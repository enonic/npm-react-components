import type {
	ImageComponent,
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
import toDiffableHtml from 'diffable-html';
import React from 'react';
import {RichText} from '../src';
import {Image} from '../src/RichText/Image';
// import {print} from 'q-i';
import {
	ERROR_STYLE,
	WARNING_STYLE
} from './testdata';


const IMG_REF = '59b78b11-3abf-4b7e-b16e-a5b1e90efcb0';
const IMG_ID = 'e9b1f92b-fa46-4e58-b41f-87dc9f1999e8'
const IMG_VERSION_KEY = '9abf6cc6c7f565515175b33c08155b3495dcdf47';

const IMAGE: ImageContent = {
	_id: IMG_ID,
	_name: 'example.jpg',
	_path: '/mysite/example.jpg',
	type: 'media:image',
}

const originalError = console.error
beforeAll((done) => {
	console.error = (...args) => {
		// console.debug(args);
		if (
			args[0] === 'Warning: validateDOMNesting(...): %s cannot appear as a descendant of <%s>.%s'
			&& args[1] === '<div>'
			&& args[2] === 'p'
		) {
			return;
		}
		// console.debug(typeof args[0]);
		if (
			typeof args[0] === 'object'
			&& args[0].detail instanceof Error
			&& args[0].detail.message === 'Failed to render image!'
		) {
			// print(args[0], { maxItems: Infinity });
			// console.debug(args[0]);
			// console.debug(args[0].detail);
			return;
		}
		console.debug(args[0].detail.message); // For some this line makes an error go away!?!
		originalError(...args)
	}
	done();
});

afterAll((done) => {
	console.error = originalError;
	done();
});

describe('RichText', () => {
	it('should remove data-image-ref from images', () => {
		const data: RichTextData = {
			images: [{
				image: IMAGE,
				ref: IMG_REF,
				// style: null
			}],
			processedHtml: `<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\"><img alt=\"Alt text\" src=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg\" style=\"width:100%\" data-image-ref=\"${IMG_REF}\">
<figcaption>Caption</figcaption>
</figure>`
		}
		const html = render(<RichText
			className='myclass'
			data={data}
			Image={Image}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><figure class="captioned editor-align-right editor-width-custom" style="float: right; width: 50%;"><img alt="Alt text" src="/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg" style="width: 100%;">
<figcaption>Caption</figcaption>
</figure></section></div></body>`);
	});

	it('should show an ErrorComponent when Image component throws', () => {
		const ImageThatThrows: ImageComponent = () => {
			throw new Error('Failed to render image!');
		};
		const data: RichTextData = {
			images: [{
				image: IMAGE,
				ref: IMG_REF,
				// style: null
			}],
			processedHtml: `<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\"><img alt=\"Alt text\" src=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg\" style=\"width:100%\" data-image-ref=\"${IMG_REF}\">
<figcaption>Caption</figcaption>
</figure>`
		}
		const html = render(<RichText
			className='myclass'
			data={data}
			Image={ImageThatThrows}
			mode='inline'
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><figure class="captioned editor-align-right editor-width-custom" style="float: right; width: 50%;"><div style="${WARNING_STYLE}">Failed to render image!</div>
<figcaption>Caption</figcaption>
</figure></section></div></body>`);
	});

	it('should remove data-image-ref from images with srcsets', () => {
		const dataWithSrcSet: RichTextData = {
			images: [{
				image: IMAGE,
				ref: IMG_REF,
				// style: null
			}],
			processedHtml: `<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\">
			<img
				alt=\"Alt text\"
				data-image-ref=\"${IMG_REF}\"
				sizes=\"juhu\"
				src=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg\"
				srcset=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-2048/example.jpg 2048w,/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-1024/example.jpg 1024w\"
				style=\"max-width:100%\"
			>
			<figcaption>Caption</figcaption>
		</figure>`
		}
		const html = render(<RichText
			data={dataWithSrcSet}
			Image={Image}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(toDiffableHtml(html.outerHTML)).toBe(`
<body>
  <div>
    <section>
      <figure
        class="captioned editor-align-right editor-width-custom"
        style="float: right; width: 50%;"
      >
        <img
          alt="Alt text"
          sizes="juhu"
          src="/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg"
          srcset="/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-2048/example.jpg 2048w,/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-1024/example.jpg 1024w"
          style="max-width: 100%;"
        >
        <figcaption>
          Caption
        </figcaption>
      </figure>
    </section>
  </div>
</body>
`);
	});

	it('should handle image without style attribute', () => {
		const dataWithSrcSet: RichTextData = {
			images: [{
				image: IMAGE,
				ref: IMG_REF,
			}],
			processedHtml: `<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\">
	<img
		alt=\"Alt text\"
		data-image-ref=\"${IMG_REF}\"
		src=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg\"
	>
	<figcaption>Caption</figcaption>
</figure>`
		}
		const html = render(<RichText
			className='myclass'
			data={dataWithSrcSet}
			Image={Image}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(toDiffableHtml(html.outerHTML)).toBe(`
<body>
  <div>
    <section class="myclass">
      <figure
        class="captioned editor-align-right editor-width-custom"
        style="float: right; width: 50%;"
      >
        <img
          alt="Alt text"
          src="/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg"
        >
        <figcaption>
          Caption
        </figcaption>
      </figure>
    </section>
  </div>
</body>
`);
	});

	it('should show an ErrorComponent when images object is missing', () => {
		const ImageThatThrows: ImageComponent = () => {
			throw new Error('Failed to render image!');
		};
		const data: RichTextData = {
			// images: [], // Should be missing :)
			processedHtml: `<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\"><img alt=\"Alt text\" src=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg\" style=\"width:100%\" data-image-ref=\"${IMG_REF}\">
<figcaption>Caption</figcaption>
</figure>`
		}
		const html = render(<RichText
			className='myclass'
			data={data}
			Image={ImageThatThrows}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(toDiffableHtml(html.outerHTML)).toBe(`
<body>
  <div>
    <section class="myclass">
      <figure
        class="captioned editor-align-right editor-width-custom"
        style="float: right; width: 50%;"
      >
        <div style="${ERROR_STYLE}">
          Can't replace image, when there are no images in the data object!
        </div>
        <figcaption>
          Caption
        </figcaption>
      </figure>
    </section>
  </div>
</body>
`);
	});

	it('should show an ErrorComponent when image element is missing data-image-ref attribute', () => {
		const ImageThatThrows: ImageComponent = () => {
			throw new Error('Failed to render image!');
		};
		const data: RichTextData = {
			images: [{
				image: IMAGE,
				ref: 'whatever',
			}],
			processedHtml: `<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\">
	<img alt=\"Alt text\" src=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg\" style=\"width:100%\">
	<figcaption>Caption</figcaption>
</figure>`
		}
		const html = render(<RichText
			className='myclass'
			data={data}
			Image={ImageThatThrows}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(toDiffableHtml(html.outerHTML)).toBe(`
<body>
  <div>
    <section class="myclass">
      <figure
        class="captioned editor-align-right editor-width-custom"
        style="float: right; width: 50%;"
      >
        <div style="${ERROR_STYLE}">
          Image element has no data-image-ref attibute!
        </div>
        <figcaption>
          Caption
        </figcaption>
      </figure>
    </section>
  </div>
</body>
`);
	});

	it('should show an ErrorComponent when image not found in image', () => {
		const ImageThatThrows: ImageComponent = () => {
			throw new Error('Failed to render image!');
		};
		const data: RichTextData = {
			images: [{
				image: IMAGE,
				ref: 'wrongRef',
			}],
			processedHtml: `<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\"><img alt=\"Alt text\" src=\"/admin/site/preview/richproject/draft/_/image/${IMG_ID}:${IMG_VERSION_KEY}/width-768/example.jpg\" style=\"width:100%\" data-image-ref=\"${IMG_REF}\">
<figcaption>Caption</figcaption>
</figure>`
		}
		const html = render(<RichText
			className='myclass'
			data={data}
			Image={ImageThatThrows}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(toDiffableHtml(html.outerHTML)).toBe(`
<body>
  <div>
    <section class="myclass">
      <figure
        class="captioned editor-align-right editor-width-custom"
        style="float: right; width: 50%;"
      >
        <div style="${ERROR_STYLE}">
          Unable to find image with ref ${IMG_REF} in images object!
        </div>
        <figcaption>
          Caption
        </figcaption>
      </figure>
    </section>
  </div>
</body>
`);
	});
}); // describe RichText
