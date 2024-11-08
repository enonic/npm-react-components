// There is a difference between the core enonic types and what Guillotine returns:
import type {
	Content,
	Component,
	Layout,
	LayoutComponent,
	Part,
	PartComponent,
	Page,
	PageComponent,
	TextComponent
} from '@enonic-types/core';

// The Guillotine types are similar, but uses complex types:
// import type {Content} from '@enonic-types/guillotine/advanced';

import type {
	DOMNode,
	Element
} from 'html-react-parser';
import type {ReactNode, JSX} from 'react';


export interface ComponentDefinitionParams<PROPS = {}> {
	View: React.FunctionComponent<PROPS>
}

export interface ComponentDefinition<PROPS = {}> {
	View: React.FunctionComponent<PROPS>
}

export type ComponentDictionary<PROPS = {}> = Record<string, ComponentDefinition<PROPS>>;

export interface ComponentRegistry {
	addMacro<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	addLayout<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	addPage<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	addPart<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	getMacro<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	getLayout<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	getPage<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	getPart<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	hasMacro(name: string): boolean
	hasLayout(name: string): boolean
	hasPage(name: string): boolean
	hasPart(name: string): boolean
}

export type DecoratedLayoutComponent = LayoutComponent & {
	// processedConfig: Record<string, unknown>
	processedComponent?: LayoutComponent
	props?: Record<string, unknown>
}

export type DecoratedPageComponent = PageComponent & {
	// processedConfig: Record<string, unknown>
	processedComponent?: PageComponent
	props?: Record<string, unknown>
}

export type DecoratedPartComponent = PartComponent & {
	// processedConfig: Record<string, unknown>
	props?: Record<string, unknown>
}

export type DecoratedTextComponent = TextComponent & {
	props?: {
		data: RichTextData
	}
}

export type DecoratedComponent =
	| DecoratedLayoutComponent
	| DecoratedPageComponent
	| DecoratedPartComponent
	| DecoratedTextComponent;

export type RichtextContent<
	Extensions extends Record<string, unknown> = Record<string, unknown>
> = {
	// Direct Properties
	_id: string
	_name: string
	_path: string
	_references: RichtextContent[]
	_score?: number
	// attachments: Attachment[]
	children: RichtextContent[]
	// childrenConnection: ContentConnection
	components: RichtextContent[]
	// contentType: ContentType
	createdTime: string
	// creator: PrincipalKey
	// dataAsJson: GraphQLJson
	displayName: string
	// hasChildren: GraphQLBoolean
	language: string
	modifiedTime?: string
	// modifier: PrincipalKey
	// owner: PrincipalKey
	// pageAsJson: GraphQLJson
	pageTemplate: RichtextContent
	pageUrl: string
	parent: RichtextContent
	// permissions: Permissions
	// publish: PublishInfo
	// site: portal_Site
	type: string
	valid: boolean
	// x: ExtraData
	// xAsJson: GraphQLJson

	// ... on media_Image
	imageUrl?: string
	mediaUrl?: string
	[key: string]: any
} & Extensions

export type ContentUri = `content://${string}`;

export type CreateReplacer<RestProps = Record<string, unknown>> = (params: CreateReplacerParams<RestProps>) => (domNode: DOMNode) => ReplacerResult;

export interface CreateReplacerParams<RestProps = Record<string, unknown>> {
	componentRegistry?: ComponentRegistry
	data: RichTextData
	Image: ImageComponent<RestProps>
	Link: LinkComponent<RestProps>
	Macro: MacroComponent<RestProps>
	replacer?: Replacer
}

export type FragmentContent<
	Component extends LayoutComponent | PartComponent = Layout | Part
> = Content<undefined,'portal:fragment',Component>;

export type ImageContent = Partial<RichtextContent> & {
	imageUrl?: string
}

export type ImageComponent<
	RestProps = Record<string, unknown>
> = (params: ImageComponentParams<RestProps>) => React.JSX.Element | null;

export type ImageComponentParams<
	RestProps = Record<string, unknown>
> = {
	alt?: string
	image: ImageContent
	imageStyle?: ImageStyle | null
	sizes?: string
	src: string
	srcSet?: string
	style?: React.CSSProperties
} & RestProps;

export interface ImageData {
	ref: string
	image: ImageContent,
	style?: ImageStyle | null
}

export interface ImageStyle {
	name: string
	aspectRatio: string
	filter: string
}

export type LinkComponent<
	RestProps = Record<string, unknown>
> = (params: LinkComponentParams<RestProps>) => React.JSX.Element | null;

export type LinkComponentParams<
	RestProps = Record<string, unknown>
> = {
	children: ReactNode
	content?: Partial<RichtextContent> | null
	href: string
	media?: LinkDataMedia | null
	target?: string
	title?: string
	uri: string
} & RestProps;

export interface LinkData {
	ref: string
	content?: Partial<RichtextContent> | null
	media?: LinkDataMedia | null
	uri: string
}

export interface LinkDataMedia {
	content: Partial<RichtextContent> & {
		mediaUrl?: string
	}
	intent: 'inline' | 'download'
}

export type MacroConfig = Record<string, any>;

export type MacroComponent<
	RestProps = Record<string, unknown>
> = (params: MacroComponentParams<RestProps>) => React.JSX.Element | null

export type MacroComponentParams<
	RestProps = Record<string, unknown>
> = {
	componentRegistry?: ComponentRegistry
	config: Record<string, unknown>
	descriptor: MacroDescriptor
	children: string | React.JSX.Element | React.JSX.Element[]
} & RestProps;

export interface MacroData {
	ref: string
	name: string
	descriptor: MacroDescriptor
	config: Record<string, MacroConfig>
}

export type MacroDescriptor = `${string}:${string}`;

export type MediaUri = `media://${string}`;

export type PageContent<
	Data = Record<string, unknown>,
	Type extends string = string,
	Component extends PageComponent = Page
> = Content<
	Data,
	Type,
	// @ts-expect-error Does not satisfy the type constraint
	Component
>

export interface ReplaceMacroParams<RestProps = Record<string, unknown>> {
	componentRegistry?: ComponentRegistry
	createReplacer: CreateReplacer<RestProps>
    data: RichTextData
    el: Element
    Image: ImageComponent<RestProps>,
    Link: LinkComponent<RestProps>
    Macro: MacroComponent<RestProps>
    replacer?: Replacer
}

export type Replacer = (
	element: Element,
	data: RichTextData,
) => ReplacerResult;

export type ReplacerResult = JSX.Element | object | void | undefined | null | false;

export interface RichTextData {
	processedHtml: string
	links?: LinkData[]
	macros?: MacroData[]
	images?: ImageData[]
}

export type RichTextParams<
	RestProps = Record<string, unknown>
> = {
	className?: string
	componentRegistry?: ComponentRegistry
	data: RichTextData
	Image?: ImageComponent<RestProps>
	Macro?: MacroComponent<RestProps>
	Link?: LinkComponent<RestProps>
	replacer?: Replacer
	tag?: string
} & RestProps;
