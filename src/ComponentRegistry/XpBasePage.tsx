// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	RenderablePageComponent,
} from '../types';

import * as React from 'react';
import { Alert } from '../Alert';

export function XpBasePage({
	component,
	componentRegistry
}: {
	component: RenderablePageComponent
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

	const pageDefinition = componentRegistry.getPage(descriptor);
	if (!pageDefinition) {
		// throw new Error(`Page definition not found for descriptor: ${descriptor}`);
		return (
			<Alert mode={mode}>{`Page descriptor:${descriptor} not registered in ComponentRegistry!`}</Alert>
		);
	}
	const {View: PageView} = pageDefinition;
	if (!PageView) {
		// throw new Error(`Page definition missing View for descriptor: ${descriptor}`);
		return (
			<Alert mode={mode}>{`No View found for page descriptor:${descriptor} in ComponentRegistry!`}</Alert>
		);
	}
	if (!props) {
		// throw new Error(`Page component missing props: ${descriptor}`);
		return (
			<Alert mode={mode}>{`Page component missing props: ${descriptor}!`}</Alert>
		);
	}
	props.componentRegistry = componentRegistry;
	// console.info('XpComponent PageView props:', toStr(props));
	return (
		<PageView {...props}/>
	);
}
