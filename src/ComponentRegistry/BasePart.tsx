import type {
	ComponentRegistry,
	RenderablePartComponent,
} from '../types';

// import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';
import { Message } from '../Common/Message';

export function BasePart({
	component,
	componentRegistry
}: {
	component: RenderablePartComponent
	componentRegistry: ComponentRegistry
}): JSX.Element {

	const {
		descriptor,
		mode,
		props,
		warning,
	} = component;

	const dataPortalComponentType = mode === 'edit' ? 'part' : undefined;

	if (warning && (mode === 'edit' || mode === 'inline')) {
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
