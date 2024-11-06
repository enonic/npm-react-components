import type {Component} from '@enonic-types/core';

export function XpComponentComment({
	component
}: {
	component?: Component
}): JSX.Element | null {
	if (!component || !component.path) {
		return null;
	}
	return (
		<>{/*# COMPONENT ${component.path} */}</>
	);
}
