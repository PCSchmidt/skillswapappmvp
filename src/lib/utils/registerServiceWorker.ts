/**
 * Service Worker Registration Utility
 * 
 * This utility handles registration and updates of the service worker
 * to enable PWA capabilities like offline access and caching.
 */

// Track if we've shown update notification to avoid duplicates
let updateNotificationShown = false;

/**
 * Register the service worker
 */
export const registerServiceWorker = async (): Promise<void> => {
  // Only register in production and if service workers are supported
  if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const swUrl = '/sw.js';

  try {
    const registration = await navigator.serviceWorker.register(swUrl);
    console.log('Service Worker registered successfully:', registration.scope);

    // Check for updates to the Service Worker
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller && !updateNotificationShown) {
          updateNotificationShown = true;
          showUpdateNotification();
        }
      });
    });

    // Handle service worker updates when app is already open
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      console.log('Controller changed - refreshing page');
      window.location.reload();
    });

  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

/**
 * Show a notification that an update is available
 */
const showUpdateNotification = (): void => {
  // Create a notification element
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 flex justify-between items-center';
  notification.setAttribute('role', 'alert');
  notification.style.zIndex = '9999';
  
  notification.innerHTML = `
    <div class="flex-1">
      <p class="font-medium">App update available!</p>
      <p class="text-sm">A new version of SkillSwap is available. Refresh to update.</p>
    </div>
    <div class="flex space-x-2">
      <button id="sw-update-dismiss" class="px-3 py-1 text-sm bg-indigo-700 hover:bg-indigo-800 rounded">
        Dismiss
      </button>
      <button id="sw-update-refresh" class="px-3 py-1 text-sm bg-white text-indigo-700 hover:bg-gray-100 rounded">
        Refresh
      </button>
    </div>
  `;
  
  // Add notification to the DOM
  document.body.appendChild(notification);
  
  // Add event listeners to buttons
  document.getElementById('sw-update-dismiss')?.addEventListener('click', () => {
    document.body.removeChild(notification);
  });
  
  document.getElementById('sw-update-refresh')?.addEventListener('click', () => {
    document.body.removeChild(notification);
    window.location.reload();
  });
  
  // Auto-dismiss after 30 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 30000);
};

/**
 * Request notification permission for push notifications
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission | null> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
};
