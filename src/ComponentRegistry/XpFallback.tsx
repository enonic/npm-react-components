import type {Component} from '@enonic-types/core';
import {HtmlComment} from '../Common/HtmlComment';

export function XpFallback({
	data
}: {
	data?: Component
}): JSX.Element | null {
	if (!data || !data.path) {
		return null;
	}
	return (
		<HtmlComment comment={`#COMPONENT ${data.path}`}/>
	);
}

