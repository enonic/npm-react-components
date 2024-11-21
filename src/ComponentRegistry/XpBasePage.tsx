// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	RenderablePageComponent,
} from '../types';

import * as React from 'react';

export function XpBasePage({
	component,
	componentRegistry
}: {
	component: RenderablePageComponent
	componentRegistry: ComponentRegistry
}) {
	const pageDefinition = componentRegistry.getPage(component.descriptor);
	if (!pageDefinition) {
		throw new Error(`Page definition not found for descriptor: ${component.descriptor}`);
	}
	const {View: PageView} = pageDefinition;
	if (!PageView) {
		throw new Error(`Page definition missing View for descriptor: ${component.descriptor}`);
	}
	const {props} = component;
	if (!props) {
		throw new Error(`Page component missing props: ${component.descriptor}`);
	}
	props.componentRegistry = componentRegistry;
	// console.info('XpComponent PageView props:', toStr(props));
	return (
		<PageView {...props}/>
	);
}
