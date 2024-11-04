import * as React from 'react';

export function cssToReactStyle(cssString?: string): React.CSSProperties {

	if (!cssString) {
		return {};
	}

	const styleObject: Record<string, unknown> = {};
	const rules = cssString.split(';');

	rules.forEach((rule) => {
		const [key, value] = rule.trim().split(':');
		if (key && value) {
			styleObject[key.replace(/-([a-z])/g, (_match, group1) => group1.toUpperCase())] = value; // Convert to camelCase
		}
	});

	return styleObject;
}
