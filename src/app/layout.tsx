'use client';

/**
 * Copyright Paul C. Schmidt 2025. All rights reserved.
 * Unauthorized use, reproduction, or distribution of this software is prohibited.
 */

import './globals.css';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import SWRWrapper from '@/components/wrappers/SWRWrapper';
import ErrorProvider from '@/components/ui/ErrorProvider';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/navigation/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <SWRWrapper>
            <ErrorProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster position="top-right" />
            </ErrorProvider>
          </SWRWrapper>
        </SupabaseProvider>
      </body>
    </html>
  );
}
