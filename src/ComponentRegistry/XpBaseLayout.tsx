// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	RenderableLayoutComponent,
} from '../types';

import * as React from 'react';
import { Alert } from '../Alert';

export function XpBaseLayout({
	component,
	componentRegistry
}: {
	component: RenderableLayoutComponent
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

	const layoutDefinition = componentRegistry.getLayout(descriptor);
	if (!layoutDefinition) {
		return (
			<Alert mode={mode}>{`Layout descriptor:${descriptor} not registered in ComponentRegistry!`}</Alert>
		);
	}

	const {View: LayoutView} = layoutDefinition;
	if (!LayoutView) {
		return (
			<Alert mode={mode}>{`No View found for layout descriptor:${descriptor} in ComponentRegistry!`}</Alert>
		);
	}

	if (!props) {
		return (
			<Alert mode={mode}>{`Layout component missing props: ${descriptor}!`}</Alert>
		);
	}

	return (
		<LayoutView {...{
			...props,
			componentRegistry,
			'data-portal-component-type': mode === 'edit' ? 'layout' : undefined
		}}/>
	);
}
