// There is a difference between the core enonic types and what Guillotine returns:
import type {
	ComponentDescriptor,
	// LayoutComponent,
	LiteralUnion,
	// PageComponent,
	RequestMode,
	TextComponent,
} from '@enonic-types/core';
import type { XpTextBaseProps } from './XpTextBaseProps';

export type XpRunMode = 'development' | 'production';

export interface RenderableContentType {
	contentType: string;
	mode: LiteralUnion<RequestMode>;
	props?: Record<string, unknown>
	runMode: XpRunMode;
	type: 'contentType';
}

export interface RenderableRegion {
	name: string;
	components: RenderableComponent[];
}

export type RenderableRegions = Record<string, RenderableRegion>;

export interface RenderableLayoutComponent {
	// config: never
	descriptor: ComponentDescriptor;
	mode: LiteralUnion<RequestMode>;
	path?: string // Missing in fragmentPreview https://github.com/enonic/xp/issues/10116
	props?: Record<string, unknown>
	regions: RenderableRegions;
	runMode: XpRunMode;
	type: 'layout'
	warning?: string;
}

export interface RenderablePageComponent {
	// config: never;
	descriptor: ComponentDescriptor;
	mode: LiteralUnion<RequestMode>;
	path: '/';
	props?: Record<string, unknown>;
	regions: RenderableRegions;
	runMode: XpRunMode;
	type: 'page';
	warning?: string;
}

export interface RenderablePartComponent {
	// config: never
	descriptor: ComponentDescriptor;
	mode: LiteralUnion<RequestMode>;
	path?: string // Missing in fragmentPreview https://github.com/enonic/xp/issues/10116
	props?: Record<string, unknown>
	runMode: XpRunMode;
	type: 'part'
	warning?: string;
}

export type RenderableTextComponent = TextComponent & {
	mode: LiteralUnion<RequestMode>;
	props?: XpTextBaseProps;
	runMode: XpRunMode;
}

export type RenderableComponent =
	| RenderableContentType
	| RenderableLayoutComponent
	| RenderablePageComponent
	| RenderablePartComponent
	| RenderableTextComponent;
