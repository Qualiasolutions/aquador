'use client';

import { Component, ReactNode, useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Real React error boundary that catches React component errors.
 * Shows branded fallback UI with gold/dark theme matching Aquad'or design.
 * Logs errors to Sentry with component stack.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to Sentry with component stack
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Reload page to ensure clean state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 mb-4">
                <svg
                  className="w-8 h-8 text-[#D4AF37]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="font-playfair text-2xl font-semibold text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-400 text-sm">
                We encountered an unexpected error. Our team has been notified.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 text-left">
                <details className="text-xs text-red-400 bg-red-950/20 border border-red-900/50 rounded p-3">
                  <summary className="cursor-pointer font-medium mb-2">
                    Error Details (dev only)
                  </summary>
                  <pre className="whitespace-pre-wrap overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-black font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Suppresses harmless AbortErrors that occur during navigation.
 * These errors happen when fetch requests are cancelled due to:
 * - User navigating away before request completes
 * - React unmounting components with in-flight requests
 * - Next.js prefetch getting cancelled
 */
export function AbortErrorSuppressor() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress AbortError - these are harmless navigation artifacts
      if (
        event.reason?.name === 'AbortError' ||
        event.reason?.message?.includes('signal is aborted') ||
        event.reason?.message?.includes('aborted')
      ) {
        event.preventDefault();
        return;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
