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
    // Immediate hydration to reduce layout shifts
    setIsClient(true);
  }, []);

  // Show a stable loading state during hydration to prevent mismatches and shaking
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Stable header skeleton that matches the real navbar height */}
        <div className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg"></div>
              <div className="font-bold text-xl text-primary-600">SkillSwap</div>
            </div>
            <div className="hidden md:flex space-x-8">
              <div className="w-20 h-4 bg-transparent"></div>
              <div className="w-16 h-4 bg-transparent"></div>
              <div className="w-12 h-4 bg-transparent"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-4 bg-transparent"></div>
              <div className="w-20 h-8 bg-transparent"></div>
            </div>
          </div>
        </div>
        <main className="min-h-[calc(100vh-4rem)]">
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
