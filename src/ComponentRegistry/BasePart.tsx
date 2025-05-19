import type {ComponentRegistry, ProcessedPart} from '../types';

// import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';
import {Message} from '../Common/Message';
import {XP_REQUEST_MODE} from '../constants';

export function BasePart({
	data,
	componentRegistry
}: {
	data: ProcessedPart
	componentRegistry: ComponentRegistry
}): JSX.Element {

	const {
		descriptor,
		mode,
		props,
		warning,
	} = data;

	const dataPortalComponentType = mode === XP_REQUEST_MODE.EDIT ? 'part' : undefined;

	if (warning && (mode === XP_REQUEST_MODE.EDIT || mode === XP_REQUEST_MODE.INLINE || mode === XP_REQUEST_MODE.ADMIN)) {
		return (
			<Message {...{
				children: warning,
				'data-portal-component-type': dataPortalComponentType,
				mode,
			}}/>
		);
	}

	const partDefinition = componentRegistry.getPart<{
		componentRegistry: ComponentRegistry
	}>(descriptor);

	if (!partDefinition) {
		return (
			<Message {...{
				children: `Part descriptor:${descriptor} not registered in ComponentRegistry!`,
				'data-portal-component-type': dataPortalComponentType,
				mode,
			}}/>
		);
	}

	const {View: PartView} = partDefinition;
	if (!PartView) {
		return (
			<Message {...{
				children: `No View found for part descriptor:${descriptor} in ComponentRegistry!`,
				'data-portal-component-type': dataPortalComponentType,
				mode,
			}}/>
		);
	}

	if (!props) {
		return (
			<Message {...{
				children: `Part component missing props: ${descriptor}!`,
				'data-portal-component-type': dataPortalComponentType,
				mode,
			}}/>
		);
	}

	return (
		<PartView {...{
			...props,
			componentRegistry,
			'data-portal-component-type': dataPortalComponentType,
			mode
		}}/>
	);
}
