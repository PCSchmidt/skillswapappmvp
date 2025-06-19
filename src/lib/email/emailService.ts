/**
 * Email Service
 * 
 * This service handles sending emails through Supabase Edge Functions
 * to manage notification emails for users.
 */

import { createClient } from '@supabase/supabase-js';
import { EmailTemplateType, EmailTemplateData } from '@/types/email';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Email sending service class
 */
export class EmailService {
  private supabase;

  constructor() {
    // Initialize Supabase client with service role key for admin access
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * Send an email using the specified template and data
   */
  async sendEmail(
    templateType: EmailTemplateType,
    templateData: EmailTemplateData
  ): Promise<{ success: boolean; error?: unknown; data?: Record<string, unknown> }> {
    try {
      // Call the Supabase Edge Function for sending emails
      const { data, error } = await this.supabase.functions.invoke('send-email', {
        body: {
          templateType,
          templateData,
        },
      });

      if (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
      }

      return { success: true, data: data };
    } catch (error) {
      console.error('Error invoking email function:', error);
      return { success: false, error };
    }
  }

  /**
   * Send a notification email based on notification type and data
   */
  async sendNotificationEmail(
    userId: string,
    notificationType: EmailTemplateType,
    notificationData: EmailTemplateData
  ): Promise<{ success: boolean; error?: unknown }> {
    try {
      // First, check if the user has email notifications enabled for this type
      const { data: preferences, error: preferencesError } = await this.supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (preferencesError) {
        console.error('Error fetching email preferences:', preferencesError);
        return { success: false, error: preferencesError };
      }

      // If user has disabled this notification type, skip sending
      if (preferences && preferences[`notify_${notificationType}`] === false) {
        console.log(`User ${userId} has disabled ${notificationType} email notifications`);
        return { success: true }; // Not an error, just skipped
      }

      // Get user details for email
      const { data: user, error: userError } = await this.supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        console.error('Error fetching user details:', userError);
        return { success: false, error: userError };
      }

      // Prepare email template data
      const templateData: EmailTemplateData = {
        ...notificationData,
        recipientName: user.full_name,
        recipientEmail: user.email,
      };

      // Send the email
      return await this.sendEmail(notificationType, templateData as EmailTemplateData);
    } catch (error) {
      console.error('Error sending notification email:', error);
      return { success: false, error };
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();
