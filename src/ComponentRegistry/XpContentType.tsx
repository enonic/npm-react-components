import type {
	ComponentRegistry,
	RenderableContentType,
} from '../types';

import * as React from 'react';
import { Alert } from '../Alert';

export const XpContentType = ({
	component,
	componentRegistry
}: {
	component: RenderableContentType
	componentRegistry: ComponentRegistry
}): JSX.Element => {
	const {
		contentType,
		mode,
		props,
		// warning, // TODO
	} = component;

	// if (warning && (mode === 'edit' || mode === 'inline')) {
	// 	return (
	// 		<Alert mode={mode}>{warning}</Alert>
	// 	);
	// }

	const contentTypeDefinition = componentRegistry.getContentType<{
		componentRegistry: ComponentRegistry
	}>(contentType);
	if (!contentTypeDefinition) {
		return (
			<Alert mode={mode}>{`ContentType:${contentType} not registered in ComponentRegistry!`}</Alert>
		);
	}

	const {View: ContentTypeView} = contentTypeDefinition;
	if (!ContentTypeView) {
		return (
			<Alert mode={mode}>{`No View found for contentType:${contentType} in ComponentRegistry!`}</Alert>
		);
	}

	if (!props) {
		return (
			<Alert mode={mode}>{`ContentType component missing props: ${contentType}!`}</Alert>
		);
	}

	return (
		<ContentTypeView {...{
			...props,
			componentRegistry,
		}}/>
	);
};
