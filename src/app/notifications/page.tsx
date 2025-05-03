/**
 * Notifications Page
 * 
 * This page displays all notifications for the logged-in user,
 * with options to filter, mark as read, and manage notifications.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/contexts/SupabaseContext';
import NotificationList from '@/components/notifications/NotificationList';

// Define Notification type manually since it's not in the Database types yet
type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
  expires_at: string | null;
  metadata: any;
  priority: string | null;
};

export default function NotificationsPage() {
  const router = useRouter();
  const { supabase, user, isLoading } = useSupabase();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Fetch notifications when the page loads
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, filter, typeFilter]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('notifications-page-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Notification change received:', payload);

        // Handle different change types
        if (payload.eventType === 'INSERT') {
          // Add to notifications if it matches filters
          const newNotification = payload.new as Notification;
          if (shouldShowNotification(newNotification)) {
            setNotifications(prev => [newNotification, ...prev]);
          }
          // Update available types
          setAvailableTypes(prev => {
            if (!prev.includes(newNotification.type)) {
              return [...prev, newNotification.type].sort();
            }
            return prev;
          });
        } else if (payload.eventType === 'UPDATE') {
          // Update existing notification
          const updatedNotification = payload.new as Notification;
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
              .filter(n => shouldShowNotification(n))
          );
        } else if (payload.eventType === 'DELETE') {
          // Remove from notifications
          setNotifications(prev => 
            prev.filter(n => n.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, supabase, filter, typeFilter]);

  // Check if a notification should be shown based on current filters
  const shouldShowNotification = (notification: Notification): boolean => {
    // Filter by read/unread status
    if (filter === 'unread' && notification.is_read) return false;
    if (filter === 'read' && !notification.is_read) return false;
    
    // Filter by notification type
    if (typeFilter && notification.type !== typeFilter) return false;
    
    return true;
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Build query
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter === 'unread') {
        query = query.eq('is_read', false);
      } else if (filter === 'read') {
        query = query.eq('is_read', true);
      }

      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setNotifications(data as Notification[]);

      // Collect available types for filtering
      if (!typeFilter) {
        const types = [...new Set(data.map((n: any) => n.type))];
        setAvailableTypes(types.sort());
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('mark_all_notifications_read');

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all as read');
    }
  };

  // Delete all notifications
  const handleClearAll = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setNotifications([]);
    } catch (err: any) {
      console.error('Error clearing notifications:', err);
      setError('Failed to clear notifications');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              
              {/* Filter controls */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="all">All notifications</option>
                  <option value="unread">Unread only</option>
                  <option value="read">Read only</option>
                </select>
                
                {availableTypes.length > 0 && (
                  <select
                    value={typeFilter || ''}
                    onChange={(e) => setTypeFilter(e.target.value || null)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">All types</option>
                    {availableTypes.map(type => (
                      <option key={type} value={type}>
                        {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
          
          {/* Error display */}
          {error && (
            <div className="bg-error-50 border-l-4 border-error-400 p-4 m-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-error-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Mark all as read
                </button>
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
          
          {/* Notification list */}
          <div className="bg-white">
            <NotificationList
              notifications={notifications}
              loading={loading}
              emptyMessage={
                filter !== 'all' || typeFilter ? 
                "No matching notifications found" : 
                "You don't have any notifications yet"
              }
              maxHeight="calc(100vh - 250px)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
