import type {
	ImageContent,
	RichTextData,
} from '../src/types';


import {
	beforeAll,
	afterAll,
	describe,
	expect,
	test as it
} from '@jest/globals';
import {render} from '@testing-library/react'
import React from 'react';
// import renderer from 'react-test-renderer';
import {RichText} from '../src/RichText';
// import {imageUrlFnGenerator} from '../src/RichText/imageUrlFnGenerator';
import {Image} from './RichText/Image';
import {Link} from './RichText/Link';
import {Macro} from './RichText/Macro';
import {print} from 'q-i';


const IMG_REF = '59b78b11-3abf-4b7e-b16e-a5b1e90efcb0';
const IMG_ID = 'e9b1f92b-fa46-4e58-b41f-87dc9f1999e8'
const IMG_VERSION_KEY = '9abf6cc6c7f565515175b33c08155b3495dcdf47';

const IMAGE: ImageContent = {
	_id: IMG_ID,
	_name: 'example.jpg',
	_path: '/mysite/example.jpg',
	type: 'media:image',
}


const FOLDER_ID = '73fb7dd4-b483-428e-968e-690ca65b11d8';
const FOLDER_REF = '8c5593b8-fe2f-47d0-a7fa-472be74a2ae5';


const originalError = console.error
beforeAll(() => {
	console.error = (...args) => {
		// console.debug(args);
		if (
			args[0] === 'Warning: validateDOMNesting(...): %s cannot appear as a descendant of <%s>.%s'
			&& args[1] === '<div>'
			&& args[2] === 'p'
		) {
			return
		}
		originalError.call(console, ...args)
	}
});

afterAll(() => {
	console.error = originalError;
});

