/**
 * Centralized Supabase Client Export
 * 
 * This file re-exports all Supabase client implementations and individual clients
 * to provide a consistent import pattern across the codebase.
 */

// Re-export all exports from the supabase directory
export * from '@/lib/supabase/index';

// Import and re-export both client implementations
import { supabaseCachedClient } from '@/lib/supabase/cachedClient';
import { supabaseClient } from '@/lib/supabase/client';

// Export the default client (non-cached version)
export const supabase = supabaseClient;

// Export the cached client with a different name for clarity
export const supabaseCached = supabaseCachedClient;
