// There is a difference between the core enonic types and what Guillotine returns:
import type {ComponentDescriptor, LiteralUnion, RequestMode, TextComponent} from '@enonic-types/core';
import {ComponentRegistry} from './ComponentRegistry';

export type XpRunMode = 'development' | 'production';

export interface ContentTypeData {
	contentType: string;
	type: 'contentType';
}

export interface ErrorData {
	html: string;
	path: string;
	type: 'error';
}

export interface RegionData {
	name: string;
	components: ComponentDataAndProps[];
}

export type RegionsData = Record<string, RegionData>;

export interface LayoutData {
	// config: never
	descriptor: ComponentDescriptor;
	path?: string // Missing in fragmentPreview https://github.com/enonic/xp/issues/10116
	regions: RegionsData;
	type: 'layout'
}

export interface PageData {
	// config: never;
	descriptor: ComponentDescriptor;
	path: '/';
	regions: RegionsData;
	type: 'page';
}

export interface PartData {
	// config: never
	descriptor: ComponentDescriptor;
	path?: string // Missing in fragmentPreview https://github.com/enonic/xp/issues/10116
	type: 'part'
}

export interface FragmentData {
	// config: never
	key?: string;
	path?: string;
	type: 'fragment';
}

export type TextData = TextComponent;

export type MetaData = {
	type: string;
	id: string;
	path: string;
	mode: LiteralUnion<RequestMode>;
	componentRegistry: ComponentRegistry;
}

export type ComponentDataAndProps<T extends ComponentData = ComponentData> = {
	data?: Record<string, unknown>;
	component: T;
}

export type ComponentData =
	| ContentTypeData
	| LayoutData
	| PageData
	| PartData
	| TextData
	| FragmentData
	| ErrorData;
