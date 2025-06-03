/**
 * Authentication Utilities for Supabase
 * 
 * This file contains wrapper functions for Supabase authentication
 * operations to provide a consistent API and error handling.
 */

import { supabaseClient } from './client';

/**
 * Sign in a user with email and password
 * 
 * @param email User's email address
 * @param password User's password
 * @returns Object containing user data or error
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data?.user || null,
    error,
  };
}

/**
 * Register a new user
 * 
 * @param email User's email address
 * @param password User's password
 * @param metadata Additional user metadata (optional)
 * @returns Object containing user data or error
 */
export async function signUp(email: string, password: string, metadata?: Record<string, any>) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  return {
    user: data?.user || null,
    error,
  };
}

/**
 * Sign out the current user
 * 
 * @returns Object containing error (if any)
 */
export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  return { error };
}

/**
 * Send a password reset email
 * 
 * @param email User's email address
 * @param redirectTo URL to redirect to after password reset (optional)
 * @returns Object containing data or error
 */
export async function resetPassword(email: string, redirectTo?: string) {
  const options = redirectTo ? { redirectTo } : undefined;
  return await supabaseClient.auth.resetPasswordForEmail(email, options);
}

/**
 * Verify a one-time password (OTP)
 * 
 * @param email User's email address
 * @param token OTP token
 * @param type Type of verification ('signup', 'recovery', or 'invite')
 * @returns Object containing user data or error
 */
export async function verifyOtp(
  email: string, 
  token: string, 
  type: 'signup' | 'recovery' | 'invite'
) {
  const { data, error } = await supabaseClient.auth.verifyOtp({
    email,
    token,
    type,
  });

  return {
    user: data?.user || null,
    error,
  };
}

/**
 * Get the current authenticated user
 * 
 * @returns Object containing user data or error
 */
export async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();
  
  return {
    user: data?.user || null,
    error,
  };
}

/**
 * Get the current session
 * 
 * @returns Object containing session data or error
 */
export async function getSession() {
  const { data, error } = await supabaseClient.auth.getSession();
  
  return {
    session: data?.session || null,
    error,
  };
}
