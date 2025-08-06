import type {RichTextData} from '../src/types';


import {beforeAll, afterAll, describe, expect, test as it} from '@jest/globals';
import {render, waitFor} from '@testing-library/react'
import toDiffableHtml from 'diffable-html';
import React from 'react';
import {RichText} from '../src';
import {Macro} from './RichText/Macro';
import {ERROR_STYLE} from './testdata';
import {METADATA, COMPONENT} from './RichText.test';


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

		originalError(...args)
	}
	done();
});

afterAll((done) => {
	console.error = originalError;
	done();
});

describe('RichText', () => {
    it('should handle macros', async () => {
		const SUCCESS_REF = 'aa398f96-98d9-4ce1-a224-db732a57a68c';
		const dataWithMacros: RichTextData = {
			macros: [{
				"ref": SUCCESS_REF,
				"name": "success-macro",
				"descriptor": "com.enonic.app.panelmacros:success-macro",
				"config": {
					"success_macro": {
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
			meta={METADATA}
			component={COMPONENT}
			Macro={Macro}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });

        await waitFor(() => {
            expect(html.outerHTML).toBe(
                `<body><div><section class="myclass"><p><div class=\"macro-panel macro-panel-success macro-panel-styled\"><i class=\"icon\"></i><strong> + Iha + </strong>Jubalong</div></p></section></div></body>`)
        });
	});

    it('should show an ErrorComponent when the Macro component throws', async () => {
		const FAILURE_REF = 'aa398f96-98d9-4ce1-a224-db732a57a68c';
		const MACRO_NAME = 'failure';
		const dataWithMacros: RichTextData = {
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
			meta={METADATA}
			component={COMPONENT}
			Macro={Macro}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
        await waitFor(() => {
            expect(html.outerHTML).toBe(
                `<body><div><section class="myclass"><p><div style="${ERROR_STYLE}"><h2>Error rendering component</h2><p>Macro not found: com.enonic.app.panelmacros:failure</p></div></p></section></div></body>`);
        });
	});

	it('should show an ErrorComponent when the macros array is missing or empty', () => {
		const SUCCESS_REF = 'aa398f96-98d9-4ce1-a224-db732a57a68c';
		const MACRO_NAME = 'success-macro';
		const dataWithMacros: RichTextData = {
			// macros: [], // Should be missing or empty, in this test :)
			processedHtml: `<p><editor-macro data-macro-name=\"${MACRO_NAME}\" data-macro-ref=\"${SUCCESS_REF}\">Jubalong</editor-macro></p>`
		}
		const html = render(<RichText
			className='myclass'
			data={dataWithMacros}
			meta={METADATA}
			component={COMPONENT}
			Macro={Macro}
		/>).baseElement;
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p><div style="${ERROR_STYLE}">Can't replace macro, when there are no macros in the data object!</div></p></section></div></body>`);
	});

	it('should show an ErrorComponent when the macro element has not data-macro-ref atribute', () => {
		const MACRO_NAME = 'success';
		const dataWithMacros: RichTextData = {
			processedHtml: `<p><editor-macro data-macro-name=\"${MACRO_NAME}\">Jubalong</editor-macro></p>`
		}
		const html = render(<RichText
			className='myclass'
			data={dataWithMacros}
			meta={METADATA}
			component={COMPONENT}
			Macro={Macro}
		/>).baseElement;
		expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p><div style="${ERROR_STYLE}">Macro element has no data-macro-ref attribute!</div></p></section></div></body>`);
	});

	it("should show an ErrorComponent when the macroRef isn't found in the macros array", () => {
		const SUCCESS_REF = 'aa398f96-98d9-4ce1-a224-db732a57a68c';
		const dataWithMacros: RichTextData = {
			macros: [{
				"ref": 'wrong-ref',
				"name": "success-macro",
				"descriptor": "com.enonic.app.panelmacros:success-macro",
				"config": {
					"success_macro": {
						"__nodeId": "d30c4572-0720-44cb-8137-7c830722b056",
						"header": "Iha",
						"body": "Jubalong"
					}
				}
			}],
			processedHtml: `<p><editor-macro data-macro-name=\"success-macro\" data-macro-ref=\"${SUCCESS_REF}\">Jubalong</editor-macro></p>`
		}
		const html = render(<RichText
			data={dataWithMacros}
			meta={METADATA}
			component={COMPONENT}
			Macro={Macro}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
		expect(html.outerHTML).toBe(`<body><div><section><p><div style="${ERROR_STYLE}">Unable to find macro with ref ${SUCCESS_REF} in macros object!</div></p></section></div></body>`);
	});

    it("should render a fallback Macro component, when it's not provided", async () => {
		const SUCCESS_REF = 'aa398f96-98d9-4ce1-a224-db732a57a68c';
		const dataWithMacros: RichTextData = {
			macros: [{
				"ref": SUCCESS_REF,
				"name": "success-macro",
				"descriptor": "com.enonic.app.panelmacros:success-macro",
				"config": {
					"success_macro": {
                        "__nodeId": "d30c4572-0720-44cb-8137-7c830722b056",
                        "header": "Iha",
                        "body": "Jubalong"
                    }
				}
            }],
			processedHtml: `<p><editor-macro data-macro-name=\"success-macro\" data-macro-ref=\"${SUCCESS_REF}\">Jubalong</editor-macro></p>`
		}
		const html = render(<RichText
			className='myclass'
			data={dataWithMacros}
			meta={METADATA}
			component={COMPONENT}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
        await waitFor(() => {
            expect(toDiffableHtml(html.outerHTML)).toBe(`
<body>
  <div>
    <section class="myclass">
      <p>
        <div style="${ERROR_STYLE}">
          Can't render macro "com.enonic.app.panelmacros:success-macro". Macro component or componentRegistry should be provided to RichText.
        </div>
      </p>
    </section>
  </div>
</body>
`);
        });
	});

    it('should handle rest props', async () => {
		const SUCCESS_REF = 'aa398f96-98d9-4ce1-a224-db732a57a68c';
		const dataWithMacros: RichTextData = {
			macros: [{
				"ref": SUCCESS_REF,
				"name": "success-macro",
				"descriptor": "com.enonic.app.panelmacros:success-macro",
				"config": {
					"success_macro": {
					"__nodeId": "d30c4572-0720-44cb-8137-7c830722b056",
					"header": "Iha",
					"body": "Jubalong"
				  }
				}
			  }],
			processedHtml: `<p><editor-macro data-macro-name=\"success-macro\" data-macro-ref=\"${SUCCESS_REF}\">Jubalong</editor-macro></p>`
		}
		const html = render(<RichText<{contentId: string}>
			className='myclass'
			contentId='d1e641c7-aa94-4310-b0f0-df47d60fafc6'
			data={dataWithMacros}
			meta={METADATA}
			component={COMPONENT}
			Macro={Macro}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
        await waitFor(() => {
            expect(html.outerHTML).toBe(
                `<body><div><section class="myclass"><p><div>Extra info: {\"prop\":\"value\"}</div></p></section></div></body>`);
        });
	});

    it('should not override descriptor', async () => {
		const SUCCESS_REF = 'aa398f96-98d9-4ce1-a224-db732a57a68c';
		const dataWithMacros: RichTextData = {
			macros: [{
				"ref": SUCCESS_REF,
				"name": "success-macro",
				"descriptor": "com.enonic.app.panelmacros:success-macro",
				"config": {
					"success_macro": {
					"__nodeId": "d30c4572-0720-44cb-8137-7c830722b056",
					"header": "Iha",
					"body": "Jubalong"
				  }
				}
			  }],
			processedHtml: `<p><editor-macro data-macro-name=\"success-macro\" data-macro-ref=\"${SUCCESS_REF}\">Jubalong</editor-macro></p>`
		}
		const html = render(<RichText<{ descriptor: string }>
			className='myclass'
			descriptor='shouldBe:ignored'
			data={dataWithMacros}
			meta={METADATA}
			component={COMPONENT}
			// @ts-ignore RichText should not have a descriptor prop, even though it's in the generic
			Macro={Macro}
		/>).baseElement;
		// print(html.outerHTML, { maxItems: Infinity });
        await waitFor(() => {
            expect(html.outerHTML).toBe(
                `<body><div><section class="myclass"><p><div class=\"macro-panel macro-panel-success macro-panel-styled\"><i class=\"icon\"></i><strong> + Iha + </strong>Jubalong</div></p></section></div></body>`);
        });
	});
}); // describe RichText
