'use client';

/**
 * Copyright Paul C. Schmidt 2025. All rights reserved.
 * Unauthorized use, reproduction, or distribution of this software is prohibited.
 */

import '@/styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          Hello from Layout!
          {children}
        </div>
      </body>
    </html>
  );
}
