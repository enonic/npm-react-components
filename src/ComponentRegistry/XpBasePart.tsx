// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	RenderablePartComponent,
} from '../types';

// import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';

export function XpBasePart({
	component,
	componentRegistry
}: {
	component: RenderablePartComponent
	componentRegistry: ComponentRegistry
}) {
	// console.debug('XpPart component', toStr(component));

	const {
		props,
		descriptor,
	} = component;
	// console.debug('XpPart descriptor:', toStr(descriptor));
	// console.debug('XpPart props:', toStr(props));

	const partDefinition = componentRegistry.getPart<{
		componentRegistry: ComponentRegistry
	}>(descriptor);
	if (!partDefinition) {
		throw new Error(`Part definition not found for descriptor: ${descriptor}`);
		// TODO return ErrorBoundary instead of throwing.
	}
	const {View} = partDefinition;
	if (!View) {
		throw new Error(`Part view not found for descriptor: ${descriptor}`);
		// TODO return ErrorBoundary instead of throwing.
	}
	return (
		<View componentRegistry={componentRegistry} {...props}/>
	);
}
