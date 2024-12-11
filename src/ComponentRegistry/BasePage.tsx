// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	RenderablePageComponent,
} from '../types';

import * as React from 'react';
import { Message } from '../Common/Message';
import { ErrorComponent } from '../Common/ErrorComponent';

export function BasePage({
	component,
	componentRegistry
}: {
	component: RenderablePageComponent
	componentRegistry: ComponentRegistry
}): JSX.Element {
	const {
		descriptor,
		error,
		mode,
		props,
		warning,
	} = component;

	const dataPortalComponentType = mode === 'edit' ? 'page' : undefined;

	if (error && (mode === 'inline' || mode === 'preview')) { // In edit mode the error should be handeled by Content Studio.
		return (
			<ErrorComponent {...{
				children: error,
				'data-portal-component-type': dataPortalComponentType
			}}/>
		);
	}

	if (warning && (mode === 'inline' || mode === 'edit')) {
		return (
			<Message {...{
				children: warning,
				'data-portal-component-type': dataPortalComponentType,
				mode
			}}/>
		);
	}

	const pageDefinition = componentRegistry.getPage(descriptor);
	if (!pageDefinition) {
		return (
			<Message {...{
				'data-portal-component-type': dataPortalComponentType,
				mode
			}}>{`Page descriptor:${descriptor} not registered in ComponentRegistry!`}</Message>
		);
	}

	const {View: PageView} = pageDefinition;
	if (!PageView) {
		return (
			<Message {...{
				'data-portal-component-type': dataPortalComponentType,
				mode
			}}>{`No View found for page descriptor:${descriptor} in ComponentRegistry!`}</Message>
		);
	}

	if (!props) {
		return (
			<Message {...{
				'data-portal-component-type': dataPortalComponentType,
				mode
			}}>{`Page component missing props: ${descriptor}!`}</Message>
		);
	}

	return (
		<PageView {...{
			...props,
			componentRegistry,
			'data-portal-component-type': dataPortalComponentType
		}}/>
	);
}
