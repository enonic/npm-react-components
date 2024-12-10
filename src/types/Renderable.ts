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
	type: 'contentType';
}

export interface RenderableError {
	html: string;
	mode: LiteralUnion<RequestMode>;
	path: string;
	type: 'error';
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
	type: 'layout'
	warning?: string;
}

export interface RenderablePageComponent {
	// config: never;
	descriptor: ComponentDescriptor;
	error?: string;
	mode: LiteralUnion<RequestMode>;
	path: '/';
	props?: Record<string, unknown>;
	regions: RenderableRegions;
	type: 'page';
	warning?: string;
}

export interface RenderablePartComponent {
	// config: never
	descriptor: ComponentDescriptor;
	mode: LiteralUnion<RequestMode>;
	path?: string // Missing in fragmentPreview https://github.com/enonic/xp/issues/10116
	props?: Record<string, unknown>
	type: 'part'
	warning?: string;
}

export interface RenderableWarning {
	html: string;
	mode: LiteralUnion<RequestMode>;
	path: string;
	type: 'warning';
}

export type RenderableTextComponent = TextComponent & {
	mode: LiteralUnion<RequestMode>;
	props?: XpTextBaseProps;
}

export type RenderableComponent =
	| RenderableContentType
	| RenderableError
	| RenderableLayoutComponent
	| RenderablePageComponent
	| RenderablePartComponent
	| RenderableTextComponent
	| RenderableWarning;
