'use client';

/**
 * SWR Configuration Component and Hook
 * 
 * This module provides application-wide SWR configuration with a provider component
 * and a hook for consuming the configuration. It implements a stale-while-revalidate
 * caching strategy for optimized data fetching.
 */

import React, { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import type { SWRConfiguration } from 'swr';
import { useErrorHandler } from './useErrorHandler';

// Default configuration for SWR
export const SWR_DEFAULT_CONFIG: SWRConfiguration = {
  // Revalidate on focus (when the user returns to the app)
  revalidateOnFocus: true,
  
  // Revalidate on reconnect (when the user's network is restored)
  revalidateOnReconnect: true,
  
  // Refresh interval (in milliseconds) - set to 0 to disable polling
  refreshInterval: 0,
  
  // How long to keep data "fresh" without revalidation (in milliseconds)
  // Default: 5 minutes
  dedupingInterval: 300000,
  
  // Keep previous data when fetching new data
  keepPreviousData: true,
  
  // Retry configuration
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000, // 5 seconds
  
  // Suspense mode (set to true to use with React Suspense)
  suspense: false,
};

interface SWRProviderProps {
  children: ReactNode;
}

/**
 * SWR Configuration Provider Component
 * 
 * Wrap your application or component tree with this provider to apply
 * consistent SWR configuration throughout the app.
 */
export const SWRProvider: React.FC<SWRProviderProps> = ({ children }) => {
  const { handleError } = useErrorHandler();
  
  return (
    <SWRConfig
      value={{
        ...SWR_DEFAULT_CONFIG,
        onError: (error: any, key: string) => {
          handleError(error, {
            context: { 
              source: 'SWR data fetching',
              key 
            }
          });
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

/**
 * Hook for accessing and customizing SWR configuration
 * 
 * @param customConfig - Optional custom configuration to merge with defaults
 * @returns Final SWR configuration object
 */
export const useSWRConfig = (customConfig: Partial<SWRConfiguration> = {}): SWRConfiguration => {
  return {
    ...SWR_DEFAULT_CONFIG,
    ...customConfig,
  };
};

export default useSWRConfig;
