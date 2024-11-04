import type {
	Component,
	FragmentComponent,
	LayoutComponent,
	PageComponent,
	PartComponent,
} from '@enonic-types/core';
import type {
	get as getContentByKey,
} from '@enonic-types/lib-content';
import type {
	processHtml,
} from '@enonic-types/lib-portal';
import type {
	// getComponent,
	GetDynamicComponentParams,
	FormItem,
	FormItemOptionSet,
	FormItemSet,
} from '@enonic-types/lib-schema';


import {getIn} from '@enonic/js-utils/object/getIn';
import {setIn} from '@enonic/js-utils/object/setIn';
import {replaceMacroComments} from './replaceMacroComments';


type ProcessHtml = typeof processHtml;
type GetContentByKey = typeof getContentByKey;

type NestedPartial<T> = {
	[K in keyof T]?: T[K] extends object ? NestedPartial<T[K]> : T[K];
};
interface GetComponentReturnType {
	componentPath: string
	config: Record<string, unknown>
	description?: string
	descriptionI18nKey?: string
	displayName: string
	displayNameI18nKey: string
	form: NestedPartial<FormItem>[]
	key: string
	modifiedTime: string
	regions?: string[]
	resource: string
	type: 'PART' | 'LAYOUT' | 'PAGE'
}
type GetComponent = (params: GetDynamicComponentParams) => GetComponentReturnType;


function getPath(name: string, ancestor?: string) {
	return ancestor ? `${ancestor}.${name}` : name;
}


function findHtmlAreasInFormItemArray({
	ancestor,
	form,
	htmlAreas, // get modified
}: {
	ancestor?: string
	form:  NestedPartial<FormItem>[]
	htmlAreas: string[]
}) {
	for (let i = 0; i < form.length; i++) {
		const formItem = form[i];
		const {
			formItemType,
			name
		} = formItem;
		if (formItemType === 'Input') {
			const {inputType} = formItem;
			if (inputType === 'HtmlArea') {
				htmlAreas.push(getPath(name as string, ancestor));
			}
		} else if (formItemType === 'ItemSet') {
			const {items} = formItem as FormItemSet;
			findHtmlAreasInFormItemArray({ // recurse
				ancestor: getPath(name as string, ancestor),
				form: items as NestedPartial<FormItem>[],
				htmlAreas, // get modified
			});
		} else if (formItemType === 'OptionSet') {
			const {options} = formItem as FormItemOptionSet;
			for (let j = 0; j < options.length; j++) {
				const option = options[j];
				const {
					name: optionName,
					items
				} = option;
				findHtmlAreasInFormItemArray({ // recurse
					ancestor: getPath(`${name}.${j}.${optionName}`, ancestor),
					form: items as NestedPartial<FormItem>[],
					htmlAreas, // get modified
				});
				// console.info('findHtmlAreasInFormItemArray OptionSet htmlAreas', htmlAreas);
			}
		} else if (formItemType === 'InlineMixin') {
			throw new Error(`processComponents: InlineMixin not supported yet!`);
		} else if (formItemType === 'Layout') {
			throw new Error(`processComponents: Layout not supported yet!`);
		}
	}
	// console.info('findHtmlAreasInFormItemArray htmlAreas', htmlAreas);
}


function getHtmlAreas({
	ancestor,
	form
}: {
	ancestor?: string
	form:  NestedPartial<FormItem>[]
}): string[] {
	const htmlAreas: string[] = [];
	findHtmlAreasInFormItemArray({
		ancestor,
		form,
		htmlAreas,
	});
	// console.info('getHtmlAreas htmlAreas', htmlAreas);
	return htmlAreas;
}


function processPart({
	component,
	processHtml,
	getComponent,
}: {
	component: PartComponent
	getComponent: GetComponent
	processHtml: ProcessHtml
}) {
	const {descriptor} = component;
	const {form} = getComponent({
		key: descriptor,
		type: 'PART',
	});
	const htmlAreas = getHtmlAreas({
		ancestor: 'config',
		form
	});
	// console.info('processPart htmlAreas:', htmlAreas);

	const processedComponent = JSON.parse(JSON.stringify(component));
	for (let i = 0; i < htmlAreas.length; i++) {
		// console.info('component:', component);

		const path = htmlAreas[i];
		// console.info('path:', path);

		const html = getIn(component, path) as string;
		// console.info('html:', html);

		if (html) {
			const processedHtml = processHtml({
				value: html
			});
			const data = replaceMacroComments(processedHtml);
			setIn(processedComponent, path, data);
		}
	}
	return processedComponent;
}


