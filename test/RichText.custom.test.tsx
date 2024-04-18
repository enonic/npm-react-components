import {ElementType} from 'domelementtype';
import type {RichTextData} from '../src/types';


import {
	// beforeAll,
	// afterAll,
	describe,
	expect,
	test as it
} from '@jest/globals';
import {render} from '@testing-library/react'
import toDiffableHtml from 'diffable-html';
import React from 'react';
// import renderer from 'react-test-renderer';
import {RichText} from '../src';
import {Image} from './RichText/Image';
import {Link} from './RichText/Link';
import {Macro} from './RichText/Macro';
// import {print} from 'q-i';




// const originalError = console.error
// beforeAll((done) => {
// 	console.error = (...args) => {
// 		// console.debug(args);
// 		if (
// 			args[0] === 'Warning: validateDOMNesting(...): %s cannot appear as a descendant of <%s>.%s'
// 			&& args[1] === '<div>'
// 			&& args[2] === 'p'
// 		) {
// 			return;
// 		}
// 		// console.debug(typeof args[0]);
// 		if (
// 			typeof args[0] === 'object'
// 			&& args[0].detail instanceof Error
// 			&& args[0].detail.message === 'Failed to render image!'
// 		) {
// 			// print(args[0], { maxItems: Infinity });
// 			// console.debug(args[0]);
// 			// console.debug(args[0].detail);
// 			return;
// 		}
// 		console.debug(args[0].detail.message); // For some this line makes an error go away!?!
// 		originalError(...args)
// 	}
// 	done();
// });

// afterAll((done) => {
// 	console.error = originalError;
// 	done();
// });

describe('RichText', () => {
	it('should use customReplacer to replace anything but image, link and macro', () => {
		const data: RichTextData = {
			images: [],
			links: [],
			macros: [],
			processedHtml: `<p>Some text</p>`
		}
		const html = render(<RichText
			className='myclass'
			customReplacer={(el, data) => {
				// console.debug('el', el);
				// console.debug('data', data);
				if (
					el.name === 'p'
					&& el.children[0].type === ElementType.Text
					&& el.children[0].data === 'Some text'
				) {
					return <p>Replaced text</p>;
				}
			}}
			data={data}
			Image={Image}
			Link={Link}
			Macro={Macro}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(toDiffableHtml(html.outerHTML)).toBe(`
<body>
  <div>
    <section class="myclass">
      <p>
        Replaced text
      </p>
    </section>
  </div>
</body>
`);
	});
}); // describe RichText
