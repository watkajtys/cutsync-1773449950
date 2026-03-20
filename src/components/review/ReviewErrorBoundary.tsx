import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ReviewErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Review component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-black/80 text-white/80 p-8 text-center backdrop-blur-sm z-50">
          <AlertTriangle size={48} className="text-red-500 mb-4 opacity-80" />
          <h2 className="text-xl font-bold mb-2 text-white">Something went wrong</h2>
          <p className="text-sm text-white/60 mb-6 max-w-md">
            An error occurred in the review interface. Your changes may not have been saved.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-200 transition-colors text-sm font-medium"
          >
            Reload Interface
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
