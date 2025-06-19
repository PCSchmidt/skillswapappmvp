"use client";

import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';
import { ErrorSeverity } from '@/lib/hooks/useErrorHandler';
import Button from './Button';

interface ErrorMessageProps {
  /**
   * The error message to display
   */
  message?: string | null;
  
  /**
   * The severity of the error
   */
  severity?: ErrorSeverity;
  
  /**
   * Callback function to retry the operation that caused the error
   */
  onRetry?: () => void;
  
  /**
   * Callback function to dismiss the error message
   */
  onDismiss?: () => void;
  
  /**
   * Whether to show the retry button
   */
  showRetry?: boolean;
  
  /**
   * Whether to show the dismiss button
   */
  showDismiss?: boolean;
  
  /**
   * Additional CSS classes for the error container
   */
  className?: string;
}

/**
 * ErrorMessage component for displaying user-friendly error messages
 * with optional retry and dismiss functionality.
 * 
 * @example
 * <ErrorMessage 
 *   message="Failed to load data"
 *   severity="warning"
 *   onRetry={() => refetch()}
 *   onDismiss={() => clearError()} 
 * />
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'An error occurred',
  severity = 'error',
  onRetry,
  onDismiss,
  showRetry = true,
  showDismiss = true,
  className = '',
}) => {
  // Map severity to appropriate styling
  const severityStyles = {
    info: {
      wrapper: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-500',
      text: 'text-blue-700',
      heading: 'text-blue-800',
    },
    warning: {
      wrapper: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-500',
      text: 'text-yellow-700',
      heading: 'text-yellow-800',
    },
    error: {
      wrapper: 'bg-red-50 border-red-200',
      icon: 'text-red-500',
      text: 'text-red-700',
      heading: 'text-red-800',
    },
    critical: {
      wrapper: 'bg-red-100 border-red-300',
      icon: 'text-red-600',
      text: 'text-red-800',
      heading: 'text-red-900',
    },
  };

  const styles = severityStyles[severity];

  // Get a user-friendly heading based on severity
  const getHeading = () => {
    switch (severity) {
      case 'info':
        return 'Information';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      case 'critical':
        return 'Critical Error';
      default:
        return 'Error';
    }
  };

  return (
    <div
      className={`rounded-md border p-4 shadow-sm ${styles.wrapper} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className={`h-5 w-5 ${styles.icon}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-grow">
          <h3 className={`text-sm font-medium ${styles.heading}`}>
            {getHeading()}
          </h3>
          <div className={`mt-2 text-sm ${styles.text}`}>
            {message}
          </div>
          
          {/* Show action buttons if callbacks are provided */}
          {(onRetry || onDismiss) && (
            <div className="mt-4 flex gap-3">
              {onRetry && showRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetry}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              )}
              
              {onDismiss && showDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDismiss}
                >
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
