'use client';

import { ReactNode } from 'react';
import { SWRProvider } from '@/lib/hooks/useSWRConfig';

interface SWRWrapperProps {
  children: ReactNode;
}

/**
 * Client component wrapper for SWR Provider
 * This isolates the client-specific SWR functionality in a dedicated client component
 */
export default function SWRWrapper({ children }: SWRWrapperProps) {
  return <SWRProvider>{children}</SWRProvider>;
}
