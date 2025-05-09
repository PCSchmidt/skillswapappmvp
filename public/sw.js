// Service worker for push notifications

// Cache name for PWA assets (can be used for offline functionality)
const CACHE_NAME = 'skillswap-v1';

// Install event - triggered when service worker is first installed
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  // Cache core app assets for offline use - optional for push notifications only
  // Uncomment and customize if you want PWA offline functionality
  /*
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        // Add other assets that should be available offline
      ]);
    })
  );
  */
});

// Activate event - triggered when a new service worker takes over
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push event - triggered when the server sends a push notification
self.addEventListener('push', (event) => {
  console.log('Push notification received', event);
  
  // Get notification data
  let notificationData = {};
  
  try {
    if (event.data) {
      notificationData = event.data.json();
    }
  } catch (error) {
    console.error('Error parsing push notification data:', error);
    
    // Fallback notification data if parsing fails
    notificationData = {
      title: 'New Notification',
      body: 'You have a new notification on SkillSwap',
      icon: '/images/logo-192.png',
      badge: '/images/badge-96.png',
      data: {
        url: '/'
      }
    };
  }
  
  // Default notification options
  const title = notificationData.title || 'SkillSwap';
  const options = {
    body: notificationData.body || 'You have a new notification',
    icon: notificationData.icon || '/images/logo-192.png',
    badge: notificationData.badge || '/images/badge-96.png',
    vibrate: [100, 50, 100],
    data: {
      url: notificationData.data?.url || '/',
      notificationId: notificationData.data?.notificationId || null
    },
    // Actions that appear as buttons
    actions: notificationData.actions || [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ],
    // Tag makes notifications with the same tag replace each other
    tag: notificationData.tag || 'default',
    // Renotify makes the device vibrate even if replacing a notification
    renotify: notificationData.renotify !== undefined ? notificationData.renotify : true
  };
  
  // Show the notification
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event - triggered when user clicks the notification
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event);
  
  // Close the notification
  event.notification.close();
  
  // Handle actions
  if (event.action === 'close') {
    // Just close the notification
    return;
  }
  
  // Default action is to open the relevant URL
  const urlToOpen = event.notification.data.url || '/';
  
  // Open the relevant page or focus if already open
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, focus it
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
  
  // If there's a notification ID, mark it as read in the database
  if (event.notification.data.notificationId) {
    // This could be implemented with a fetch to your API
    // Example:
    /*
    fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: event.notification.data.notificationId
      })
    });
    */
  }
});

// Push subscription change event
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('Push subscription changed', event);
  
  // Re-subscribe and update server
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: self.applicationServerKey
    }).then((subscription) => {
      // Send updated subscription to server
      // You would implement this with a fetch to your API
      return fetch('/api/push-subscriptions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });
    })
  );
});

// Optional: fetch event for offline functionality
// Only necessary if you're implementing a full PWA with offline support
/*
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
*/
