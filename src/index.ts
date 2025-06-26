// WARNING: This file should NOT be imported into server-side Nashorn code.
// It is supoosed to be used in React4XP (GraalJS) and Next.js projects.
// The reason is that Nashorn does NOT support Uint16Array:
// * which is used in the 'entities' node module,
// * which is used by the 'html-react-parser' node module,
// * which is used by RichText.
export type {
	ComponentProps,
	ProcessedProps,
	ContentUri,
	ProcessedData,
	ProcessedLayout,
	ProcessedPage,
	ProcessedPart,
	ProcessedText,
	ProcessedRegions,
	ProcessedRegion,
	ProcessedError,
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
	MacroData,
	MacroDescriptor,
	MediaUri,
	Replacer,
	ReplacerResult,
	RichtextContent,
	RichTextData,
	RichTextParams,
} from './types';

export { ErrorComponent } from './Common/ErrorComponent';
export { HtmlComment } from './Common/HtmlComment';
export { Warning } from './Common/Warning';

export { BaseComponent } from './ComponentRegistry/BaseComponent';
export { BaseContentType } from './ComponentRegistry/BaseContentType';
export { BaseLayout } from './ComponentRegistry/BaseLayout';
export { BaseMacro } from './ComponentRegistry/BaseMacro';
export { BasePage } from './ComponentRegistry/BasePage';
export { BasePart } from './ComponentRegistry/BasePart';
export { BaseText } from './ComponentRegistry/BaseText';

// NOTE: This is the implementation, not the type, causes "--jsx is not set" warnings in other projects when imported as a type.
export { ComponentRegistry } from './ComponentRegistry/ComponentRegistry';

export { Region } from './ComponentRegistry/Region';
export { Regions } from './ComponentRegistry/Regions';
export { XpFallback } from './ComponentRegistry/XpFallback';

export { Image } from './RichText/Image';
export { Link } from './RichText/Link';
export { Macro } from './RichText/Macro';
export { RichText } from './RichText/RichText';
export { cssToReactStyle } from './RichText/cssToReactStyle';
export { sanitizeGraphqlName } from './utils/sanitizeGraphqlName';
