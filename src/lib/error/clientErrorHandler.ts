/**
 * Client-side Error Handler
 * 
 * Handles global JavaScript errors, unhandled promise rejections,
 * and other runtime errors to prevent console spam and improve debugging.
 */

'use client';

import { useEffect } from 'react';

interface ErrorInfo {
  message: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
  timestamp: number;
  userAgent: string;
  url: string;
}

class ClientErrorHandler {
  private errors: ErrorInfo[] = [];
  private maxErrors = 50; // Prevent memory leaks

  constructor() {
    this.initializeErrorHandlers();
  }

  private initializeErrorHandlers() {
    if (typeof window === 'undefined') return;

    // Handle uncaught JavaScript errors
    window.addEventListener('error', this.handleError.bind(this));

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));

    // Handle resource loading errors (images, scripts, etc.)
    window.addEventListener('error', this.handleResourceError.bind(this), true);
  }

  private handleError(event: ErrorEvent) {
    const errorInfo: ErrorInfo = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logError('JavaScript Error', errorInfo);
  }

  private handlePromiseRejection(event: PromiseRejectionEvent) {
    const errorInfo: ErrorInfo = {
      message: event.reason?.message || 'Unhandled Promise Rejection',
      error: event.reason,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logError('Promise Rejection', errorInfo);

    // Prevent the default browser behavior (console error)
    event.preventDefault();
  }

  private handleResourceError(event: Event) {
    const target = event.target;
    
    // Only handle actual resource loading errors
    if (target && target instanceof HTMLElement && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
      const element = target as HTMLImageElement | HTMLScriptElement | HTMLLinkElement;
      const src = 'src' in element ? element.src : 'href' in element ? element.href : '';
      
      const errorInfo: ErrorInfo = {
        message: `Failed to load resource: ${target.tagName}`,
        filename: src,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      this.logError('Resource Error', errorInfo);
    }
  }

  private logError(type: string, errorInfo: ErrorInfo) {
    // Store error for debugging
    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Filter out known non-critical errors
    if (this.shouldIgnoreError(errorInfo)) {
      return;
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${type}`);
      console.error('Message:', errorInfo.message);
      if (errorInfo.filename) console.log('File:', errorInfo.filename);
      if (errorInfo.error) console.error('Error Object:', errorInfo.error);
      console.log('URL:', errorInfo.url);
      console.log('Time:', new Date(errorInfo.timestamp).toISOString());
      console.groupEnd();
    }

    // In production, you might want to send to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToService(type, errorInfo);
    }
  }

  private shouldIgnoreError(errorInfo: ErrorInfo): boolean {
    const ignoredPatterns = [
      // Ignore browser extension errors
      /extension\//i,
      /chrome-extension/i,
      /moz-extension/i,
      
      // Ignore script errors from external domains
      /facebook\.com/i,
      /google/i,
      /analytics/i,
      
      // Ignore common network errors
      /failed to fetch/i,
      /network error/i,
      /connection refused/i,
      
      // Ignore Supabase connection errors when no environment variables
      /localhost-fallback\.supabase\.co/i,
    ];

    return ignoredPatterns.some(pattern => 
      pattern.test(errorInfo.message) || 
      pattern.test(errorInfo.filename || '')
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private reportErrorToService(_type: string, _errorInfo: ErrorInfo) {
    // Example: Send to external error reporting service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   body: JSON.stringify({ type: _type, ..._errorInfo })
    // }).catch(() => {
    //   // Silently handle reporting errors
    // });
  }

  public getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }
}

// Create singleton instance
const errorHandler = new ClientErrorHandler();

// Export hook for use in components
export function useErrorHandler() {
  useEffect(() => {
    // Error handler is automatically initialized
    return () => {
      // Cleanup if needed
    };
  }, []);

  return {
    getErrors: () => errorHandler.getErrors(),
    clearErrors: () => errorHandler.clearErrors()
  };
}

export default ClientErrorHandler;
