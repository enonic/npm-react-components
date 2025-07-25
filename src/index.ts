// WARNING: This file should NOT be imported into server-side Nashorn code.
// It is supoosed to be used in React4XP (GraalJS) and Next.js projects.
// The reason is that Nashorn does NOT support Uint16Array:
// * which is used in the 'entities' node module,
// * which is used by the 'html-react-parser' node module,
// * which is used by RichText.
export type {
    ComponentProps,
    ContentUri,
    MetaData,
    ComponentData,
    ComponentDataAndProps,
    LayoutData,
    PageData,
    PartData,
    TextData,
    RegionsData,
    RegionData,
    FragmentData,
    ErrorData,
    ContentTypeData,
    MacroComponentData,
    ImageComponent,
    ImageComponentParams,
    ImageContent,
    ImageData,
    ImageStyle,
    LinkComponent,
    LinkComponentParams,
    LinkData,
    LinkDataMedia,
    MacroComponent,
    MacroComponentParams,
    MacroConfig,
    MediaUri,
    Replacer,
    ReplacerResult,
    RichtextContent,
    RichTextData,
    ExtendedRichTextData,
    RichTextMetaData,
    RichTextComponentProps,
    MacroData,
    RichTextParams
} from './types';

export {COMPONENT_DATA_TYPE, XP_REQUEST_MODE} from './constants';

export {ErrorComponent} from './Common/ErrorComponent';
export {HtmlComment} from './Common/HtmlComment';

export {BaseComponent} from './ComponentRegistry/BaseComponent';
export {BaseContentType} from './ComponentRegistry/BaseContentType';
export {BaseLayout} from './ComponentRegistry/BaseLayout';
export {BaseMacro} from './ComponentRegistry/BaseMacro';
export {BasePage} from './ComponentRegistry/BasePage';
export {BasePart} from './ComponentRegistry/BasePart';
export {BaseText} from './ComponentRegistry/BaseText';

// NOTE: This is the implementation, not the type, causes "--jsx is not set" warnings in other projects when imported as a type.
export {ComponentRegistry} from './ComponentRegistry/ComponentRegistry';

export {Region} from './ComponentRegistry/Region';
export {Regions} from './ComponentRegistry/Regions';
export {XpFallback} from './ComponentRegistry/XpFallback';

export {Image} from './RichText/Image';
export {Link} from './RichText/Link';
export {RichText} from './RichText/RichText';
export {cssToReactStyle} from './RichText/cssToReactStyle';
export {sanitizeGraphqlName} from './utils/sanitizeGraphqlName';
