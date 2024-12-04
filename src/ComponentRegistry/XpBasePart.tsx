// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	RenderablePartComponent,
} from '../types';

import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';
import { Alert } from '../Alert';

export function XpBasePart({
	component,
	componentRegistry
}: {
	component: RenderablePartComponent
	componentRegistry: ComponentRegistry
}): JSX.Element {
	// console.debug('XpPart component', toStr(component));

	const {
		descriptor,
		mode,
		props,
		warning,
	} = component;
	// console.debug('XpPart descriptor:', toStr(descriptor));
	// console.debug('XpPart props:', toStr(props));

	if (warning && (mode === 'edit' || mode === 'inline')) {
		return (
			<Alert mode={mode}>{warning}</Alert>
		);
	}

	const partDefinition = componentRegistry.getPart<{
		componentRegistry: ComponentRegistry
	}>(descriptor);
	if (!partDefinition) {
		// throw new Error(`Part definition not found for descriptor: ${descriptor}`);
		return (
			<Alert mode={mode}>{`Part descriptor:${descriptor} not registered in ComponentRegistry!`}</Alert>
		);
	}
	const {View: PartView} = partDefinition;
	if (!PartView) {
		// throw new Error(`Part view not found for descriptor: ${descriptor}`);
		return (
			<Alert mode={mode}>{`No View found for part descriptor:${descriptor} in ComponentRegistry!`}</Alert>
		);
	}
	if (!props) {
		// throw new Error(`Page component missing props: ${descriptor}`);
		return (
			<Alert mode={mode}>{`Part component missing props: ${descriptor}!`}</Alert>
		);
	}
	if (mode === 'edit') {
		return React.cloneElement(<PartView componentRegistry={componentRegistry} {...props}/>, {
			'data-portal-component-type': 'part', // WARNING: This simply adds a prop, it doesn't affect how the child is rendered!
		});
	}
	return (
		<PartView componentRegistry={componentRegistry} {...props}/>
	);
}
