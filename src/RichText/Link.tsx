import React from 'react';


export function Link({
	contentId,
	// children,
	href,
	target,
	text,
	title
}: {
	// children: string
	contentId?: string

	// may contain query params and fragment
	// may be mailto with subject param
	href: string

	target?: string // _blank
	text?: string
	title?: string
}) {
	return <a data-link-ref={contentId} href={href} target={target} title={title}>{text}</a>
}
