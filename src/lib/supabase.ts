/**
 * Centralized Supabase Client Export
 * 
 * This file re-exports all Supabase client implementations and individual clients
 * to provide a consistent import pattern across the codebase.
 */

// Re-export all exports from the supabase directory
export * from './supabase/index';

// Import and re-export both client implementations
import { supabaseClient } from './supabase/client';
import { supabaseCachedClient } from './supabase/cachedClient';

// Export the default client (non-cached version)
export const supabase = supabaseClient;

// Export the cached client with a different name for clarity
export const supabaseCached = supabaseCachedClient;
