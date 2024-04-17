import type {ReactNode} from 'react';
import type {LinkComponent} from '../../src/types';


import React from 'react';
import {parse} from 'uri-js';


export const Link: LinkComponent = ({
	children,
	content,
	href,
	target,
	title,
	uri,
}) => {
	// const {
	// 	_id,
	// 	_name,
	// 	_path,
	// 	type
	// } = content;

	// const hrefObj = parse(href);
	// console.debug('hrefObj', hrefObj);

	// const uriObj = parse(uri);
	// console.debug('uriObj', uriObj);

	return <a href={href} target={target} title={title}>{children}</a>;
}
