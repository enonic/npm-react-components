// There is a difference between the core enonic types and what Guillotine returns:
import type {
	Content,
	Layout,
	LayoutComponent,
	LiteralUnion,
	Part,
	PartComponent,
	Page,
	PageComponent,
	RequestMode
} from '@enonic-types/core';
import type {ComponentRegistry} from './ComponentRegistry';
import type {TextBaseProps} from './TextBaseProps';

// The Guillotine types are similar, but uses complex types:
// import type {Content} from '@enonic-types/guillotine/advanced';

export type {
	ComponentDefinition,
	ComponentDefinitionParams,
	ComponentDictionary,
	ComponentRegistry,
} from './ComponentRegistry';
export type {
	ProcessedProps,
	ProcessedData,
	ProcessedRegions,
	ProcessedRegion,
	ProcessedError,
	ProcessedContentType,
	ProcessedLayout,
	ProcessedPage,
	ProcessedPart,
	ProcessedText,
	ProcessedWarning,
	XpRunMode,
} from './ProcessedData';
export type {
	CreateReplacerParams,
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
	ReplaceMacroParams,
	Replacer,
	ReplacerResult,
	RichtextContent,
	RichTextData,
	RichTextParams,
} from './RichText';

export type {
	PartProps
} from '../ComponentRegistry/BasePart';
export type {
	LayoutProps
} from '../ComponentRegistry/BaseLayout';
export type {
	PageProps
} from '../ComponentRegistry/BasePage';
export type {
	ContentTypeProps
} from '../ComponentRegistry/BaseContentType';

export type ContentUri = `content://${string}`;


export type FragmentContent<
	Component extends LayoutComponent | PartComponent = Layout | Part
> = Content<undefined,'portal:fragment',Component>;

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

export interface TextProps extends TextBaseProps {
	componentRegistry: ComponentRegistry;
	mode: LiteralUnion<RequestMode>
}
