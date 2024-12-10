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
	mode: LiteralUnion<RequestMode>
}): JSX.Element | null => {
	if (mode === 'edit') {
		return (
			<ErrorComponent {...extraProps} children={children}/>
		);
	}
	if (mode === 'inline') {
		return (
			<Warning {...extraProps} children={children}/>
		);
	}
	if (!mode) {
		console.warn(`Alert component didn't get mode prop! children:${children}`);
	}
	return null;
}
