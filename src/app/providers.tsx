'use client';

import React, { useEffect } from 'react';
import SupabaseProvider from '@/contexts/SupabaseContext';
import ResponsiveProvider from '@/contexts/ResponsiveContext';
import { registerServiceWorker } from '@/lib/utils/registerServiceWorker';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <SupabaseProvider>
      <ResponsiveProvider>
        {children}
      </ResponsiveProvider>
    </SupabaseProvider>
  );
}
