/**
 * Email Service Tests
 * 
 * Tests for the email service that handles sending emails through Supabase Edge Functions
 */

// Mock @supabase/supabase-js createClient
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@supabase/supabase-js';
import { EmailService } from '@/lib/email/emailService';

describe('EmailService', () => {
  let emailService: EmailService;
  let mockSupabaseClient: Record<string, unknown>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock Supabase client
    mockSupabaseClient = {
      functions: {
        invoke: jest.fn(),
      },
      from: jest.fn(),
    };
    
    // Mock createClient to return our mock client
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    
    emailService = new EmailService();
  });
  describe('sendEmail', () => {
    it('should successfully send an email', async () => {
      // Mock the functions.invoke method to return success
      (mockSupabaseClient.functions as any).invoke.mockResolvedValue({
        data: { success: true },
        error: null,
      });

      const mockTemplateData = {
        recipientName: 'John Doe',
        recipientEmail: 'john@example.com',
        traderId: 'user-123',
        traderName: 'Jane Smith',
        skillName: 'Web Development',
        tradeId: 'trade-456',
      };

      const result = await emailService.sendEmail('trade_proposal', mockTemplateData);
      
      expect(result.success).toBe(true);
      expect(emailService['supabase'].functions.invoke).toHaveBeenCalledWith(
        'send-email',
        {
          body: {
            templateType: 'trade_proposal',
            templateData: mockTemplateData,
          },
        }
      );
    });

    it('should handle errors when sending an email', async () => {
      // Mock functions.invoke to return an error
      const mockError = { message: 'Network error' };
      emailService['supabase'].functions.invoke = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const mockTemplateData = {
        recipientName: 'John Doe',
        recipientEmail: 'john@example.com',
        traderId: 'user-123',
        traderName: 'Jane Smith',
        skillName: 'Web Development',
        tradeId: 'trade-456',
      };

      const result = await emailService.sendEmail('trade_proposal', mockTemplateData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError);
    });
  });

  describe('sendNotificationEmail', () => {    it('should send notification email when user has enabled that notification type', async () => {
      // Mock user preferences query
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            notify_trade_proposal: true,
            notify_new_message: true,
            email: 'test@example.com',
            full_name: 'Test User',
          },
          error: null,
        }),
      };

      // Mock the from method to return our query builder
      (mockSupabaseClient.from as jest.Mock).mockReturnValue(mockQueryBuilder);
      
      // Mock the functions.invoke method to return success
      (mockSupabaseClient.functions as any).invoke.mockResolvedValue({
        data: { success: true },
        error: null,
      });

      const result = await emailService.sendNotificationEmail(
        'user-123',
        'trade_proposal',
        {
          recipientName: 'Test User',
          recipientEmail: 'test@example.com',
          traderId: 'user-456',
          traderName: 'Jane Smith',
          skillName: 'Web Development',
          tradeId: 'trade-789',
        }
      );

      expect(result.success).toBe(true);
    });

    it('should not send notification email when user has disabled that notification type', async () => {
      // Mock user preferences - disabled
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            notify_trade_proposal: false,
            notify_new_message: false,
          },
          error: null,
        }),
      };

      emailService['supabase'].from = jest.fn().mockReturnValue(mockQueryBuilder);

      const result = await emailService.sendNotificationEmail(
        'user-with-disabled-emails',
        'trade_proposal',
        {
          recipientName: 'Test User',
          recipientEmail: 'test@example.com',
          traderId: 'user-456',
          traderName: 'Jane Smith',
          skillName: 'Web Development',
          tradeId: 'trade-789',
        }
      );

      // Should return success but not actually send email (logged as skipped)
      expect(result.success).toBe(true);
    });

    it('should handle errors when fetching user preferences', async () => {
      // Mock database error
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error'),
        }),
      };

      emailService['supabase'].from = jest.fn().mockReturnValue(mockQueryBuilder);

      const result = await emailService.sendNotificationEmail(
        'non-existent-user',
        'trade_proposal',
        {
          recipientName: 'Test User',
          recipientEmail: 'test@example.com',
          traderId: 'user-456',
          traderName: 'Jane Smith',
          skillName: 'Web Development',
          tradeId: 'trade-789',
        }
      );

      expect(result.success).toBe(false);
    });
  });
});
