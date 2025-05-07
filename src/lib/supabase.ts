/**
 * Direct Supabase Client Export
 * 
 * This file provides a direct export of the Supabase client to avoid complex import paths.
 * It's placed in the root of the lib directory for easy access from all components.
 */

import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or anonymous key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  );
}

// For development purposes, we'll use a mock client if credentials are missing
export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : createBrowserClient<Database>('https://example.supabase.co', 'mock-anon-key-for-development');

// Add a console warning only in development mode
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Using mock Supabase client. Please configure your .env.local file with real credentials.');
  }
}

/**
 * Get the current authenticated user
 * @returns The user object if authenticated, null otherwise
 */
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

/**
 * Sign up a new user
 * @param email User email
 * @param password User password
 * @returns Response with user data or error
 */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
}

/**
 * Sign in an existing user
 * @param email User email
 * @param password User password
 * @returns Response with session data or error
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  return supabase.auth.signOut();
}

export default supabase;
