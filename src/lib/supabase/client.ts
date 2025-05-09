/**
 * Supabase Client for SkillSwap
 * 
 * This file provides a client for interacting with Supabase services,
 * including authentication, database, and storage.
 */

import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
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

/**
 * Create or update a user profile
 * @param userId User ID
 * @param profileData Profile data to save
 * @returns Response with profile data or error
 */
export async function upsertProfile(userId: string, profileData: Record<string, any>) {
  const { data, error } = await supabase
    .from('users')
    .upsert({ id: userId, ...profileData })
    .select()
    .single();
  
  return { data, error };
}

/**
 * Get a user profile by ID
 * @param userId User ID
 * @returns Response with profile data or error
 */
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
}

/**
 * Create a new skill
 * @param skillData Skill data
 * @returns Response with skill data or error
 */
export async function createSkill(skillData: Record<string, any>) {
  const { data, error } = await supabase
    .from('skills')
    .insert(skillData)
    .select()
    .single();
  
  return { data, error };
}

/**
 * Update an existing skill
 * @param skillId Skill ID
 * @param skillData Updated skill data
 * @returns Response with skill data or error
 */
export async function updateSkill(skillId: string, skillData: Record<string, any>) {
  const { data, error } = await supabase
    .from('skills')
    .update(skillData)
    .eq('id', skillId)
    .select()
    .single();
  
  return { data, error };
}

/**
 * Get a user's skills
 * @param userId User ID
 * @param isOffering Filter by offering (true) or seeking (false)
 * @returns Response with skills data or error
 */
export async function getUserSkills(userId: string, isOffering?: boolean) {
  let query = supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);
  
  if (isOffering !== undefined) {
    query = query.eq('is_offering', isOffering);
  }
  
  const { data, error } = await query;
  
  return { data, error };
}

/**
 * Search for skills
 * @param searchParams Search parameters
 * @returns Response with skills data or error
 */
export async function searchSkills(searchParams: {
  category?: string;
  query?: string;
  isOffering?: boolean;
  isRemoteFriendly?: boolean;
  limit?: number;
  offset?: number;
}) {
  const {
    category,
    query,
    isOffering,
    isRemoteFriendly,
    limit = 10,
    offset = 0,
  } = searchParams;
  
  // Start building the query
  let dbQuery = supabase
    .from('skills')
    .select('*, users!inner(id, full_name, profile_image_url, location_city, location_state)')
    .eq('is_active', true);
  
  // Apply filters if provided
  if (category) {
    dbQuery = dbQuery.eq('category', category);
  }
  
  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }
  
  if (isOffering !== undefined) {
    dbQuery = dbQuery.eq('is_offering', isOffering);
  }
  
  if (isRemoteFriendly !== undefined) {
    dbQuery = dbQuery.eq('is_remote_friendly', isRemoteFriendly);
  }
  
  // Add pagination
  dbQuery = dbQuery.range(offset, offset + limit - 1);
  
  // Execute the query
  const { data, error } = await dbQuery;
  
  return { data, error };
}

/**
 * Create a trade proposal
 * @param tradeData Trade data
 * @returns Response with trade data or error
 */
export async function createTrade(tradeData: Record<string, any>) {
  const { data, error } = await supabase
    .from('trades')
    .insert(tradeData)
    .select()
    .single();
  
  return { data, error };
}

/**
 * Update a trade's status
 * @param tradeId Trade ID
 * @param status New status
 * @param additionalData Additional data to update
 * @returns Response with trade data or error
 */
export async function updateTradeStatus(
  tradeId: string,
  status: string,
  additionalData: Record<string, any> = {}
) {
  const { data, error } = await supabase
    .from('trades')
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...additionalData,
    })
    .eq('id', tradeId)
    .select()
    .single();
  
  return { data, error };
}

/**
 * Get trades for a user
 * @param userId User ID
 * @param status Filter by status
 * @returns Response with trades data or error
 */
export async function getUserTrades(userId: string, status?: string) {
  let query = supabase
    .from('trades')
    .select(`
      *,
      proposer:proposer_id(id, full_name, profile_image_url),
      receiver:receiver_id(id, full_name, profile_image_url),
      skill_offered:skill_offered_id(*),
      skill_requested:skill_requested_id(*)
    `)
    .or(`proposer_id.eq.${userId},receiver_id.eq.${userId}`);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  return { data, error };
}

/**
 * Send a message in a trade
 * @param messageData Message data
 * @returns Response with message data or error
 */
export async function sendMessage(messageData: Record<string, any>) {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();
  
  return { data, error };
}

/**
 * Get messages for a trade
 * @param tradeId Trade ID
 * @returns Response with messages data or error
 */
export async function getTradeMessages(tradeId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(id, full_name, profile_image_url)
    `)
    .eq('trade_id', tradeId)
    .order('created_at', { ascending: true });
  
  return { data, error };
}

/**
 * Submit a rating for a completed trade
 * @param ratingData Rating data
 * @returns Response with rating data or error
 */
export async function submitRating(ratingData: Record<string, any>) {
  const { data, error } = await supabase
    .from('ratings')
    .insert(ratingData)
    .select()
    .single();
  
  return { data, error };
}

/**
 * Get ratings for a user
 * @param userId User ID
 * @returns Response with ratings data or error
 */
export async function getUserRatings(userId: string) {
  const { data, error } = await supabase
    .from('ratings')
    .select(`
      *,
      rater:rater_id(id, full_name, profile_image_url),
      trade:trade_id(id, completed_at)
    `)
    .eq('ratee_id', userId)
    .eq('is_public', true);
  
  return { data, error };
}

export default supabase;
