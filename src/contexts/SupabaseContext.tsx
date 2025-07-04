/**
 * Supabase Context Provider
 * 
 * Provides access to Supabase client throughout the application
 * and manages authentication state.
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

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
  const refreshUser = async () => {
    if (!user) return;
    
    try {
      // Check if email is confirmed in Supabase Auth
      const isEmailConfirmed = user.email_confirmed_at != null;
      
      // Debug log to see the email confirmation status
      console.log('User verification debug:', { 
        user_id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        isEmailConfirmed 
      });
      
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
  };

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
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
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
      const { data, error } = await supabase.auth.signUp({
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

      return { success: true, error: null };
    } catch (error: any) {
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
