/**
 * Optimized Supabase Data Hook with Caching
 * 
 * Reduces API calls by:
 * - Client-side caching with TTL
 * - Demo mode support
 * - Request deduplication
 * - Minimal data fetching
 */

import { useState, useEffect, useRef } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';

// Simple client-side cache with TTL
const dataCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Demo data for different types
const DEMO_DATA = {
  user_skills: [
    {
      id: 'demo-skill-1',
      user_id: 'demo-user-id',
      title: 'JavaScript Programming',
      description: 'Expert in modern JavaScript frameworks',
      category: 'Technology',
      skill_type: 'offered',
      experience_level: 'expert',
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-skill-2', 
      user_id: 'demo-user-id',
      title: 'Guitar Lessons',
      description: 'Looking to learn acoustic guitar',
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
      description: 'Classical piano instructor with 10 years experience',
      category: 'Music',
      skill_type: 'offered',
      experience_level: 'expert',
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-skill-4',
      user_id: 'demo-other-user-2',
      title: 'Web Design',
      description: 'Modern responsive web design',
      category: 'Technology',
      skill_type: 'offered',
      experience_level: 'intermediate',
      created_at: new Date().toISOString()
    }
  ],
  trades: [
    {
      id: 'demo-trade-1',
      proposer_id: 'demo-user-id',
      receiver_id: 'demo-other-user',
      status: 'proposed',
      created_at: new Date().toISOString()
    }
  ],
  messages: [
    {
      id: 'demo-message-1',
      sender_id: 'demo-other-user',
      receiver_id: 'demo-user-id',
      content: 'Hi! I\'m interested in your JavaScript skills.',
      is_read: false,
      created_at: new Date().toISOString()
    }
  ]
};

// Check if we have valid Supabase configuration
const hasValidConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return supabaseUrl && supabaseAnonKey && 
    supabaseUrl.includes('supabase.co') && 
    supabaseAnonKey.length > 50;
};

interface UseOptimizedDataOptions {
  table: string;
  select?: string;
  filters?: Record<string, unknown>;
  dependencies?: unknown[];
  enabled?: boolean;
  cacheKey?: string;
}

export function useOptimizedData<T = unknown>({
  table,
  select = '*',
  filters = {},
  dependencies = [],
  enabled = true,
  cacheKey
}: UseOptimizedDataOptions) {
  const { supabase, user } = useSupabase();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      // Generate cache key
      const defaultCacheKey = `${table}_${JSON.stringify(filters)}_${select}`;
      const finalCacheKey = cacheKey || defaultCacheKey;

      // Check cache first
      const cached = dataCache.get(finalCacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      // Check if we should use demo mode
      if (!hasValidConfig()) {
        console.log(`📍 Demo mode: Using mock data for ${table}`);
        
        // Get demo data based on table
        let demoData = DEMO_DATA[table as keyof typeof DEMO_DATA] || [];
        
        // Apply basic filtering for demo data (safer approach)
        if (filters.user_id && table === 'user_skills') {
          demoData = (demoData as typeof DEMO_DATA.user_skills).filter(item => item.user_id === filters.user_id);
        }
        
        // Cache demo data
        dataCache.set(finalCacheKey, {
          data: demoData,
          timestamp: Date.now()
        });
        
        setData(demoData as T);
        setLoading(false);
        setError(null);
        return;
      }

      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      setError(null);

      try {
        // Build query
        let query = supabase.from(table).select(select);
        
        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });

        const { data: result, error: queryError } = await query;

        if (queryError) {
          throw queryError;
        }

        // Cache successful result
        dataCache.set(finalCacheKey, {
          data: result,
          timestamp: Date.now()
        });

        setData(result as T);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error(`Error fetching ${table}:`, err);
          setError(err.message || 'Failed to fetch data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [table, select, enabled, user?.id, cacheKey, JSON.stringify(filters), JSON.stringify(dependencies)]);

  return { data, loading, error };
}

// Specialized hooks for common use cases
export function useUserSkills(userId?: string) {
  return useOptimizedData({
    table: 'user_skills',
    select: 'id, title, description, category, skill_type, experience_level, created_at',
    filters: { user_id: userId },
    enabled: !!userId,
    cacheKey: `user_skills_${userId}`
  });
}

export function useAllSkills() {
  return useOptimizedData({
    table: 'all_skills',
    select: 'id, title, description, category, skill_type, experience_level, user_id, created_at',
    cacheKey: 'all_skills_browse'
  });
}

export function useUserTrades(userId?: string) {
  return useOptimizedData({
    table: 'trades',
    select: 'id, status, created_at',
    filters: { user_id: userId },
    enabled: !!userId,
    cacheKey: `user_trades_${userId}`
  });
}

export function useUnreadMessages(userId?: string) {
  return useOptimizedData({
    table: 'messages',
    select: 'id, created_at',
    filters: { receiver_id: userId, is_read: false },
    enabled: !!userId,
    cacheKey: `unread_messages_${userId}`
  });
}

// Clear cache function for after mutations
export function clearDataCache(pattern?: string) {
  if (pattern) {
    // Clear entries matching pattern
    Array.from(dataCache.keys()).forEach(key => {
      if (key.includes(pattern)) {
        dataCache.delete(key);
      }
    });
  } else {
    // Clear all cache
    dataCache.clear();
  }
}
