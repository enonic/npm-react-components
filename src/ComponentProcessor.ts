import type {
	Component,
	// Content,
	FragmentComponent,
	// Layout,
	LayoutComponent,
	PageComponent,
	// Part,
	PartComponent,
	Request, // TODO
	TextComponent,
} from '@enonic-types/core';
import type {
	get as getContentByKey,
} from '@enonic-types/lib-content';
import type {
	getContent as getCurrentContent,
	getSiteConfig as getCurrentSiteConfig,
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
import type {
	DecoratedComponent,
	DecoratedLayoutComponent,
	DecoratedPageComponent,
	DecoratedPartComponent,
	DecoratedTextComponent,
	FragmentContent,
	PageContent
} from './types';


import {getIn} from '@enonic/js-utils/object/getIn';
import {setIn} from '@enonic/js-utils/object/setIn';
// import {stringify} from 'q-i';

import {replaceMacroComments} from './replaceMacroComments';

type GetContentByKey = typeof getContentByKey;
type GetCurrentContent = typeof getCurrentContent;
type GetCurrentSiteConfig = typeof getCurrentSiteConfig;
type ListSchemas = typeof listSchemas;
type ProcessHtml = typeof processHtml;

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

interface LayoutComponentToPropsParams {
	component: LayoutComponent;
	content?: PageContent;
	processedComponent: DecoratedLayoutComponent;
	processedConfig: Record<string, unknown>;
	siteConfig?: Record<string, unknown> | null;
	request: Request;
}

interface PageComponentToPropsParams {
	component: PageComponent;
	content?: PageContent;
	processedComponent: DecoratedPageComponent;
	processedConfig: Record<string, unknown>;
	siteConfig?: Record<string, unknown> | null;
	request: Request;
}

interface PartComponentToPropsParams {
	component: PartComponent;
	content?: PageContent;
	processedConfig: Record<string, unknown>;
	siteConfig?: Record<string, unknown> | null;
	request: Request;
}

type LayoutComponentToPropsFunction = (params: LayoutComponentToPropsParams) => Record<string, unknown>;
type PageComponentToPropsFunction = (params: PageComponentToPropsParams) => Record<string, unknown>;
type PartComponentToPropsFunction = (params: PartComponentToPropsParams) => Record<string, unknown>;

export class ComponentProcessor {
	private getComponentSchema: GetComponent;
	private getContentByKey: GetContentByKey;
	private getCurrentContent?: GetCurrentContent;
	private getCurrentSiteConfig?: GetCurrentSiteConfig;
	private listSchemas: ListSchemas;
	private layouts: Record<string,LayoutComponentToPropsFunction> = {};
	private pages: Record<string,PageComponentToPropsFunction> = {};
	private parts: Record<string,PartComponentToPropsFunction> = {};
	private processHtml: ProcessHtml;
	private mixinSchemas: Record<string, MixinSchema> = {}

	private static getPath(name: string, ancestor?: string) {
		return ancestor ? `${ancestor}.${name}` : name;
	}

	constructor({
		getComponentSchema,
		getContentByKey,
		getCurrentContent,
		getCurrentSiteConfig,
		listSchemas,
		processHtml,
	}: {
		getComponentSchema: GetComponent;
		getContentByKey: GetContentByKey;
		getCurrentContent?: GetCurrentContent;
		getCurrentSiteConfig?: GetCurrentSiteConfig;
		listSchemas: ListSchemas;
		processHtml: ProcessHtml;
	}) {
		this.getComponentSchema = getComponentSchema;
		this.getContentByKey = getContentByKey;
		this.getCurrentContent = getCurrentContent;
		this.getCurrentSiteConfig = getCurrentSiteConfig;
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
				let mixin = this.mixinSchemas[name];

				if (!mixin) {
					const [application] = name.split(':');
					const mixinsList = this.listSchemas({
						application,
						type: 'MIXIN'
					}) as MixinSchema[];
					// console.debug('findHtmlAreasInFormItemArray mixinsList', mixinsList);

					for (let j = 0; j < mixinsList.length; j++) {
						const mixin = mixinsList[j];
						const {name: mixinName} = mixin;
						this.mixinSchemas[mixinName] = mixin;
					}
					// console.debug('findHtmlAreasInFormItemArray multiAppMixinsObj', multiAppMixinsObj);
					mixin = this.mixinSchemas[name];
					if (!mixin) {
						throw new Error(`findHtmlAreasInFormItemArray: InlineMixin mixin not found for name: ${name}!`);
					}
					// console.debug('findHtmlAreasInFormItemArray mixin', mixin);
				}

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

	private processFragment({
		component,
		content,
		request,
		siteConfig,
	}: {
		component: FragmentComponent;
		content?: PageContent;
		request: Request;
		siteConfig?: Record<string, unknown> | null;
	}) {
		const {
			fragment: key,
			path
		} = component;
		// console.info('processFragment fragment key:', key);

		// @ts-expect-error Too complex/strict type generics.
		const fragmentContent = this.getContentByKey<FragmentContent>({key});
		if (!fragmentContent) {
			throw new Error(`processFragment: content not found for key: ${key}!`);
		}
		// console.info('processFragment content:', content);

		const {fragment} = fragmentContent;
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
			return this.processPart({
				component: fragment,
				content,
				request,
				siteConfig,
			});
		}
		if(type === 'layout') {
			return this.processLayout({
				component: fragment,
				content,
				request,
				siteConfig,
			});
		}
		if(type === 'text') {
			return this.processTextComponent(fragment as TextComponent);
		}
		throw new Error(`processFragment: fragment type not supported: ${type}!`);
	}

	private processLayout({
		component,
		content,
		request,
		siteConfig,
	}: {
		component: LayoutComponent;
		content?: PageContent;
		request: Request;
		siteConfig?: Record<string, unknown> | null;
	}): DecoratedLayoutComponent {
		const decoratedComponent: DecoratedLayoutComponent = JSON.parse(JSON.stringify(component));
		const {descriptor} = component;
		const toProps = this.layouts[descriptor];
		if (!toProps) {
			console.warn(`processLayout: toProps not found for descriptor: ${descriptor}!`);
			return decoratedComponent;
		}

		const {form} = this.getComponentSchema({
			key: descriptor,
			type: 'LAYOUT',
		});

		const processedComponent = this.processWithRegions({
			component,
			content,
			form,
			request,
		}) as DecoratedLayoutComponent;

		decoratedComponent.props = toProps({
			component,
			content,
			processedComponent: processedComponent,
			processedConfig: processedComponent.config,
			siteConfig, // : this.getCurrentSiteConfig && this.getCurrentSiteConfig() as Record<string, unknown>,
			request,
		});
		// decoratedComponent.processedConfig = processedComponent.config;
		return decoratedComponent;
	}

	private processPage({
		component,
		content,
		request,
		siteConfig,
	}: {
		component: PageComponent;
		content?: PageContent;
		request: Request;
		siteConfig?: Record<string, unknown> | null;
	}): DecoratedPageComponent {
		// console.debug('processPage component:', component);
		const decoratedComponent: DecoratedPageComponent = JSON.parse(JSON.stringify(component));
		const {descriptor} = component;
		const toProps = this.pages[descriptor];
		if (!toProps) {
			console.warn(`processPage: toProps not found for descriptor: ${descriptor}!`);
			return decoratedComponent;
		}

		const {form} = this.getComponentSchema({
			key: descriptor,
			type: 'PAGE',
		});

		const processedComponent = this.processWithRegions({
			component,
			content,
			form,
			request,
		}) as DecoratedPageComponent;

		decoratedComponent.props = toProps({
			component,
			content,
			processedComponent: processedComponent,
			processedConfig: processedComponent.config,
			siteConfig, // : this.getCurrentSiteConfig && this.getCurrentSiteConfig() as Record<string, unknown>,
			request,
		});
		// decoratedComponent.processedConfig = processedComponent.config;
		return decoratedComponent;
	}

	private processPart({
		component,
		content,
		request,
		siteConfig
	}: {
		component: PartComponent;
		content?: PageContent;
		request: Request;
		siteConfig?: Record<string, unknown> | null;
	}): DecoratedPartComponent {
		const {descriptor} = component;

		const decoratedComponent: DecoratedPartComponent = JSON.parse(JSON.stringify(component));
		const toProps = this.parts[descriptor];
		if (!toProps) {
			console.warn(`processPart: toProps not found for descriptor: ${descriptor}!`);
			return decoratedComponent;
		}

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
		} // for

		decoratedComponent.props = toProps({
			component,
			content,
			processedConfig: processedComponent.config,
			siteConfig,//: this.getCurrentSiteConfig && this.getCurrentSiteConfig() as Record<string, unknown>,
			request,
		});
		// decoratedComponent.processedConfig = processedComponent.config;
		return decoratedComponent;
	}

	private processTextComponent(component: TextComponent): DecoratedTextComponent {
		const {text} = component;
		const processedHtml = this.processHtml({
			value: text
		});
		const decoratedTextComponent: DecoratedTextComponent = JSON.parse(JSON.stringify(component));
		decoratedTextComponent.props = {
			data: replaceMacroComments(processedHtml)
		};
		return decoratedTextComponent;
	}

	private processWithRegions({
		component: layoutOrPageComponent,
		content,
		form,
		request,
	}: {
		component: LayoutComponent | PageComponent;
		content?: PageContent;
		form:  NestedPartial<FormItem>[];
		request: Request;
	}): DecoratedLayoutComponent | DecoratedPageComponent {
		const htmlAreas = this.getHtmlAreas({
			ancestor: 'config',
			form,
		});
		// console.info('processWithRegions htmlAreas:', htmlAreas);

		const decoratedLayoutOrPageComponent: DecoratedLayoutComponent | DecoratedPageComponent = JSON.parse(JSON.stringify(layoutOrPageComponent));

		//──────────────────────────────────────────────────────────────────────
		// This modifies layoutOrPage.config:
		//──────────────────────────────────────────────────────────────────────
		for (let i = 0; i < htmlAreas.length; i++) {
			// console.info('component:', component);

			const path = htmlAreas[i];
			// console.debug('processWithRegions path:', path);

			const html = getIn(layoutOrPageComponent, path) as string;
			// console.info('html:', html);

			if (html) {
				const processedHtml = this.processHtml({
					value: html
				});
				const data = replaceMacroComments(processedHtml);
				setIn(decoratedLayoutOrPageComponent, path, data);
			}
		} // for
		// console.debug('processWithRegions config:', decoratedLayoutOrPageComponent.config);

		//──────────────────────────────────────────────────────────────────────
		// This modifies layoutOrPage.regions:
		//──────────────────────────────────────────────────────────────────────
		const {regions} = layoutOrPageComponent;
		// console.debug('processWithRegions regions:', stringify(regions, {maxItems: Infinity}));
		const regionNames = Object.keys(regions);
		for (let i = 0; i < regionNames.length; i++) {
			const regionName = regionNames[i];
			const region = regions[regionName];
			const components = region.components;
			for (let j = 0; j < components.length; j++) {
				const component = components[j];
				// @ts-expect-error
				decoratedLayoutOrPageComponent.regions[regionName].components[j] = this.process({
					component,
					content,
					request,
				});
			}
		}
		// console.debug('processWithRegions regions:', stringify(decoratedLayoutOrPageComponent.regions, {maxItems: Infinity}));
		return decoratedLayoutOrPageComponent;
	} // processWithRegions

	public addLayout(descriptor: string, {
		toProps
	}: {
		toProps: (params: LayoutComponentToPropsParams) => Record<string, unknown>;
	}) {
		// console.debug('addLayout:', descriptor);
		this.layouts[descriptor] = toProps;
	}

	public addPage(descriptor: string, {
		toProps
	}: {
		toProps: (params: PageComponentToPropsParams) => Record<string, unknown>;
	}) {
		// console.debug('addPage:', descriptor);
		this.pages[descriptor] = toProps;
	}

	public addPart(descriptor: string, {
		toProps
	}: {
		toProps: (params: PartComponentToPropsParams) => Record<string, unknown>;
	}) {
		// console.debug('addPart:', descriptor);
		this.parts[descriptor] = toProps;
	}

	public process({
		component,
		content,
		request,
	}: {
		component?: Component;
		content?: PageContent;
		request: Request;
	}): DecoratedComponent {
		// content = this.getCurrentContent && this.getCurrentContent() as PageContent
		if (!content) {
			if (!this.getCurrentContent) {
				throw new Error(`process: content not passed and getCurrentContent not passed when ComponentProcessor was instantiated!`);
			}
			content = this.getCurrentContent!() as PageContent;
			if (!content) {
				throw new Error(`process: content not passed and getCurrentContent returned null!`);
			}
		}
		if (!component) {
			component = (content.page || content.fragment) as Component;
			if (!component) {
				throw new Error(`process: component not passed and content.page and content.fragment not found!`);
			}
		}
		let siteConfig: Record<string, unknown> | undefined | null = undefined;
		if (this.getCurrentSiteConfig) {
			siteConfig = this.getCurrentSiteConfig();
			if (!siteConfig) {
				// @ts-expect-error log is not defined
				(log||console).warn(`process: getCurrentSiteConfig returned null!`);
			}
		}
		const {type} = component;
		switch (type) {
			case 'part': return this.processPart({
				component,
				content,
				request,
				siteConfig,
			});
			case 'layout': return this.processLayout({
				component: component as LayoutComponent,
				content,
				request,
				siteConfig,
			});
			case 'page': return this.processPage({
				component: component as PageComponent,
				content,
				request,
				siteConfig,
			});
			case 'text': return this.processTextComponent(component as TextComponent);
			case 'fragment': return this.processFragment({
				component: component as FragmentComponent,
				content,
				request,
				siteConfig,
			});
			default: throw new Error(`processComponents: component type not supported: ${type}!`);
		}
	}
} // class ComponentProcessor

// export function processComponents({
// 	component,
// 	content,
// 	getComponentSchema,
// 	getContentByKey,
// 	getCurrentContent,
// 	getCurrentSiteConfig,
// 	listSchemas,
// 	processHtml,
// 	request,
// }: {
// 	component?: Component;
// 	content?: PageContent;
// 	getComponentSchema: GetComponent;
// 	getContentByKey: GetContentByKey;
// 	getCurrentContent?: GetCurrentContent;
// 	getCurrentSiteConfig?: GetCurrentSiteConfig;
// 	listSchemas: ListSchemas;
// 	processHtml: ProcessHtml;
// 	request: Request;
// }): DecoratedComponent {
// 	const processor = new ComponentProcessor({
// 		getComponentSchema,
// 		getContentByKey,
// 		getCurrentContent,
// 		getCurrentSiteConfig,
// 		listSchemas,
// 		processHtml,
// 	});
// 	return processor.process({
// 		component,
// 		content,
// 		request
// 	});
// }
