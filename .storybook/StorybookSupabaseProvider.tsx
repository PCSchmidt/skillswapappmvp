/**
 * Storybook-specific Supabase Provider
 * 
 * This version uses hardcoded values instead of environment variables
 * to avoid the "supabaseUrl is required" error in Storybook.
 */

import React, { createContext, useState } from 'react';
import { type User, type Session } from '@supabase/supabase-js';

// Create a mock Supabase client
const createMockSupabaseClient = () => {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
      signUp: () => Promise.resolve({ data: {}, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({
            data: null,
            error: null,
          }),
          order: () => Promise.resolve({
            data: [],
            error: null,
          }),
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({
          data: null,
          error: null,
        }),
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: File) => Promise.resolve({ data: {}, error: null }),
      }),
    },
    channel: (name: string) => ({
      on: (event: string, callback: Function) => ({
        subscribe: () => {},
      }),
    }),
  };
};

// Create context type matching the real SupabaseContext
type SupabaseContextType = {
  supabase: ReturnType<typeof createMockSupabaseClient>;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isVerified: boolean;
  signIn: (email: string, password: string) => Promise<{ 
    success: boolean; 
    error: string | null;
  }>;
  signUp: (email: string, password: string) => Promise<{ 
    success: boolean; 
    error: string | null;
  }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
};

// Create context with mock values
export const StorybookSupabaseContext = createContext<SupabaseContextType>({
  supabase: createMockSupabaseClient(),
  session: null,
  user: null,
  isLoading: false,
  isVerified: false,
  signIn: async () => ({ success: false, error: 'Mock context' }),
  signUp: async () => ({ success: false, error: 'Mock context' }),
  signOut: async () => {},
  refreshUser: async () => {},
  sendPasswordReset: async () => ({ success: false, error: 'Mock context' }),
});

// Provider component for Storybook
export function StorybookSupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const mockClient = createMockSupabaseClient();
  
  const value = {
    supabase: mockClient,
    session: null,
    user: null,
    isLoading: false,
    isVerified: false,
    signIn: async () => ({ success: true, error: null }),
    signUp: async () => ({ success: true, error: null }),
    signOut: async () => {},
    refreshUser: async () => {},
    sendPasswordReset: async () => ({ success: true, error: null }),
  };

  return (
    <StorybookSupabaseContext.Provider value={value}>
      {children}
    </StorybookSupabaseContext.Provider>
  );
}

export default StorybookSupabaseProvider;
