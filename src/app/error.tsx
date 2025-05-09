'use client';

import * as Sentry from '@sentry/nextjs';
import React, { useEffect } from 'react';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js Error Page
 * This component handles errors at the page level and works with our ErrorBoundary
 * to provide consistent error handling across the application.
 *
 * Note: This is the error.tsx file for Next.js App Router which acts as a
 * fallback error UI for unhandled errors in the React component tree.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Next.js Error Page caught an error:', error);
    }
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="p-8 max-w-lg mx-auto bg-red-50 border-red-200">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-bold text-red-800">Something went wrong</h1>
          
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-2 text-left w-full">
              <h2 className="text-lg font-semibold text-red-800 mb-1">Error Details:</h2>
              <p className="text-sm text-red-600 p-3 bg-red-100 rounded overflow-auto max-h-40">
                {error.message}
                {error.stack && (
                  <pre className="mt-2 text-xs overflow-auto">{error.stack}</pre>
                )}
              </p>
            </div>
          )}
          
          <p className="text-md text-red-600 mt-2">
            {process.env.NODE_ENV === 'production' 
              ? 'An unexpected error occurred. Our team has been notified.'
              : 'An error occurred while rendering this page.'}
          </p>
          
          <div className="flex gap-4 mt-4">
            <Button
              onClick={reset}
              variant="primary"
            >
              Try again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              Go to home page
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
