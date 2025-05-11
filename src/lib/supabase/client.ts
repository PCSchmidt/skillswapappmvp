/**
 * Supabase Client Implementation
 * 
 * This file creates and exports the Supabase client using the latest ssr package.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create and export the client
export const supabaseClient = supabaseUrl && supabaseAnonKey
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : createBrowserClient<Database>('https://example.supabase.co', 'mock-anon-key-for-development');

// Export a default client for compatibility
export default supabaseClient;
