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

// Check if we have valid environment variables
const hasValidConfig = supabaseUrl && supabaseAnonKey && 
  supabaseUrl.includes('supabase.co') && 
  supabaseAnonKey.length > 50;

// Validate environment variables
if (!hasValidConfig) {
  if (typeof window !== 'undefined') {
    console.warn(
      '🔧 Supabase configuration missing - running in demo mode.',
      '\nTo enable full functionality, set these environment variables in Vercel:',
      '\n- NEXT_PUBLIC_SUPABASE_URL',
      '\n- NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }
}

// Create mock client that doesn't make network requests
const createMockClient = () => {
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    limit: () => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no database connection' } }),
    insert: () => mockQueryBuilder,
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    then: () => Promise.resolve({ data: [], error: null })
  };

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: { message: 'Demo mode - authentication disabled' } }),
      signInWithOAuth: () => Promise.resolve({ data: {}, error: { message: 'Demo mode - authentication disabled' } }),
      signUp: () => Promise.resolve({ data: {}, error: { message: 'Demo mode - authentication disabled' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Demo mode - email features disabled' } }),
    },
    from: () => mockQueryBuilder,
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: {}, error: { message: 'Demo mode - storage disabled' } }),
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `/demo-placeholder-${path}` },
          error: null,
        }),
      }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
    removeChannel: () => Promise.resolve({ data: null, error: null }),
    rpc: () => Promise.resolve({ data: null, error: { message: 'Demo mode - RPC disabled' } }),
  };
};

// Create client with proper error handling
export const supabaseClient = hasValidConfig
  ? createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : createMockClient() as any;

// Export a default client for compatibility
export default supabaseClient;
