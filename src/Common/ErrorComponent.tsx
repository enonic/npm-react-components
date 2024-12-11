import type { ReactNode } from 'react';

import { CONTENT_STUDIO_EDIT_MODE_PLACEHOLDER_STYLE } from '../constants';

const PINK = '#e0b4b4';
const DARK_RED = '#9f3a38';

const STYLE = {
	...CONTENT_STUDIO_EDIT_MODE_PLACEHOLDER_STYLE,
	borderColor: PINK,
	color: DARK_RED,
};

// NOTE: "Error" is a property on the global object in Ecmascript.
export function ErrorComponent({
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
			<div {...extraProps} dangerouslySetInnerHTML={{ __html: html }} style={STYLE}/>
		);
	}
	return <div {...extraProps} style={STYLE}>{children}</div>
}
