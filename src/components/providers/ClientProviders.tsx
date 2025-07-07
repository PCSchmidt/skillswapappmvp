'use client';

/**
 * Client Providers Component
 * 
 * This component wraps all client-side providers and components
 * to avoid hydration issues in the root layout.
 */

import React, { useEffect, useState } from 'react';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import FeedbackWidget from '@/components/feedback/FeedbackWidget';
import Navbar from '@/components/navigation/Navbar';
import { SupabaseProvider } from '@/contexts/SupabaseContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show a loading state during hydration to prevent mismatches
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-16 bg-white border-b border-gray-200"></div>
        <main>
          {children}
        </main>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SupabaseProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            {children}
          </main>
          <FeedbackWidget />
        </div>
      </SupabaseProvider>
    </ErrorBoundary>
  );
}
