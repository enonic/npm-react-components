'use client';

import type {LiteralUnion, RequestMode} from '@enonic-types/core';

import React, {Component, ReactNode} from 'react';
import {getFallback} from './ErrorBoundaryFallback';

interface ErrorBoundaryProps {
    children: ReactNode
    Fallback: ({error}: { error: Error }) => React.JSX.Element
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false, error: new Error()};
    }

    static getDerivedStateFromError(error) {
        // Update state so react shows the fallback UI
        return {hasError: true};
    }

    componentDidCatch(error, _errorInfo) {
        // Log the error to an error reporting service console
        this.setState({error});
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <this.props.Fallback error={this.state.error}/>
        }

        return this.props.children;
    }
}

export default function ErrorBoundaryClient({
	children,
	mode,
}: {
	children: React.ReactNode
	mode?: LiteralUnion<RequestMode>
}) {
    return (
        <ErrorBoundary Fallback={getFallback(mode)}>
            {children}
        </ErrorBoundary>
    );
}
