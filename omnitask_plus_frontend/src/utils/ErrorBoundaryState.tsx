import React from 'react';

// Define props for ErrorBoundary component
interface ErrorBoundaryProps {
  // Accepts ReactNode as children to render UI components within the ErrorBoundary
  children: React.ReactNode;
}

// Define state structure for ErrorBoundary component
interface ErrorBoundaryState {
  // State to track if an error has occurred
  hasError: boolean;
}

// ErrorBoundary class component to catch JavaScript errors anywhere in the child component tree
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Initialize state with hasError set to false indicating no error on component mount
    this.state = { hasError: false };
  }

  // Lifecycle method to update state when an error is caught
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Set hasError to true to indicate an error has occurred
    return { hasError: true };
  }

  // Lifecycle method to catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error and error information to the console or an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  // Render method to display UI based on the error state
  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error is caught
      return <h1>Something went wrong.</h1>;
    }

    // Render children components if no error is caught
    return this.props.children;
  }
}
