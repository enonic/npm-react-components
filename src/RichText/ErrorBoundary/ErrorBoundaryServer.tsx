import type {
	LiteralUnion,
	RequestMode,
} from '@enonic-types/core';
import * as React from 'react';
import { Message } from '../../Common/Message';
import { XP_REQUEST_MODE } from '../../constants';

// ErrorBoundaries are not supported on server in Next.js
export function ErrorBoundaryServer({
	children,
	mode,
}: {
	children: React.ReactNode
	mode?: LiteralUnion<RequestMode>
}) {
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
