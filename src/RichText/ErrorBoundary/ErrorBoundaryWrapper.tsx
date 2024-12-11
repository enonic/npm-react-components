import type {
	LiteralUnion,
	RequestMode,
} from '@enonic-types/core';
import * as React from 'react';

export function ErrorBoundaryWrapper({
	children,
	mode,
}: {
	children: React.ReactNode
	mode?: LiteralUnion<RequestMode>
}) {
    if (typeof window === 'undefined') {
        const {ErrorBoundaryServer} = require('./ErrorBoundaryServer');
        return <ErrorBoundaryServer mode={mode}>{children}</ErrorBoundaryServer>;
    } else {
        const {ErrorBoundaryClient} = require('./ErrorBoundaryClient');
        return <ErrorBoundaryClient mode={mode}>{children}</ErrorBoundaryClient>;
    }
}

