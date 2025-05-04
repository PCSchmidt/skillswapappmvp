/**
 * Cached Supabase Client for SkillSwap
 *
 * This file extends the basic Supabase client with caching capabilities
 * to improve performance and reduce database load.
 */

import { queryCache, cachedFetch } from '../cache/queryCacheService';
import * as supabaseClient from './client';
import { supabase } from './client';

// Cache expiry times in milliseconds
const CACHE_TIMES = {
  SHORT: 1 * 60 * 1000,  // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000,  // 30 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
};

// Re-export the base supabase client
export { supabase, getCurrentUser, signUp, signIn, signOut } from './client';

/**
 * Get a user profile by ID with caching
 * @param userId User ID
 * @returns Response with profile data or error
 */
export async function getProfileCached(userId: string) {
  return cachedFetch(
    `profile:${userId}`,
    () => supabaseClient.getProfile(userId),
    { expiry: CACHE_TIMES.MEDIUM }
  );
}

/**
 * Get a user's skills with caching
 * @param userId User ID
 * @param isOffering Filter by offering (true) or seeking (false)
 * @returns Response with skills data or error
 */
export async function getUserSkillsCached(userId: string, isOffering?: boolean) {
  const cacheKey = `userSkills:${userId}:${isOffering !== undefined ? (isOffering ? 'offering' : 'seeking') : 'all'}`;
  
  return cachedFetch(
    cacheKey,
    () => supabaseClient.getUserSkills(userId, isOffering),
    { expiry: CACHE_TIMES.MEDIUM }
  );
}

/**
 * Search for skills with caching for common searches
 * @param searchParams Search parameters
 * @returns Response with skills data or error
 */
export async function searchSkillsCached(searchParams: {
  category?: string;
  query?: string;
  isOffering?: boolean;
  isRemoteFriendly?: boolean;
  limit?: number;
  offset?: number;
}) {
  // Don't cache searches with specific text queries (too unique)
  if (searchParams.query) {
    return supabaseClient.searchSkills(searchParams);
  }
  
  // Create cache key based on search parameters
  const cacheKey = `skillsSearch:${JSON.stringify({
    category: searchParams.category || 'all',
    isOffering: searchParams.isOffering,
    isRemoteFriendly: searchParams.isRemoteFriendly,
    limit: searchParams.limit || 10,
    offset: searchParams.offset || 0,
  })}`;
  
  return cachedFetch(
    cacheKey,
    () => supabaseClient.searchSkills(searchParams),
    { expiry: CACHE_TIMES.SHORT }
  );
}

/**
 * Get trades for a user with caching
 * @param userId User ID
 * @param status Filter by status
 * @returns Response with trades data or error
 */
export async function getUserTradesCached(userId: string, status?: string) {
  const cacheKey = `userTrades:${userId}:${status || 'all'}`;
  
  // Use shorter cache for active trades, longer for completed/cancelled
  const expiry = status === 'completed' || status === 'cancelled' 
    ? CACHE_TIMES.LONG 
    : CACHE_TIMES.SHORT;
  
  return cachedFetch(
    cacheKey,
    () => supabaseClient.getUserTrades(userId, status),
    { expiry }
  );
}

/**
 * Get messages for a trade with caching
 * @param tradeId Trade ID
 * @returns Response with messages data or error
 */
export async function getTradeMessagesCached(tradeId: string) {
  // Short cache time for messages since they're frequently updated
  return cachedFetch(
    `tradeMessages:${tradeId}`,
    () => supabaseClient.getTradeMessages(tradeId),
    { expiry: CACHE_TIMES.SHORT }
  );
}

/**
 * Get ratings for a user with caching
 * @param userId User ID
 * @returns Response with ratings data or error
 */
export async function getUserRatingsCached(userId: string) {
  // Longer cache time for ratings since they don't change often
  return cachedFetch(
    `userRatings:${userId}`,
    () => supabaseClient.getUserRatings(userId),
    { expiry: CACHE_TIMES.LONG }
  );
}

/**
 * Invalidate all user-related caches when user data changes
 * @param userId User ID
 */
export function invalidateUserCaches(userId: string) {
  queryCache.removeByPrefix(`profile:${userId}`);
  queryCache.removeByPrefix(`userSkills:${userId}`);
  queryCache.removeByPrefix(`userTrades:${userId}`);
  queryCache.removeByPrefix(`userRatings:${userId}`);
}

/**
 * Invalidate all skill-related caches when skill data changes
 * @param skillId Skill ID (optional, if not provided all skill caches are invalidated)
 */
