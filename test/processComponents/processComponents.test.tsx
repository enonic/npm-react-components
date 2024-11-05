import type {
	ListDynamicSchemasParams,
	MixinSchema,
} from '@enonic-types/lib-schema';
// import type {RegionsProps} from '../../src/Regions';
// import type {MacroComponent} from '../../src/types';
import type {InfoPanelProps} from './InfoPanel';

import {
	// beforeAll,
	// afterAll,
	describe,
	// expect,
	test as it
} from '@jest/globals';
// import {render} from '@testing-library/react'
// import toDiffableHtml from 'diffable-html';
// import {print} from 'q-i';
// import React from 'react';

import {ComponentRegistry} from '../../src/ComponentRegistry';
// import Regions from '../../../src/Regions';
// import {RichText} from '../../src/RichText';
// import {replaceMacroComments} from '../../src/replaceMacroComments';
import {processComponents} from '../../src/processComponents';
import {InfoPanel} from './InfoPanel';

import {
	LAYOUT_FRAGMENT_CONTENT_ID,
	LAYOUT_FRAGMENT_CONTENT,
	PAGE_COMPONENT,
	PART_FRAGMENT_CONTENT_ID,
	PART_FRAGMENT_CONTENT,
	PROCESSED_HTML,
	TEXT_FRAGMENT_CONTENT_ID,
	TEXT_FRAGMENT_CONTENT,
} from './data';
import {
	LAYOUT_SCHEMA,
	MIXIN_SCHEMAS,
	PART_SCHEMA,
	PAGE_SCHEMA,
} from './schema';

const componentRegistry = new ComponentRegistry;
componentRegistry.addMacro<InfoPanelProps>('info', {
	View: InfoPanel
});

describe('processComponents', () => {
	it('is able to process anything', () => {
		const processed = processComponents({
			component: PAGE_COMPONENT,
			getComponentSchema: ({
				// key,
				type,
			}) => {
				if (type === 'PART') return PART_SCHEMA;
				if (type === 'LAYOUT') return LAYOUT_SCHEMA;
				return PAGE_SCHEMA;
			},
			// @ts-expect-error
			getContentByKey: ({key}) => {
				if (key === LAYOUT_FRAGMENT_CONTENT_ID) {
					return LAYOUT_FRAGMENT_CONTENT;
				}
				if (key === PART_FRAGMENT_CONTENT_ID) {
					return PART_FRAGMENT_CONTENT;
				}
				if (key === TEXT_FRAGMENT_CONTENT_ID) {
					return TEXT_FRAGMENT_CONTENT;
				}
				console.error("getContentByKey:", key);
				return undefined;
			},
			listSchemas: ({
				application: _application,
				type,
			}: ListDynamicSchemasParams) => {
				if (type === 'MIXIN') {
					return MIXIN_SCHEMAS as MixinSchema[];
				}
				// ContentSchemaType[]
				// XDataSchema[]
				throw new Error(`listSchemas: type: ${type} not mocked.`);
			},
			processHtml: ({ value }) => {
				// console.info("processHtml:", value);
				return PROCESSED_HTML;
			},
		});
		// print(processed, { maxItems: Infinity });
		// expect(toDiffableHtml(element.outerHTML)).toEqual(``);
	});
});
