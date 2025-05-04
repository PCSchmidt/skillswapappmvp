/**
 * Query Cache Service
 * 
 * This service provides caching functionality for API responses to improve
 * performance and reduce unnecessary network requests.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

type CacheMap = Map<string, CacheEntry<any>>;

class QueryCacheService {
  private static instance: QueryCacheService;
  private cacheMap: CacheMap = new Map();
  private defaultExpiry = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of the cache service
   */
  public static getInstance(): QueryCacheService {
    if (!QueryCacheService.instance) {
      QueryCacheService.instance = new QueryCacheService();
    }
    return QueryCacheService.instance;
  }

  /**
   * Set cache expiry duration (in milliseconds)
   * @param milliseconds Duration in milliseconds
   */
  public setDefaultExpiry(milliseconds: number): void {
    this.defaultExpiry = milliseconds;
  }

  /**
   * Store data in cache with a given key
   * @param key Cache key
   * @param data Data to cache
   * @param expiryMs Optional custom expiry time in milliseconds
   */
  public set<T>(key: string, data: T, expiryMs?: number): void {
    const now = Date.now();
    const expiry = expiryMs || this.defaultExpiry;
    
    this.cacheMap.set(key, {
      data,
      timestamp: now,
      expiresAt: now + expiry
    });

    // For debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[QueryCache] Set: ${key} (expires in ${expiry / 1000}s)`);
    }
  }

  /**
   * Get data from cache if available and not expired
   * @param key Cache key
   * @returns Cached data or null if not found or expired
   */
  public get<T>(key: string): T | null {
    const entry = this.cacheMap.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    
    // Check if cache entry has expired
    if (now > entry.expiresAt) {
      // Clean up expired entry
      this.cacheMap.delete(key);
      
      // For debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[QueryCache] Miss (expired): ${key}`);
      }
      
      return null;
    }
    
    // For debugging in development
    if (process.env.NODE_ENV === 'development') {
      const ageSeconds = Math.round((now - entry.timestamp) / 1000);
      console.log(`[QueryCache] Hit: ${key} (age: ${ageSeconds}s)`);
    }
    
    return entry.data;
  }

  /**
   * Check if cache has a valid entry for the given key
   * @param key Cache key
   * @returns True if cache has valid entry
   */
  public has(key: string): boolean {
    const entry = this.cacheMap.get(key);
    
    if (!entry) {
      return false;
    }
    
    return Date.now() <= entry.expiresAt;
  }

  /**
   * Remove an entry from the cache
   * @param key Cache key
   */
  public remove(key: string): void {
    this.cacheMap.delete(key);
    
    // For debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[QueryCache] Removed: ${key}`);
    }
  }

  /**
   * Remove all entries from the cache that match a prefix
   * @param keyPrefix Cache key prefix
   * @returns Number of entries removed
   */
  public removeByPrefix(keyPrefix: string): number {
    let count = 0;
    
    for (const key of this.cacheMap.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.cacheMap.delete(key);
        count++;
      }
    }
    
    // For debugging in development
    if (process.env.NODE_ENV === 'development' && count > 0) {
      console.log(`[QueryCache] Removed ${count} entries with prefix: ${keyPrefix}`);
    }
    
    return count;
  }

  /**
   * Remove all expired entries from the cache
   * @returns Number of expired entries removed
   */
  public cleanExpired(): number {
    const now = Date.now();
    let count = 0;
    
    for (const [key, entry] of this.cacheMap.entries()) {
      if (now > entry.expiresAt) {
        this.cacheMap.delete(key);
        count++;
      }
    }
    
    // For debugging in development
    if (process.env.NODE_ENV === 'development' && count > 0) {
      console.log(`[QueryCache] Cleaned ${count} expired entries`);
    }
    
    return count;
  }

  /**
   * Clear all entries from the cache
   */
  public clear(): void {
    const count = this.cacheMap.size;
    this.cacheMap.clear();
    
    // For debugging in development
    if (process.env.NODE_ENV === 'development' && count > 0) {
      console.log(`[QueryCache] Cleared all ${count} entries`);
    }
  }

  /**
   * Get cache statistics
   * @returns Object with cache statistics
   */
  public getStats(): { total: number; expired: number; valid: number } {
    const now = Date.now();
    let expiredCount = 0;
    let validCount = 0;
    
    for (const entry of this.cacheMap.values()) {
      if (now > entry.expiresAt) {
        expiredCount++;
      } else {
        validCount++;
      }
    }
    
    return {
      total: this.cacheMap.size,
      expired: expiredCount,
      valid: validCount
    };
  }
}

// Export singleton instance
export const queryCache = QueryCacheService.getInstance();

// Export helper utility to cache API calls
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options?: {
    expiry?: number;
    forceRefresh?: boolean;
  }
): Promise<T> {
  const cache = QueryCacheService.getInstance();
  const { expiry, forceRefresh = false } = options || {};
  
  // Return cached result if available and not forcing refresh
  if (!forceRefresh && cache.has(key)) {
    const cachedData = cache.get<T>(key);
    if (cachedData !== null) {
      return cachedData;
    }
  }
  
  // Otherwise fetch fresh data
  try {
    const data = await fetchFn();
    cache.set(key, data, expiry);
    return data;
  } catch (error) {
    console.error(`Error fetching data for key ${key}:`, error);
    throw error;
  }
}
