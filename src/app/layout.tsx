'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import SupabaseProvider from '@/contexts/SupabaseContext';
import Navbar from '@/components/navigation/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <title>SkillSwap - Trade skills, learn together</title>
        <meta name="description" content="A skill-sharing and bartering platform enabling users to trade skills in a hyper-local community" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <SupabaseProvider>
          <div className="flex min-h-screen flex-col">
          <Navbar />
          
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">SkillSwap</h3>
                  <p className="text-gray-300">Trade skills, learn together, build community.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Explore</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-300 hover:text-white">Browse Skills</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">Categories</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">Popular Trades</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">Community Guidelines</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">Safety Tips</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Company</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                &copy; {new Date().getFullYear()} SkillSwap. All rights reserved.
              </div>
            </div>
          </footer>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
