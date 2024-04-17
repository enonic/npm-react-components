import type {ReactNode} from 'react';


import React from 'react';


export function MediaLink({
	children,
	href,
	target,
	title
}: {
	children: ReactNode
	href: string
	target?: string // _blank
	title?: string
}) {
	return <a href={href} target={target} title={title}>{children}</a>
}
