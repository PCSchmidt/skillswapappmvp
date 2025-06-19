# Data Fetching and Caching Strategy

This document outlines the data fetching and caching strategy for the SkillSwap MVP application to improve performance, reduce server load, and enhance the user experience.

## Goals

- Reduce API calls and database load through effective caching
- Minimize loading spinners and improve perceived performance
- Implement optimistic UI updates for common actions
- Handle offline scenarios gracefully
- Ensure data consistency across the application
- Support real-time updates for collaborative features

## Technical Approach

### 1. SWR Implementation

We'll implement the SWR (stale-while-revalidate) pattern using the SWR library for React:

```jsx
import useSWR from 'swr'

function SkillsList() {
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/skills', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    focusThrottleInterval: 10000,
    errorRetryCount: 3
  })

  if (isLoading) return <SkillsListSkeleton />
  if (error) return <ErrorDisplay error={error} />
  
  return (
    <div>
      {isValidating && <SyncIndicator />}
      <SkillGrid skills={data} />
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  )
}
```

### 2. Custom Cache Configuration

We'll implement custom cache configurations based on data type and usage patterns:

| Data Type | Cache Duration | Revalidation Strategy | Auto Refresh | Notes |
|-----------|---------------|----------------------|--------------|-------|
| User profile | 1 hour | On focus, on reconnect | No | Personal data, moderate refresh |
| Skills catalog | 24 hours | Background refresh | Every 12h | Relatively static data |
| Search results | 15 minutes | On query change | No | Query-dependent cache |
| Notifications | None (no-cache) | On focus, every 60s | Yes | Real-time importance |
| User matches | 5 minutes | On focus, on reconnect | Every 5m | Semi-real-time importance |
| Dashboard stats | 1 hour | On focus | Every 30m | Analytics data, moderate refresh |

### 3. Global Cache Configuration

```jsx
// In _app.tsx or a custom provider
import { SWRConfig } from 'swr'

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig 
      value={{
        fetcher: async (url) => {
          const res = await fetch(url)
          if (!res.ok) {
            const error = new Error('An error occurred while fetching the data.')
            error.info = await res.json()
            error.status = res.status
            throw error
          }
          return res.json()
        },
        dedupingInterval: 10000,
        focusThrottleInterval: 5000,
        onError: (error, key) => {
          // Log errors to monitoring service
          if (error.status !== 403 && error.status !== 404) {
            logError(error, key)
          }
        },
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: (retryCount) => Math.min(1000 * 2 ** retryCount, 30000),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  )
}
```

### 4. Optimistic UI Updates

For a responsive feel, we'll implement optimistic updates for common actions:

```jsx
function AddSkillButton({ userId }) {
  const { data, mutate } = useSWR(`/api/users/${userId}/skills`, fetcher)
  
  const addSkill = async (newSkill) => {
    // Optimistically update the local data immediately
    const optimisticData = [...data, { ...newSkill, id: 'temp-id', status: 'saving' }]
    
    // Update the local cache with the optimistic data
    mutate(optimisticData, false)
    
    try {
      // Send the request to the API
      const result = await fetch(`/api/users/${userId}/skills`, {
        method: 'POST',
        body: JSON.stringify(newSkill),
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json())
      
      // Update the local cache with the actual data from the server
      mutate()
      
      return result
    } catch (error) {
      // If the request fails, roll back to the previous data
      mutate(data, false)
      throw error
    }
  }
  
  return <button onClick={() => addSkill({ name: 'New Skill' })}>Add Skill</button>
}
```

### 5. Preloading and Prefetching

We'll implement preloading for critical data and prefetching for likely user paths:

```jsx
// Preload on component mount
useEffect(() => {
  // Preload user data that will likely be needed soon
  mutate('/api/user/profile')
  mutate('/api/notifications')
}, [mutate])

// Prefetch on hover or other trigger
const prefetchUserProfile = (userId) => {
  mutate(`/api/users/${userId}`)
}

return (
  <Link 
    href={`/users/${user.id}`} 
    onMouseEnter={() => prefetchUserProfile(user.id)}
  >
    {user.name}
  </Link>
)
```

### 6. Progressive Data Loading

For pages with multiple data dependencies, we'll implement a progressive loading strategy:

```jsx
function UserProfilePage({ userId }) {
  // Critical data - load immediately with placeholder
  const { data: basicInfo, error: basicError } = useSWR(`/api/users/${userId}/basic`, fetcher)
  
  // Secondary data - load after basic data is available
  const { data: skills } = useSWR(
    () => basicInfo ? `/api/users/${userId}/skills` : null, 
    fetcher
  )
  
  // Tertiary data - lower priority, load last
  const { data: activity } = useSWR(
    () => basicInfo ? `/api/users/${userId}/activity` : null, 
    fetcher,
    { dedupingInterval: 60000 } // Custom config for this specific data
  )
  
  if (basicError) return <ErrorPage error={basicError} />
  if (!basicInfo) return <ProfileSkeleton />
  
  return (
    <ProfileLayout>
      <UserHeader user={basicInfo} />
      
      {skills ? <SkillsSection skills={skills} /> : <SkillsSkeleton />}
      
      {activity ? <ActivityFeed activities={activity} /> : <ActivitySkeleton />}
    </ProfileLayout>
  )
}
```

### 7. Conditional Fetching

We'll implement conditional fetching based on user state, permissions and UI state:

