/**
 * NotificationCenter Component
 * 
 * A comprehensive notification center that provides:
 * - Categorized view of notifications
 * - Filtering options by type and priority
 * - Grouping by context
 * - Bulk actions for notification management
 * - Responsive layout for all device sizes
 */

'use client';

import React, { useState, useEffect } from 'react';
import Column from '@/components/layout/Column';
import Container from '@/components/layout/Container';
import Grid from '@/components/layout/Grid';
import Section from '@/components/layout/Section';
import Card from '@/components/ui/Card';
import { useSupabase } from '@/contexts/SupabaseContext';
import type { Notification } from '@/types/supabase';
import NotificationList from './NotificationList';

// Define filter types
type FilterOptions = {
  types: string[];
  priorities: string[];
  readStatus: 'all' | 'read' | 'unread';
  timeRange: 'all' | 'today' | 'week' | 'month';
};

export default function NotificationCenter() {
  const { supabase, user } = useSupabase();
  
  // State for notifications and loading status
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    types: [],
    priorities: [],
    readStatus: 'all',
    timeRange: 'all',
  });
  
  // Available notification types and priorities
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availablePriorities, setAvailablePriorities] = useState<string[]>([]);
  
  // State for grouped notifications
  const [groupedNotifications, setGroupedNotifications] = useState<Record<string, Notification[]>>({});
  
  // Fetch notifications when component mounts
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);
  
  // Set up real-time subscription for notifications
  useEffect(() => {
    if (!user) return;
    
    const subscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload: any) => { // Use any for payload for now to avoid deep type issues
        console.log('Notification change received:', payload);
        
        // Handle different change types
        if (payload.eventType === 'INSERT') {
          // Add to notifications
          setNotifications(prev => [payload.new as Notification, ...prev]);
          updateAvailableFilters([payload.new as Notification, ...notifications]);
          updateGroupedNotifications([payload.new as Notification, ...notifications]);
        } else if (payload.eventType === 'UPDATE') {
          // Update existing notification
          setNotifications(prev => 
            prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
          );
          updateGroupedNotifications(
            notifications.map(n => n.id === payload.new.id ? payload.new as Notification : n)
          );
        } else if (payload.eventType === 'DELETE') {
          // Remove from notifications
          setNotifications(prev => 
            prev.filter(n => n.id !== payload.old.id)
          );
          updateAvailableFilters(notifications.filter(n => n.id !== payload.old.id));
          updateGroupedNotifications(notifications.filter(n => n.id !== payload.old.id));
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, supabase, notifications]);
  
  // Fetch notifications with support for filtering and pagination
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      // Apply time range filter if set
      if (filters.timeRange === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('created_at', today.toISOString());
      } else if (filters.timeRange === 'week') {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        query = query.gte('created_at', lastWeek.toISOString());
      } else if (filters.timeRange === 'month') {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        query = query.gte('created_at', lastMonth.toISOString());
      }
      
      // Apply read status filter if set
      if (filters.readStatus === 'read') {
        query = query.eq('is_read', true);
      } else if (filters.readStatus === 'unread') {
        query = query.eq('is_read', false);
      }
      
      // Apply type filters if any
      if (filters.types.length > 0) {
        query = query.in('type', filters.types);
      }
      
      // Apply priority filters if any
      if (filters.priorities.length > 0) {
        query = query.in('priority', filters.priorities);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const typedData = data as Notification[];
      setNotifications(typedData);
      
      // Update available filters based on fetched data
      updateAvailableFilters(typedData);
      
      // Update grouped notifications
      updateGroupedNotifications(typedData);
    } catch (err: unknown) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };
  
  // Update available filters based on current notifications
  const updateAvailableFilters = (notifs: Notification[]) => {
    const types = [...new Set(notifs.map(n => n.type))];
    const priorities = [...new Set(notifs.map(n => n.priority).filter(Boolean))];
    
    setAvailableTypes(types);
    setAvailablePriorities(priorities as string[]);
  };
  
  // Group notifications by context or type
  const updateGroupedNotifications = (notifs: Notification[]) => {
    // First try to group by context if available
    const grouped: Record<string, Notification[]> = {};
    
    notifs.forEach(notification => {
      const groupKey = (notification.metadata?.context as string) || notification.type || 'other';
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(notification);
    });
    
    setGroupedNotifications(grouped);
  };
  
  // Update filters and refetch notifications
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Refetch with new filters
    fetchNotifications();
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
      
      updateGroupedNotifications(
        notifications.map(n => ({ ...n, is_read: true }))
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
      setGroupedNotifications({});
    } catch (err: unknown) {
      console.error('Error clearing notifications:', err);
      setError('Failed to clear notifications');
    }
  };
  
  // Render filter badge
  const renderFilterBadge = (
    label: string,
    isActive: boolean,
    onClick: () => void
  ) => (
    <button
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isActive
          ? 'bg-primary-100 text-primary-800'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
  
  const totalCount = notifications.length;
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  return (
    <Section>
      <Container>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
            <div className="flex space-x-2">
              {totalCount > 0 && (
                <>
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      unreadCount > 0
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Mark all as read
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    Clear all
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-4">
            <Grid>
              <Column span={{ default: 6, md: 3 }}>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
                  <div className="text-sm text-gray-500">Total Notifications</div>
                </div>
              </Column>
              <Column span={{ default: 6, md: 3 }}>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-primary-600">{unreadCount}</div>
                  <div className="text-sm text-gray-500">Unread</div>
                </div>
              </Column>
              <Column span={{ default: 6, md: 3 }}>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-success">
                    {notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
                  </div>
                  <div className="text-sm text-gray-500">High Priority</div>
                </div>
              </Column>
              <Column span={{ default: 6, md: 3 }}>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-info">
                    {notifications.filter(n => 
                      new Date(n.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </div>
                  <div className="text-sm text-gray-500">Today</div>
                </div>
              </Column>
            </Grid>
          </div>
          
          {/* Filters */}
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
              
              <div className="space-y-4">
                {/* Read status filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {renderFilterBadge(
                      'All',
                      filters.readStatus === 'all',
                      () => handleFilterChange({ readStatus: 'all' })
                    )}
                    {renderFilterBadge(
                      'Unread',
                      filters.readStatus === 'unread',
                      () => handleFilterChange({ readStatus: 'unread' })
                    )}
                    {renderFilterBadge(
                      'Read',
                      filters.readStatus === 'read',
                      () => handleFilterChange({ readStatus: 'read' })
                    )}
                  </div>
                </div>
                
                {/* Time range filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Time Range</h3>
                  <div className="flex flex-wrap gap-2">
                    {renderFilterBadge(
                      'All Time',
                      filters.timeRange === 'all',
                      () => handleFilterChange({ timeRange: 'all' })
                    )}
                    {renderFilterBadge(
                      'Today',
                      filters.timeRange === 'today',
                      () => handleFilterChange({ timeRange: 'today' })
                    )}
                    {renderFilterBadge(
                      'This Week',
                      filters.timeRange === 'week',
                      () => handleFilterChange({ timeRange: 'week' })
                    )}
                    {renderFilterBadge(
                      'This Month',
                      filters.timeRange === 'month',
                      () => handleFilterChange({ timeRange: 'month' })
                    )}
                  </div>
                </div>
                
                {/* Type filter */}
                {availableTypes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Notification Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableTypes.map(type => (
                        <div key={type}>
                          {renderFilterBadge(
                            type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                            filters.types.includes(type),
                            () => {
                              const newTypes = filters.types.includes(type)
                                ? filters.types.filter(t => t !== type)
                                : [...filters.types, type];
                              handleFilterChange({ types: newTypes });
                            }
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Priority filter */}
                {availablePriorities.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
                    <div className="flex flex-wrap gap-2">
                      {availablePriorities.map(priority => (
                        <div key={priority}>
                          {renderFilterBadge(
                            priority.charAt(0).toUpperCase() + priority.slice(1),
                            filters.priorities.includes(priority),
                            () => {
                              const newPriorities = filters.priorities.includes(priority)
                                ? filters.priorities.filter(p => p !== priority)
                                : [...filters.priorities, priority];
                              handleFilterChange({ priorities: newPriorities });
                            }
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          {/* Error display */}
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
          
          {/* Notifications */}
          <div className="space-y-6">
            {Object.keys(groupedNotifications).length === 0 && !loading ? (
              <Card>
                <div className="p-12 text-center">
                  <svg className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                  <p className="text-sm text-gray-500">
                    You're all caught up! We'll notify you when there's something new.
                  </p>
                </div>
              </Card>
            ) : (
              Object.entries(groupedNotifications).map(([groupKey, groupNotifications]) => (
                <Card key={groupKey}>
                  <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">
                      {groupKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h2>
                  </div>
                  <NotificationList
                    notifications={groupNotifications}
                    loading={loading}
                    maxHeight="none"
                  />
                </Card>
              ))
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
