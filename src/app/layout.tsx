import React, { Suspense } from 'react';
import { Manrope, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/navigation/Navbar';
import type { Metadata } from 'next';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkillSwap — AI-Powered Skill Exchange',
  description:
    'Trade skills with people in your community. AI-powered matching finds your perfect learning partner.',
  metadataBase: new URL('https://skillswap.vercel.app'),
  openGraph: {
    title: 'SkillSwap — AI-Powered Skill Exchange',
    description:
      'Trade skills with people in your community. AI-powered matching finds your perfect learning partner.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-grow">
              <Suspense
                fallback={
                  <div className="p-8 flex justify-center text-text-secondary">
                    Loading…
                  </div>
                }
              >
                {children}
              </Suspense>
            </main>

            <footer className="border-t border-border bg-surface">
              <div className="container mx-auto px-4 py-10 md:py-14">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <span className="eyebrow mb-3 block">SkillSwap</span>
                    <p className="text-sm text-text-muted">
                      Trade skills, learn together, build community.
                    </p>
                  </div>
                  <div>
                    <span className="eyebrow mb-3 block">Explore</span>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/skills/browse" className="text-text-secondary hover:text-emerald-400">
                          Browse Skills
                        </a>
                      </li>
                      <li>
                        <a href="/trades" className="text-text-secondary hover:text-emerald-400">
                          Trades
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <span className="eyebrow mb-3 block">Resources</span>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/how-it-works" className="text-text-secondary hover:text-emerald-400">
                          How It Works
                        </a>
                      </li>
                      <li>
                        <a href="/about" className="text-text-secondary hover:text-emerald-400">
                          About
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <span className="eyebrow mb-3 block">Legal</span>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/privacy" className="text-text-secondary hover:text-emerald-400">
                          Privacy
                        </a>
                      </li>
                      <li>
                        <a href="/terms" className="text-text-secondary hover:text-emerald-400">
                          Terms
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-border mt-8 pt-8 text-center text-text-muted text-xs tracking-wide">
                  &copy; {new Date().getFullYear()} SkillSwap. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
