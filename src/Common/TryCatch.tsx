import type {
	LiteralUnion,
	RequestMode,
} from '@enonic-types/core';
import type {ReactNode} from 'react';

import * as React from 'react';
import { Message } from './Message';
import { XP_REQUEST_MODE } from '../constants';

export const TryCatch = ({
	children,
	mode
}: {
	children: ReactNode;
	mode?: LiteralUnion<RequestMode>
}): JSX.Element | null => {
	try {
		return <>{children}</>;
	} catch (e) {
		return (
			<Message mode={mode}>
				<h2>Error rendering component</h2>
				<p>{e.message}</p>
				{
					mode === XP_REQUEST_MODE.EDIT && (
						<pre>{e.stack || ''}</pre>
					)
				}
			</Message>
		);
	}
}
