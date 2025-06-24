/**
 * Copyright Paul C. Schmidt 2025. All rights reserved.
 * Unauthorized use, reproduction, or distribution of this software is prohibited.
 * 
 * Notification Scheduling Service
 * 
 * This service handles the scheduling, management, and delivery of delayed notifications.
 * Key features:
 * - Schedule notifications for future delivery
 * - Cancel scheduled notifications
 * - Reschedule existing notifications
 * - Process and deliver due notifications
 */

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Types for notification scheduling
export type ScheduledNotification = {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  link?: string;
  scheduled_for: Date;
  created_at: Date;
  metadata: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'cancelled' | 'failed';
};

// Type for creating a new scheduled notification
export type CreateScheduledNotification = Omit<ScheduledNotification, 'id' | 'created_at' | 'status'>;

// Initialize Supabase client
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
};

/**
 * The NotificationSchedulingService manages delayed notification delivery
 */
const notificationSchedulingService = {
  /**
   * Schedule a notification for future delivery
   */
  scheduleNotification: async (notification: CreateScheduledNotification): Promise<string> => {
    try {
      const supabase = getSupabaseClient();
      const id = uuidv4();
      
      const { error } = await supabase
        .from('scheduled_notifications')
        .insert({
          id,
          user_id: notification.user_id,
          notification_type: notification.notification_type,
          title: notification.title,
          message: notification.message,
          link: notification.link || null,
          scheduled_for: notification.scheduled_for.toISOString(),
          created_at: new Date().toISOString(),
          metadata: notification.metadata || {},
          status: 'pending'
        });
      
      if (error) {
        console.error('Error scheduling notification:', error);
        throw error;
      }
      
      return id;
    } catch (error) {
      console.error('Error in notification scheduling service:', error);
      throw error;
    }
  },
  
  /**
   * Get a scheduled notification by ID
   */
  getScheduledNotification: async (id: string): Promise<ScheduledNotification | null> => {
    try {
      const supabase = getSupabaseClient();
      
      const { data, error } = await supabase
        .from('scheduled_notifications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // Not found
          return null;
        }
        throw error;
      }
      
      // Convert dates from strings
      return {
        ...data,
        scheduled_for: new Date(data.scheduled_for),
        created_at: new Date(data.created_at)
      };
    } catch (error) {
      console.error('Error getting scheduled notification:', error);
      throw error;
    }
  },
  
  /**
   * Cancel a scheduled notification
   */
  cancelScheduledNotification: async (id: string): Promise<boolean> => {
    try {
      const supabase = getSupabaseClient();
      
      const { data, error } = await supabase
        .from('scheduled_notifications')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .eq('status', 'pending')
        .select('id');
      
      if (error) {
        console.error('Error cancelling notification:', error);
        throw error;
      }
      
      // Return true if a notification was actually cancelled
      return data && data.length > 0;
    } catch (error) {
      console.error('Error in notification cancellation:', error);
      throw error;
    }
  },
  
  /**
   * Reschedule an existing notification to a new time
   */
  rescheduleNotification: async (id: string, newTime: Date): Promise<boolean> => {
    try {
      const supabase = getSupabaseClient();
      
      const { data, error } = await supabase
        .from('scheduled_notifications')
        .update({ scheduled_for: newTime.toISOString() })
        .eq('id', id)
        .eq('status', 'pending')
        .select('id');
      
      if (error) {
        console.error('Error rescheduling notification:', error);
        throw error;
      }
      
      // Return true if a notification was actually rescheduled
      return data && data.length > 0;
    } catch (error) {
      console.error('Error in notification rescheduling:', error);
      throw error;
    }
  },
  
  /**
   * Get all pending notifications for a user
   */
  getPendingNotifications: async (userId: string): Promise<ScheduledNotification[]> => {
    try {
      const supabase = getSupabaseClient();
      
      const { data, error } = await supabase
        .from('scheduled_notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error getting pending notifications:', error);
        throw error;
      }
      
      // Convert dates from strings
      return data.map(notification => ({
        ...notification,
        scheduled_for: new Date(notification.scheduled_for),
        created_at: new Date(notification.created_at)
      }));
    } catch (error) {
      console.error('Error in getting pending notifications:', error);
      return [];
    }
  },
  
  /**
   * Process due notifications (to be called by a scheduled job/function)
   * This function finds all notifications that are due and processes them
   */
  processDueNotifications: async (): Promise<number> => {
    try {
      const supabase = getSupabaseClient();
      const now = new Date().toISOString();
      
      // Get all due notifications
      const { data: dueNotifications, error: fetchError } = await supabase
        .from('scheduled_notifications')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', now)
        .limit(100); // Process in batches
      
      if (fetchError) {
        console.error('Error fetching due notifications:', fetchError);
        throw fetchError;
      }
      
      if (!dueNotifications || dueNotifications.length === 0) {
        return 0;
      }
      
      // Process each notification
      const processedIds: string[] = [];
      
      for (const notification of dueNotifications) {
        try {
          // Here you would actually deliver the notification through your notification system
          // This could involve:
          // 1. Creating an entry in your notifications table
          // 2. Triggering a push notification
          // 3. Sending an in-app notification
          // 4. Potentially sending an email
          
          // For now, we'll just mark it as delivered
          processedIds.push(notification.id);
        } catch (error) {
          console.error(`Error processing notification ${notification.id}:`, error);
          
          // Mark the notification as failed
          await supabase
            .from('scheduled_notifications')
            .update({ status: 'failed' })
            .eq('id', notification.id);
        }
      }
      
      // Mark all successfully processed notifications as delivered
      if (processedIds.length > 0) {
        const { error: updateError } = await supabase
          .from('scheduled_notifications')
          .update({ status: 'delivered' })
          .in('id', processedIds);
        
        if (updateError) {
          console.error('Error updating notification statuses:', updateError);
        }
      }
      
      return processedIds.length;
    } catch (error) {
      console.error('Error in processing due notifications:', error);
      return 0;
    }
  },
  
  /**
   * Schedule a recurring notification
   */
  scheduleRecurringNotification: async (
    baseNotification: Omit<CreateScheduledNotification, 'scheduled_for'>,
    schedule: {
      startDate: Date;
      recurrencePattern: 'daily' | 'weekly' | 'monthly';
      occurrences: number;
    }
  ): Promise<string[]> => {
    const notificationIds: string[] = [];
    const { startDate, recurrencePattern, occurrences } = schedule;
    
    try {
      // Calculate dates for each occurrence
      const dates: Date[] = [];
      const currentDate = new Date(startDate);
      
      for (let i = 0; i < occurrences; i++) {
        dates.push(new Date(currentDate));
        
        // Calculate next date based on recurrence pattern
        if (recurrencePattern === 'daily') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (recurrencePattern === 'weekly') {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (recurrencePattern === 'monthly') {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
      
      // Schedule each notification
      for (const date of dates) {
        const id = await notificationSchedulingService.scheduleNotification({
          ...baseNotification,
          scheduled_for: date,
          // Add metadata about the recurrence
          metadata: {
            ...baseNotification.metadata,
            isRecurring: true,
            recurrencePattern,
            occurrenceNumber: dates.indexOf(date) + 1,
            totalOccurrences: occurrences
          }
        });
        
        notificationIds.push(id);
      }
      
      return notificationIds;
    } catch (error) {
      console.error('Error scheduling recurring notifications:', error);
      
      // If we've already created some notifications but encounter an error,
      // try to cancel the ones we've already created
      for (const id of notificationIds) {
        try {
          await notificationSchedulingService.cancelScheduledNotification(id);
        } catch (cancelError) {
          console.error(`Error cancelling notification ${id} after scheduling failure:`, cancelError);
        }
      }
      
      throw error;
    }
  }
};

export default notificationSchedulingService;
