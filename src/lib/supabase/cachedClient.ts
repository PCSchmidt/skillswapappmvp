/**
 * Cached Supabase Client Implementation
 * 
 * This file creates a cached version of the Supabase client for optimized performance.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

let cachedClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Get a cached Supabase client to avoid creating multiple instances
 */
export const getCachedClient = () => {
  if (cachedClient) return cachedClient;
  
  // Validate environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.warn('Supabase environment variables missing for cached client.');
    }
  }
  
  cachedClient = (supabaseUrl && supabaseAnonKey)
    ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
    : createBrowserClient<Database>(
        'https://localhost-fallback.supabase.co', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhbGxiYWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk3Njk2MDAsImV4cCI6MTk2NTM0NTYwMH0.mock-key-for-development'
      );
    
  return cachedClient;
};

// Create and export the client
export const supabaseCachedClient = getCachedClient();

// Export a default client for compatibility
export default supabaseCachedClient;
