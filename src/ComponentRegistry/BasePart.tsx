import type {PartComponent} from '@enonic-types/core';

import type {ComponentRegistry} from '../types';


export function BasePart({
	component,
	componentRegistry
}: {
	component: PartComponent
	componentRegistry: ComponentRegistry
}) {
	// console.debug('BasePart component', component);

	const {
		config: props,
		descriptor
	} = component;
	// console.debug('BasePart descriptor', descriptor);

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
	return (<View {...props}/>);
}
