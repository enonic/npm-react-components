import type {
	ImageComponent,
	LinkComponent,
	MacroComponent,
	Replacer,
	RichTextData,
} from './types'


// Converts an HTML string to one or more React elements
import HTMLReactParser from 'html-react-parser';

import React from 'react';

// Replaces "matching" domNodes
import {createReplacer} from './RichText/createReplacer';


export function RichText({
	className,
	data,
	Image,
	Macro,
	Link,
	replacer,
	tag
}: {
	className?: string
	data: RichTextData
	Image: ImageComponent
	Macro: MacroComponent
	Link: LinkComponent
	replacer?: Replacer
	tag?: string
}) {
	const CustomTag = tag as keyof JSX.IntrinsicElements || 'section';
	return <CustomTag className={className}>
		{
			data.processedHtml
				? HTMLReactParser(data.processedHtml, {
					replace: createReplacer({
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
