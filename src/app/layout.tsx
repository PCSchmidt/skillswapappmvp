'use client';

import React, { lazy, Suspense, useEffect } from 'react';
import './globals.css';
import SupabaseProvider from '@/contexts/SupabaseContext';
import ResponsiveProvider from '@/contexts/ResponsiveContext';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';
import { registerServiceWorker } from '@/lib/utils/registerServiceWorker';

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Register service worker for PWA functionality
  useEffect(() => {
    registerServiceWorker();
  }, []);
  return (
    <html lang="en">
      <head>
        <title>SkillSwap - Trade skills, learn together</title>
        <meta name="description" content="A skill-sharing and bartering platform enabling users to trade skills in a hyper-local community" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="min-h-screen antialiased">
        <SupabaseProvider>
          <ResponsiveProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              
              <main className="flex-grow">
                <Suspense fallback={<div className="p-8 flex justify-center">Loading...</div>}>
                  {children}
                </Suspense>
              </main>
          
              <Footer />
            </div>
          </ResponsiveProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
