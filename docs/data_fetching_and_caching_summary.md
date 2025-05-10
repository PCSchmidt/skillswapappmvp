# Data Fetching and Caching System for SkillSwap

This document provides an overview of the data fetching and caching architecture implemented in the SkillSwap application. The system is designed to improve application performance, reduce server load, and enhance the user experience through optimized data management.

## Architecture Overview

The data fetching system is built with three key layers:

1. **Core Fetching Layer**: Based on SWR (stale-while-revalidate) for efficient caching and revalidation
2. **Specialized Hooks**: Custom hooks tailored for specific data access patterns
3. **Unified Interface**: A centralized API for consistent data access throughout the application

### Directory Structure

```
src/
└── lib/
    ├── data/
    │   └── index.ts         // Central export point and configuration
    ├── hooks/
    │   ├── useSWRConfig.tsx // SWR configuration provider
    │   ├── useSWRFetcher.ts // Standard fetcher functions
    │   ├── useData.ts       // General data fetching hooks
    │   └── useSupabaseData.ts // Supabase-specific data hooks
```

## Key Components

### 1. SWR Configuration (useSWRConfig.tsx)

Provides application-wide configuration for SWR, including:

- Default fetcher function
- Revalidation strategies
- Error handling and retry logic
- Cache persistence configuration using localforage

### 2. Fetcher Functions (useSWRFetcher.ts)

A collection of specialized fetcher functions for different use cases:

- `defaultFetcher`: Standard JSON fetcher with error handling
- `supabaseFetcher`: Fetcher optimized for Supabase API endpoints
- `authFetcher`: Fetcher that includes authentication tokens
- `timeoutFetcher`: Fetcher with customizable timeout handling
- `offlineFetcher`: Fetcher with offline support using localStorage

### 3. General Data Hooks (useData.ts)

Generic data hooks for different data access patterns:

- `useData`: Base hook with default SWR configuration
- `useAutoRefreshData`: For data that needs periodic refresh
- `useCriticalData`: For high-priority data with aggressive revalidation
- `useStaticData`: For rarely changing data with longer cache durations
- `useConditionalData`: For data that should only be fetched conditionally
- `useAuthenticatedData`: For data that requires user authentication

### 4. Supabase Data Hooks (useSupabaseData.ts)

Specialized hooks for Supabase database access:

- `useSupabaseData`: For fetching lists of data from Supabase tables
- `useSupabaseRecord`: For fetching a single record by ID
- `useRealtimeSupabaseData`: For data that should update in real-time
- `useStaticSupabaseData`: For infrequently changing Supabase data

### 5. Unified Data Interface (data/index.ts)

A centralized module that:

- Re-exports all data hooks and utilities
- Defines API endpoints as constants
- Defines database table names
- Provides pre-configured cache settings for different data types

## Caching Strategy

The application implements a multi-layer caching strategy:

### 1. Memory Cache (SWR)

- In-memory caching for the current session
- Automatic revalidation based on configurable triggers
- Deduplication of simultaneous requests

### 2. Persistent Cache (localforage)

- Browser storage-based persistence between sessions
- Automatic serialization and deserialization of cached data
- Configurable TTL (time-to-live) for cached items

### 3. Offline Support

- Fallback to cached data when offline
- Automatic revalidation when connection is restored
- Visual indicators for data freshness

## Caching Configuration Presets

The system provides several pre-configured cache settings for different data types:

- **Static**: For data that rarely changes (e.g., skill categories)
  - Long deduping intervals (1 hour)
  - No automatic revalidation

- **Regular**: For data that changes occasionally (e.g., user profiles)
  - Medium deduping intervals (1 minute)
  - Revalidation on focus and reconnect

- **Realtime**: For frequently changing data (e.g., messages)
  - Short deduping intervals (5 seconds)
  - Frequent refresh interval (15 seconds)

- **Critical**: For mission-critical data (e.g., match status)
  - Very short deduping intervals (2 seconds)
  - More aggressive retry strategy
  - Frequent refresh interval (10 seconds)

## API Endpoint Management

API endpoints are centralized in the data module as constants, grouped by feature area:

- USER: User profile and settings endpoints
- SKILLS: Skill listing and management endpoints
- MATCHING: Match recommendation and management endpoints
- MESSAGING: Conversation and message endpoints
- REVIEWS: User review endpoints
- NOTIFICATIONS: Notification management endpoints
- AUTH: Authentication-related endpoints

## Database Table Management

Similarly, database table names are centralized for consistent access:

- USERS, PROFILES: User data tables
- SKILLS, USER_SKILLS, SKILL_CATEGORIES: Skill-related tables
- MATCHES, MATCH_STATUS: Matching system tables
- MESSAGES, CONVERSATIONS: Messaging system tables
- REVIEWS: User review tables
- NOTIFICATIONS, USER_NOTIFICATION_SETTINGS: Notification system tables
- EMAIL_TEMPLATES, EMAIL_PREFERENCES: Email system tables

## Usage Examples

### Basic Data Fetching

```tsx
import { useData, API_ENDPOINTS } from '@/lib/data';

function SkillsList() {
  const { data, error, isLoading } = useData(API_ENDPOINTS.SKILLS.LIST);
  
  if (isLoading) return <SkillsListSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <SkillsGrid skills={data} />;
}
```

### Supabase Data Fetching

```tsx
import { useSupabaseData, DB_TABLES } from '@/lib/data';

function UserSkillsList({ userId }) {
  const { data, error, isLoading } = useSupabaseData({
    table: DB_TABLES.USER_SKILLS,
    match: { user_id: userId },
    order: { column: 'created_at', ascending: false }
  });
  
  // Render component with data...
}
```

### Real-time Data

```tsx
import { useRealtimeSupabaseData, DB_TABLES } from '@/lib/data';

function ConversationMessages({ conversationId }) {
  const { data, error, isLoading, isRealtime } = useRealtimeSupabaseData({
    table: DB_TABLES.MESSAGES,
    match: { conversation_id: conversationId },
    order: { column: 'created_at', ascending: true }
  });
  
  // Render real-time messages...
}
```

### Cached Static Data

```tsx
import { useStaticData, API_ENDPOINTS, CACHE_CONFIG } from '@/lib/data';

function SkillCategories() {
  const { data } = useStaticData(
    API_ENDPOINTS.SKILLS.CATEGORIES,
    CACHE_CONFIG.STATIC
  );
  
  // Render categories that rarely change...
}
```

## Benefits

This data fetching and caching architecture provides several key benefits:

1. **Performance**: Efficient caching reduces network requests and improves response times
2. **Consistency**: Centralized data access patterns ensure consistent handling throughout the app
3. **Offline Support**: Graceful degradation when network connectivity is lost
4. **Real-time Updates**: Support for real-time data synchronization
5. **Developer Experience**: Simple, declarative data fetching with minimal boilerplate
6. **Maintainability**: Separation of concerns between data access and UI components
7. **Type Safety**: Full TypeScript support for data structures and API endpoints

## Future Improvements

Potential areas for enhancement:

1. **Prefetching**: Implement data prefetching for anticipated user navigation
2. **Cache Synchronization**: Ensure consistency across tabs/windows
3. **Server-Side Rendering**: Improve integration with Next.js SSR
4. **Analytics**: Add telemetry for cache hit rates and performance metrics
5. **Cache Invalidation**: More granular cache invalidation strategies
