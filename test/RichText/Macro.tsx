import type {MacroComponent} from '../../src/types';
import React from 'react';
import {Success} from './Success';

const contentQueriesMock = {
	'd1e641c7-aa94-4310-b0f0-df47d60fafc6': {
		prop: 'value'
	}
};

export const Macro: MacroComponent<{
	contentId?: string
}> = ({
	component,
	common,
	meta,
	data,
	children,
	contentId
}) => {
	// console.debug(`Macro descriptor: ${descriptor}, config: ${JSON.stringify(config, null, 4)}, contentId: ${contentId}`);
	if (contentId) {
		// Simulate executing a second query to get some extra info based on the contentId
		const response = contentQueriesMock[contentId];
		return <div>Extra info: {JSON.stringify(response)}</div>;
	}
	if (component.descriptor === 'com.enonic.app.panelmacros:success-macro') {
		return <Success {...data} />;
	}
	throw new Error(`Macro not found: ${component.descriptor}`);
}
