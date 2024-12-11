// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	RenderableLayoutComponent,
} from '../types';

import * as React from 'react';
import { Message } from '../Common/Message';

export function BaseLayout({
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

	const dataPortalComponentType = mode === 'edit' ? 'layout' : undefined;

	if (warning && (mode === 'edit' || mode === 'inline')) {
		return (
			<Message {...{
				'data-portal-component-type': dataPortalComponentType,
				mode
			}}>{warning}</Message>
		);
	}

	const layoutDefinition = componentRegistry.getLayout(descriptor);
	if (!layoutDefinition) {
		return (
			<Message {...{
				'data-portal-component-type': dataPortalComponentType,
				mode
			}}>{`Layout descriptor:${descriptor} not registered in ComponentRegistry!`}</Message>
		);
	}

	const {View: LayoutView} = layoutDefinition;
	if (!LayoutView) {
		return (
			<Message {...{
				'data-portal-component-type': dataPortalComponentType,
				mode
			}}>{`No View found for layout descriptor:${descriptor} in ComponentRegistry!`}</Message>
		);
	}

	if (!props) {
		return (
			<Message {...{
				'data-portal-component-type': dataPortalComponentType,
				mode
			}}>{`Layout component missing props: ${descriptor}!`}</Message>
		);
	}

	return (
		<LayoutView {...{
			...props,
			componentRegistry,
			'data-portal-component-type': dataPortalComponentType
		}}/>
	);
}
