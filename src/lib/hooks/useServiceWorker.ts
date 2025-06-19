import { useState, useEffect } from 'react';

/**
 * Interface for the service worker hook return value
 */
interface ServiceWorkerHookResult {
  /** Whether a service worker is supported in the current browser */
  isSupported: boolean;
  /** The current registration status */
  registration: ServiceWorkerRegistration | null;
  /** Whether the registration process is in progress */
  isRegistering: boolean;
  /** Any error that occurred during registration */
  error: Error | null;
  /** Function to register the service worker */
  registerServiceWorker: () => Promise<ServiceWorkerRegistration | null>;
  /** Current notification permission status */
  notificationPermission: NotificationPermission | 'default';
  /** Function to request notification permission */
  requestPermission: () => Promise<NotificationPermission>;
}

/**
 * Hook for managing service worker registration and notifications
 * @param swPath Path to the service worker file (default: '/sw.js')
 * @returns ServiceWorkerHookResult object with registration status and functions
 */
export function useServiceWorker(swPath = '/sw.js'): ServiceWorkerHookResult {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'default'>('default');

  // Check if service worker is supported
  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    if (supported) {
      // Check current notification permission
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Register service worker
  const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    if (!isSupported) {
      setError(new Error('Service Worker is not supported in this browser'));
      return null;
    }

    setIsRegistering(true);
    setError(null);

    try {
      const reg = await navigator.serviceWorker.register(swPath);
      setRegistration(reg);
      
      // Check if the service worker was updated
      if (reg.installing) {
        console.log('Service Worker installing');
      } else if (reg.waiting) {
        console.log('Service Worker installed, waiting to activate');
      } else if (reg.active) {
        console.log('Service Worker active');
      }

      return reg;
    } catch (err) {
      console.error('Service Worker registration failed:', err);
      const serviceWorkerError = err instanceof Error 
        ? err 
        : new Error('Unknown service worker registration error');
      
      setError(serviceWorkerError);
      return null;
    } finally {
      setIsRegistering(false);
    }
  };

  // Request notification permission
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported in this browser');
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      throw err;
    }
  };

  return {
    isSupported,
    registration,
    isRegistering,
    error,
    registerServiceWorker,
    notificationPermission,
    requestPermission
  };
}

/**
 * Interface for the push subscription hook return value
 */
interface PushSubscriptionHookResult {
  /** The current push subscription */
  subscription: PushSubscription | null;
  /** Whether the subscription process is in progress */
  isSubscribing: boolean;
  /** Any error that occurred during subscription */
  error: Error | null;
  /** Function to subscribe to push notifications */
  subscribe: (registration: ServiceWorkerRegistration, applicationServerKey: string) => Promise<PushSubscription | null>;
  /** Function to unsubscribe from push notifications */
  unsubscribe: () => Promise<boolean>;
}

/**
 * Hook for managing push notification subscriptions
 * @returns PushSubscriptionHookResult object with subscription status and functions
 */
export function usePushSubscription(): PushSubscriptionHookResult {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to push notifications
  const subscribe = async (
    registration: ServiceWorkerRegistration, 
    applicationServerKey: string
  ): Promise<PushSubscription | null> => {
    if (!registration || !registration.pushManager) {
      setError(new Error('Service Worker registration is required'));
      return null;
    }

    setIsSubscribing(true);
    setError(null);

    try {
      // Convert base64 application server key to Uint8Array if needed
      const appServerKey = typeof applicationServerKey === 'string'
        ? urlBase64ToUint8Array(applicationServerKey)
        : applicationServerKey;

      // Subscribe to push
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appServerKey
      });

      setSubscription(newSubscription);
      return newSubscription;
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err);
      const subscriptionError = err instanceof Error 
        ? err 
        : new Error('Unknown subscription error');
      
      setError(subscriptionError);
      return null;
    } finally {
      setIsSubscribing(false);
    }
  };

  // Unsubscribe from push notifications
  const unsubscribe = async (): Promise<boolean> => {
    if (!subscription) {
      setError(new Error('No active subscription to unsubscribe from'));
      return false;
    }

    try {
      const result = await subscription.unsubscribe();
      if (result) {
        setSubscription(null);
      }
      return result;
    } catch (err) {
      console.error('Failed to unsubscribe from push notifications:', err);
      const unsubscribeError = err instanceof Error 
        ? err 
        : new Error('Unknown unsubscribe error');
      
      setError(unsubscribeError);
      return false;
    }
  };

  return {
    subscription,
    isSubscribing,
    error,
    subscribe,
    unsubscribe
  };
}

// Helper function to convert base64 to Uint8Array
// (Required for VAPID authentication with push services)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