```jsx
// Only fetch data when condition is met
const { data } = useSWR(
  isLoggedIn ? '/api/user/dashboard' : null,
  fetcher
)

// Fetch different data based on role
const { data: userData } = useSWR(
  () => user?.role === 'admin' 
    ? '/api/admin/users' 
    : '/api/users/public',
  fetcher
)

// Fetch data based on UI state
const { data } = useSWR(
  () => activeTab === 'skills' 
    ? '/api/skills' 
    : activeTab === 'matches' 
      ? '/api/matches' 
      : null,
  fetcher
)
```

### 8. Offline Support Strategy

We'll implement basic offline support using a service worker and localStorage fallback:

```jsx
// Custom fetcher with offline fallback
const fetcherWithOfflineFallback = async (url) => {
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    // Store successful responses in localStorage for offline use
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cache_${url}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    }
    
    return data
  } catch (error) {
    // When offline, try to load from localStorage
    if (!navigator.onLine && typeof window !== 'undefined') {
      const cachedData = localStorage.getItem(`cache_${url}`)
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData)
        // Check if cache is not too old (24 hours)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return {
            ...data,
            _isOfflineData: true,
            _cachedAt: new Date(timestamp)
          }
        }
      }
    }
    
    throw error
  }
}
```

### 9. Supabase Integration

For Supabase-specific data fetching and real-time capabilities:

```jsx
import { useSupabaseClient } from '@/contexts/SupabaseContext'
import { useEffect } from 'react'

function useSWRSupabase(table, query, options = {}) {
  const supabase = useSupabaseClient()
  const { data, mutate, ...rest } = useSWR(
    [table, JSON.stringify(query)],
    async () => {
      const { data, error } = await supabase
        .from(table)
        .select(query.select || '*')
        .match(query.match || {})
        .order(query.order || { column: 'created_at', ascending: false })
        .limit(query.limit || 100)
      
      if (error) throw error
      return data
    },
    options
  )
  
  // Set up real-time subscription
  useEffect(() => {
    if (!options.realtime) return
    
    const subscription = supabase
      .from(table)
      .on('*', (payload) => {
        mutate()
      })
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [table, mutate, options.realtime, supabase])
  
  return { data, mutate, ...rest }
}

// Usage
function SkillsList() {
  const { data, error } = useSWRSupabase('skills', {
    select: 'id, name, description, user_id, created_at',
    match: { is_active: true },
    order: { column: 'created_at', ascending: false },
    limit: 20
  }, {
    revalidateOnFocus: false,
    refreshInterval: 0,
    realtime: true // Enable real-time updates
  })
  
  // ...render component
}
```

### 10. Cache Persistence

For improved performance across sessions and page refreshes:

```jsx
// In _app.tsx
import { SWRConfig } from 'swr'
import localforage from 'localforage'

// Configure persistent cache storage
const cachePersistor = {
  get: async (key) => {
    const data = await localforage.getItem(key)
    return data ? JSON.parse(data) : null
  },
  set: async (key, value) => {
    return localforage.setItem(key, JSON.stringify(value))
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig 
      value={{
        provider: () => cachePersistor,
        // Other global settings
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  )
}
```

## Implementation Steps

1. **Audit Current Data Fetching**
   - Identify all API endpoints and data sources
   - Map data relationships and dependencies
   - Document refresh requirements for each data type

2. **Set Up Global SWR Configuration**
   - Install SWR and related dependencies
   - Create global configuration with default settings
   - Implement central error handling and logging

3. **Implement Core Data Hooks**
   - Create custom hooks for common data patterns
   - Implement Supabase-specific fetching logic
   - Set up type safety with TypeScript interfaces

4. **Add Progressive Loading**
   - Implement skeleton loading states for all components
   - Configure data dependencies and loading priorities
   - Add pending state indicators for optimistic updates

5. **Enable Offline Support**
   - Implement service worker for caching
   - Add localStorage fallback mechanisms
   - Create offline UI indicators and sync status

6. **Cache Optimization**
   - Configure cache persistence between sessions
   - Implement cache invalidation strategies
   - Set up background revalidation for critical data

7. **Performance Testing**
   - Measure API call reduction with caching
   - Test data consistency across components
   - Verify offline functionality

## Target Performance Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Average API calls per session | ~40 | <15 |
| Time to interactive data | ~1.5s | <500ms |
| Cache hit rate | ~30% | >80% |
| Offline usability score | Low | Medium-High |
| Data stale time | Varies | Configurable per data type |

## Technical Considerations

- **Data Consistency**: Ensure proper cache invalidation when data is modified
- **Memory Usage**: Monitor client-side cache size and implement pruning strategies
- **Security**: Never cache sensitive data in persistent storage
- **Network Conditions**: Test under varying network conditions including slow 3G
- **Service Worker Compatibility**: Ensure compatibility across supported browsers

## Integration with Error Handling System

```jsx
function useProtectedData(url, options = {}) {
  const { data, error, ...rest } = useSWR(url, fetcher, options)
  
  useEffect(() => {
    if (error) {
      if (error.status === 401) {
        // Redirect to login
        router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname))
      } else if (error.status === 403) {
        // Show permission denied message
        toast.error('You don\'t have permission to access this resource')
      } else if (error.status >= 500) {
        // Log server errors to monitoring
        captureException(error)
      }
    }
  }, [error])
  
  return { data, error, ...rest }
}
```

## Implementation Timeline

| Week | Tasks |
|------|-------|
| Week 1 | Audit data fetching, set up global SWR configuration |
| Week 2 | Implement core data hooks, progressive loading |
| Week 3 | Add offline support, cache optimization, testing |
