'use client';

/**
 * Copyright Paul C. Schmidt 2025. All rights reserved.
 * Unauthorized use, reproduction, or distribution of this software is prohibited.
 */

import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navigation/Navbar';
import { SupabaseProvider } from '@/contexts/SupabaseContext';

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
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              {children}
            </main>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
