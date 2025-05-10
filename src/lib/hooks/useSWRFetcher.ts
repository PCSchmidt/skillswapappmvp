/**
 * Standard fetcher function for SWR that handles JSON responses and errors
 * 
 * @param url The URL to fetch
 * @returns The JSON response
 * @throws Error with status and info properties on fetch failure 
 */
export const defaultFetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.');
    // Attach additional info to the error object
    try {
      error.info = await res.json();
    } catch (e) {
      error.info = { message: 'Failed to parse error response' };
    }
    error.status = res.status;
    throw error;
  }

  return res.json();
};

/**
 * Fetcher function for Supabase API endpoints that handles authentication
 * This assumes authentication is handled via cookies or auth headers automatically
 */
export const supabaseFetcher = async (url: string) => {
  // Add any Supabase-specific headers if needed
  const res = await fetch(url, {
    credentials: 'include', // Include cookies with the request
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.');
    try {
      error.info = await res.json();
    } catch (e) {
      error.info = { message: 'Failed to parse error response' };
    }
    error.status = res.status;
    throw error;
  }

  return res.json();
};

/**
 * Fetcher function with custom authorization header
 */
export const authFetcher = (token: string) => async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  
  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.');
    try {
      error.info = await res.json();
    } catch (e) {
      error.info = { message: 'Failed to parse error response' };
    }
    error.status = res.status;
    throw error;
  }

  return res.json();
};

/**
 * Fetcher with custom timeout
 */
export const timeoutFetcher = (timeoutMs: number = 8000) => async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    
    if (!res.ok) {
      const error: any = new Error('An error occurred while fetching the data.');
      try {
        error.info = await res.json();
      } catch (e) {
        error.info = { message: 'Failed to parse error response' };
      }
      error.status = res.status;
      throw error;
    }
    
    return res.json();
  } catch (e) {
    if ((e as any).name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Fetcher with offline support that tries localStorage if fetch fails
 */
export const offlineFetcher = async (url: string) => {
  const cacheKey = `swr_cache_${url}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const error: any = new Error('An error occurred while fetching the data.');
      try {
        error.info = await response.json();
      } catch (e) {
        error.info = { message: 'Failed to parse error response' };
      }
      error.status = response.status;
      throw error;
    }
    
    const data = await response.json();
    
    // Store in localStorage for offline use
    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    }
    
    return data;
  } catch (error) {
    // When offline, try to load from localStorage
    if (!navigator.onLine && typeof window !== 'undefined') {
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Check if cache is not too old (24 hours)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return {
            ...data,
            _isOfflineData: true,
            _cachedAt: new Date(timestamp)
          };
        }
      }
    }
    
    throw error;
  }
};

export default defaultFetcher;
