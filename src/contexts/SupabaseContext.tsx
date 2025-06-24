/**
 * Supabase Context Provider
 * 
 * Provides access to Supabase client throughout the application
 * and manages authentication state.
 */

'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Function to create a mock Supabase client for Storybook
const createMockSupabaseClient = () => {
  const mockQueryBuilder = {
    select: (_columns: string) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    eq: (_column: string, _value: unknown) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    order: (_column: string, _options: { ascending: boolean }) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    limit: (_count: number) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    gte: (_column: string, _value: string) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    in: (_column: string, _values: unknown[]) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    single: () => Promise.resolve({ data: null, error: null }),
    count: () => Promise.resolve({ count: 0, error: null }),
    update: (_data: unknown) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
      eq: (_column: string, _value: unknown) => Promise.resolve({ // eslint-disable-line @typescript-eslint/no-unused-vars
        data: null,
        error: null,
      }),
    }),
    delete: () => mockQueryBuilder,
    insert: (_data: unknown) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    or: (_filter: string) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    upsert: (_data: unknown, _options?: unknown) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    neq: (_column: string, _value: unknown) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    ilike: (_column: string, _pattern: string) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    range: (_from: number, _to: number) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    // Add a thenable interface to allow awaiting the query builder directly
    then: (onFulfilled?: (value: { data: unknown[]; error: null }) => unknown, onRejected?: (reason: unknown) => unknown) => {
      // Simulate an async operation and return mock data
      return Promise.resolve({ data: [], error: null }).then(onFulfilled, onRejected);
    },
  };
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: {}, error: null }),
      signUp: () => Promise.resolve({ data: {}, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
    },
    from: (_table: string) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    storage: {
      from: (_bucket: string) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
        upload: (_path: string, _file: File) => Promise.resolve({ data: {}, error: null }), // eslint-disable-line @typescript-eslint/no-unused-vars
        getPublicUrl: (_path: string) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
          data: { publicUrl: 'https://mocked-public-url.com/' + _path },
          error: null,
        }),
      }),
    },
    channel: (_name: string) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
      on: (_event: 'postgres_changes' | 'system', _payload: { event: string, schema: string, table: string, filter: string }, _callback: (...args: unknown[]) => void) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
        subscribe: () => ({
          unsubscribe: () => {},
        }),
      }),
    }),
    removeChannel: (_subscription?: unknown) => Promise.resolve({ data: null, error: null }), // eslint-disable-line @typescript-eslint/no-unused-vars
    rpc: (_functionName: string, _args: unknown) => Promise.resolve({ data: null, error: null }), // eslint-disable-line @typescript-eslint/no-unused-vars
  };
};

// Determine which Supabase client to use
const supabase = process.env.STORYBOOK ? createMockSupabaseClient() : createClientComponentClient();

type SupabaseContextType = {
  supabase: typeof supabase;
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

// Create context with default values
const SupabaseContext = createContext<SupabaseContextType>({
  supabase,
  session: null,
  user: null,
  isLoading: true,
  isVerified: false,
  signIn: async () => ({ success: false, error: 'Context not initialized' }),
  signUp: async () => ({ success: false, error: 'Context not initialized' }),
  signOut: async () => {},
  refreshUser: async () => {},
  sendPasswordReset: async () => ({ success: false, error: 'Context not initialized' }),
});

// Custom hook to use the Supabase context
export const useSupabase = () => useContext(SupabaseContext);

// Provider component
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  // Function to refresh user data from the database
  const refreshUser = useCallback(async () => {
    if (!user) return;
    try {      // Check if email is confirmed in Supabase Auth
      const isEmailConfirmed = user.email_confirmed_at != null;
      // Get the user's profile information from our database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data && !error) {
        // If email is confirmed in Supabase Auth but not in our database, update our database
        if (isEmailConfirmed && !data.is_verified) {
          await supabase
            .from('users')
            .update({ is_verified: true })
            .eq('id', user.id);
          setIsVerified(true);
        } else {
          // Otherwise use whichever verification status is true (either source)
          setIsVerified(isEmailConfirmed || data.is_verified || false);
        }
      } else {
        // If we can't get the user profile data, at least use the Supabase Auth status
        setIsVerified(isEmailConfirmed);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }, [user]);

  // Get the session on initial load
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
        // If user is logged in, get their profile data
        if (session?.user) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user || null);
        if (session?.user) {
          await refreshUser();
        } else {
          setIsVerified(false);
        }
        setIsLoading(false);
      }
    );
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Send a password reset email
  const sendPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success : true, error: null };
    } catch (error) {
      console.error('Error sending password reset:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };
  
  const value = {
    supabase,
    session,
    user,
    isLoading,
    isVerified,
    signIn,
    signUp,
    signOut,
    refreshUser,
    sendPasswordReset,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export default SupabaseProvider;
