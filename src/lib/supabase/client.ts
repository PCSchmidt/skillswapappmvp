/**
 * Supabase Client Implementation
 * 
 * This file creates and exports the Supabase client using the latest ssr package.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn(
      'Supabase environment variables missing. Some features may not work correctly.',
      '\nRequired variables:',
      '\n- NEXT_PUBLIC_SUPABASE_URL',
      '\n- NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }
}

// Create client with proper error handling
export const supabaseClient = (supabaseUrl && supabaseAnonKey)
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : createBrowserClient<Database>(
      // Use a valid Supabase URL format to avoid network errors
      'https://localhost-fallback.supabase.co', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhbGxiYWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk3Njk2MDAsImV4cCI6MTk2NTM0NTYwMH0.mock-key-for-development'
    );

// Export a default client for compatibility
export default supabaseClient;
