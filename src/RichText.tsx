// import type {
// 	imageUrl as libPortalImageUrl,
// 	pageUrl as libPortalPageUrl
// } from '@enonic-types/lib-portal';
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
	customReplacer,
	data,
	Image,
	Macro,
	Link,
	tag = 'section'
}: {
	className?: string
	customReplacer?: Replacer
	data: RichTextData
	Image: ImageComponent
	Macro: MacroComponent
	Link: LinkComponent
	tag?: string
}) {
	const CustomTag = tag as keyof JSX.IntrinsicElements || 'section';
	return <CustomTag className={className}>
		{
			data.processedHtml
				? HTMLReactParser(data.processedHtml, {
					replace: createReplacer({
						customReplacer,
						data,
						Image,
						Link,
						Macro,
					})
				})
				: ''
		}
	</CustomTag>;
}
