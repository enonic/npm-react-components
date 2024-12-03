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
}) {
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
		// throw new Error(`Layout definition not found for descriptor: ${descriptor}`);
		return (
			<Alert mode={mode}>{`Layout descriptor:${descriptor} not registered in ComponentRegistry!`}</Alert>
		);
	}
	const {View: LayoutView} = layoutDefinition;
	if (!LayoutView) {
		// throw new Error(`Layout definition missing View for descriptor: ${descriptor}`);
		return (
			<Alert mode={mode}>{`No View found for layout descriptor:${descriptor} in ComponentRegistry!`}</Alert>
		);
	}
	if (!props) {
		// throw new Error(`Layout component missing props: ${descriptor}`);
		return (
			<Alert mode={mode}>{`Layout component missing props: ${descriptor}!`}</Alert>
		);
	}
	props.componentRegistry = componentRegistry;
	// console.info('XpComponent LayoutView props:', toStr(props));
	return (
		<LayoutView {...props}/>
	);
}
