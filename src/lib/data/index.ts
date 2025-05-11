/**
 * Central data fetching module for SkillSwap
 * 
 * This module exports all data fetching hooks and utilities
 * to provide a unified interface for data access throughout the application.
 */

// Import and re-export SWR configuration
import { SWRProvider, SWR_DEFAULT_CONFIG } from '../hooks/useSWRConfig';
import SWRConfigOptions from '../hooks/useSWRConfigOptions';
export { SWRProvider, SWR_DEFAULT_CONFIG };
export type { SWRConfigOptions };

// Re-export SWR fetcher
export {
  useSWRFetcher,
  FetchError
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

// Export optimistic UI update hook
export {
  useOptimisticUpdate
} from '../hooks/useOptimisticUpdate';

// Export offline support hook
export {
  useOfflineSupport
} from '../hooks/useOfflineSupport';

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
    CREATE: '/api/skills/create',
    UPDATE: (id: string) => `/api/skills/${id}/update`,
    DELETE: (id: string) => `/api/skills/${id}/delete`,
  },
  
  // Matching related endpoints
  MATCHING: {
    RECOMMENDATIONS: '/api/matching/recommendations',
    MATCHES: '/api/matching/matches',
    ACCEPT: (id: string) => `/api/matching/${id}/accept`,
    DECLINE: (id: string) => `/api/matching/${id}/decline`,
    CANCEL: (id: string) => `/api/matching/${id}/cancel`,
  },
  
  // Messaging related endpoints
  MESSAGING: {
    CONVERSATIONS: '/api/messaging/conversations',
    MESSAGES: (conversationId: string) => `/api/messaging/conversations/${conversationId}/messages`,
    SEND: '/api/messaging/send',
    READ: (messageId: string) => `/api/messaging/messages/${messageId}/read`,
  },
  
  // Reviews related endpoints
  REVIEWS: {
    LIST: '/api/reviews',
    CREATE: '/api/reviews/create',
    USER: (userId: string) => `/api/reviews/user/${userId}`,
    UPDATE: (id: string) => `/api/reviews/${id}/update`,
    DELETE: (id: string) => `/api/reviews/${id}/delete`,
  },
  
  // Email and notification endpoints
  NOTIFICATIONS: {
    SETTINGS: '/api/notifications/settings',
    MARK_READ: '/api/notifications/mark-read',
    SUBSCRIBE: '/api/notifications/subscribe',
    UNSUBSCRIBE: (type: string) => `/api/notifications/unsubscribe/${type}`,
  },
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SIGNUP: '/api/auth/signup',
    VERIFY: '/api/auth/verify',
    RESET_PASSWORD: '/api/auth/reset-password',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
  
  // Profile endpoints
  PROFILE: {
    UPDATE: '/api/profile/update',
    AVATAR: '/api/profile/avatar',
    PREFERENCES: '/api/profile/preferences',
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
  USER_SESSIONS: 'user_sessions',
  USER_PREFERENCES: 'user_preferences',
  ACTIVITY_LOG: 'activity_log',
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
  
  // User profile data (sensitive and personalized)
  USER_PROFILE: {
    dedupingInterval: 300000, // 5 minutes
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0, // No auto refresh
    errorRetryCount: 3,
  },
  
  // Public data that can be cached aggressively
  PUBLIC: {
    dedupingInterval: 43200000, // 12 hours
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0, // No auto refresh
  },
  
  // Notification data that needs to be fresh
  NOTIFICATIONS: {
    dedupingInterval: 10000, // 10 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // Refresh every 30 seconds
    errorRetryCount: 3,
  },
};

/**
 * Offline data configuration
 * Defines how long different types of data can be used from cache when offline
 */
export const OFFLINE_DATA_CONFIG = {
  // User profile can be used for up to 7 days when offline
  USER_PROFILE: 7 * 24 * 60 * 60 * 1000,
  
  // Skills catalog can be used for up to 30 days when offline
  SKILLS_CATALOG: 30 * 24 * 60 * 60 * 1000,
  
  // Conversations history can be used for up to 14 days
  CONVERSATIONS: 14 * 24 * 60 * 60 * 1000,
  
  // Matches data can be used for up to 7 days
  MATCHES: 7 * 24 * 60 * 60 * 1000,
  
  // Default max age for any data not specifically configured (1 day)
  DEFAULT: 24 * 60 * 60 * 1000,
};
