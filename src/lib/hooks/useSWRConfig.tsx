import localforage from 'localforage';
import React, { ReactNode } from 'react';
import { SWRConfig, SWRConfiguration } from 'swr';

/**
 * Default SWR configuration for the SkillSwap application
 */
export const defaultSWRConfig: SWRConfiguration = {
  /**
   * Default fetcher function for SWR
   */
  fetcher: async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      const error: any = new Error('An error occurred while fetching the data.');
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return res.json();
  },
  dedupingInterval: 10000, // Deduping interval in milliseconds (10 seconds)
  focusThrottleInterval: 5000, // Focus throttle interval in milliseconds (5 seconds)
  revalidateOnFocus: true, // Revalidate when window gets focused
  revalidateOnReconnect: true, // Revalidate when browser regains network connection
  refreshInterval: 0, // Disable auto refresh by default
  shouldRetryOnError: true, // Retry on error
  errorRetryCount: 3, // Retry 3 times on error
  errorRetryInterval: 5000, // 5 seconds between retries
};

/**
 * Cache persistence configuration for SWR using localforage
 */
export const cachePersistor = {
  get: async (key: string) => {
    try {
      const data = await localforage.getItem(key);
      return data ? JSON.parse(data as string) : null;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  },
  set: async (key: string, value: any) => {
    try {
      return await localforage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting cached data:', error);
    }
  },
  delete: async (key: string) => {
    try {
      return await localforage.removeItem(key);
    } catch (error) {
      console.error('Error removing cached data:', error);
    }
  },
  clear: async () => {
    try {
      return await localforage.clear();
    } catch (error) {
      console.error('Error clearing cached data:', error);
    }
  }
};

// Simple in-memory storage as fallback
const mapStorage = new Map<string, any>();

/**
 * Get full SWR configuration with optional overrides
 */
export const getFullSWRConfig = (config: Partial<SWRConfiguration> = {}): SWRConfiguration => {
  return {
    ...defaultSWRConfig,
    ...config,
  };
};

/**
 * SWR configuration provider to be used in _app.tsx
 * Note: Due to TypeScript compatibility issues with the provider function signature,
 * we're keeping this simpler in this implementation.
 */
export const ConfiguredSWRConfig = ({ children }: { children: ReactNode }) => {
  return (
    <SWRConfig
      value={defaultSWRConfig}
    >
      {children}
    </SWRConfig>
  );
};

export default ConfiguredSWRConfig;
