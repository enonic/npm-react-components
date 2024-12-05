import type {
	ComponentRegistry,
	RenderableTextComponent,
	XpTextProps,
} from '../types';

import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';
import { Alert } from '../Alert';
import { XpFallback } from './XpFallback';
import { XpText } from './XpText';

export const XpBaseText = ({
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
				<Alert mode={mode}>Text component missing props: {toStr(component)}</Alert>
			);
		}
		console.warn('XpBaseText: Text component missing props:', toStr(component));
		return <XpFallback component={component}/>
	}

	const textProps = props as XpTextProps;

	return (
		<XpText {...{
			...textProps,
			componentRegistry,
			'data-portal-component-type': mode === 'edit' ? 'text' : undefined
		}}/>
	);
}
