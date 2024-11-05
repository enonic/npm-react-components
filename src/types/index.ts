// There is a difference between the core enonic types and what Guillotine returns:
// import type {Content} from '@enonic-types/core';

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

export type Content<
	Extensions extends Record<string, unknown> = Record<string, unknown>
> = {
	// Direct Properties
	_id: string
	_name: string
	_path: string
	_references: Content[]
	_score?: number
	// attachments: Attachment[]
	children: Content[]
	// childrenConnection: ContentConnection
	components: Content[]
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
	pageTemplate: Content
	pageUrl: string
	parent: Content
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

export type ImageContent = Partial<Content> & {
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
	content?: Partial<Content> | null
	href: string
	media?: LinkDataMedia | null
	target?: string
	title?: string
	uri: string
} & RestProps;

export interface LinkData {
	ref: string
	content?: Partial<Content> | null
	media?: LinkDataMedia | null
	uri: string
}

export interface LinkDataMedia {
	content: Partial<Content> & {
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
