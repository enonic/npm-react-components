import type {ComponentRegistry, ProcessedContentType} from '../types';

import * as React from 'react';
import {Message} from '../Common/Message';
// import { XP_REQUEST_MODE } from '../constants';

export const BaseContentType = ({
	data,
	componentRegistry
}: {
	data: ProcessedContentType
	componentRegistry: ComponentRegistry
}): JSX.Element => {
	const {
		contentType,
		mode,
		props,
		// NOTE: Such a warning would typically come from lib-react4xp DataFecther.
		// But there are currently no such warnings returned in dataFecther.processContentType();
		// warning,
	} = data;

	// if (warning && (mode === XP_REQUEST_MODE.EDIT || mode === XP_REQUEST_MODE.INLINE || mode === XP_REQUEST_MODE.ADMIN)) {
	// 	return (
	// 		<Message mode={mode}>{warning}</Message>
	// 	);
	// }

	const contentTypeDefinition = componentRegistry.getContentType(contentType);
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
		<ContentTypeView {...props}/>
	);
};
