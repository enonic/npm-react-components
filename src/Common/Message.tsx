import type {LiteralUnion, RequestMode} from '@enonic-types/core';
import type {ReactNode, JSX} from 'react';

import {ErrorComponent} from './ErrorComponent';
import {XP_REQUEST_MODE} from '../constants';


export const Message = ({
	children,
	mode,
	...extraProps
}: {
	children?: ReactNode,
	mode?: LiteralUnion<RequestMode>
	[keys: string]: any;
}): JSX.Element | null => {

	// Log, but don't render errors in live and preview mode.
	if (mode === XP_REQUEST_MODE.LIVE || mode === XP_REQUEST_MODE.PREVIEW) {
		console.error(children);
		return null;
	}

	if (mode === XP_REQUEST_MODE.INLINE || mode === XP_REQUEST_MODE.EDIT || mode === XP_REQUEST_MODE.ADMIN) {
		return (
			<ErrorComponent {...extraProps} children={children}/>
		);
	}

	if (mode) {
		console.error(`Unsupported mode passed to Message component! mode:${mode} children:${children}`);
	} else {
		console.warn(`Message component didn't get mode prop! children:${children}`);
	}
	return null;
}
