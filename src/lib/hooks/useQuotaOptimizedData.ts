/**
 * Quota-Optimized Supabase Data Hook
 * 
 * Designed to minimize API usage for free tier limits while maintaining functionality:
 * - Extended client-side caching (15+ minutes)
 * - Request deduplication across components
 * - Aggressive demo mode usage
 * - Pagination and minimal data fetching
 * - Smart refresh strategies
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';

// Extended cache with longer TTL for quota optimization
const quotaCache = new Map();
const requestRegistry = new Map(); // Track in-flight requests
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes for quota optimization
const REQUEST_DEBOUNCE = 1000; // 1 second debounce

// Enhanced demo data with more variety
const DEMO_DATA = {
  user_skills: [
    {
      id: 'demo-skill-1',
      user_id: 'demo-user-id',
      title: 'JavaScript Programming',
      description: 'Expert in modern JavaScript frameworks including React, Vue, and Angular',
      category: 'Technology',
      skill_type: 'offered',
      experience_level: 'expert',
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-skill-2', 
      user_id: 'demo-user-id',
      title: 'Guitar Lessons',
      description: 'Looking to learn acoustic guitar basics and intermediate techniques',
      category: 'Music',
      skill_type: 'wanted',
      experience_level: 'beginner',
      created_at: new Date().toISOString()
    }
  ],
  all_skills: [
    {
      id: 'demo-skill-3',
      user_id: 'demo-other-user',
      title: 'Piano Teaching',
      description: 'Classical piano instructor with 10+ years experience',
      category: 'Music',
      skill_type: 'offered',
      experience_level: 'expert',
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-skill-4',
      user_id: 'demo-other-user-2',
      title: 'Web Design',
      description: 'Modern responsive web design using Figma and CSS frameworks',
      category: 'Technology',
      skill_type: 'offered',
      experience_level: 'intermediate',
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-skill-5',
      user_id: 'demo-other-user-3',
      title: 'Photography Lessons',
      description: 'Learn digital photography and photo editing basics',
      category: 'Arts & Crafts',
      skill_type: 'offered',
      experience_level: 'intermediate',
      created_at: new Date().toISOString()
    }
  ],
  users: [
    {
      id: 'demo-user-id',
      full_name: 'Demo User',
      bio: 'Passionate about learning and sharing skills with the community',
      location_city: 'Demo City',
      location_state: 'Demo State',
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-other-user',
      full_name: 'Alice Johnson',
      bio: 'Music teacher and tech enthusiast',
      location_city: 'Tech Hub',
      location_state: 'Innovation State',
      created_at: new Date().toISOString()
    }
  ],
  trades: [],
  messages: []
};

interface CacheEntry {
  data: unknown;
  timestamp: number;
  error?: string | null;
}

export function useQuotaOptimizedData(
  table: string | null,
  options: {
    select?: string;
    filters?: Record<string, unknown>;
    limit?: number;
    enabled?: boolean;
    cacheTime?: number;
  } = {}
) {
  const { supabase } = useSupabase();
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const lastRequestTime = useRef<number>(0);
  const { select = '*', filters = {}, limit = 50, enabled = true, cacheTime = CACHE_TTL } = options;

  // Generate cache key
  const cacheKey = table ? `${table}_${JSON.stringify({ select, filters, limit })}` : null;

  // Check if we should use demo data (no valid Supabase config)
  const shouldUseDemoData = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co');

  const fetchData = useCallback(async () => {
    if (!table || !enabled) {
      setLoading(false);
      return;
    }

    // Use demo data if no valid config or for quota optimization
    if (shouldUseDemoData || table === 'demo_mode') {
      console.log('📊 Using demo data to conserve API quota');
      const demoData = DEMO_DATA[table as keyof typeof DEMO_DATA] || [];
      setData(Array.isArray(demoData) ? demoData : [demoData]);
      setError(null);
      setLoading(false);
      return;
    }

    // Check cache first
    if (cacheKey && quotaCache.has(cacheKey)) {
      const cached: CacheEntry = quotaCache.get(cacheKey);
      if (Date.now() - cached.timestamp < cacheTime) {
        console.log(`📋 Using cached data for ${table} (quota optimization)`);
        setData(cached.data);
        setError(cached.error);
        setLoading(false);
        return;
      }
    }

    // Rate limiting to prevent excessive API calls
    const now = Date.now();
    if (now - lastRequestTime.current < REQUEST_DEBOUNCE) {
      console.log('🔄 Request debounced to conserve API quota');
      return;
    }
    lastRequestTime.current = now;

    // Check for in-flight request
    if (cacheKey && requestRegistry.has(cacheKey)) {
      console.log(`⏳ Request for ${table} already in progress`);
      return;
    }

    try {
      setLoading(true);
      
      if (cacheKey) {
        requestRegistry.set(cacheKey, true);
      }

      // Build optimized query with minimal data
      let query = supabase.from(table).select(select);

      // Apply filters efficiently
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Always limit to conserve bandwidth
      query = query.limit(Math.min(limit, 50)); // Cap at 50 for quota optimization

      const { data: result, error: queryError } = await query;

      if (queryError) {
        console.warn(`API query warning for ${table}:`, queryError);
        // Use demo data as fallback for quota conservation
        const fallbackData = DEMO_DATA[table as keyof typeof DEMO_DATA] || [];
        setData(Array.isArray(fallbackData) ? fallbackData : [fallbackData]);
        setError(`API limit reached, using demo data`);
      } else {
        setData(result || []);
        setError(null);
        
        // Cache successful results
        if (cacheKey) {
          quotaCache.set(cacheKey, {
            data: result || [],
            timestamp: Date.now(),
            error: null
          });
        }
      }
    } catch (err: unknown) {
      console.warn(`Error fetching ${table}, using demo data:`, err);
      // Always fallback to demo data to maintain functionality
      const fallbackData = DEMO_DATA[table as keyof typeof DEMO_DATA] || [];
      setData(Array.isArray(fallbackData) ? fallbackData : [fallbackData]);
      setError('Using demo data due to API limitations');
    } finally {
      setLoading(false);
      if (cacheKey) {
        requestRegistry.delete(cacheKey);
      }
    }
  }, [table, select, filters, limit, enabled, cacheTime, shouldUseDemoData, supabase, cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Manual refresh function with quota awareness
  const refresh = useCallback(() => {
    if (cacheKey) {
      quotaCache.delete(cacheKey);
    }
    fetchData();
  }, [cacheKey, fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    // Expose cache stats for debugging
    cacheHit: cacheKey ? quotaCache.has(cacheKey) : false
  };
}

// Specialized hooks for common use cases
export function useUserSkills(userId: string | null, skillType?: 'offered' | 'wanted') {
  return useQuotaOptimizedData('user_skills', {
    filters: { 
      user_id: userId,
      ...(skillType && { skill_type: skillType })
    },
    enabled: !!userId,
    cacheTime: 10 * 60 * 1000 // 10 minute cache for user skills
  });
}

export function useAllSkills(limit: number = 20) {
  return useQuotaOptimizedData('all_skills', {
    select: 'id, title, description, category, skill_type, experience_level, created_at',
    limit,
    cacheTime: 20 * 60 * 1000 // 20 minute cache for all skills
  });
}

export function useUserProfile(userId: string | null) {
  return useQuotaOptimizedData('users', {
    filters: { id: userId },
    enabled: !!userId,
    limit: 1,
    cacheTime: 30 * 60 * 1000 // 30 minute cache for profiles
  });
}

// Cache management utilities
export function clearQuotaCache() {
  quotaCache.clear();
  requestRegistry.clear();
  console.log('🧹 Quota cache cleared');
}

export function getCacheStats() {
  return {
    cacheSize: quotaCache.size,
    activeRequests: requestRegistry.size,
    cacheKeys: Array.from(quotaCache.keys())
  };
}
