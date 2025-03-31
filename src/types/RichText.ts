import type {
	LiteralUnion,
	RequestMode,
} from '@enonic-types/core';
import type {
	DOMNode,
	Element
} from 'html-react-parser';
import type {ReactNode, JSX} from 'react';
import type {ComponentRegistry} from './ComponentRegistry';

export type CreateReplacer<RestProps = Record<string, unknown>> = (params: CreateReplacerParams<RestProps>) => (domNode: DOMNode) => ReplacerResult;

export interface CreateReplacerParams<RestProps = Record<string, unknown>> {
	componentRegistry?: ComponentRegistry;
	data: RichTextData;
	Image: ImageComponent<RestProps>;
	Link: LinkComponent<RestProps>;
	Macro: MacroComponent<RestProps>;
	mode?: LiteralUnion<RequestMode>;
	replacer?: Replacer;
}

export type ImageComponent<
	RestProps = Record<string, unknown>
> = (params: ImageComponentParams<RestProps>) => React.JSX.Element | null;

export type ImageComponentParams<
	RestProps = Record<string, unknown>
> = {
	alt?: string;
	image: ImageContent;
	imageStyle?: ImageStyle | null;
	sizes?: string;
	src: string;
	srcSet?: string;
	style?: React.CSSProperties;
} & RestProps;

export type ImageContent = Partial<RichtextContent> & {
	imageUrl?: string;
}

export interface ImageData {
	ref: string;
	image: ImageContent;
	style?: ImageStyle | null;
}

export interface ImageStyle {
	name: string;
	aspectRatio: string;
	filter: string;
}

export interface LinkData {
	ref: string;
	content?: Partial<RichtextContent> | null;
	media?: LinkDataMedia | null;
	uri: string;
}

export interface LinkDataMedia {
	content: Partial<RichtextContent> & {
		mediaUrl?: string;
	}
	intent: 'inline' | 'download';
}

export type MacroConfig = Record<string, any>;

export interface MacroData {
	ref: string;
	name: string;
	descriptor: MacroDescriptor;
	config: Record<string, MacroConfig>;
}

export type MacroDescriptor = `${string}:${string}`;

export type Replacer = (params: {
	el: Element;
	data: RichTextData;
	mode?: LiteralUnion<RequestMode>;
}) => ReplacerResult;

export type ReplacerResult = React.JSX.Element | object | void | undefined | null | false;

export interface RichTextData {
	processedHtml: string;
	links?: LinkData[];
	macros?: MacroData[];
	images?: ImageData[];
}

export type LinkComponent<
	RestProps = Record<string, unknown>
> = (params: LinkComponentParams<RestProps>) => React.JSX.Element | null;

export type LinkComponentParams<
	RestProps = Record<string, unknown>
> = {
	children: ReactNode;
	content?: Partial<RichtextContent> | null;
	href: string;
	media?: LinkDataMedia | null;
	target?: string;
	title?: string;
	uri: string;
} & RestProps;

export type MacroComponent<
	RestProps = Record<string, unknown>
> = (params: MacroComponentParams<RestProps>) => React.JSX.Element | null;

export type MacroComponentParams<
	RestProps = Record<string, unknown>
> = {
	children: string | React.JSX.Element | React.JSX.Element[];
	componentRegistry?: ComponentRegistry;
	config: Record<string, unknown>;
	descriptor: MacroDescriptor;
	mode?: LiteralUnion<RequestMode>;
} & RestProps;

export interface ReplaceMacroParams<RestProps = Record<string, unknown>> {
	componentRegistry?: ComponentRegistry;
	createReplacer: CreateReplacer<RestProps>;
    data: RichTextData;
    el: Element;
    Image: ImageComponent<RestProps>;
    Link: LinkComponent<RestProps>;
    Macro: MacroComponent<RestProps>;
	mode?: LiteralUnion<RequestMode>;
    replacer?: Replacer;
}

export type RichtextContent<
	Extensions extends Record<string, unknown> = Record<string, unknown>
> = {
	// Direct Properties
	_id: string;
	_name: string;
	_path: string;
	_references: RichtextContent[];
	_score?: number;
	// attachments: Attachment[];
	children: RichtextContent[];
	// childrenConnection: ContentConnection;
	components: RichtextContent[];
	// contentType: ContentType;
	createdTime: string;
	// creator: PrincipalKey;
	// dataAsJson: GraphQLJson;
	displayName: string;
	// hasChildren: GraphQLBoolean;
	language: string;
	modifiedTime?: string;
	// modifier: PrincipalKey;
	// owner: PrincipalKey;
	// pageAsJson: GraphQLJson;
	pageTemplate: RichtextContent;
	pageUrl: string;
	parent: RichtextContent;
	// permissions: Permissions;
	// publish: PublishInfo;
	// site: portal_Site;
	type: string;
	valid: boolean;
	// x: ExtraData;
	// xAsJson: GraphQLJson;

	// ... on media_Image
	imageUrl?: string;
	mediaUrl?: string;
	[key: string]: any;
} & Extensions

export type RichTextParams<
	RestProps = Record<string, unknown>
> = {
	className?: string;
	componentRegistry?: ComponentRegistry;
	data: RichTextData;
	Image?: ImageComponent<RestProps>;
	Macro?: MacroComponent<RestProps>;
	mode?: LiteralUnion<RequestMode>;
	Link?: LinkComponent<RestProps>;
	replacer?: Replacer;
	tag?: string;
} & RestProps;
