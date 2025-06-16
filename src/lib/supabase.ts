/**
 * Centralized Supabase Client Export
 * 
 * This file re-exports all Supabase client implementations and individual clients
 * to provide a consistent import pattern across the codebase.
 */

// Import directly from the files without using re-exports
import { createBrowserClient } from '@supabase/ssr';

// Initialize the clients directly here instead of importing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verify environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is not defined in environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Create clients directly using the SSR helper
const supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
const supabaseCachedClient = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Export the default client (non-cached version)
export const supabase = supabaseClient;

// Export the cached client with a different name for clarity
export const supabaseCached = supabaseCachedClient;
