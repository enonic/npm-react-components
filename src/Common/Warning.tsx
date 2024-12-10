import type {ReactNode} from 'react';

import { ContentStudioEditModePlaceholderStyle } from './ErrorComponent';

const lightYellow = '#c9ba9b';
const brown = '#794b02';

export const WARNING_STYLE = {
	...ContentStudioEditModePlaceholderStyle,
	borderColor: lightYellow,
	color: brown,
};

export function Warning({
	children,
	html,
	...extraProps
}: {
	children?: ReactNode
	html?: string
}) {
	if (html) {
		return (
			// Using dangerouslySetInnerHTML avoids encoding < to &lt;
			<div {...extraProps} dangerouslySetInnerHTML={{ __html: html }} style={WARNING_STYLE}/>
		);
	}
	return (
		<div {...extraProps} style={WARNING_STYLE}>{children}</div>
	);
}
