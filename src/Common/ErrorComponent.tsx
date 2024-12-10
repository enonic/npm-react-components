import type {
	CSSProperties,
	ReactNode,
} from 'react';

const pink = '#e0b4b4';
const darkRed = '#9f3a38';

export const ContentStudioEditModePlaceholderStyle: CSSProperties = {
	backgroundColor: '#ffffff',
	borderWidth: '2px',
	borderStyle: 'dashed',
	borderRadius: '4px',
	boxSizing: 'border-box',
	display: 'block',
	fontFamily: 'Open Sans, Helvetica, sans-serif',
	fontSize: '20px',
	lineHeight: '33px',
	margin: '1px 0 10px',
	minHeight: '137px',
	padding: '50px 15px',
	position: 'relative',
	textAlign: 'center',
}

const STYLE = {
	...ContentStudioEditModePlaceholderStyle,
	borderColor: pink,
	color: darkRed,
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
