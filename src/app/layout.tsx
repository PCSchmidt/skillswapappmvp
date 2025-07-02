'use client';

/**
 * Copyright Paul C. Schmidt 2025. All rights reserved.
 * Unauthorized use, reproduction, or distribution of this software is prohibited.
 */

import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import Navbar from '@/components/navigation/Navbar';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import { useErrorHandler } from '@/lib/error/clientErrorHandler';

const inter = Inter({ subsets: ['latin'] });

function ClientErrorInitializer() {
  useErrorHandler(); // Initialize global error handling
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <SupabaseProvider>
            <ClientErrorInitializer />
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                {children}
              </main>
            </div>
          </SupabaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
