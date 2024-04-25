import type {
	RichTextData,
} from '../src/types';


import {
	describe,
	expect,
	test as it
} from '@jest/globals';
import {render} from '@testing-library/react'
import React from 'react';
import {RichText} from '../src';


describe('RichText', () => {
	it('should support tag', () => {
		const data: RichTextData = {
			processedHtml: `<p>Some text</p>`
		}
		const html = render(<RichText
			data={data}
			tag='article'
		/>).baseElement;
		expect(html.outerHTML).toBe(`<body><div><article><p>Some text</p></article></div></body>`);
	});

	it('should return an empty element when processedHtml is missing or empty', () => {
		// @ts-expect-error
		const data: RichTextData = {};

		const html = render(<RichText
			data={data}
		/>).baseElement;
		expect(html.outerHTML).toBe(`<body><div><section></section></div></body>`);
	});
}); // describe RichText
