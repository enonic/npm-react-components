import type {
	Component,
	Content,
	FragmentComponent,
	// Layout,
	LayoutComponent,
	PageComponent,
	// Part,
	PartComponent,
	TextComponent,
} from '@enonic-types/core';
import type {
	get as getContentByKey,
} from '@enonic-types/lib-content';
import type {
	processHtml,
} from '@enonic-types/lib-portal';
import type {
	// getComponent,
	listSchemas,
	GetDynamicComponentParams,
	FormItem,
	FormItemOptionSet,
	FormItemSet,
	MixinSchema,
} from '@enonic-types/lib-schema';


import {getIn} from '@enonic/js-utils/object/getIn';
import {setIn} from '@enonic/js-utils/object/setIn';
import {replaceMacroComments} from './replaceMacroComments';

type FragmentContent = Content<undefined,'portal:fragment'>;

type ListSchemas = typeof listSchemas;
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
	listSchemas,
}: {
	ancestor?: string
	form:  NestedPartial<FormItem>[]
	htmlAreas: string[]
	listSchemas: ListSchemas
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
				listSchemas,
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
					listSchemas,
				});
				// console.info('findHtmlAreasInFormItemArray OptionSet htmlAreas', htmlAreas);
			}
		} else if (formItemType === 'InlineMixin') {
			if (!name) {
				throw new Error(`findHtmlAreasInFormItemArray: InlineMixin name not found!`);
			}
			const [application] = name.split(':');
			const mixinsList = listSchemas({
				application,
				type: 'MIXIN'
			}) as MixinSchema[];
			// console.debug('findHtmlAreasInFormItemArray mixinsList', mixinsList);

			const multiAppMixinsObj: Record<string, MixinSchema> = {};
			for (let j = 0; j < mixinsList.length; j++) {
				const mixin = mixinsList[j];
				const {name: mixinName} = mixin;
				multiAppMixinsObj[mixinName] = mixin;
			}
			// console.debug('findHtmlAreasInFormItemArray multiAppMixinsObj', multiAppMixinsObj);

			const mixin = multiAppMixinsObj[name];
			if (!mixin) {
				throw new Error(`findHtmlAreasInFormItemArray: InlineMixin mixin not found for name: ${name}!`);
			}
			// console.debug('findHtmlAreasInFormItemArray mixin', mixin);

			const {form} = mixin;
			if (!form) {
				throw new Error(`findHtmlAreasInFormItemArray: InlineMixin mixin form not found for name: ${name}!`);
			}
			// console.debug('findHtmlAreasInFormItemArray form', form);

			findHtmlAreasInFormItemArray({ // recurse
				ancestor,
				form: form,
				htmlAreas, // get modified
				listSchemas,
			});
		} else if (formItemType === 'Layout') {
			// console.debug('findHtmlAreasInFormItemArray Layout formItem', formItem);
			const {items} = formItem;
			if (items) { // Avoid empty fieldsets
				findHtmlAreasInFormItemArray({ // recurse
					ancestor,
					form: items as NestedPartial<FormItem>[],
					htmlAreas, // get modified
					listSchemas,
				});
			}
		}
	}
	// console.info('findHtmlAreasInFormItemArray htmlAreas', htmlAreas);
}


function getHtmlAreas({
	ancestor,
	form,
	listSchemas
}: {
	ancestor?: string
	form: NestedPartial<FormItem>[]
	listSchemas: ListSchemas
}): string[] {
	const htmlAreas: string[] = [];
	findHtmlAreasInFormItemArray({
		ancestor,
		form,
		htmlAreas,
		listSchemas,
	});
	// console.info('getHtmlAreas htmlAreas', htmlAreas);
	return htmlAreas;
}


