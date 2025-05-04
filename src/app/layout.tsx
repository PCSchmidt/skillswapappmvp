'use client';

import React, { lazy, Suspense, useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import SupabaseProvider from '@/contexts/SupabaseContext';
import ResponsiveProvider from '@/contexts/ResponsiveContext';
import Navbar from '@/components/navigation/Navbar';
import { registerServiceWorker } from '@/lib/utils/registerServiceWorker';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Register service worker for PWA functionality
  useEffect(() => {
    registerServiceWorker();
  }, []);
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <title>SkillSwap - Trade skills, learn together</title>
        <meta name="description" content="A skill-sharing and bartering platform enabling users to trade skills in a hyper-local community" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <SupabaseProvider>
          <ResponsiveProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              
              <main className="flex-grow">
                <Suspense fallback={<div className="p-8 flex justify-center">Loading...</div>}>
                  {children}
                </Suspense>
              </main>
          
              <footer className="bg-gray-800 text-white py-8 md:py-12">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    <div>
                      <h3 className="font-bold text-lg mb-3 md:mb-4">SkillSwap</h3>
                      <p className="text-gray-300 text-sm md:text-base">Trade skills, learn together, build community.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 md:mb-4">Explore</h3>
                      <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                        <li><a href="/skills/browse" className="text-gray-300 hover:text-white">Browse Skills</a></li>
                        <li><a href="/skills/browse" className="text-gray-300 hover:text-white">Categories</a></li>
                        <li><a href="/trades" className="text-gray-300 hover:text-white">Trades</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 md:mb-4">Resources</h3>
                      <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                        <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Guidelines</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Safety</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 md:mb-4">Company</h3>
                      <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                        <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Privacy</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white">Terms</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} SkillSwap. All rights reserved.
                  </div>
                </div>
              </footer>
            </div>
          </ResponsiveProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
