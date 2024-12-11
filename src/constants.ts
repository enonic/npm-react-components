import type {
	CSSProperties,
	ReactNode,
} from 'react';

export const IMG_TAG = 'img';
export const LINK_TAG = 'a';
export const MACRO_TAG = 'editor-macro';

export const IMG_ATTR = 'data-image-ref';
export const LINK_ATTR = 'data-link-ref';
export const MACRO_ATTR = 'data-macro-ref';

export enum RENDERABLE_COMPONENT_TYPE {
	CONTENT_TYPE = 'contentType',
	ERROR = 'error',
	FRAGMENT = 'fragment',
	LAYOUT = 'layout',
	PAGE = 'page',
	PART = 'part',
	TEXT = 'text',
	WARNING = 'warning',
}

export enum XP_REQUEST_MODE {
	EDIT = 'edit',
	INLINE = 'inline',
	LIVE = 'live',
	PREVIEW = 'preview',
}

export const CONTENT_STUDIO_EDIT_MODE_PLACEHOLDER_STYLE: CSSProperties = {
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

const WARNING_BORDER_COLOR = '#c9ba9b'; // light yellow
const WARNING_COLOR = '#794b02'; // brown

export const WARNING_STYLE = {
	...CONTENT_STUDIO_EDIT_MODE_PLACEHOLDER_STYLE,
	borderColor: WARNING_BORDER_COLOR,
	color: WARNING_COLOR,
};
