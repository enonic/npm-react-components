import type {
	LiteralUnion,
	RequestMode,
} from '@enonic-types/core';
import type {ReactNode} from 'react';

import * as React from 'react';
import { Message } from './Message';

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
					mode === 'edit' && (
						<pre>{e.stack || ''}</pre>
					)
				}
			</Message>
		);
	}
}
