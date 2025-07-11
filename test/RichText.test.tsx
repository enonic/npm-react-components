import {RichTextData, RichTextMetaData, type PartData} from '../src/types';


import {describe, expect, test as it} from '@jest/globals';
import {render} from '@testing-library/react'
import React from 'react';
import {RichText} from '../src';

export const METADATA: RichTextMetaData = {
	type: 'type',
	id: '12345678-1234-1234-1234-123456789012',
	path: '/some/path',
	mode: 'inline'
}

export const COMPONENT: PartData = {
	descriptor: 'com.enonic.app.foo:bar',
	path: '/main/0/layout/0',
	type: 'part'
}

describe('RichText', () => {
	it('should support tag', () => {
		const data: RichTextData = {
			processedHtml: `<p>Some text</p>`
		}
		const html = render(<RichText
			data={data}
			meta={METADATA}
			component={COMPONENT}
			tag='article'
		/>).baseElement;
		expect(html.outerHTML).toBe(`<body><div><article><p>Some text</p></article></div></body>`);
	});

	it('should return an empty element when processedHtml is missing or empty', () => {
		// @ts-expect-error
		const data: RichTextData = {};

		const html = render(<RichText
			data={data}
			meta={METADATA}
			component={COMPONENT}
		/>).baseElement;
		expect(html.outerHTML).toBe(`<body><div><section></section></div></body>`);
	});
}); // describe RichText
