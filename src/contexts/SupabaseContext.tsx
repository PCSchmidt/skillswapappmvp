/**
 * Supabase Context Provider
 * 
 * Provides access to Supabase client throughout the application
 * and manages authentication state.
 */

'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

// Check if we have valid Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasValidConfig = supabaseUrl && supabaseAnonKey && 
  supabaseUrl.includes('supabase.co') && 
  supabaseAnonKey.length > 50;

// Simple cache for demo mode data
const demoDataCache = new Map();

// Demo data generator for testing
const generateDemoData = (type: string, userId?: string) => {
  const cacheKey = `${type}_${userId || 'default'}`;
  if (demoDataCache.has(cacheKey)) {
    return demoDataCache.get(cacheKey);
  }

  let demoData;
  switch (type) {
    case 'user_profile':
      demoData = {
        id: userId || 'demo-user-id',
        full_name: 'Demo User',
        bio: 'This is a demo user profile for testing purposes.',
        location_city: 'Demo City',
        location_state: 'Demo State',
        location_country: 'Demo Country',
        created_at: new Date().toISOString()
      };
      break;
    case 'user_skills':
      demoData = [
        {
          id: 'demo-skill-1',
          user_id: userId || 'demo-user-id',
          title: 'JavaScript Programming',
          description: 'Expert in modern JavaScript frameworks',
          category: 'Technology',
          skill_type: 'offered',
          experience_level: 'expert',
          created_at: new Date().toISOString()
        },
        {
          id: 'demo-skill-2', 
          user_id: userId || 'demo-user-id',
          title: 'Guitar Lessons',
          description: 'Looking to learn acoustic guitar',
          category: 'Music',
          skill_type: 'wanted',
          experience_level: 'beginner',
          created_at: new Date().toISOString()
        }
      ];
      break;
    case 'trades':
      demoData = [
        {
          id: 'demo-trade-1',
          proposer_id: userId || 'demo-user-id',
          receiver_id: 'demo-other-user',
          status: 'proposed',
          created_at: new Date().toISOString()
        }
      ];
      break;
    case 'messages':
      demoData = [
        {
          id: 'demo-message-1',
          sender_id: 'demo-other-user',
          receiver_id: userId || 'demo-user-id',
          content: 'Hi! I\'m interested in your JavaScript skills.',
          is_read: false,
          created_at: new Date().toISOString()
        }
      ];
      break;
    default:
      demoData = [];
  }

  demoDataCache.set(cacheKey, demoData);
  return demoData;
};

// Function to create a mock Supabase client for Storybook
const createMockSupabaseClient = () => {
  const mockQueryBuilder = {
    select: (_columns?: string) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    eq: (_column: string, _value: unknown) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    order: (_column: string, _options: { ascending: boolean }) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    limit: (_count: number) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    gte: (_column: string, _value: string) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    in: (_column: string, _values: unknown[]) => mockQueryBuilder, // eslint-disable-line @typescript-eslint/no-unused-vars
    single: () => Promise.resolve({ data: null, error: null }),
    count: () => Promise.resolve({ count: 0, error: null }),
    update: (_data: unknown) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
      eq: (_column: string, _value: unknown) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
        eq: (_column: string, _value: unknown) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
          eq: (_column: string, _value: unknown) => Promise.resolve({ // eslint-disable-line @typescript-eslint/no-unused-vars
            data: null,
            error: null,
          }),
          in: (_column: string, _values: unknown[]) => Promise.resolve({ // eslint-disable-line @typescript-eslint/no-unused-vars
            data: null,
            error: null,
          }),
          single: () => Promise.resolve({ data: null, error: null }),
          then: (onFulfilled?: (value: { data: unknown; error: null }) => unknown) => {
            return Promise.resolve({ data: null, error: null }).then(onFulfilled);
          }
        }),
        in: (_column: string, _values: unknown[]) => Promise.resolve({ // eslint-disable-line @typescript-eslint/no-unused-vars
          data: null,
          error: null,
        }),
        single: () => Promise.resolve({ data: null, error: null }),
        then: (onFulfilled?: (value: { data: unknown; error: null }) => unknown) => {
          return Promise.resolve({ data: null, error: null }).then(onFulfilled);
        }
      }),
      in: (_column: string, _values: unknown[]) => Promise.resolve({ // eslint-disable-line @typescript-eslint/no-unused-vars
        data: null,
        error: null,
      }),
      single: () => Promise.resolve({ data: null, error: null }),
      then: (onFulfilled?: (value: { data: unknown; error: null }) => unknown) => {
        return Promise.resolve({ data: null, error: null }).then(onFulfilled);
      }
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
const supabase = (process.env.STORYBOOK || !hasValidConfig) ? createMockSupabaseClient() : createClientComponentClient();

