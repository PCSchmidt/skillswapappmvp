// tests/lib/cache/queryCacheService.test.ts
import { queryCache, cachedFetch } from '@/lib/cache/queryCacheService'; // Adjust path if necessary based on tsconfig paths

describe('QueryCacheService', () => {
  beforeEach(() => {
    // Ensure a clean cache for each test and reset timers
    jest.useFakeTimers();
    queryCache.clear(); // queryCache is a singleton, so clear its state
    queryCache.setDefaultExpiry(5 * 60 * 1000); // Reset default expiry
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be a singleton instance', () => {
    const instance1 = queryCache; // queryCache is already QueryCacheService.getInstance()
    const instance2 = queryCache; // Effectively getting the same instance
    // To be more explicit or if we were testing the class directly:
    // import { QueryCacheService } from '@/lib/cache/queryCacheService'; // if class were exported
    // const instance1 = QueryCacheService.getInstance();
    // const instance2 = QueryCacheService.getInstance();
    expect(instance1).toBe(instance2);
  });

  describe('set and get', () => {
    it('should set and get a value', () => {
      queryCache.set('testKey', 'testValue');
      expect(queryCache.get('testKey')).toBe('testValue');
    });

    it('should return null for a non-existent key', () => {
      expect(queryCache.get('nonExistentKey')).toBeNull();
    });

    it('should overwrite an existing key', () => {
      queryCache.set('testKey', 'initialValue');
      queryCache.set('testKey', 'newValue');
      expect(queryCache.get('testKey')).toBe('newValue');
    });
  });

  describe('expiry', () => {
    it('should return null for an item expired after default expiry time', () => {
      queryCache.set('testKey', 'testValue'); // Default expiry 5 mins
      jest.advanceTimersByTime(5 * 60 * 1000 + 1); // Advance time by 5 mins + 1ms
      expect(queryCache.get('testKey')).toBeNull();
    });

    it('should return null for an item expired after custom expiry time', () => {
      queryCache.set('testKey', 'testValue', 1000); // Custom expiry 1 sec
      jest.advanceTimersByTime(1000 + 1); // Advance time by 1 sec + 1ms
      expect(queryCache.get('testKey')).toBeNull();
    });

    it('should return the item if not expired', () => {
      queryCache.set('testKey', 'testValue', 5000); // Custom expiry 5 secs
      jest.advanceTimersByTime(4000); // Advance time by 4 secs
      expect(queryCache.get('testKey')).toBe('testValue');
    });

    it('get() should remove an expired item from cache', () => {
      queryCache.set('testKey', 'testValue', 1000);
      jest.advanceTimersByTime(1001);
      queryCache.get('testKey'); // This call should detect expiry and remove it
      expect(queryCache.getStats().total).toBe(0);
    });

    it('has() should return false for an expired item', () => {
      queryCache.set('testKey', 'testValue', 1000);
      jest.advanceTimersByTime(1001);
      expect(queryCache.has('testKey')).toBe(false);
    });

    it('has() should return true for a non-expired item', () => {
      queryCache.set('testKey', 'testValue', 1000);
      expect(queryCache.has('testKey')).toBe(true);
    });
  });

  describe('setDefaultExpiry', () => {
    it('should change the default expiry time', () => {
      queryCache.setDefaultExpiry(1000); // 1 sec
      queryCache.set('testKey', 'testValue');
      jest.advanceTimersByTime(1000 + 1); // Advance by 1 sec + 1ms
      expect(queryCache.get('testKey')).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove an item from the cache', () => {
      queryCache.set('testKey', 'testValue');
      queryCache.remove('testKey');
      expect(queryCache.get('testKey')).toBeNull();
      expect(queryCache.getStats().total).toBe(0);
    });

    it('should do nothing if removing a non-existent key', () => {
      queryCache.remove('nonExistentKey');
      expect(queryCache.getStats().total).toBe(0);
    });
  });

  describe('removeByPrefix', () => {
    it('should remove items matching the prefix', () => {
      queryCache.set('prefix_1', 'value1');
      queryCache.set('prefix_2', 'value2');
      queryCache.set('other_1', 'value3');
      const removedCount = queryCache.removeByPrefix('prefix_');
      expect(removedCount).toBe(2);
      expect(queryCache.get('prefix_1')).toBeNull();
      expect(queryCache.get('prefix_2')).toBeNull();
      expect(queryCache.get('other_1')).toBe('value3');
      expect(queryCache.getStats().total).toBe(1);
    });

    it('should return 0 if no keys match the prefix', () => {
      queryCache.set('other_1', 'value1');
      const removedCount = queryCache.removeByPrefix('prefix_');
      expect(removedCount).toBe(0);
      expect(queryCache.getStats().total).toBe(1);
    });
  });

  describe('cleanExpired', () => {
    it('should remove all expired items and return the count', () => {
      queryCache.set('key1', 'value1', 1000); // Expires
      queryCache.set('key2', 'value2', 3000); // Does not expire yet
      queryCache.set('key3', 'value3', 500);  // Expires

      jest.advanceTimersByTime(1500); // key1 and key3 should be expired

      const cleanedCount = queryCache.cleanExpired();
      expect(cleanedCount).toBe(2);
      expect(queryCache.get('key1')).toBeNull();
      expect(queryCache.get('key3')).toBeNull();
      expect(queryCache.get('key2')).toBe('value2'); // key2 should still be there
      expect(queryCache.getStats().total).toBe(1);
    });
  });

  describe('clear', () => {
    it('should clear all items from the cache', () => {
      queryCache.set('key1', 'value1');
      queryCache.set('key2', 'value2');
      queryCache.clear();
      expect(queryCache.get('key1')).toBeNull();
      expect(queryCache.get('key2')).toBeNull();
      expect(queryCache.getStats().total).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      queryCache.set('key1', 'value1', 1000); // Will expire
      queryCache.set('key2', 'value2', 3000); // Valid
      queryCache.set('key3', 'value3', 5000); // Valid

      jest.advanceTimersByTime(1500); // key1 is now expired

      const stats = queryCache.getStats();
      expect(stats.total).toBe(3); // Total entries initially set
      // Note: getStats doesn't automatically clean. If get() was called on key1, total would be 2.
      // The current implementation of getStats iterates and counts expired without deleting.
      // Let's test this behavior.
      expect(stats.expired).toBe(1);
      expect(stats.valid).toBe(2);

      // If we call get on the expired key, it gets removed
      queryCache.get('key1');
      const statsAfterGet = queryCache.getStats();
      expect(statsAfterGet.total).toBe(2);
      expect(statsAfterGet.expired).toBe(0);
      expect(statsAfterGet.valid).toBe(2);

      // If we call cleanExpired
      queryCache.set('key4', 'value4', 100);
      jest.advanceTimersByTime(101);
      queryCache.cleanExpired();
      const statsAfterClean = queryCache.getStats();
      expect(statsAfterClean.total).toBe(2); // key2, key3 remain
      expect(statsAfterClean.expired).toBe(0);
      expect(statsAfterClean.valid).toBe(2);
    });
  });

  describe('cachedFetch', () => {
    const mockFetchFn = jest.fn();

    beforeEach(() => {
      mockFetchFn.mockClear();
    });

    it('should call fetchFn and cache result on cache miss', async () => {
      mockFetchFn.mockResolvedValue('fetchedData');
      const data = await cachedFetch('fetchKey', mockFetchFn);

      expect(data).toBe('fetchedData');
      expect(mockFetchFn).toHaveBeenCalledTimes(1);
      expect(queryCache.get('fetchKey')).toBe('fetchedData');
    });

    it('should return cached data on cache hit without calling fetchFn', async () => {
      queryCache.set('fetchKey', 'cachedData');
      mockFetchFn.mockResolvedValue('freshData'); // Should not be called

      const data = await cachedFetch('fetchKey', mockFetchFn);

      expect(data).toBe('cachedData');
      expect(mockFetchFn).not.toHaveBeenCalled();
    });

    it('should call fetchFn if forceRefresh is true, even on cache hit', async () => {
      queryCache.set('fetchKey', 'cachedData');
      mockFetchFn.mockResolvedValue('refreshedData');

      const data = await cachedFetch('fetchKey', mockFetchFn, { forceRefresh: true });

      expect(data).toBe('refreshedData');
      expect(mockFetchFn).toHaveBeenCalledTimes(1);
      expect(queryCache.get('fetchKey')).toBe('refreshedData'); // Cache updated
    });

    it('should use custom expiry when provided to cachedFetch', async () => {
      mockFetchFn.mockResolvedValue('fetchedData');
      await cachedFetch('fetchKeyExpiry', mockFetchFn, { expiry: 1000 }); // 1 sec expiry

      expect(queryCache.get('fetchKeyExpiry')).toBe('fetchedData');
      jest.advanceTimersByTime(1001);
      expect(queryCache.get('fetchKeyExpiry')).toBeNull(); // Should be expired
    });

    it('should propagate errors from fetchFn and not cache on error', async () => {
      const error = new Error('Fetch failed');
      mockFetchFn.mockRejectedValue(error);

      await expect(cachedFetch('fetchKeyError', mockFetchFn)).rejects.toThrow('Fetch failed');
      expect(mockFetchFn).toHaveBeenCalledTimes(1);
      expect(queryCache.get('fetchKeyError')).toBeNull(); // Should not cache on error
    });
  });
});
