'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';

interface PushNotificationPromptProps {
  className?: string;
  onClose?: () => void;
  onSubscribe?: (subscription: PushSubscription) => void;
}

export function PushNotificationPrompt({ 
  className = '',
  onClose,
  onSubscribe
}: PushNotificationPromptProps) {
  const [permission, setPermission] = useState<NotificationPermission | 'default'>('default');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceWorkerAvailable, setServiceWorkerAvailable] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState<boolean>(true);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    // Check if service workers and push notifications are supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setServiceWorkerAvailable(true);
      
      // Check current notification permission
      setPermission(Notification.permission);
      
      // If already granted, hide the prompt
      if (Notification.permission === 'granted') {
        setShowPrompt(false);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!serviceWorkerAvailable) {
      setError('Push notifications are not supported in your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Request notification permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult === 'granted') {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Get push subscription
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
          )
        });

        // Save the subscription to the database
        const { error: saveError } = await supabase
          .from('push_subscriptions')
          .upsert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            subscription: JSON.stringify(subscription),
            created_at: new Date().toISOString()
          });

        if (saveError) {
          throw new Error(saveError.message);
        }

        // Callback with the subscription
        if (onSubscribe) {
          onSubscribe(subscription);
        }

        setShowPrompt(false);
      } else if (permissionResult === 'denied') {
        setError('You have denied notification permissions. Please update your browser settings to enable notifications.');
      }
    } catch (err) {
      setError(`Failed to enable push notifications: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    if (onClose) onClose();
  };

  const remindLater = () => {
    // Set a flag in local storage to remind later
    localStorage.setItem('pushNotificationReminder', new Date(Date.now() + 86400000).toISOString()); // Remind in 24 hours
    dismissPrompt();
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <Card className={`p-6 max-w-md mx-auto ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="mr-3 bg-primary-50 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Enable Push Notifications</h3>
        </div>
        <button 
          type="button" 
          className="text-gray-400 hover:text-gray-500" 
          onClick={dismissPrompt}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="mb-5">
        <p className="text-gray-600 mb-3">
          Stay updated with real-time notifications about new matches, messages, and skill exchange opportunities.
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Instant alerts for new skill match opportunities</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Real-time message notifications</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Updates on skill exchange status changes</span>
          </li>
        </ul>
      </div>

      {!serviceWorkerAvailable && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
          Push notifications are not supported in your browser. Try using a modern browser like Chrome, Firefox, or Edge.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <button
          type="button"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          onClick={requestPermission}
          disabled={!serviceWorkerAvailable || loading || permission === 'denied'}
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {permission === 'denied' 
            ? 'Notifications Blocked (Update Browser Settings)' 
            : 'Enable Push Notifications'}
        </button>
        
        <button
          type="button"
          className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          onClick={remindLater}
        >
          Remind Me Later
        </button>
      </div>
    </Card>
  );
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

export default PushNotificationPrompt;
