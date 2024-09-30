import React from 'react';

// ErrorBoundaries are not supported on server in Next.js
export function ErrorBoundaryServer({children}: { children: React.ReactNode }) {
    return <>{children}</>;
}
