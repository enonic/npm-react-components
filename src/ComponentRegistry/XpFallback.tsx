import type {Component} from '@enonic-types/core';
import { HtmlComment } from './HtmlComment';

export function XpFallback({
	component
}: {
	component?: Component
}): JSX.Element | null {
	if (!component || !component.path) {
		return null;
	}
	return (
		<HtmlComment comment={`#COMPONENT ${component.path}`} />
	);
}

