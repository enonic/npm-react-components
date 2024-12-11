import type {
	LiteralUnion,
	RequestMode,
} from '@enonic-types/core';
import type {ReactNode} from 'react';

import { ErrorComponent } from './ErrorComponent';
import { Warning } from './Warning';


export const Message = ({
	children,
	mode,
	...extraProps
}: {
	children: ReactNode,
	mode?: LiteralUnion<RequestMode>
}): JSX.Element | null => {

	// Log, but don't render errors in live and preview mode.
	if (mode === 'live' || mode === 'preview') {
		console.error(children);
		return null;
	}

	if (mode === 'inline') {
		return (
			<Warning {...extraProps} children={children}/>
		);
	}

	if (mode === 'edit') {
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
