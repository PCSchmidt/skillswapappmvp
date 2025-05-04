/**
 * SkillSwap Service Worker
 * 
 * This service worker enables offline functionality and faster loading
 * through caching of assets and API responses.
 */

// Service worker version (update when making changes)
const SW_VERSION = '1.0.0';

// Cache names
const STATIC_CACHE_NAME = 'skillswap-static-v1';
const DYNAMIC_CACHE_NAME = 'skillswap-dynamic-v1';
const API_CACHE_NAME = 'skillswap-api-v1';

// Resources to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/css/tailwind.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon.png'
];

// Maximum number of items in the dynamic cache
const DYNAMIC_CACHE_LIMIT = 50;

// API paths to cache
const API_ROUTES = [
  '/api/skills',
  '/api/categories'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => {
        console.error('[Service Worker] Install cache failure:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating v' + SW_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          // Delete old versions of our caches
          if (key !== STATIC_CACHE_NAME && 
              key !== DYNAMIC_CACHE_NAME && 
              key !== API_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Limit cache size function
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    // Delete oldest items if we exceed the limit
    await cache.delete(keys[0]);
    // Recursively trim until we're under the limit
    await trimCache(cacheName, maxItems);
  }
}

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Handle API requests
  if (API_ROUTES.some(route => url.pathname.includes(route))) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // Handle static asset requests
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Return cached response if found
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Otherwise fetch from network
          return fetch(event.request)
            .then(response => {
              // Don't cache non-successful responses or non-GET requests
              if (!response || response.status !== 200 || event.request.method !== 'GET') {
                return response;
              }
              
              // Clone the response as it can only be consumed once
              const responseToCache = response.clone();
              
              // Cache the fetched response
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                  // Trim cache if needed
                  trimCache(DYNAMIC_CACHE_NAME, DYNAMIC_CACHE_LIMIT);
                });
              
              return response;
            })
            .catch(error => {
              // If fetching main page fails, return offline page
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
              
              console.error('[Service Worker] Fetch error:', error);
              return new Response('Network error happened', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
  }
});

// Handle API requests with a stale-while-revalidate strategy
async function handleApiRequest(request) {
  const cacheName = API_CACHE_NAME;
  
  // Try to get fresh data from the network
  const fetchPromise = fetch(request.clone())
    .then(networkResponse => {
      // Cache the new response
      if (networkResponse && networkResponse.status === 200) {
        const clonedResponse = networkResponse.clone();
        caches.open(cacheName)
          .then(cache => cache.put(request, clonedResponse));
      }
      return networkResponse;
    })
    .catch(error => {
      console.error('[Service Worker] API fetch error:', error);
      return null;
    });
  
  // Check the cache first
  const cachedPromise = caches.open(cacheName)
    .then(cache => cache.match(request))
    .then(cachedResponse => cachedResponse || null);
  
  // Wait for the cached response
  const cachedResponse = await cachedPromise;
  
  // If we have a cached response, use it while we wait for a network response
  if (cachedResponse) {
    // Try to update the cache in the background
    fetchPromise.catch(() => {
      console.log('[Service Worker] Using cached API response');
    });
    return cachedResponse;
  }
  
  // If no cached data, wait for the network response
  const networkResponse = await fetchPromise;
  return networkResponse || new Response(JSON.stringify({ 
    error: 'Network error, and no cached data available' 
  }), {
    status: 408,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Push notification event handler
self.addEventListener('push', event => {
  if (!event.data) {
    console.log('[Service Worker] Push received but no data');
    return;
  }

  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New notification from SkillSwap',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        url: data.url || '/'
      },
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'SkillSwap', options)
    );
  } catch (error) {
    console.error('[Service Worker] Push notification error:', error);
  }
});

// Notification click event handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const clickedNotification = event.notification;
  const url = clickedNotification.data && clickedNotification.data.url
    ? clickedNotification.data.url
    : '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(windowClients => {
        // Check if there is already a window open
        for (const client of windowClients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

console.log('[Service Worker] Initialized: v' + SW_VERSION);
