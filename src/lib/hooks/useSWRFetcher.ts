'use client';

/**
 * SWR Fetcher Hook
 * 
 * This hook provides a standardized fetcher function for SWR with error handling,
 * type safety, and proper response processing.
 */

import { useErrorHandler } from './useErrorHandler';

/**
 * Default fetcher options
 */
const DEFAULT_FETCHER_OPTIONS = {
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Error class for failed fetches
 */
export class FetchError extends Error {
  status: number;
  info: any;
  
  constructor(message: string, status: number, info?: any) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.info = info;
  }
}

/**
 * Default fetcher function for use with SWR
 */
export const defaultFetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  try {
    const mergedOptions = {
      ...DEFAULT_FETCHER_OPTIONS,
      ...options,
    };

    const response = await fetch(url, mergedOptions);
    
    // Handle non-2xx responses
    if (!response.ok) {
      let errorInfo;
      try {
        // Try to parse error details from response
        errorInfo = await response.json();
      } catch (e) {
        // If parsing fails, use response text
        errorInfo = await response.text();
      }
      
      throw new FetchError(
        `API error: ${response.status} ${response.statusText}`,
        response.status,
        errorInfo
      );
    }
    
    // Handle empty responses
    if (response.status === 204) {
      return null as T;
    }
    
    // Parse and return JSON response
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

/**
 * Creates a type-safe SWR fetcher function
 * 
 * @returns A fetcher function to be used with SWR
 */
export const useSWRFetcher = () => {
  const { handleError } = useErrorHandler();

  /**
   * Fetch data with automatic error handling
   * 
   * @param url - The URL to fetch data from
   * @param options - Fetch options
   * @returns The response data
   * @throws FetchError if the fetch fails
   */
  const fetcher = async <T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      const mergedOptions = {
        ...DEFAULT_FETCHER_OPTIONS,
        ...options,
      };

      const response = await fetch(url, mergedOptions);
      
      // Handle non-2xx responses
      if (!response.ok) {
        let errorInfo;
        try {
          // Try to parse error details from response
          errorInfo = await response.json();
        } catch (e) {
          // If parsing fails, use response text
          errorInfo = await response.text();
        }
        
        throw new FetchError(
          `API error: ${response.status} ${response.statusText}`,
          response.status,
          errorInfo
        );
      }
      
      // Handle empty responses
      if (response.status === 204) {
        return null as T;
      }
      
      // Parse and return JSON response
      return await response.json();
    } catch (error) {
      // Log and rethrow errors
      handleError(error, {
        context: { 
          source: 'SWR fetch',
          url,
          options: { ...options, headers: '(omitted)' }
        }
      });
      throw error;
    }
  };

  return { fetcher };
};

export default useSWRFetcher;
