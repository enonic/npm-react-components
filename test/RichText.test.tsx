import type {PageUrlParams} from '@enonic-types/lib-portal'
import type {
	// Replacer,
	RichTextData
} from '../src/types';

import {
	describe,
	expect,
	test as it
} from '@jest/globals';
import {render} from '@testing-library/react'
import React from 'react';
// import renderer from 'react-test-renderer';
import {RichText} from '../src/RichText';
// import {print} from 'q-i';

const IMG_REF = '59b78b11-3abf-4b7e-b16e-a5b1e90efcb0';
const IMG_ID = 'e9b1f92b-fa46-4e58-b41f-87dc9f1999e8'

const FOLDER_ID = '73fb7dd4-b483-428e-968e-690ca65b11d8';
const FOLDER_REF = '8c5593b8-fe2f-47d0-a7fa-472be74a2ae5';

const ID_TO_URL = {
	[IMG_ID]: `/admin/site/preview/richproject/draft/_/image/${IMG_ID}:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-768/example.jpg`,
	[FOLDER_ID]: '/admin/site/preview/richproject/draft/mysite/myfolder'
};


const processedHtml = `<p>Bla bla ukeblad<br>
<br>
<a href=\"/admin/site/preview/richproject/draft/mysite/myfolder?key=value#anchor\" target=\"_blank\" title=\"link tooltip\" data-link-ref=\"${FOLDER_REF}\">link text</a>
</p>
<p><a href=\"mailto:email@example.com?subject=Subject\" title=\"Tooltip\">Text</a></p>
<p><a href=\"https://www.example.com\" target=\"_blank\" title=\"Tooltip\">Text</a></p>
<p><editor-macro data-macro-name=\"success\" data-macro-ref=\"9d8fb674-f76f-4a50-812d-682c54e07333\">Jubalong</editor-macro></p>

<p>&nbsp;</p>

<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\"><img alt=\"Alt text\" src=\"/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-768/example.jpg\" style=\"width:100%\" data-image-ref=\"${IMG_REF}\">
<figcaption>Caption</figcaption>
</figure>

<p><br>
<br>
&nbsp;</p>
`;

const data: RichTextData = {
	images: [{
		"image": {
			"_id": IMG_ID,
		// 	"_path": "/mysite/example.jpg"
		},
		ref: IMG_REF,
		// style: null
	}],
	links: [{
		content: {
			"_id": FOLDER_ID,
		// 	"_path": "/mysite/myfolder"
		},
		ref: FOLDER_REF,
		uri: `content://${FOLDER_ID}?query=key%3Dvalue&fragment=anchor`
	}],
	macros: [],
	processedHtml
}


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
	if (params) {
		const query = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
		return `${url}?${query}`;
	}
	return url;

}

describe('RichText', () => {
	it('should render', () => {
		const html = render(<RichText className='myclass' data={data} pageUrl={pageUrl}/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p>Bla bla ukeblad<br>
<br>
<a href="/admin/site/preview/richproject/draft/mysite/myfolder?key=value#anchor">link text</a>
</p>
<p><a href="mailto:email@example.com?subject=Subject" title="Tooltip">Text</a></p>
<p><a href="https://www.example.com" target="_blank" title="Tooltip">Text</a></p>
<p><editor-macro data-macro-name="success" data-macro-ref="9d8fb674-f76f-4a50-812d-682c54e07333">Jubalong</editor-macro></p>

<p>&nbsp;</p>

<figure class="captioned editor-align-right editor-width-custom" style="float: right; width: 50%;"><img alt="Alt text" src="/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-768/example.jpg" style="width: 100%;" data-image-ref="${IMG_REF}">
<figcaption>Caption</figcaption>
</figure>

<p><br>
<br>
&nbsp;</p>
</section></div></body>`);

	}); // it
}); // describe RichText
