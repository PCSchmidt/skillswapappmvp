/**
 * Email Service Tests
 * 
 * Tests for the email service that handles sending emails through Supabase Edge Functions
 */

import { EmailService } from '@/lib/email/emailService';

// Use global mocks - no inline mocking needed
// The global mocks from __mocks__ directory will handle Supabase

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    jest.clearAllMocks();
    emailService = new EmailService();
  });

  describe('sendEmail', () => {
    it('should successfully send an email', async () => {
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

  describe('sendNotificationEmail', () => {
    it('should send notification email when user has enabled that notification type', async () => {
      // Mock user preferences - enabled
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

      emailService['supabase'].from = jest.fn().mockReturnValue(mockQueryBuilder);

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
