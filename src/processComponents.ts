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

export type NestedPartial<T> = {
	[K in keyof T]?: T[K] extends object ? NestedPartial<T[K]> : T[K];
};
export interface GetComponentReturnType {
	componentPath: string;
	config: Record<string, unknown>;
	description?: string;
	descriptionI18nKey?: string;
	displayName: string;
	displayNameI18nKey: string;
	form: NestedPartial<FormItem>[];
	key: string;
	modifiedTime: string;
	regions?: string[];
	resource: string;
	type: 'PART' | 'LAYOUT' | 'PAGE';
};
type GetComponent = (params: GetDynamicComponentParams) => GetComponentReturnType;


class ComponentProcessor {
	private getComponentSchema: GetComponent;
	private getContentByKey: GetContentByKey;
	private listSchemas: ListSchemas;
	private processHtml: ProcessHtml;

	private static getPath(name: string, ancestor?: string) {
		return ancestor ? `${ancestor}.${name}` : name;
	}

	constructor({
		getComponentSchema,
		getContentByKey,
		listSchemas,
		processHtml,
	}: {
		getComponentSchema: GetComponent;
		getContentByKey: GetContentByKey;
		listSchemas: ListSchemas;
		processHtml: ProcessHtml;
	}) {
		this.getComponentSchema = getComponentSchema;
		this.getContentByKey = getContentByKey;
		this.listSchemas = listSchemas;
		this.processHtml = processHtml;
	}

	private findHtmlAreasInFormItemArray({
		ancestor,
		form,
		htmlAreas, // get modified
	}: {
		ancestor?: string;
		form:  NestedPartial<FormItem>[];
		htmlAreas: string[];
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
					htmlAreas.push(ComponentProcessor.getPath(name as string, ancestor));
				}
			} else if (formItemType === 'ItemSet') {
				const {items} = formItem as FormItemSet;
				this.findHtmlAreasInFormItemArray({ // recurse
					ancestor: ComponentProcessor.getPath(name as string, ancestor),
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
					this.findHtmlAreasInFormItemArray({ // recurse
						ancestor: ComponentProcessor.getPath(`${name}.${j}.${optionName}`, ancestor),
						form: items as NestedPartial<FormItem>[],
						htmlAreas, // get modified
					});
					// console.info('findHtmlAreasInFormItemArray OptionSet htmlAreas', htmlAreas);
				}
			} else if (formItemType === 'InlineMixin') {
				if (!name) {
					throw new Error(`findHtmlAreasInFormItemArray: InlineMixin name not found!`);
				}
				const [application] = name.split(':');
				const mixinsList = this.listSchemas({
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

				this.findHtmlAreasInFormItemArray({ // recurse
					ancestor,
					form: form,
					htmlAreas, // get modified
				});
			} else if (formItemType === 'Layout') {
				// console.debug('findHtmlAreasInFormItemArray Layout formItem', formItem);
				const {items} = formItem;
				if (items) { // Avoid empty fieldsets
					this.findHtmlAreasInFormItemArray({ // recurse
						ancestor,
						form: items as NestedPartial<FormItem>[],
						htmlAreas, // get modified
					});
				}
			}
		}
		// console.info('findHtmlAreasInFormItemArray htmlAreas', htmlAreas);
	}

	private getHtmlAreas({
		ancestor,
		form,
	}: {
		ancestor?: string;
		form: NestedPartial<FormItem>[];
	}): string[] {
		const htmlAreas: string[] = [];
		this.findHtmlAreasInFormItemArray({
			ancestor,
			form,
			htmlAreas,
		});
		// console.info('getHtmlAreas htmlAreas', htmlAreas);
		return htmlAreas;
	}

	private processFragment(component: FragmentComponent) {
		const {
			fragment: key,
			path
		} = component;
		// console.info('processFragment fragment key:', key);

		// @ts-expect-error Too complex/strict type generics.
		const content = this.getContentByKey<FragmentContent>({key});
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
			return this.processPart(fragment);
		}
		if(type === 'layout') {
			return this.processLayout(fragment);
		}
		if(type === 'text') {
			return this.processTextComponent(fragment as TextComponent);
		}
		throw new Error(`processFragment: fragment type not supported: ${type}!`);
	}

	private processLayout(component: LayoutComponent) {
		const {descriptor} = component;
		const {form} = this.getComponentSchema({
			key: descriptor,
			type: 'LAYOUT',
		});
		return this.processWithRegions({
			component,
			form,
		});
	}

	private processPage(component: PageComponent) {
		const {descriptor} = component;
		const {form} = this.getComponentSchema({
			key: descriptor,
			type: 'PAGE',
		});
		return this.processWithRegions({
			component,
			form,
		});
	}

	private processPart(component: PartComponent) {
		const {descriptor} = component;
		const {form} = this.getComponentSchema({
			key: descriptor,
			type: 'PART',
		});
		const htmlAreas = this.getHtmlAreas({
			ancestor: 'config',
			form,
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
				const processedHtml = this.processHtml({
					value: html
				});
				const data = replaceMacroComments(processedHtml);
				setIn(processedComponent, path, data);
			}
		}
		return processedComponent;
	}

	private processTextComponent(component: TextComponent) {
		const {text} = component;
		const processedHtml = this.processHtml({
			value: text
		});
		return replaceMacroComments(processedHtml);
	}

	private processWithRegions({
		component,
		form,
	}: {
		component: LayoutComponent | PageComponent;
		form:  NestedPartial<FormItem>[];
	}) {
		const htmlAreas = this.getHtmlAreas({
			ancestor: 'config',
			form,
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
				const processedHtml = this.processHtml({
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
				processedComponent.regions[regionName].components[j] = this.process(component);
			}
		}
		return processedComponent;
	}

	public process(component:Component) {
		const {type} = component;
		switch (type) {
			case 'part': return this.processPart(component);
			case 'layout': return this.processLayout(component as LayoutComponent);
			case 'page': return this.processPage(component as PageComponent);
			case 'text': return this.processTextComponent(component as TextComponent);
			case 'fragment': return this.processFragment(component as FragmentComponent);
			default: throw new Error(`processComponents: component type not supported: ${type}!`);
		}
	}
}

export function processComponents({
	component,
	getComponentSchema,
	getContentByKey,
	listSchemas,
	processHtml,
}: {
	component: Component;
	getComponentSchema: GetComponent;
	getContentByKey: GetContentByKey;
	listSchemas: ListSchemas;
	processHtml: ProcessHtml;
}) {
	const processor = new ComponentProcessor({
		getComponentSchema,
		getContentByKey,
		listSchemas,
		processHtml,
	});
	return processor.process(component);
}
