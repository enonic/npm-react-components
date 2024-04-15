import type {pageUrl as libPortalPageUrl} from '@enonic-types/lib-portal'
import type {
	Replacer,
	RichTextData
} from './types'

import HTMLReactParser from 'html-react-parser';
import {createReplacer} from './RichText/createReplacer';


export function RichText({
	className,
	customReplacer,
	data,
	pageUrl,
	tag = 'section'
}: {
	className?: string
	customReplacer?: Replacer
	data: RichTextData
	pageUrl: typeof libPortalPageUrl
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
						pageUrl,
						// renderMacroInEditMode,
					})
				})
				: ''
		}
	</CustomTag>;
}