describe('RichText', () => {
	it('should NOT touch images', () => {
		const data: RichTextData = {
			images: [{
				image: IMAGE,
				ref: IMG_REF,
				// style: null
			}],
			links: [],
			macros: [],
			processedHtml: `<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\"><img alt=\"Alt text\" src=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg\" style=\"width:100%\" data-image-ref=\"${IMG_REF}\">
<figcaption>Caption</figcaption>
</figure>`
		}
		const html = render(<RichText
			className='myclass'
			data={data}
			Image={Image}
			Link={Link}
			Macro={Macro}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><figure class="captioned editor-align-right editor-width-custom" style="float: right; width: 50%;"><img alt="Alt text" src="/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg" style="width: 100%;">
<figcaption>Caption</figcaption>
</figure></section></div></body>`);
	}); // it

	it('should NOT touch images with srcsets', () => {
		const dataWithSrcSet: RichTextData = {
			images: [{
				image: IMAGE,
				ref: IMG_REF,
				// style: null
			}],
			links: [],
			macros: [],
			processedHtml: `<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\"><img alt=\"Alt text\" src=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg\" style=\"width:100%\" srcset=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-2048/example.jpg 2048w,/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-1024/example.jpg 1024w\" sizes=\"juhu\" data-image-ref=\"${IMG_REF}\">\n<figcaption>Caption</figcaption>\n</figure>`
		}
		const html = render(<RichText
			className='myclass'
			data={dataWithSrcSet}
			Image={Image}
			Link={Link}
			Macro={Macro}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><figure class="captioned editor-align-right editor-width-custom" style="float: right; width: 50%;"><img alt="Alt text" sizes="juhu" src="/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg" srcset="/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-2048/example.jpg 2048w,/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-1024/example.jpg 1024w" style="width: 100%;">
<figcaption>Caption</figcaption>
</figure></section></div></body>`);
	});

	it('should NOT touch links to open or download media', () => {
		const LINK_REF1 = '7c68ab3a-689b-45d0-9043-10067598af0c';
		const LINK_REF2 = 'fc7ef744-02b8-4518-b3bb-50c021a54ac5';
		const data: RichTextData = {
			images: [],
			links: [{
				content: null,
				ref: LINK_REF1,
				uri: `media://inline/${IMG_ID}`
			},{
				content: null,
				ref: LINK_REF2,
				uri: `media://download/${IMG_ID}`
			}],
			macros: [],
			processedHtml: `<p>
	<a href=\"/admin/site/preview/richproject/draft/_/attachment/inline/${IMG_ID}:${IMG_VERSION_KEY}/example.jpg\" title=\"open file tooltip\" data-link-ref=\"${LINK_REF1}\">open file text</a>
	<a href=\"/admin/site/preview/richproject/draft/_/attachment/download/${IMG_ID}:${IMG_VERSION_KEY}/example.jpg\" title=\"download file tooltip\" data-link-ref=\"${LINK_REF2}\">download file text</a>
</p>`
		}
		const html = render(<RichText
			className='myclass'
			data={data}
			Image={Image}
			Link={Link}
			Macro={Macro}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p>
	<a href=\"/admin/site/preview/richproject/draft/_/attachment/inline/${IMG_ID}:${IMG_VERSION_KEY}/example.jpg\" title=\"open file tooltip\">open file text</a>
	<a href=\"/admin/site/preview/richproject/draft/_/attachment/download/${IMG_ID}:${IMG_VERSION_KEY}/example.jpg\" title=\"download file tooltip\">download file text</a>
</p></section></div></body>`);
	});

	it('should handle links', () => {
		const data: RichTextData = {
			images: [],
			links: [{
				content: {
					_id: FOLDER_ID,
					_name: 'myfolder',
					_path: '/mysite/myfolder',
					type: 'base:folder'
				},
				ref: FOLDER_REF,
				uri: `content://${FOLDER_ID}?query=key%3Dvalue&fragment=anchor`
			}],
			macros: [],
			processedHtml: `<p><a href=\"/admin/site/preview/richproject/draft/mysite/myfolder?key=value#anchor\" target=\"_blank\" title=\"link tooltip\" data-link-ref=\"${FOLDER_REF}\">link text</a></p>
<p><a href=\"mailto:email@example.com?subject=Subject\" title=\"Tooltip\">Text</a></p>
<p><a href=\"https://www.example.com\" target=\"_blank\" title=\"Tooltip\">Text</a></p>`
		}
		const html = render(<RichText
			className='myclass'
			data={data}
			Image={Image}
			Link={Link}
			Macro={Macro}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p><a href="/admin/site/preview/richproject/draft/mysite/myfolder?key=value#anchor" target="_blank" title="link tooltip">link text</a></p>
<p><a href="mailto:email@example.com?subject=Subject" title="Tooltip">Text</a></p>
<p><a href="https://www.example.com" target="_blank" title="Tooltip">Text</a></p></section></div></body>`);
	});

	it('should handle macros', () => {
		const SUCCESS_REF = 'aa398f96-98d9-4ce1-a224-db732a57a68c';
		const dataWithMacros: RichTextData = {
			images: [],
			links: [],
			macros: [{
				"ref": SUCCESS_REF,
				"name": "success",
				"descriptor": "com.enonic.app.panelmacros:success",
				"config": {
				  "success": {
					"__nodeId": "d30c4572-0720-44cb-8137-7c830722b056",
					"header": "Iha",
					"body": "Jubalong"
				  }
				}
			  }],
			processedHtml: `<p><editor-macro data-macro-name=\"success\" data-macro-ref=\"${SUCCESS_REF}\">Jubalong</editor-macro></p>`
		}
		const html = render(<RichText
			className='myclass'
			data={dataWithMacros}
			Image={Image}
			Macro={Macro}
			Link={Link}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p><div class=\"macro-panel macro-panel-success macro-panel-styled\"><i class=\"icon\"></i>&lt;strong&gt;Iha&lt;/strong&gt;Jubalong</div></p></section></div></body>`);
	});
}); // describe RichText
