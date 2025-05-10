/**
 * Central data fetching module for SkillSwap
 * 
 * This module exports all data fetching hooks and utilities
 * to provide a unified interface for data access throughout the application.
 */

// Re-export SWR configuration
export { 
  ConfiguredSWRConfig,
  defaultSWRConfig,
  getFullSWRConfig,
  cachePersistor
} from '../hooks/useSWRConfig';

// Re-export all fetcher functions
export {
  defaultFetcher,
  supabaseFetcher,
  authFetcher,
  timeoutFetcher,
  offlineFetcher
} from '../hooks/useSWRFetcher';

// Re-export general data hooks
export {
  useData,
  useAutoRefreshData,
  useCriticalData,
  useStaticData,
  useConditionalData,
  useAuthenticatedData
} from '../hooks/useData';

// Re-export Supabase data hooks with their types
export {
  useSupabaseData,
  useSupabaseRecord,
  useRealtimeSupabaseData,
  useStaticSupabaseData,
  type SupabaseQueryParams,
  type SupabaseQueryOptions
} from '../hooks/useSupabaseData';

/**
 * API endpoints for the application
 * Centralizing API paths helps maintain consistency and makes updates easier
 */
export const API_ENDPOINTS = {
  // User related endpoints
  USER: {
    PROFILE: '/api/user/profile',
    SETTINGS: '/api/user/settings',
    NOTIFICATIONS: '/api/user/notifications',
  },
  
  // Skills related endpoints
  SKILLS: {
    LIST: '/api/skills',
    DETAIL: (id: string) => `/api/skills/${id}`,
    CATEGORIES: '/api/skills/categories',
    FEATURED: '/api/skills/featured',
  },
  
  // Matching related endpoints
  MATCHING: {
    RECOMMENDATIONS: '/api/matching/recommendations',
    MATCHES: '/api/matching/matches',
    ACCEPT: (id: string) => `/api/matching/${id}/accept`,
    DECLINE: (id: string) => `/api/matching/${id}/decline`,
  },
  
  // Messaging related endpoints
  MESSAGING: {
    CONVERSATIONS: '/api/messaging/conversations',
    MESSAGES: (conversationId: string) => `/api/messaging/conversations/${conversationId}/messages`,
    SEND: '/api/messaging/send',
  },
  
  // Reviews related endpoints
  REVIEWS: {
    LIST: '/api/reviews',
    CREATE: '/api/reviews/create',
    USER: (userId: string) => `/api/reviews/user/${userId}`,
  },
  
  // Email and notification endpoints
  NOTIFICATIONS: {
    SETTINGS: '/api/notifications/settings',
    MARK_READ: '/api/notifications/mark-read',
    SUBSCRIBE: '/api/notifications/subscribe',
  },
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SIGNUP: '/api/auth/signup',
    VERIFY: '/api/auth/verify',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
};

/**
 * Table names for Supabase data access
 * Centralizing table names helps maintain consistency and makes updates easier
 */
export const DB_TABLES = {
  USERS: 'users',
  PROFILES: 'profiles',
  SKILLS: 'skills',
  USER_SKILLS: 'user_skills',
  SKILL_CATEGORIES: 'skill_categories',
  MATCHES: 'matches',
  MATCH_STATUS: 'match_status',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  USER_NOTIFICATION_SETTINGS: 'user_notification_settings',
  EMAIL_TEMPLATES: 'email_templates',
  EMAIL_PREFERENCES: 'email_preferences',
};

/**
 * Default cache configuration for different data types
 */
export const CACHE_CONFIG = {
  // Static data that rarely changes
  STATIC: {
    dedupingInterval: 3600000, // 1 hour
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0, // No auto refresh
  },
  
  // Regular data that changes occasionally
  REGULAR: {
    dedupingInterval: 60000, // 1 minute
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0, // No auto refresh
  },
  
  // Real-time data that changes frequently
  REALTIME: {
    dedupingInterval: 5000, // 5 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 15000, // Refresh every 15 seconds
  },
  
  // Critical data that must be fresh
  CRITICAL: {
    dedupingInterval: 2000, // 2 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 10000, // Refresh every 10 seconds
    errorRetryCount: 5,
  },
};
