import type {DOMNode} from 'html-react-parser';
import type {ReactNode} from 'react';


export declare interface Content {
	_id: string
	_name: string
	_path: string
	type: string
}

export declare type ContentUri = `content://${string}`;

export declare type ImageContent = Content & {
	imageUrl?: string
}

export declare type ImageComponent = (params: ImageComponentParams) => React.JSX.Element | null;

export declare interface ImageComponentParams {
	alt?: string
	image: ImageContent
	imageStyle?: ImageStyle | null
	sizes?: string
	src: string
	srcset?: string
	styleStr?: string
}

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

export declare type LinkComponent = (params: LinkComponentParams) => React.JSX.Element | null;

export declare interface LinkComponentParams {
	children: ReactNode
	content: Content
	href: string
	target?: string
	title?: string
	uri: string
}

export declare interface LinkData {
	ref: string
	content: Content | null
	// media: { // NOTE: This is not used for now.
	// 	content: Content & {
	// 		mediaUrl: string
	// 	}
	// 	intent: 'inline' | 'download'
	// } | null
	uri: string
}

export declare type MacroConfig = Record<string, any>;

export declare type MacroComponent = (params: MacroComponentParams) => React.JSX.Element | null

export declare interface MacroComponentParams {
	config: Record<string, unknown>
	descriptor: MacroDescriptor;
}

export declare interface MacroData {
	ref: string
	name: string
	descriptor: MacroDescriptor
	config: Record<string, MacroConfig>
}

export declare type MacroDescriptor = `${string}:${string}`;

export declare type MediaUri = `media://${string}`;

export declare type Replacer = (
	domNode: DOMNode,
	data: RichTextData,
) => ReplacerResult;

export declare type ReplacerResult = JSX.Element | object | void | undefined | null | false;

export declare interface RichTextData {
	processedHtml: string
	links: LinkData[]
	macros: MacroData[]
	images: ImageData[]
}
