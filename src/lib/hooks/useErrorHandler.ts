"use client";

import * as Sentry from '@sentry/nextjs';
import { useState, useCallback } from 'react';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorOptions {
  severity?: ErrorSeverity;
  context?: Record<string, any>;
  shouldReport?: boolean;
  userMessage?: string;
  retry?: () => Promise<any>;
}

export interface ErrorState {
  hasError: boolean;
  message: string | null;
  error: Error | null;
  severity: ErrorSeverity;
  timestamp: Date | null;
}

export interface ErrorHandler {
  errorState: ErrorState;
  handleError: (error: unknown, options?: ErrorOptions) => void;
  clearError: () => void;
  retryLastOperation: () => Promise<any>;
}

const defaultErrorState: ErrorState = {
  hasError: false,
  message: null,
  error: null,
  severity: 'error',
  timestamp: null,
};

/**
 * Custom hook for handling errors in a consistent way across the application
 * 
 * This hook provides a standardized way to handle errors, including:
 * - Error state management
 * - Error reporting to Sentry
 * - User-friendly error messages
 * - Retry functionality
 * 
 * @param initialMessage Optional default error message
 * @returns ErrorState and methods to handle errors
 * 
 * @example
 * const { errorState, handleError, clearError, retryLastOperation } = useErrorHandler();
 * 
 * // In a try/catch:
 * try {
 *   await fetchData();
 * } catch (error) {
 *   handleError(error, { 
 *     severity: 'warning',
 *     userMessage: 'Unable to load data. Please try again.',
 *     context: { userId, action: 'fetchData' },
 *     retry: fetchData
 *   });
 * }
 * 
 * // Show error to user:
 * if (errorState.hasError) {
 *   return <ErrorMessage message={errorState.message} onRetry={retryLastOperation} />;
 * }
 */
export function useErrorHandler(initialMessage?: string): ErrorHandler {
  const [errorState, setErrorState] = useState<ErrorState>({
    ...defaultErrorState,
    message: initialMessage || null,
  });
  const [retryFn, setRetryFn] = useState<(() => Promise<any>) | null>(null);

  const handleError = useCallback((error: unknown, options: ErrorOptions = {}) => {
    const {
      severity = 'error',
      context = {},
      shouldReport = true,
      userMessage,
      retry,
    } = options;

    // Normalize the error
    const normalizedError = error instanceof Error 
      ? error 
      : new Error(typeof error === 'string' ? error : 'An unknown error occurred');
    
    // Set the error state
    setErrorState({
      hasError: true,
      message: userMessage || normalizedError.message,
      error: normalizedError,
      severity,
      timestamp: new Date(),
    });

    // Store retry function if provided
    if (retry) {
      setRetryFn(() => retry);
    }

    // Report to Sentry if needed
    if (shouldReport) {
      Sentry.withScope((scope) => {
        // Add additional context
        scope.setLevel(severity === 'critical' ? 'fatal' : severity);
        
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
        
        Sentry.captureException(normalizedError);
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[${severity.toUpperCase()}] ${normalizedError.message}`, normalizedError);
      if (Object.keys(context).length > 0) {
        console.error('Error context:', context);
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState(defaultErrorState);
    setRetryFn(null);
  }, []);

  const retryLastOperation = useCallback(async () => {
    if (retryFn) {
      clearError();
      try {
        return await retryFn();
      } catch (error) {
        handleError(error, { shouldReport: false });
        return Promise.reject(error);
      }
    }
    return Promise.resolve();
  }, [retryFn, clearError, handleError]);

  return {
    errorState,
    handleError,
    clearError,
    retryLastOperation,
  };
}

/**
 * Hook for handling data fetching errors specifically
 * 
 * @param options Default options for data fetching errors
 * @returns Error handler specifically configured for data fetching
 */
export function useDataFetchingErrorHandler(options: Partial<ErrorOptions> = {}) {
  const errorHandler = useErrorHandler();
  const { handleError: originalHandleError } = errorHandler;

  // Override handleError with data-specific defaults
  const handleError = useCallback((
    error: unknown, 
    dataOptions: Partial<ErrorOptions> = {}
  ) => {
    const mergedOptions: ErrorOptions = {
      severity: 'warning',
      userMessage: 'Failed to load data. Please try again later.',
      context: { source: 'data-fetching' },
      ...options,
      ...dataOptions,
    };
    
    originalHandleError(error, mergedOptions);
  }, [originalHandleError, options]);

  return {
    ...errorHandler,
    handleError,
  };
}

export default useErrorHandler;