function processPart({
	component,
	getComponent,
	listSchemas,
	processHtml,
}: {
	component: PartComponent
	getComponent: GetComponent
	listSchemas: ListSchemas
	processHtml: ProcessHtml
}) {
	const {descriptor} = component;
	const {form} = getComponent({
		key: descriptor,
		type: 'PART',
	});
	const htmlAreas = getHtmlAreas({
		ancestor: 'config',
		form,
		listSchemas
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
	listSchemas,
	processHtml,
}: {
	component: LayoutComponent | PageComponent
	form:  NestedPartial<FormItem>[]
	getComponent: GetComponent
	getContentByKey: GetContentByKey
	listSchemas: ListSchemas
	processHtml: ProcessHtml
}) {
	const htmlAreas = getHtmlAreas({
		ancestor: 'config',
		form,
		listSchemas,
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
				listSchemas,
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
	listSchemas,
	processHtml,
}: {
	component: LayoutComponent
	getComponent: GetComponent
	getContentByKey: GetContentByKey
	listSchemas: ListSchemas
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
		listSchemas,
		processHtml,
	});
}

function processPage({
	component,
	getComponent,
	getContentByKey,
	listSchemas,
	processHtml,
}: {
	component: PageComponent
	getComponent: GetComponent
	getContentByKey: GetContentByKey
	listSchemas: ListSchemas
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
		listSchemas,
		processHtml,
	});
}

function processTextComponent({
	component,
	// getComponent,
	// getContentByKey,
	// listSchemas,
	processHtml,
}: {
	component: TextComponent
	// getComponent: GetComponent
	// getContentByKey: GetContentByKey
	// listSchemas: ListSchemas
	processHtml: ProcessHtml
}) {
	const {text} = component;
	const processedHtml = processHtml({
		value: text
	});
	const data = replaceMacroComments(processedHtml);
	return data;
}

function processFragment({
	component,
	getComponent,
	getContentByKey,
	listSchemas,
	processHtml,
}: {
	component: FragmentComponent
	getComponent: GetComponent
	getContentByKey: GetContentByKey
	listSchemas: ListSchemas
	processHtml: ProcessHtml
}) {
	const {
		fragment: key,
		path
	} = component;
	// console.info('processFragment fragment key:', key);

	// @ts-expect-error Too complex/strict type generics.
	const content = getContentByKey<FragmentContent>({key});
	if (!content) {
		throw new Error(`processFragment: content not found for key: ${key}!`);
	}
	// console.info('processFragment content:', content);

	const {fragment} = content;
	if (!fragment) {
		throw new Error(`processFragment: fragment not found in content with key: ${key}!`);
	}

	if (!fragment.path) {
		fragment.path = path;
	}
	// console.info('processFragment fragment:', fragment);

	const {type} = fragment;
	// console.info('processFragment fragment:', fragment);

	if(type === 'part') {
		return processPart({
			component: fragment,
			getComponent,
			listSchemas,
			processHtml,
		});
	}
	if(type === 'layout') {
		return processLayout({
			component: fragment,
			getComponent,
			getContentByKey,
			listSchemas,
			processHtml,
		});
	}
	if(type === 'text') {
		return processTextComponent({
			component: fragment as TextComponent,
			processHtml,
		});
	}
	throw new Error(`processFragment: fragment type not supported: ${type}!`);
}

export function processComponents({
	component,
	getComponent,
	getContentByKey,
	listSchemas,
	processHtml,
}: {
	component: Component
	getComponent: GetComponent
	getContentByKey: GetContentByKey
	listSchemas: ListSchemas
	processHtml: ProcessHtml
}) {
	const {type} = component;
	switch (type) {
		case 'part': return processPart({
			component,
			listSchemas,
			processHtml,
			getComponent,
		});
		case 'layout': return processLayout({
			component: component as LayoutComponent,
			getComponent,
			getContentByKey,
			listSchemas,
			processHtml,
		});
		case 'page': return processPage({
			component: component as PageComponent,
			getComponent,
			getContentByKey,
			listSchemas,
			processHtml,
		});
		case 'text': return processTextComponent({
			component: component as TextComponent,
			processHtml,
		});
		case 'fragment': return processFragment({
			component: component as FragmentComponent,
			getComponent,
			getContentByKey,
			listSchemas,
			processHtml,
		});
		default: throw new Error(`processComponents: component type not supported: ${type}!`);
	}
}
