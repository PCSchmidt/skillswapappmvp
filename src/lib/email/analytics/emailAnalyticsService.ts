/**
 * Copyright Paul C. Schmidt 2025. All rights reserved.
 * Unauthorized use, reproduction, or distribution of this software is prohibited.
 * 
 * Email Analytics Service
 * 
 * This service handles tracking and reporting of email-related analytics:
 * - Delivery status (sent, delivered, bounced)
 * - Open rates (tracks when emails are opened)
 * - Click tracking (tracks when links in emails are clicked)
 * - Engagement metrics (overall engagement with email content)
 */

import { createClient } from '@supabase/supabase-js';

// Analytics event types
export type EmailEvent = 
  | 'sent'
  | 'delivered'
  | 'bounced'
  | 'opened'
  | 'clicked'
  | 'unsubscribed';

// Analytics data types
export type EmailAnalyticsData = {
  email_id: string;
  user_id: string;
  template_id: string;
  event: EmailEvent;
  timestamp: Date;
  url?: string;           // For click events
  device?: string;        // Device info
  client?: string;        // Email client info
  metadata?: Record<string, unknown>; // Additional event metadata
};

// Analytics summary report
export type EmailAnalyticsSummary = {
  total_sent: number;
  total_delivered: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  unique_opens: number;
  unique_clicks: number;
  most_clicked_links: Array<{ url: string; clicks: number }>;
  engagement_by_time: Array<{ hour: number; count: number }>;
  engagement_by_device: Record<string, number>;
  engagement_by_client: Record<string, number>;
};

// Initialize Supabase client
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
};

/**
 * Email Analytics Service provides functions to track and analyze email interactions
 */
const emailAnalyticsService = {
  /**
   * Track an email-related event
   */
  trackEvent: async (data: EmailAnalyticsData): Promise<void> => {
    try {
      const supabase = getSupabaseClient();
      
      // Insert the event into the analytics table
      const { error } = await supabase
        .from('email_analytics_events')
        .insert({
          email_id: data.email_id,
          user_id: data.user_id,
          template_id: data.template_id,
          event: data.event,
          timestamp: data.timestamp.toISOString(),
          url: data.url || null,
          device: data.device || null,
          client: data.client || null,
          metadata: data.metadata || null
        });
      
      if (error) {
        console.error('Error tracking email event:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in email analytics service:', error);
      // Don't throw here to prevent breaking the application flow
      // Just log the error since analytics are non-critical
    }
  },
  
  /**
   * Generate tracking pixel HTML to embed in emails for open tracking
   */
  generateTrackingPixel: (emailId: string, userId: string, templateId: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://skillswap.example.com';
    const trackingUrl = `${baseUrl}/api/email/track-open?emailId=${emailId}&userId=${userId}&templateId=${templateId}`;
    
    return `<img src="${trackingUrl}" width="1" height="1" style="display:none;" alt="" />`;
  },
  
  /**
   * Generate tracking URL for click tracking in email links
   */
  generateTrackingUrl: (originalUrl: string, emailId: string, userId: string, templateId: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://skillswap.example.com';
    const encodedOriginalUrl = encodeURIComponent(originalUrl);
    
    return `${baseUrl}/api/email/track-click?emailId=${emailId}&userId=${userId}&templateId=${templateId}&redirect=${encodedOriginalUrl}`;
  },
  
  /**
   * Get analytics summary for a specific template or all templates
   */
  getAnalyticsSummary: async (filters: {
    templateId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<EmailAnalyticsSummary> => {
    try {
      const supabase = getSupabaseClient();
      
      // Build query with filters
      let query = supabase
        .from('email_analytics_events')
        .select('*');
      
      if (filters.templateId) {
        query = query.eq('template_id', filters.templateId);
      }
      
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate.toISOString());
      }
      
      // Execute query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching email analytics:', error);
        throw error;
      }
      
      // Process data for summary
      const sent = data.filter(item => item.event === 'sent').length;
      const delivered = data.filter(item => item.event === 'delivered').length;
      const opened = data.filter(item => item.event === 'opened');
      const clicked = data.filter(item => item.event === 'clicked');
      
      // Get unique users who opened emails
      const uniqueOpens = new Set(opened.map(item => item.user_id)).size;
      
      // Get unique users who clicked links
      const uniqueClicks = new Set(clicked.map(item => item.user_id)).size;
      
      // Calculate most clicked links
      const clicksByUrl: Record<string, number> = {};
      clicked.forEach(item => {
        if (item.url) {
          clicksByUrl[item.url] = (clicksByUrl[item.url] || 0) + 1;
        }
      });
      
      const mostClickedLinks = Object.entries(clicksByUrl)
        .map(([url, clicks]) => ({ url, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);
      
      // Calculate engagement by time of day
      const engagementByTime: Record<number, number> = {};
      [...opened, ...clicked].forEach(item => {
        const hour = new Date(item.timestamp).getHours();
        engagementByTime[hour] = (engagementByTime[hour] || 0) + 1;
      });
      
      const engagementByTimeArray = Array.from(
        { length: 24 },
        (_, hour) => ({ hour, count: engagementByTime[hour] || 0 })
      );
      
      // Calculate engagement by device and client
      const engagementByDevice: Record<string, number> = {};
      const engagementByClient: Record<string, number> = {};
      
      [...opened, ...clicked].forEach(item => {
        if (item.device) {
          engagementByDevice[item.device] = (engagementByDevice[item.device] || 0) + 1;
        }
        
        if (item.client) {
          engagementByClient[item.client] = (engagementByClient[item.client] || 0) + 1;
        }
      });
      
      // Calculate rates
      const deliveryRate = sent > 0 ? (delivered / sent) * 100 : 0;
      const openRate = delivered > 0 ? (opened.length / delivered) * 100 : 0;
      const clickRate = opened.length > 0 ? (clicked.length / opened.length) * 100 : 0;
      
      return {
        total_sent: sent,
        total_delivered: delivered,
        delivery_rate: Math.round(deliveryRate * 100) / 100,
        open_rate: Math.round(openRate * 100) / 100,
        click_rate: Math.round(clickRate * 100) / 100,
        unique_opens: uniqueOpens,
        unique_clicks: uniqueClicks,
        most_clicked_links: mostClickedLinks,
        engagement_by_time: engagementByTimeArray,
        engagement_by_device: engagementByDevice,
        engagement_by_client: engagementByClient
      };
    } catch (error) {
      console.error('Error generating email analytics summary:', error);
      
      // Return empty summary in case of error
      return {
        total_sent: 0,
        total_delivered: 0,
        delivery_rate: 0,
        open_rate: 0,
        click_rate: 0,
        unique_opens: 0,
        unique_clicks: 0,
        most_clicked_links: [],
        engagement_by_time: Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 })),
        engagement_by_device: {},
        engagement_by_client: {}
      };
    }
  }
};

export default emailAnalyticsService;
