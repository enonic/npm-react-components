import type {RichTextParams} from './types'


// Converts an HTML string to one or more React elements
import HTMLReactParser from 'html-react-parser';

// Replaces "matching" domNodes
import {createReplacer} from './RichText/createReplacer';

import {Image as ImageFallback} from './RichText/Image';
import {Link as LinkFallback} from './RichText/Link';
import {Macro as MacroFallback} from './RichText/Macro';


export function RichText({
	className,
	contentId,
	data,
	Image = ImageFallback,
	Link = LinkFallback,
	Macro = MacroFallback,
	replacer,
	tag
}: RichTextParams) {
	const CustomTag = tag as keyof JSX.IntrinsicElements || 'section';
	return <CustomTag className={className}>
		{
			data.processedHtml
				? HTMLReactParser(data.processedHtml, {
					replace: createReplacer({
						contentId,
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
