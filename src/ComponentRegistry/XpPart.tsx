// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	DecoratedPartComponent,
} from '../types';

import * as React from 'react';

export function XpPart({
	component,
	componentRegistry
}: {
	component: DecoratedPartComponent
	componentRegistry: ComponentRegistry
}) {
	// console.info('XpPart component', component.);

	const {
		config,
		props = config,
		descriptor,
	} = component;
	// console.debug('XpPart descriptor:', descriptor);

	const partDefinition = componentRegistry.getPart(descriptor);
	if (!partDefinition) {
		throw new Error(`Part definition not found for descriptor: ${descriptor}`);
		// TODO return ErrorBoundary instead of throwing.
	}
	const {View} = partDefinition;
	if (!View) {
		throw new Error(`Part view not found for descriptor: ${descriptor}`);
		// TODO return ErrorBoundary instead of throwing.
	}
	props.componentRegistry = componentRegistry;
	return (
		<View {...props}/>
	);
}
