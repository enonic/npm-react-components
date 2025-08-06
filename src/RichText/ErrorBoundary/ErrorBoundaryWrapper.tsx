import type {LiteralUnion, RequestMode} from '@enonic-types/core';
import * as React from 'react';
import {ErrorBoundaryServer} from './ErrorBoundaryServer';

export function ErrorBoundaryWrapper({
    children,
    mode
}: {
    children: React.ReactNode
    mode?: LiteralUnion<RequestMode>
}) {
    if (typeof document === 'undefined') {
        return <React.Suspense fallback={null}>
            <ErrorBoundaryServer mode={mode}>{children}</ErrorBoundaryServer>
        </React.Suspense>;
    } else {
        // Dynamic import for client component to avoid SSR issues
        const ErrorBoundaryClient =
            React.lazy(() => import('./ErrorBoundary.client'));

        return <React.Suspense fallback={null}>
            <ErrorBoundaryClient mode={mode}>{children}</ErrorBoundaryClient>
        </React.Suspense>;
    }
}

