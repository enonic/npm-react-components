import {
	// beforeAll,
	// afterAll,
	describe,
	expect,
	test as it
} from '@jest/globals';

import {replaceMacroComments} from '../src/replaceMacroComments';

describe('replaceMacroComments', () => {
	it('should replace macro comments', () => {
		expect(replaceMacroComments(`<p><!--#MACRO _name="info" header="Header1" _document="__macroDocument1" _body="Text1<br>
With<br>
Newlines"--></p>
<p><!--#MACRO _name="info" header="Header2" _document="__macroDocument1" _body="Text2<br>
With<br>
Newlines"--></p>`))
		.toEqual({
			processedHtml: `<p><editor-macro data-macro-name="info" data-macro-ref="1"></editor-macro></p>
<p><editor-macro data-macro-name="info" data-macro-ref="2"></editor-macro></p>`,
			macros: [
				{
					"ref": "1",
					"name": "info",
					"descriptor": "whatever:info",
					"config": {
						"info": {
							"body": "Text1<br>\nWith<br>\nNewlines",
							"header": "Header1"
						}
					}
				},
				{
					"ref": "2",
					"name": "info",
					"descriptor": "whatever:info",
					"config": {
						"info": {
							"body": "Text2<br>\nWith<br>\nNewlines",
							"header": "Header2"
						}
					}
				}
			]
		});
	});
});
