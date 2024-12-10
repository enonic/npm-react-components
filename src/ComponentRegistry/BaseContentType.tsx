import type {
	ComponentRegistry,
	RenderableContentType,
} from '../types';

import * as React from 'react';
import { Message } from '../Common/Message';

export const BaseContentType = ({
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
	// 		<Message mode={mode}>{warning}</Message>
	// 	);
	// }

	const contentTypeDefinition = componentRegistry.getContentType<{
		componentRegistry: ComponentRegistry
	}>(contentType);
	if (!contentTypeDefinition) {
		return (
			<Message mode={mode}>{`ContentType:${contentType} not registered in ComponentRegistry!`}</Message>
		);
	}

	const {View: ContentTypeView} = contentTypeDefinition;
	if (!ContentTypeView) {
		return (
			<Message mode={mode}>{`No View found for contentType:${contentType} in ComponentRegistry!`}</Message>
		);
	}

	if (!props) {
		return (
			<Message mode={mode}>{`ContentType component missing props: ${contentType}!`}</Message>
		);
	}

	return (
		<ContentTypeView {...{
			...props,
			componentRegistry,
		}}/>
	);
};
