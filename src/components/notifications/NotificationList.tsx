/**
 * NotificationList Component
 * 
 * This component displays a list of notifications and provides
 * controls for managing them (marking as read, deleting, etc.)
 */

import React, { useState } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import NotificationItem from './NotificationItem';

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

interface NotificationListProps {
  notifications: Notification[];
  onClearAll?: () => void;
  onMarkAllAsRead?: () => void;
  loading?: boolean;
  emptyMessage?: string;
  maxHeight?: string;
}

export default function NotificationList({
  notifications,
  onClearAll,
  onMarkAllAsRead,
  loading = false,
  emptyMessage = 'No notifications',
  maxHeight = '400px'
}: NotificationListProps) {
  const { supabase } = useSupabase();
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  
  // Handle marking a single notification as read
  const handleMarkAsRead = async (id: string) => {
    // Prevent duplicate processing
    if (processingIds[id]) return;
    
    // Update local state
    setProcessingIds((prev) => ({ ...prev, [id]: true }));
    setError(null);
    
    try {
      // Call the stored procedure to mark as read
      const { error } = await supabase.rpc('mark_notification_read', {
        p_notification_id: id
      });
      
      if (error) throw error;
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    } finally {
      // Remove from processing state
      setProcessingIds((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };
  
  // Handle deleting a notification
  const handleDelete = async (id: string) => {
    // Prevent duplicate processing
    if (processingIds[id]) return;
    
    // Update local state
    setProcessingIds((prev) => ({ ...prev, [id]: true }));
    setError(null);
    
    try {
      // Delete the notification
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    } finally {
      // Remove from processing state
      setProcessingIds((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="spinner"></div>
      </div>
    );
  }
  
  // Render empty state
  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  return (
    <div className="notifications-list">
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-2">
          {error}
        </div>
      )}
      
      {/* List header with action buttons */}
      {notifications.length > 0 && (
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h3 className="text-sm font-medium text-gray-900">
            {unreadCount > 0 ? (
              <span>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
            ) : (
              <span>All caught up!</span>
            )}
          </h3>
          <div className="flex space-x-2">
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-800"
              >
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Scrollable notifications container */}
      <div style={{ maxHeight, overflowY: 'auto' }} className="notifications-container">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
