import type {ReactNode} from 'react';

import { WARNING_STYLE } from '../constants';

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
