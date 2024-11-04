import type {RichTextParams} from './types'


// Converts an HTML string to one or more React elements
import * as parser from 'html-react-parser';
import * as React from 'react';

// Replaces "matching" domNodes
import {createReplacer} from './RichText/createReplacer';

import {Image as ImageFallback} from './RichText/Image';
import {Link as LinkFallback} from './RichText/Link';
import {Macro as MacroFallback} from './RichText/Macro';


export function RichText<RestProps = Record<string, unknown>>({
	className,
	componentRegistry,
	data,
	Image = ImageFallback,
	Link = LinkFallback,
	Macro = MacroFallback,
	replacer,
	tag,
	...rest
}: RichTextParams<RestProps>) {
	// console.info('RichText', {data, Macro, tag, ...rest});
	const CustomTag = tag as keyof JSX.IntrinsicElements || 'section';
	return <CustomTag className={className}>
		{
			data.processedHtml
				/* try parser.default.default first because import is wrapped with __toesm() in cjs files
				 * for node compatibility, which adds default export resulting in parser.default.default */
				? (((parser.default as any).default as typeof parser.default) || parser.default)(data.processedHtml, {
					replace: createReplacer<RestProps>({
						...rest,
						// These should be last, so they can't be overridden
						componentRegistry,
						data,
						Image,
						Link,
						Macro,
						replacer,
					}),
				})
				: ''
		}
	</CustomTag>;
}