// Log demo mode warning if no valid config
if (!hasValidConfig && typeof window !== 'undefined') {
  console.warn(
    '🔧 Supabase configuration missing - running in demo mode.',
    '\nTo enable full functionality, set these environment variables:',
    '\n- NEXT_PUBLIC_SUPABASE_URL',
    '\n- NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

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
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cache for API quota conservation
  const lastRefreshTime = useRef<number>(0);
  const REFRESH_COOLDOWN = 60000; // 1 minute minimum between refreshes
  const isRefreshing = useRef<boolean>(false);
  
  // Function to refresh user data from the database
  const refreshUser = useCallback(async () => {
    if (!user || !isClient) {
      return;
    }
    
    // Skip refreshing on landing page to prevent API calls and shaking
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      return;
    }
    
    // Prevent concurrent refresh calls
    if (isRefreshing.current) {
      return;
    }
    
    // In demo mode, use demo data instead of making API calls
    if (!hasValidConfig) {
      console.log('📍 Demo mode: Using mock user data to avoid API calls');
      const isEmailConfirmed = user.email_confirmed_at != null;
      setIsVerified(isEmailConfirmed);
      return;
    }
    
    // Rate limiting for API quota conservation
    const now = Date.now();
    if (now - lastRefreshTime.current < REFRESH_COOLDOWN) {
      console.log('🔧 Skipping refresh (rate limited to conserve API quota)');
      const isEmailConfirmed = user.email_confirmed_at != null;
      setIsVerified(isEmailConfirmed);
      return;
    }
    
    isRefreshing.current = true;
    lastRefreshTime.current = now;
    
    try {
      // Check email confirmation status from auth (no API call needed)
      const isEmailConfirmed = user.email_confirmed_at != null;
      
      // Only verify database record existence for critical operations
      // Skip database calls for basic auth verification to conserve quota
      console.log('💡 Using auth status to conserve API quota');
      setIsVerified(isEmailConfirmed);
      
    } catch (error) {
      console.warn('Error refreshing user data:', error);
      const isEmailConfirmed = user.email_confirmed_at != null;
      setIsVerified(isEmailConfirmed);
    } finally {
      isRefreshing.current = false;
    }
  }, [user, isClient]);

  // Get the session on initial load - only on client side with reduced delays for landing page
  useEffect(() => {
    if (!isClient) return;
    
    let isMounted = true;
    
    const fetchSession = async () => {
      // Skip session loading on landing page to prevent API calls and delays
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user || null);
        // If user is logged in, get their profile data
        if (session?.user) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchSession();
    
    // Set up the auth state listener with aggressive debouncing to prevent shaking
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!isMounted) return;
        
        // Reduced debouncing for landing page to improve performance
        const debounceDelay = typeof window !== 'undefined' && window.location.pathname === '/' ? 100 : 500;
        
        setTimeout(() => {
          if (!isMounted) return;
          
          // Only update state if it actually changed to prevent unnecessary re-renders
          if (session?.user?.id !== user?.id) {
            setSession(session);
            setUser(session?.user || null);
            
            // Only refresh user for significant events, not token refreshes
            if (session?.user && event === 'SIGNED_IN') {
              refreshUser();
            } else if (!session) {
              setIsVerified(false);
            }
          }
          
          setIsLoading(false);
        }, debounceDelay);
      }
    );
    
    // Clean up subscription
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [refreshUser, isClient, user?.id]);

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
