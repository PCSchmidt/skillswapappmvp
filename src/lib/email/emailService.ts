/**
 * Email Service
 * 
 * This service handles sending emails through Supabase Edge Functions
 * to manage notification emails for users.
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Email template types that match our notification types
export type EmailTemplateType = 
  | 'trade_proposal'
  | 'trade_status_accepted'
  | 'trade_status_declined'
  | 'trade_status_cancelled'
  | 'trade_status_completed'
  | 'new_message'
  | 'new_rating'
  | 'welcome'
  | 'password_reset'
  | 'verification';

// Template data interface - common properties for all email templates
interface BaseTemplateData {
  recipientName: string;
  recipientEmail: string;
}

// Trade-related template data
interface TradeTemplateData extends BaseTemplateData {
  traderId: string;
  traderName: string;
  skillName: string;
  tradeId: string;
  tradeDate?: string;
}

// Message template data
interface MessageTemplateData extends BaseTemplateData {
  senderId: string;
  senderName: string;
  tradeId: string;
  messagePreview: string;
}

// Rating template data
interface RatingTemplateData extends BaseTemplateData {
  raterId: string;
  raterName: string;
  tradeId: string;
  rating: number;
  skillName: string;
}

// Welcome template data
interface WelcomeTemplateData extends BaseTemplateData {
  verificationLink?: string;
}

// Password reset template data
interface PasswordResetTemplateData extends BaseTemplateData {
  resetLink: string;
}

// Union type of all template data types
export type EmailTemplateData = 
  | TradeTemplateData
  | MessageTemplateData
  | RatingTemplateData
  | WelcomeTemplateData
  | PasswordResetTemplateData;

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
  ): Promise<{ success: boolean; error?: any; data?: any }> {
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
    notificationData: any
  ): Promise<{ success: boolean; error?: any }> {
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
      const templateData = {
        recipientName: user.full_name,
        recipientEmail: user.email,
        ...notificationData,
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
