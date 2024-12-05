// There is a difference between the core enonic types and what Guillotine returns:
import type {
	Content,
	Layout,
	LayoutComponent,
	Part,
	PartComponent,
	Page,
	PageComponent,
} from '@enonic-types/core';
import type { ComponentRegistry } from './ComponentRegistry';
import type { XpTextBaseProps } from './XpTextBaseProps';

// The Guillotine types are similar, but uses complex types:
// import type {Content} from '@enonic-types/guillotine/advanced';

export type {
	ComponentDefinition,
	ComponentDefinitionParams,
	ComponentDictionary,
	ComponentRegistry,
} from './ComponentRegistry';
export type {
	RenderableComponent,
	RenderableContentType,
	RenderableLayoutComponent,
	RenderablePageComponent,
	RenderablePartComponent,
	RenderableTextComponent,
	XpRunMode,
} from './Renderable';
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

export interface XpTextProps extends XpTextBaseProps {
	componentRegistry: ComponentRegistry;
}
