import type {
	ComponentRegistry,
	RenderableTextComponent,
	TextProps,
} from '../types';

import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';
import { Message } from '../Common/Message';
import { XpFallback } from './XpFallback';
import { Text } from './Text';
import { XP_REQUEST_MODE } from '../constants';

export const BaseText = ({
	component,
	componentRegistry
}: {
	component: RenderableTextComponent
	componentRegistry: ComponentRegistry
}): JSX.Element => {
	const {
		mode,
		props
	} = component;

	const dataPortalComponentType = mode === XP_REQUEST_MODE.EDIT ? 'text' : undefined;

	if (!props) {
		if (mode === XP_REQUEST_MODE.EDIT || mode === XP_REQUEST_MODE.INLINE || mode === XP_REQUEST_MODE.ADMIN) {
			return (
				<Message {...{
					'data-portal-component-type': dataPortalComponentType,
					mode
				}}>Text component missing props: {toStr(component)}</Message>
			);
		}
		console.warn('BaseText: Text component missing props:', toStr(component));
		return <XpFallback component={component}/>
	}

	const textProps = props as TextProps;

	return (
		<Text {...{
			...textProps,
			componentRegistry,
			'data-portal-component-type': dataPortalComponentType
		}}/>
	);
}
