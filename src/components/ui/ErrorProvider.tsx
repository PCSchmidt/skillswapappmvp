import * as Sentry from '@sentry/nextjs';
import React, { ErrorInfo, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ErrorProviderProps {
  children: ReactNode;
}

/**
 * Error Provider component that wraps the application with ErrorBoundary
 * and integrates with Sentry for error tracking.
 * 
 * @example
 * <ErrorProvider>
 *   <App />
 * </ErrorProvider>
 */
const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Caught an error:', error, errorInfo);
    }
    
    // Report to Sentry in all environments
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key as keyof ErrorInfo]);
      });
      Sentry.captureException(error);
    });
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorProvider;
