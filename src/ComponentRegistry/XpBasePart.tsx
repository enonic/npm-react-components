// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	RenderablePartComponent,
} from '../types';

// import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';
import { Alert } from '../Alert';

export function XpBasePart({
	component,
	componentRegistry
}: {
	component: RenderablePartComponent
	componentRegistry: ComponentRegistry
}): JSX.Element {

	const {
		descriptor,
		mode,
		props,
		warning,
	} = component;

	if (warning && (mode === 'edit' || mode === 'inline')) {
		return (
			<Alert mode={mode}>{warning}</Alert>
		);
	}

	const partDefinition = componentRegistry.getPart<{
		componentRegistry: ComponentRegistry
	}>(descriptor);

	if (!partDefinition) {
		return (
			<Alert mode={mode}>{`Part descriptor:${descriptor} not registered in ComponentRegistry!`}</Alert>
		);
	}

	const {View: PartView} = partDefinition;
	if (!PartView) {
		return (
			<Alert mode={mode}>{`No View found for part descriptor:${descriptor} in ComponentRegistry!`}</Alert>
		);
	}

	if (!props) {
		return (
			<Alert mode={mode}>{`Part component missing props: ${descriptor}!`}</Alert>
		);
	}

	return (
		<PartView {...{
			...props,
			componentRegistry,
			'data-portal-component-type': mode === 'edit' ? 'part' : undefined
		}}/>
	);
}
