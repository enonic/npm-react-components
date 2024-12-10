// import type {PartComponent} from '@enonic-types/core';
import type {
	ComponentRegistry,
	RenderablePageComponent,
} from '../types';

import * as React from 'react';
import { Alert } from '../Alert';
import { ErrorComponent } from '../ErrorComponent';

export function XpBasePage({
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

	if (error && (mode === 'inline' || mode === 'preview')) { // In edit mode the error should be handeled by Content Studio.
		return (
			<ErrorComponent children={error}/>
		);
	}

	if (warning && (mode === 'inline' || mode === 'edit')) {
		return (
			<Alert mode={mode} children={warning}/>
		);
	}

	const pageDefinition = componentRegistry.getPage(descriptor);
	if (!pageDefinition) {
		return (
			<Alert mode={mode}>{`Page descriptor:${descriptor} not registered in ComponentRegistry!`}</Alert>
		);
	}

	const {View: PageView} = pageDefinition;
	if (!PageView) {
		return (
			<Alert mode={mode}>{`No View found for page descriptor:${descriptor} in ComponentRegistry!`}</Alert>
		);
	}

	if (!props) {
		return (
			<Alert mode={mode}>{`Page component missing props: ${descriptor}!`}</Alert>
		);
	}

	return (
		<PageView {...{
			...props,
			componentRegistry,
			'data-portal-component-type': mode === 'edit' ? 'page' : undefined
		}}/>
	);
}
