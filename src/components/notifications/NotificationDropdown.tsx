/**
 * NotificationDropdown Component
 * 
 * This component creates a dropdown menu for notifications that can be
 * toggled from a notification bell icon in the navigation.
 */

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

import { useSupabase } from '@/contexts/SupabaseContext';
import type { Notification } from '@/types/supabase';
import NotificationList from './NotificationList';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  maxNotifications?: number;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
  maxNotifications = 10
}: NotificationDropdownProps) {
  const { supabase, user } = useSupabase();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch notifications when the dropdown is opened
  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);
  
  // Set up click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;
    
    const subscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Notification change received:', payload);
        
        // Handle different change types
        if (payload.eventType === 'INSERT') {
          // Add to notifications
          setNotifications(prev => [payload.new as Notification, ...prev].slice(0, maxNotifications));
        } else if (payload.eventType === 'UPDATE') {
          // Update existing notification
          setNotifications(prev => 
            prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
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
      subscription.unsubscribe();
    };
  }, [user, supabase, maxNotifications]);
  
  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(maxNotifications);
      
      if (error) throw error;
      
      setNotifications(data as Notification[]);
    } catch (err: unknown) {
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
      const { error } = await supabase.rpc('mark_all_notifications_read', {});
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (err: unknown) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all as read');
    }
  };
  
  // Clear all notifications
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
    } catch (err: unknown) {
      console.error('Error clearing notifications:', err);
      setError('Failed to clear notifications');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="notification-button"
    >
      <div className="py-1">
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <Link
              href="/notifications"
              className="text-sm text-primary-600 hover:text-primary-800"
              onClick={onClose}
            >
              View all
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-error-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
          maxHeight="400px"
          emptyMessage="You have no notifications"
        />
      </div>
    </div>
  );
}
