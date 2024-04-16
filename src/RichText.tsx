import type {
	imageUrl as libPortalImageUrl,
	pageUrl as libPortalPageUrl
} from '@enonic-types/lib-portal'
import type {
	Replacer,
	RichTextData
} from './types'

// Converts an HTML string to one or more React elements
import HTMLReactParser from 'html-react-parser';

// Replaces "matching" domNodes
import {createReplacer} from './RichText/createReplacer';


export function RichText({
	className,
	customReplacer,
	data,
	imageUrlFn,
	pageUrlFn,
	tag = 'section'
}: {
	className?: string
	customReplacer?: Replacer
	data: RichTextData
	imageUrlFn: typeof libPortalImageUrl
	pageUrlFn: typeof libPortalPageUrl
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
						imageUrlFn,
						pageUrlFn,
						// renderMacroInEditMode,
					})
				})
				: ''
		}
	</CustomTag>;
}
