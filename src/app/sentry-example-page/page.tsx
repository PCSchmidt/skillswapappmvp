'use client';

import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import Button from '@/components/ui/Button';

export default function SentryTestPage() {
  const [testPerformed, setTestPerformed] = useState(false);

  // This function deliberately triggers an error for Sentry to capture
  const handleTriggerError = () => {
    try {
      // Intentionally call a non-existent function
      // @ts-ignore - deliberately causing an error
      nonExistentFunction();
    } catch (error) {
      console.error('Error triggered for Sentry test:', error);
      setTestPerformed(true);
      // Re-throw the error so Sentry can capture it
      throw error;
    }
  };

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-2xl font-bold mb-6">Sentry Integration Test</h1>
        
        <div className="space-y-6 max-w-lg">
          <p>
            This page allows you to test that Sentry error monitoring is correctly configured.
            Click the button below to trigger a test error that should be captured by Sentry.
          </p>
          
          {testPerformed ? (
            <div className="p-4 bg-amber-100 border border-amber-300 rounded-md">
              <p className="font-medium">Test error triggered!</p>
              <p className="mt-2">
                Check your Sentry dashboard in a few moments to verify that the error was captured.
              </p>
            </div>
          ) : (
            <Button onClick={handleTriggerError}>
              Trigger Test Error
            </Button>
          )}
          
          <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <h2 className="font-semibold mb-2">Alternative verification method:</h2>
            <p>
              If you prefer, you can also verify Sentry by adding this code anywhere in your application:
            </p>
            <pre className="p-3 bg-gray-800 text-white rounded mt-2 overflow-x-auto">
              <code>{`// This will throw an error and be captured by Sentry
myUndefinedFunction();`}</code>
            </pre>
          </div>
        </div>
      </div>
    </Container>
  );
}
