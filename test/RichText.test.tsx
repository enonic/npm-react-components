import type {PageUrlParams} from '@enonic-types/lib-portal'
import type {
	MacroRegistry,
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
import {imageUrlFnGenerator} from '../src/RichText/imageUrlFnGenerator';
import {Success} from './RichText/Success';
import {print} from 'q-i';


const IMG_REF = '59b78b11-3abf-4b7e-b16e-a5b1e90efcb0';
const IMG_ID = 'e9b1f92b-fa46-4e58-b41f-87dc9f1999e8'
const IMG_VERSION_KEY = '9abf6cc6c7f565515175b33c08155b3495dcdf47';

const FOLDER_ID = '73fb7dd4-b483-428e-968e-690ca65b11d8';
const FOLDER_REF = '8c5593b8-fe2f-47d0-a7fa-472be74a2ae5';

const ID_TO_URL = {
	[IMG_ID]: `/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg`,
	[FOLDER_ID]: '/admin/site/preview/richproject/draft/mysite/myfolder'
};

// const imageUrl = imageUrlFnGenerator({
// 	basePath: '/admin/site/preview/richproject/draft',
// 	// @ts-ignore
// 	getContentFn: ({key}) => {
// 		if (key === IMG_ID) {
// 			return {
// 				_id: IMG_ID,
// 				_name: 'example.jpg'
// 			};
// 		}
// 	},
// 	getNodeFn: (_id) => {
// 		if (_id === IMG_ID) {
// 			return {
// 				_versionKey: IMG_VERSION_KEY
// 			};
// 		}
// 	},
// 	host: 'localhost',
// 	port: 8080,
// 	scheme: 'http'

// });

function pageUrl({
	id,
	// path,
	// type,
	params
}: PageUrlParams): string {
	const url = ID_TO_URL[id as string]
	// if (type) {
	// 	return `content:///${type}`;
	// }
	if (params && Object.values(params).length) {
		const query = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
		return `${url}?${query}`;
	}
	return url;

}

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
				"image": {
					"_id": IMG_ID,
				// 	"_path": "/mysite/example.jpg"
				},
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
			// imageUrlFn={imageUrl}
			pageUrlFn={pageUrl}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><figure class="captioned editor-align-right editor-width-custom" style="float: right; width: 50%;"><img alt="Alt text" src="/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg" style="width: 100%;" data-image-ref="${IMG_REF}">
<figcaption>Caption</figcaption>
</figure></section></div></body>`);
	}); // it

	it('should handle links', () => {
		const data: RichTextData = {
			images: [],
			links: [{
				content: {
					"_id": FOLDER_ID,
				// 	"_path": "/mysite/myfolder"
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
			// imageUrlFn={imageUrl}
			pageUrlFn={pageUrl}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p><a href="/admin/site/preview/richproject/draft/mysite/myfolder?key=value#anchor" target="_blank" title="link tooltip" data-link-ref="${FOLDER_REF}">link text</a></p>
<p><a href="mailto:email@example.com?subject=Subject" title="Tooltip">Text</a></p>
<p><a href="https://www.example.com" target="_blank" title="Tooltip">Text</a></p></section></div></body>`);
	}); // it

	it('should NOT touch images with srcsets', () => {
		const dataWithSrcSet: RichTextData = {
			images: [{
				"image": {
					"_id": IMG_ID,
				// 	"_path": "/mysite/example.jpg"
				},
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
			// imageUrlFn={imageUrl}
			pageUrlFn={pageUrl}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><figure class="captioned editor-align-right editor-width-custom" style="float: right; width: 50%;"><img alt="Alt text" src="/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg" style="width: 100%;" srcset="/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-2048/example.jpg 2048w,/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-1024/example.jpg 1024w" sizes="juhu" data-image-ref="${IMG_REF}">
<figcaption>Caption</figcaption>
</figure></section></div></body>`);
	});

	it('should handle macros', () => {
		const macroRegistry: MacroRegistry = {
			'com.enonic.app.panelmacros:success': Success
		}
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
			// imageUrlFn={imageUrl}
			macroRegistry={macroRegistry}
			pageUrlFn={pageUrl}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p><div class=\"macro-panel macro-panel-success macro-panel-styled\"><i class=\"icon\"></i>&lt;strong&gt;Iha&lt;/strong&gt;Jubalong</div></p></section></div></body>`);
	});
}); // describe RichText
