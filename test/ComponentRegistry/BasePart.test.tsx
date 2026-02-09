import type {MetaData, PartData, RichTextData} from '../../src/types';

import {describe, expect, test as it} from '@jest/globals';
import {render} from '@testing-library/react';
import React from 'react';

// SRC imports
import {ComponentRegistry} from '../../src/ComponentRegistry/ComponentRegistry';
import {BasePart} from '../../src/ComponentRegistry/BasePart';
// TEST imports
import {InfoPanel} from './InfoPanel';
import {EXAMPLE_PART_DESCRIPTOR} from './data'
import {ExamplePart} from './ExamplePart';

const componentRegistry = new ComponentRegistry;
const macroName = 'info';
componentRegistry.addMacro(macroName, {
	View: InfoPanel
});
componentRegistry.addPart(EXAMPLE_PART_DESCRIPTOR, {
	View: ExamplePart
});

const meta: MetaData = {
	type: 'portal:site',
	id: '12345678-1234-1234-1234-123456789012',
	path: '/mysite',
	mode: 'live',
	componentRegistry,
};

const component: PartData = {
	descriptor: EXAMPLE_PART_DESCRIPTOR,
	path: '/main/0',
	type: 'part',
};

const data: RichTextData = {
	processedHtml: '<p>Hello World</p>',
};

describe('ComponentRegistry', () => {
	it('should be able to render a part component', () => {
		const element = render(<BasePart
			component={component}
			data={data}
			meta={meta}
		/>).container;
		expect(element.innerHTML).toBe(
			'<div><section><p>Hello World</p></section></div>'
		);
	});
});
