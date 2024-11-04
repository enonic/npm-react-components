import * as React from 'react';

export function ErrorBoundaryWrapper({children}: { children: React.ReactNode }) {
    if (typeof window === 'undefined') {
        const {ErrorBoundaryServer} = require('./ErrorBoundaryServer');
        return <ErrorBoundaryServer>{children}</ErrorBoundaryServer>;
    } else {
        const {ErrorBoundaryClient} = require('./ErrorBoundaryClient');
        return <ErrorBoundaryClient>{children}</ErrorBoundaryClient>;
    }
}

