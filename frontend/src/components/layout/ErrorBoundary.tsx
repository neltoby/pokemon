import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  name?: string;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error(`[ErrorBoundary${this.props.name ? `:${this.props.name}` : ''}]`, error, errorInfo);
  }

  reset(): void {
    this.setState({ error: null });
  }

  render(): React.ReactNode {
    const { error } = this.state;
    if (error) {
      if (this.props.fallback) {
        return this.props.fallback(error, this.reset);
      }
      return (
        <div className="p-3 rounded-xl border border-red-500/60 bg-red-500/10 text-sm text-red-300">
          <div className="font-semibold mb-1">Something went wrong.</div>
          <div className="mb-2">{error.message}</div>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-1 text-xs"
            onClick={this.reset}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

