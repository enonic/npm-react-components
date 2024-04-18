import type {
	ImageComponent,
	ImageContent,
	LinkComponent,
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
import {RichText} from '../src';
import {Image} from './RichText/Image';
import {Link} from './RichText/Link';
import {Macro} from './RichText/Macro';
// import {print} from 'q-i';


const originalError = console.error
beforeAll((done) => {
	console.error = (...args) => {
		if (
			args[0] === 'Warning: validateDOMNesting(...): %s cannot appear as a descendant of <%s>.%s'
			&& args[1] === '<div>'
			&& args[2] === 'p'
		) {
			return;
		}
		if (
			typeof args[0] === 'object'
			&& args[0].detail instanceof Error
			&& args[0].detail.message.startsWith('Macro not found:')
		) {
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

	it('should show an ErrorComponent when the Macro component throws', () => {
		const FAILURE_REF = 'aa398f96-98d9-4ce1-a224-db732a57a68c';
		const MACRO_NAME = 'failure';
		const dataWithMacros: RichTextData = {
			images: [],
			links: [],
			macros: [{
				ref: FAILURE_REF,
				name: MACRO_NAME,
				descriptor: `com.enonic.app.panelmacros:${MACRO_NAME}`,
				config: {
					[MACRO_NAME]: {
					"__nodeId": "d30c4572-0720-44cb-8137-7c830722b056",
					"header": "Iha",
					"body": "Jubalong"
				  }
				}
			  }],
			processedHtml: `<p><editor-macro data-macro-name=\"${MACRO_NAME}\" data-macro-ref=\"${FAILURE_REF}\">Jubalong</editor-macro></p>`
		}
		const html = render(<RichText
			className='myclass'
			data={dataWithMacros}
			Image={Image}
			Macro={Macro}
			Link={Link}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p><div style=\"border: 1px dotted red; color: red;\">Macro not found: com.enonic.app.panelmacros:failure</div></p></section></div></body>`);
	});
}); // describe RichText
