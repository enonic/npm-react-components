export function cssToReactStyle(cssString?: string): React.CSSProperties {

	if (!cssString) {
		return {};
	}

	const styleObject: { [key: string]: any } = {};
	const rules = cssString.split(';');

	rules.forEach((rule) => {
		const [key, value] = rule.trim().split(':');
		if (key && value) {
			const prop = key.replace(/-([a-z])/g, (_match, group1: string) => group1.toUpperCase());
			styleObject[prop] = value; // Convert to camelCase
		}
	});

	return styleObject as React.CSSProperties
}