export function invalidateSkillCaches(skillId?: string) {
  if (skillId) {
    // Invalidate specific skill
    queryCache.removeByPrefix(`skill:${skillId}`);
  } else {
    // Invalidate all skill search results
    queryCache.removeByPrefix('skillsSearch:');
  }
}

/**
 * Invalidate all trade-related caches when trade data changes
 * @param tradeId Trade ID
 * @param userIds Array of user IDs involved in the trade
 */
export function invalidateTradeCaches(tradeId: string, userIds: string[]) {
  // Invalidate specific trade
  queryCache.removeByPrefix(`trade:${tradeId}`);
  queryCache.removeByPrefix(`tradeMessages:${tradeId}`);
  
  // Invalidate user trades for all involved users
  for (const userId of userIds) {
    queryCache.removeByPrefix(`userTrades:${userId}`);
  }
}

/**
 * Invalidate message caches for a trade
 * @param tradeId Trade ID
 */
export function invalidateMessageCaches(tradeId: string) {
  queryCache.removeByPrefix(`tradeMessages:${tradeId}`);
}

/**
 * Create a new skill with cache invalidation
 * @param skillData Skill data
 * @returns Response with skill data or error
 */
export async function createSkillWithCache(skillData: Record<string, any>) {
  const result = await supabaseClient.createSkill(skillData);
  
  if (!result.error && result.data) {
    // Invalidate skill caches
    invalidateSkillCaches();
    
    // Invalidate user skill caches
    invalidateUserCaches(skillData.user_id);
  }
  
  return result;
}

/**
 * Update an existing skill with cache invalidation
 * @param skillId Skill ID
 * @param skillData Updated skill data
 * @returns Response with skill data or error
 */
export async function updateSkillWithCache(skillId: string, skillData: Record<string, any>) {
  const result = await supabaseClient.updateSkill(skillId, skillData);
  
  if (!result.error && result.data) {
    // Invalidate skill caches
    invalidateSkillCaches(skillId);
    invalidateSkillCaches(); // Also invalidate skill searches
    
    // Invalidate user skill caches
    if (result.data.user_id) {
      invalidateUserCaches(result.data.user_id);
    }
  }
  
  return result;
}

/**
 * Create a trade proposal with cache invalidation
 * @param tradeData Trade data
 * @returns Response with trade data or error
 */
export async function createTradeWithCache(tradeData: Record<string, any>) {
  const result = await supabaseClient.createTrade(tradeData);
  
  if (!result.error && result.data) {
    // Invalidate trade caches for involved users
    invalidateTradeCaches(
      result.data.id,
      [tradeData.proposer_id, tradeData.receiver_id]
    );
  }
  
  return result;
}

/**
 * Update a trade's status with cache invalidation
 * @param tradeId Trade ID
 * @param status New status
 * @param additionalData Additional data to update
 * @returns Response with trade data or error
 */
export async function updateTradeStatusWithCache(
  tradeId: string,
  status: string,
  additionalData: Record<string, any> = {}
) {
  const result = await supabaseClient.updateTradeStatus(tradeId, status, additionalData);
  
  if (!result.error && result.data) {
    // Invalidate trade caches for involved users
    invalidateTradeCaches(
      tradeId,
      [result.data.proposer_id, result.data.receiver_id]
    );
    
    // For completed trades, also invalidate ratings
    if (status === 'completed') {
      invalidateUserCaches(result.data.proposer_id);
      invalidateUserCaches(result.data.receiver_id);
    }
  }
  
  return result;
}

/**
 * Send a message in a trade with cache invalidation
 * @param messageData Message data
 * @returns Response with message data or error
 */
export async function sendMessageWithCache(messageData: Record<string, any>) {
  const result = await supabaseClient.sendMessage(messageData);
  
  if (!result.error && result.data) {
    // Invalidate message caches
    invalidateMessageCaches(messageData.trade_id);
  }
  
  return result;
}

/**
 * Submit a rating for a completed trade with cache invalidation
 * @param ratingData Rating data
 * @returns Response with rating data or error
 */
export async function submitRatingWithCache(ratingData: Record<string, any>) {
  const result = await supabaseClient.submitRating(ratingData);
  
  if (!result.error && result.data) {
    // Invalidate rating caches
    invalidateUserCaches(ratingData.ratee_id);
    
    // Also invalidate trade cache
    invalidateTradeCaches(ratingData.trade_id, [ratingData.rater_id, ratingData.ratee_id]);
  }
  
  return result;
}
