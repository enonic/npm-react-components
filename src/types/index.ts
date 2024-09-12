// There is a difference between the core enonic types and what Guillotine returns:
// import type {Content} from '@enonic-types/core';

// The Guillotine types are similar, but uses complex types:
// import type {Content} from '@enonic-types/guillotine/advanced';

import type {Element} from 'html-react-parser';
import type {ReactNode, JSX} from 'react';


export declare type Content<
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

export declare type ContentUri = `content://${string}`;

export declare type ImageContent = Partial<Content> & {
	imageUrl?: string
}

export declare type ImageComponent<
	RestProps = Record<string, unknown>
> = (params: ImageComponentParams<RestProps>) => React.JSX.Element | null;

export declare type ImageComponentParams<
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

export declare interface ImageData {
	ref: string
	image: ImageContent,
	style?: ImageStyle | null
}

export declare interface ImageStyle {
	name: string
	aspectRatio: string
	filter: string
}

export declare type LinkComponent<
	RestProps = Record<string, unknown>
> = (params: LinkComponentParams<RestProps>) => React.JSX.Element | null;

export declare type LinkComponentParams<
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

export declare interface LinkData {
	ref: string
	content?: Partial<Content> | null
	media?: LinkDataMedia | null
	uri: string
}

export declare interface LinkDataMedia {
	content: Partial<Content> & {
		mediaUrl?: string
	}
	intent: 'inline' | 'download'
}

export declare type MacroConfig = Record<string, any>;

export declare type MacroComponent<
	RestProps = Record<string, unknown>
> = (params: MacroComponentParams<RestProps>) => React.JSX.Element | null

export declare type MacroComponentParams<
	RestProps = Record<string, unknown>
> = {
	config: Record<string, unknown>
	descriptor: MacroDescriptor
	children: string | React.JSX.Element | React.JSX.Element[]
} & RestProps;

export declare interface MacroData {
	ref: string
	name: string
	descriptor: MacroDescriptor
	config: Record<string, MacroConfig>
}

export declare type MacroDescriptor = `${string}:${string}`;

export declare type MediaUri = `media://${string}`;

export declare type Replacer = (
	element: Element,
	data: RichTextData,
) => ReplacerResult;

export declare type ReplacerResult = JSX.Element | object | void | undefined | null | false;

export declare interface RichTextData {
	processedHtml: string
	links?: LinkData[]
	macros?: MacroData[]
	images?: ImageData[]
}

export declare type RichTextParams<
	RestProps = Record<string, unknown>
> = {
	className?: string
	data: RichTextData
	Image?: ImageComponent<RestProps>
	Macro?: MacroComponent<RestProps>
	Link?: LinkComponent<RestProps>
	replacer?: Replacer
	tag?: string
} & RestProps;
