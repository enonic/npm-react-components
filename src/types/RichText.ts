import type {DOMNode, Element} from 'html-react-parser';
import type {ReactNode, JSX, CSSProperties, ElementType} from 'react';
import type {LiteralUnion} from '@enonic-types/core';
import type {ComponentRegistry} from './ComponentRegistry';
import {ComponentProps, MetaData, MacroComponentData, ComponentDataAndProps} from './index';

// RichText data types and interfaces

/** URL components supplied by a data source; their interpretation belongs to the consumer. */
export interface UrlParts {
    path: string;
    queryString?: string;
    baseUrl?: string | null;
}

export type UrlValue = string | UrlParts;

export interface RichTextData extends Record<string, unknown> {
    processedHtml: string;
    links?: LinkData[];
    macros?: MacroData[];
    images?: ImageData[];
}

export interface ExtendedRichTextData extends RichTextData {
    macroComponents?: ComponentDataAndProps<MacroComponentData>[];
}

export interface LinkData {
    ref: string;
    content?: Partial<RichtextContent> | null;
    media?: LinkDataMedia | null;
    pageUrl?: UrlValue | null;
    fragment?: string;
    uri: string;
}

export interface LinkDataMedia {
    content: Partial<RichtextContent> | null;
    mediaUrl?: UrlValue | null;
    intent: 'inline' | 'download';
}

export type MacroConfig = Record<string, unknown>;

export interface MacroData {
    ref: string;
    name: string;
    descriptor: string;
    config: Record<string, MacroConfig>;
}

export type ImageContent = Partial<RichtextContent> & {
    imageUrl?: string;
}

export interface ImageSource {
    width: number;
    imageUrl: UrlValue;
}

export interface ImageData {
    ref: string;
    image: ImageContent | null;
    src?: UrlValue | null;
    srcset?: ImageSource[];
    style?: ImageStyle | null;
}

export interface ImageStyle {
    application?: string;
    name: string;
    aspectRatio: string;
    filter: string;
}


// Replacer types and interfaces

export type RichTextComponentProps = Omit<ComponentProps, 'data' | 'meta'> & {
    data: ExtendedRichTextData;
    meta: RichTextMetaData;
}

export type RichTextMetaData = Omit<MetaData, 'componentRegistry'> & {
    componentRegistry?: ComponentRegistry;
}

export type CreateReplacer<RestProps = Record<string, unknown>> = (params: CreateReplacerParams<RestProps>) => (domNode: DOMNode) => ReplacerResult;

export interface CreateReplacerParams<RestProps = Record<string, unknown>> extends RichTextComponentProps {
    Image: ImageComponent<RestProps>;
    Link: LinkComponent<RestProps>;
    Macro: MacroComponent<RestProps>;
    replacer?: Replacer<RestProps>;
}

export type ReplacerResult = JSX.Element | object | void | undefined | null | false;

export type ImageComponent<
    RestProps = Record<string, unknown>
> = (params: ImageComponentParams<RestProps>) => JSX.Element | null;

export type ImageComponentParams<
    RestProps = Record<string, unknown>
> = {
    alt?: string;
    /** The original reference entry, including any structured URL values. */
    data?: ImageData;
    /** @deprecated Use data.image instead. */
    image: ImageData['image'];
    /** @deprecated Use data.style instead. */
    imageStyle?: ImageStyle | null;
    sizes?: string;
    src: string;
    srcSet?: string;
    style?: CSSProperties;
} & RestProps;

export type ReplacerParams<RestProps = Record<string, unknown>> = RichTextComponentProps & {
    el: Element;
} & RestProps;

export type Replacer<
    RestProps = Record<string, unknown>
> = (params: ReplacerParams<RestProps>) => ReplacerResult;


export type LinkComponent<
    RestProps = Record<string, unknown>
> = (params: LinkComponentParams<RestProps>) => JSX.Element | null;

export type LinkComponentParams<
    RestProps = Record<string, unknown>
> = {
    children: ReactNode;
    /** Present for a referenced link; absent for ordinary HTML links. */
    data?: LinkData;
    /** @deprecated Use data.content instead. */
    content?: LinkData['content'];
    /** @deprecated Use data.media instead. */
    media?: LinkData['media'];
    /** @deprecated Use data.uri for referenced links, or href for ordinary HTML links. */
    uri: string;
    href: string;
    target?: string;
    title?: string;
} & RestProps;

export type MacroComponent<
    RestProps = Record<string, unknown>
> = (params: MacroComponentParams<RestProps>) => JSX.Element | null;

export type MacroComponentParams<
    RestProps = Record<string, unknown>
> = ComponentProps<MacroComponentData> & {
    children: string | JSX.Element | JSX.Element[];
} & RestProps;

export interface ReplaceMacroImageLinkParams<RestProps = Record<string, unknown>> extends CreateReplacerParams<RestProps> {
    createReplacer: CreateReplacer<RestProps>;
    el: Element;
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
> = RichTextComponentProps & {
    // ElementType covers components and Fragment, LiteralUnion keeps plain strings
    // (custom elements, string variables) assignable while autocompleting known tags.
    tag?: ElementType | LiteralUnion<keyof JSX.IntrinsicElements>;
    className?: string;
    Image?: ImageComponent<RestProps>;
    Macro?: MacroComponent<RestProps>;
    Link?: LinkComponent<RestProps>;
    replacer?: Replacer<RestProps>;
} & RestProps;
