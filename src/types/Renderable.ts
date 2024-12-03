// There is a difference between the core enonic types and what Guillotine returns:
import type {
	ComponentDescriptor,
	LayoutComponent,
	LiteralUnion,
	PageComponent,
	RequestMode,
	TextComponent,
} from '@enonic-types/core';
import type { XpTextBaseProps } from './XpTextBaseProps';

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

export type RenderableTextComponent = TextComponent & {
	props?: XpTextBaseProps;
}

export type RenderableComponent =
	| RenderableLayoutComponent
	| RenderablePageComponent
	| RenderablePartComponent
	| RenderableTextComponent;