function processWithRegions({
	component,
	form,
	getComponent,
	getContentByKey,
	processHtml,
}: {
	component: LayoutComponent | PageComponent
	form:  NestedPartial<FormItem>[]
	getComponent: GetComponent
	getContentByKey: GetContentByKey
	processHtml: ProcessHtml
}) {
	const htmlAreas = getHtmlAreas({
		ancestor: 'config',
		form
	});
	// console.info('processWithRegions htmlAreas:', htmlAreas);

	const processedComponent = JSON.parse(JSON.stringify(component));
	for (let i = 0; i < htmlAreas.length; i++) {
		// console.info('component:', component);

		const path = htmlAreas[i];
		// console.info('path:', path);

		const html = getIn(component, path) as string;
		// console.info('html:', html);

		if (html) {
			const processedHtml = processHtml({
				value: html
			});
			const data = replaceMacroComments(processedHtml);
			setIn(processedComponent, path, data);
		}
	} // for

	const {regions} = component;
	const regionNames = Object.keys(regions);
	for (let i = 0; i < regionNames.length; i++) {
		const regionName = regionNames[i];
		const region = regions[regionName];
		const components = region.components;
		for (let j = 0; j < components.length; j++) {
			const component = components[j];
			processedComponent.regions[regionName].components[j] = processComponents({
				component,
				getComponent,
				getContentByKey,
				processHtml,
			});
		}
	}
	return processedComponent;
}

function processLayout({
	component,
	getComponent,
	getContentByKey,
	processHtml,
}: {
	component: LayoutComponent
	getComponent: GetComponent
	getContentByKey: GetContentByKey
	processHtml: ProcessHtml
}) {
	const {descriptor} = component;
	const {form} = getComponent({
		key: descriptor,
		type: 'LAYOUT',
	});
	return processWithRegions({
		component,
		form,
		getComponent,
		getContentByKey,
		processHtml,
	});
}

function processPage({
	component,
	getComponent,
	getContentByKey,
	processHtml,
}: {
	component: PageComponent
	getComponent: GetComponent
	getContentByKey: GetContentByKey
	processHtml: ProcessHtml
}) {
	const {descriptor} = component;
	const {form} = getComponent({
		key: descriptor,
		type: 'PAGE',
	});
	return processWithRegions({
		component,
		form,
		getComponent,
		getContentByKey,
		processHtml,
	});
}

function processFragment({
	component,
	getComponent,
	getContentByKey,
	processHtml,
}: {
	component: FragmentComponent
	getComponent: GetComponent
	getContentByKey: GetContentByKey
	processHtml: ProcessHtml
}) {
	const {fragment: key} = component;
	// console.info('processFragment fragment key:', key);

	const content = getContentByKey({key});
	if (!content) {
		throw new Error(`processFragment: content not found for key: ${key}!`);
	}
	// console.info('processFragment content:', content);

	const {fragment} = content;
	// console.info('processFragment fragment:', fragment);

	// @ts-expect-error
	const {type} = fragment;
	// console.info('processFragment fragment:', fragment);

	if(type === 'part') {
		return processPart({
			// @ts-expect-error
			component: fragment as PartComponent,
			getComponent,
			processHtml,
		});
	}
	if(type === 'layout') {
		return processLayout({
			// @ts-expect-error
			component: fragment as LayoutComponent,
			getComponent,
			getContentByKey,
			processHtml,
		});
	}
	throw new Error(`processFragment: fragment type not supported: ${type}!`);
}

export function processComponents({
	component,
	getComponent,
	getContentByKey,
	processHtml,
}: {
	component: Component
	getComponent: GetComponent
	getContentByKey: GetContentByKey
	processHtml: ProcessHtml
}) {
	const {type} = component;
	switch (type) {
		case 'part': return processPart({
			component,
			processHtml,
			getComponent,
		});
		case 'layout': return processLayout({
			component: component as LayoutComponent,
			getComponent,
			getContentByKey,
			processHtml,
		});
		case 'page': return processPage({
			component: component as PageComponent,
			getComponent,
			getContentByKey,
			processHtml,
		});
		case 'fragment': return processFragment({
			component: component as FragmentComponent,
			getComponent,
			getContentByKey,
			processHtml,
		});
		default: throw new Error(`processComponents: component type not supported: ${type}!`);
	}
}
