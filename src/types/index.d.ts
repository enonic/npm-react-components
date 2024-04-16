import {DOMNode} from 'html-react-parser';


export interface ImageData {
    ref: string
    image: {
        _id: string
    },
	// style: // TODO
}

export declare interface LinkData {
	ref: string
	content: {
		_id: string
		_name: string
		_path: string
		type: string
	} | null
	// media: { // NOTE: This is not used for now.
	// 	content: {
	// 		_id: string
	// 		_name: string
	// 		_path: string
	// 		mediaUrl: string
	// 		type: string
	// 	}
	// 	intent: 'inline' | 'download'
	// } | null
	uri: string
}

export declare type MacroConfig = Record<string, any>;

export declare interface MacroData {
    ref: string
    name: string
    descriptor: string
    config: Record<string, MacroConfig>
}

export type MacroDescriptor = `${string}:${string}`;

export declare interface MacroRegistry {
	[key: MacroDescriptor]: (params?: any) => React.JSX.Element
}

export type Replacer = (
    domNode: DOMNode,
    data: RichTextData,
    // meta: MetaData,
    // renderMacroInEditMode: boolean
) => ReplacerResult;

export type ReplacerResult = JSX.Element | object | void | undefined | null | false;

export declare interface RichTextData {
    processedHtml: string
    links: LinkData[]
    macros: MacroData[]
    images: ImageData[]
}
