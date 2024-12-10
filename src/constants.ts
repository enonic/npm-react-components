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
