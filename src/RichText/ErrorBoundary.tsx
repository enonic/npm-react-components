import React from 'react';

interface ErrorBoundaryProps {
	children: React.ReactNode
	Fallback: ({error}: { error: Error }) => React.JSX.Element
}

interface ErrorBoundaryState {
	hasError: boolean
	error: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			error: new Error(),
			hasError: false
		};
	}

	static getDerivedStateFromError(error: any): Partial<ErrorBoundaryState> | null {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo): void {
		// Example "componentStack":
		//   in ComponentThatThrows (created by App)
		//   in ErrorBoundary (created by App)
		//   in div (created by App)
		//   in App
		// logErrorToMyService(error, info.componentStack);
		// console.error(error, info.componentStack);
		this.setState({ error });
	}

	render() {
		if (this.state.hasError) {
			return <this.props.Fallback error={this.state.error}/>;
		}

		return this.props.children;
	}
}
