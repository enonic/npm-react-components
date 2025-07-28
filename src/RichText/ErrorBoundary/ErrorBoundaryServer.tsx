import type {LiteralUnion, RequestMode} from '@enonic-types/core';
import * as React from 'react';
import {getFallback} from './ErrorBoundaryFallback';

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
	} catch (error) {
		return getFallback(mode)({error});
	}
}
