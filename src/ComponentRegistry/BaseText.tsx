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

	if (!props) {
		if (mode === 'edit' || mode === 'inline') {
			return (
				<Message {...{
					'data-portal-component-type': mode === 'edit' ? 'text' : undefined,
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
			'data-portal-component-type': mode === 'edit' ? 'text' : undefined
		}}/>
	);
}
