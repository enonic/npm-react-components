// There is a difference between the core enonic types and what Guillotine returns:
import type {ComponentDescriptor, LiteralUnion, RequestMode, TextComponent} from '@enonic-types/core';
import type {TextBaseProps} from './TextBaseProps';

export type XpRunMode = 'development' | 'production';

export interface ProcessedContentType {
	contentType: string;
	mode: LiteralUnion<RequestMode>;
	props?: Record<string, unknown>
	type: 'contentType';
}

export interface ProcessedError {
	html: string;
	mode: LiteralUnion<RequestMode>;
	path: string;
	type: 'error';
}

export interface ProcessedRegion {
	name: string;
	components: ProcessedData[];
}

export type ProcessedRegions = Record<string, ProcessedRegion>;

export interface ProcessedLayout {
	// config: never
	descriptor: ComponentDescriptor;
	mode: LiteralUnion<RequestMode>;
	path?: string // Missing in fragmentPreview https://github.com/enonic/xp/issues/10116
	props?: Record<string, unknown>
	regions: ProcessedRegions;
	type: 'layout'
	warning?: string;
}

export interface ProcessedPage {
	// config: never;
	descriptor: ComponentDescriptor;
	error?: string;
	mode: LiteralUnion<RequestMode>;
	path: '/';
	props?: Record<string, unknown>;
	regions: ProcessedRegions;
	type: 'page';
	warning?: string;
}

export interface ProcessedPart {
	// config: never
	descriptor: ComponentDescriptor;
	mode: LiteralUnion<RequestMode>;
	path?: string // Missing in fragmentPreview https://github.com/enonic/xp/issues/10116
	props?: Record<string, unknown>
	type: 'part'
	warning?: string;
}

export interface ProcessedWarning {
	html: string;
	mode: LiteralUnion<RequestMode>;
	path: string;
	type: 'warning';
}

export type ProcessedText = TextComponent & {
	mode: LiteralUnion<RequestMode>;
	props?: TextBaseProps;
}

export type ProcessedData =
	| ProcessedContentType
	| ProcessedLayout
	| ProcessedPage
	| ProcessedPart
	| ProcessedText
	| ProcessedError
	| ProcessedWarning;
