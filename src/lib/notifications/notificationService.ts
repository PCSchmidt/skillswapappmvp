/**
 * Notification Service
 * 
 * This service manages both in-app notifications and email notifications.
 * It provides a unified interface for other parts of the application to send
 * notifications to users through different channels.
 */

import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email';
import { EmailTemplateType, EmailTemplateData } from '@/types/email';
  
// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Notification type definitions
export type NotificationType = 
  | 'trade_proposal'
  | 'trade_status_accepted'
  | 'trade_status_declined'
  | 'trade_status_cancelled'
  | 'trade_status_completed'
  | 'new_message'
  | 'new_rating'
  | 'system_announcement';

// Notification priority levels
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

// Notification interface
export interface NotificationData {
  userId: string;             // Recipient user ID
  type: NotificationType;     // Type of notification
  title: string;              // Notification title
  content: string;            // Notification content/body
  link?: string;              // Optional link to direct user to relevant page
  metadata?: Record<string, unknown>; // Additional data related to the notification
  priority?: NotificationPriority; // Priority level (default: normal)
  sendEmail?: boolean;        // Whether to also send an email (default: based on user preferences)
  emailData?: EmailTemplateData; // Additional data needed for email template
  expiresAt?: Date;           // Optional expiration date
}

/**
 * Notification Service Class
 */
export class NotificationService {
  private supabase;

  constructor() {
    // Initialize Supabase client with service role key for admin access
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * Send a notification to a user (both in-app and email if enabled)
   */
  async sendNotification(data: NotificationData): Promise<{ success: boolean; error?: unknown; data?: Record<string, unknown> }> {
    try {
      const {
        userId,
        type,
        title,
        content,
        link,
        metadata,
        priority = 'normal',
        sendEmail,
        emailData,
        expiresAt
      } = data;

      // Create the in-app notification
      const { data: notification, error } = await this.supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          content,
          link,
          metadata,
          priority,
          expires_at: expiresAt
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating in-app notification:', error);
        return { success: false, error };
      }

      // Check if we should send an email notification
      if (sendEmail !== false) {
        // Send email notification (user preferences are checked within the email service)
        if (emailData) {
          await this.sendEmailNotification(userId, type as EmailTemplateType, emailData);
        }
      }

      return { success: true, data: notification };
    } catch (error) {
      console.error('Error in notification service:', error);
      return { success: false, error };
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(
    userId: string,
    type: EmailTemplateType,
    data: EmailTemplateData
  ): Promise<{ success: boolean; error?: unknown }> {
    try {
      return await emailService.sendNotificationEmail(userId, type, data);
    } catch (error) {
      console.error('Error sending email notification:', error);
      return { success: false, error };
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean; error?: unknown }> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error };
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<{ success: boolean; error?: unknown }> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error };
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean; error?: unknown }> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error };
    }
  }

  /**
   * Delete all notifications for a user
   */
  async deleteAllNotifications(userId: string): Promise<{ success: boolean; error?: unknown }> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting all notifications:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      return { success: false, error };
    }
  }

  /**
   * Get all notifications for a user
   */
  async getNotifications(
    userId: string,
    options?: {
      unreadOnly?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ data: Record<string, unknown>[]; error?: unknown }> {
    try {
      const { unreadOnly = false, limit = 50, offset = 0 } = options || {};
      
      let query = this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);
      
      // Filter for unread notifications if specified
      if (unreadOnly) {
        query = query.eq('is_read', false);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return { data: [], error };
      }
      
      return { data: data || [] };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: [], error };
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
