// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	RenderableLayoutComponent,
} from '../types';

import * as React from 'react';

export function XpBaseLayout({
	component,
	componentRegistry
}: {
	component: RenderableLayoutComponent
	componentRegistry: ComponentRegistry
}) {
	const layoutDefinition = componentRegistry.getLayout(component.descriptor);
	if (!layoutDefinition) {
		throw new Error(`Layout definition not found for descriptor: ${component.descriptor}`);
	}
	const {View: LayoutView} = layoutDefinition;
	if (!LayoutView) {
		throw new Error(`Layout definition missing View for descriptor: ${component.descriptor}`);
	}
	const {props} = component as RenderableLayoutComponent;
	if (!props) {
		throw new Error(`Layout component missing props: ${component.descriptor}`);
	}
	props.componentRegistry = componentRegistry;
	// console.info('XpComponent LayoutView props:', toStr(props));
	return (
		<LayoutView {...props}/>
	);
}
