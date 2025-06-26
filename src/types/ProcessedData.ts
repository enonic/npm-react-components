// There is a difference between the core enonic types and what Guillotine returns:
import type {ComponentDescriptor, LiteralUnion, RequestMode, TextComponent} from '@enonic-types/core';
import {ComponentRegistry} from './ComponentRegistry';

export type XpRunMode = 'development' | 'production';

export type ProcessedProps = Record<string, unknown>;

export interface ProcessedContentType {
	contentType: string;
	type: 'contentType';
}

export interface ProcessedError {
	html: string;
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
	path?: string // Missing in fragmentPreview https://github.com/enonic/xp/issues/10116
	regions: ProcessedRegions;
	type: 'layout'
	warning?: string;
}

export interface ProcessedPage {
	// config: never;
	descriptor: ComponentDescriptor;
	error?: string;
	path: '/';
	regions: ProcessedRegions;
	type: 'page';
	warning?: string;
}

export interface ProcessedPart {
	// config: never
	descriptor: ComponentDescriptor;
	path?: string // Missing in fragmentPreview https://github.com/enonic/xp/issues/10116
	type: 'part'
	warning?: string;
}

export interface ProcessedWarning {
	html: string;
	path: string;
	type: 'warning';
}

export type ProcessedText = TextComponent;

export type MetaData = {
	type: string;
	id: string;
	path: string;
	mode: LiteralUnion<RequestMode>;
	componentRegistry: ComponentRegistry;
}

export type ProcessedData = {
	data?: ProcessedProps;
	component: ProcessedComponent;
}

export type ProcessedComponent =
	| ProcessedContentType
	| ProcessedLayout
	| ProcessedPage
	| ProcessedPart
	| ProcessedText
	| ProcessedError
	| ProcessedWarning;
