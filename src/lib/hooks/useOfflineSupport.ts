'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Options for offline support hook
 */
interface OfflineSupportOptions {
  // How often to check network status in milliseconds
  checkInterval?: number;
  // Callback when going offline
  onOffline?: () => void;
  // Callback when coming back online
  onOnline?: () => void;
}

/**
 * Hook that provides offline support utilities
 * 
 * This hook monitors the network status and provides utilities for
 * working with offline data and synchronization.
 * 
 * @param options Configuration options
 * @returns Object with network status and utilities
 */
export function useOfflineSupport(options: OfflineSupportOptions = {}) {
  const {
    checkInterval = 5000,
    onOffline,
    onOnline,
  } = options;
  
  // Initial state based on navigator.onLine
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  // Handler for when the browser goes online
  const handleOnline = useCallback(() => {
    setIsOnline(true);
    if (wasOffline) {
      setWasOffline(false);
      if (onOnline) onOnline();
    }
  }, [wasOffline, onOnline]);

  // Handler for when the browser goes offline
  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setWasOffline(true);
    if (onOffline) onOffline();
  }, [onOffline]);

  useEffect(() => {
    // Add event listeners for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set up active checking of network status
    // This helps in cases where the online/offline events don't fire reliably
    const interval = setInterval(() => {
      const currentOnlineStatus = navigator.onLine;
      if (currentOnlineStatus !== isOnline) {
        if (currentOnlineStatus) {
          handleOnline();
        } else {
          handleOffline();
        }
      }
    }, checkInterval);
    
    // Clean up event listeners and interval
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline, handleOnline, handleOffline, checkInterval]);

  /**
   * Save data to local storage for offline access
   * 
   * @param key Storage key
   * @param data Data to store
   */
  const saveOfflineData = useCallback((key: string, data: unknown): void => {
    try {
      localStorage.setItem(
        `offline_${key}`, 
        JSON.stringify({
          data,
          timestamp: Date.now()
        })
      );
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }, []);

  /**
   * Load data from local storage for offline access
   * 
   * @param key Storage key
   * @param maxAge Maximum age of cached data in milliseconds
   * @returns Cached data or null if not found or expired
   */
  const loadOfflineData = useCallback(<T>(key: string, maxAge: number = 24 * 60 * 60 * 1000): T | null => {
    try {
      const item = localStorage.getItem(`offline_${key}`);
      if (!item) return null;
      
      const { data, timestamp } = JSON.parse(item);
      
      // Check if the data is too old
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(`offline_${key}`);
        return null;
      }
      
      return data as T;
    } catch (error) {
      console.error('Failed to load offline data:', error);
      return null;
    }
  }, []);

  /**
   * Clear offline data for a specific key
   * 
   * @param key Storage key to clear
   */
  const clearOfflineData = useCallback((key: string): void => {
    try {
      localStorage.removeItem(`offline_${key}`);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }, []);

  /**
   * Check if there is pending offline data that needs to be synchronized
   * 
   * @param key Storage key to check
   * @returns Boolean indicating if there is pending data
   */
  const hasPendingOfflineData = useCallback((key: string): boolean => {
    try {
      return localStorage.getItem(`offline_pending_${key}`) !== null;
    } catch (error) {
      console.error('Failed to check pending offline data:', error);
      return false;
    }
  }, []);

  /**
   * Save pending operations to be synchronized when online
   * 
   * @param key Storage key
   * @param operation Operation details (e.g., { type: 'create', data: {...} })
   */
  const savePendingOperation = useCallback((key: string, operation: Record<string, unknown>): void => {
    try {
      // Get existing pending operations or initialize empty array
      const pendingString = localStorage.getItem(`offline_pending_${key}`);
      const pending = pendingString ? JSON.parse(pendingString) : [];
      
      // Add the new operation
      pending.push({
        ...operation,
        timestamp: Date.now()
      });
      
      // Save back to storage
      localStorage.setItem(`offline_pending_${key}`, JSON.stringify(pending));
    } catch (error) {
      console.error('Failed to save pending operation:', error);
    }
  }, []);

  /**
   * Get pending operations to be synchronized
   * 
   * @param key Storage key
   * @returns Array of pending operations
   */
  const getPendingOperations = useCallback(<T>(key: string): T[] => {
    try {
      const pendingString = localStorage.getItem(`offline_pending_${key}`);
      return pendingString ? JSON.parse(pendingString) : [];
    } catch (error) {
      console.error('Failed to get pending operations:', error);
      return [];
    }
  }, []);

  /**
   * Clear pending operations after they've been synchronized
   * 
   * @param key Storage key
   */
  const clearPendingOperations = useCallback((key: string): void => {
    try {
      localStorage.removeItem(`offline_pending_${key}`);
    } catch (error) {
      console.error('Failed to clear pending operations:', error);
    }
  }, []);

  return {
    isOnline,
    wasOffline,
    saveOfflineData,
    loadOfflineData,
    clearOfflineData,
    hasPendingOfflineData,
    savePendingOperation,
    getPendingOperations,
    clearPendingOperations
  };
}

export default useOfflineSupport;
