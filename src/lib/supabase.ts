/**
 * Centralized Supabase Client Export
 * 
 * This file re-exports all Supabase client implementations and individual clients
 * to provide a consistent import pattern across the codebase.
 */

// Import directly from the files without using re-exports
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

// Initialize the clients directly here instead of importing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verify environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is not defined in environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Create clients directly
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
const supabaseCachedClient = createClientComponentClient();

// Export the default client (non-cached version)
export const supabase = supabaseClient;

// Export the cached client with a different name for clarity
export const supabaseCached = supabaseCachedClient;
