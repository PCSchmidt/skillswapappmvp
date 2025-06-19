'use client';

import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRFetcher from './useSWRFetcher';

/**
 * Type definitions for useData hook
 */
export type UseDataOptions = SWRConfiguration;

/**
 * Custom hook for fetching data with SWR
 * This acts as a wrapper around useSWR with our default configuration
 * 
 * @param key The key for SWR (usually a URL)
 * @param options Optional SWR configuration options
 * @returns SWR response object with data, error, and other properties
 */
export function useData<T>(key: string | null | undefined, options?: UseDataOptions): SWRResponse<T, Error> {
  const { fetcher } = useSWRFetcher();
  
  return useSWR<T, Error>(
    key,
    fetcher,
    {
      revalidateOnFocus: false, // Don't revalidate when window regains focus
      dedupingInterval: 5000,   // Deduplicate requests within 5 seconds
      ...options,
    }
  );
}

/**
 * Custom hook for fetching data with a specific revalidation schedule
 * Useful for data that needs to be kept fresh periodically
 * 
 * @param key The key for SWR (usually a URL)
 * @param refreshInterval The interval in milliseconds to refresh the data
 * @param options Optional SWR configuration options
 * @returns SWR response object with data, error, and other properties
 */
export function useAutoRefreshData<T>(
  key: string | null | undefined, 
  refreshInterval: number = 30000, // Default to 30 seconds
  options?: UseDataOptions
): SWRResponse<T, Error> {
  return useData<T>(
    key,
    {
      refreshInterval,
      ...options
    }
  );
}

/**
 * Custom hook for fetching critical data with more aggressive revalidation
 * Useful for data that must be as fresh as possible (e.g., notifications)
 * 
 * @param key The key for SWR (usually a URL)
 * @param options Optional SWR configuration options
 * @returns SWR response object with data, error, and other properties
 */
export function useCriticalData<T>(key: string | null | undefined, options?: UseDataOptions): SWRResponse<T, Error> {
  return useData<T>(
    key,
    {
      revalidateOnFocus: true,   // Revalidate when window regains focus
      refreshInterval: 60000,    // Refresh every minute
      dedupingInterval: 2000,    // Deduplicate requests within 2 seconds
      errorRetryCount: 5,        // Retry 5 times on error
      ...options
    }
  );
}

/**
 * Custom hook for fetching static data that rarely changes
 * Uses longer cache durations for better performance
 * 
 * @param key The key for SWR (usually a URL)
 * @param options Optional SWR configuration options
 * @returns SWR response object with data, error, and other properties
 */
export function useStaticData<T>(key: string | null | undefined, options?: UseDataOptions): SWRResponse<T, Error> {
  return useData<T>(
    key,
    {
      revalidateOnFocus: false,   // Don't revalidate when window regains focus
      revalidateOnReconnect: false, // Don't revalidate on reconnect
      refreshInterval: 0,         // Don't refresh automatically
      dedupingInterval: 3600000,  // Deduplicate requests within 1 hour
      ...options
    }
  );
}

/**
 * Custom hook for conditional data fetching
 * Only fetches data when the condition is true
 * 
 * @param key The key for SWR (usually a URL)
 * @param condition Boolean condition that determines whether to fetch
 * @param options Optional SWR configuration options
 * @returns SWR response object with data, error, and other properties
 */
export function useConditionalData<T>(
  key: string | undefined, 
  condition: boolean,
  options?: UseDataOptions
): SWRResponse<T, Error> {
  return useData<T>(
    condition ? key : null,
    options
  );
}

/**
 * Custom hook for fetching data with user authentication
 * Requires the user to be authenticated to fetch data
 * 
 * @param key The key for SWR (usually a URL)
 * @param isAuthenticated Boolean indicating whether the user is authenticated
 * @param options Optional SWR configuration options
 * @returns SWR response object with data, error, and other properties
 */
export function useAuthenticatedData<T>(
  key: string | undefined, 
  isAuthenticated: boolean,
  options?: UseDataOptions
): SWRResponse<T, Error> {
  return useConditionalData<T>(key, isAuthenticated, options);
}

export default useData;
