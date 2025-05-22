/**
 * Email Service Tests
 * 
 * Tests for the email service that handles sending emails through Supabase Edge Functions
 */

import { EmailService } from '@/lib/email/emailService';

// Create a properly chainable query builder
const createQueryBuilder = (customBehavior = {}) => {
  const queryBuilder = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockImplementation((field, value) => {
      if (field === 'user_id') {
        if (value === 'user-with-disabled-emails') {
          return {
            ...queryBuilder,
            single: jest.fn().mockResolvedValue({
              data: {
                notify_trade_proposal: false,
                notify_new_message: false,
              },
              error: null,
            }),
          };
        } else if (value === 'non-existent-user') {
          return {
            ...queryBuilder,
            single: jest.fn().mockResolvedValue({
              data: null,
              error: 'User not found',
            }),
          };
        }
      }
      
      return {
        ...queryBuilder,
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
    }),
    neq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: { id: 'mock-id' },
      error: null,
    }),
    then: jest.fn(callback => 
      Promise.resolve({
        data: { success: true },
        error: null
      }).then(callback)
    ),
    ...customBehavior
  };
  
  return queryBuilder;
};

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    functions: {
      invoke: jest.fn().mockImplementation((functionName, { body }) => {
        if (functionName === 'send-email') {
          // Successful email sending
          if (body.templateData.recipientEmail !== 'error@example.com') {
            return Promise.resolve({
              data: { messageId: 'mock-message-id' },
              error: null,
            });
          } 
          // Simulate error
          else {
            return Promise.resolve({
              data: null,
              error: 'Failed to send email',
            });
          }
        }
      }),
    },
    from: jest.fn().mockImplementation(() => createQueryBuilder()),
  })),
}));

// Mock the process.env variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-supabase-url.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

describe('EmailService', () => {
  let emailService: EmailService;
  
  beforeEach(() => {
    // Create a new instance for each test
    emailService = new EmailService();
    
    // Mock the methods that fetch user details
    jest.spyOn(emailService['supabase'], 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockImplementation((field, value) => ({
        single: jest.fn().mockResolvedValue({
          data: {
            email: 'test@example.com',
            full_name: 'Test User',
          },
          error: null,
        }),
      })),
    } as any);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
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
      const mockTemplateData = {
        recipientName: 'Error User',
        recipientEmail: 'error@example.com', // This will trigger the error case in our mock
        traderId: 'user-123',
        traderName: 'Jane Smith',
        skillName: 'Web Development',
        tradeId: 'trade-456',
      };
      
      const result = await emailService.sendEmail('trade_proposal', mockTemplateData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
  
  describe('sendNotificationEmail', () => {
    it('should send notification email when user has enabled that notification type', async () => {
      // Set up spy on the sendEmail method
      const sendEmailSpy = jest.spyOn(emailService, 'sendEmail').mockResolvedValue({
        success: true,
        data: { messageId: 'mock-message-id' },
      });
      
      // Setup mock for this test
      emailService['supabase'].from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockImplementation((field, value) => ({
          single: jest.fn().mockResolvedValue({
            data: {
              notify_trade_proposal: true,
              notify_new_message: true,
              email: 'enabled@example.com',
              full_name: 'Enabled User',
            },
            error: null,
          }),
        })),
      });
      
      const mockNotificationData = {
        traderId: 'user-123',
        traderName: 'Jane Smith',
        skillName: 'Web Development',
        tradeId: 'trade-456',
      };
      
      const result = await emailService.sendNotificationEmail(
        'user-with-enabled-emails',
        'trade_proposal',
        mockNotificationData
      );
      
      expect(result.success).toBe(true);
      expect(sendEmailSpy).toHaveBeenCalled();
    });
    
    it('should not send notification email when user has disabled that notification type', async () => {
      // Set up spy on the sendEmail method
      const sendEmailSpy = jest.spyOn(emailService, 'sendEmail').mockResolvedValue({
        success: true,
        data: { messageId: 'mock-message-id' },
      });
      
      // Setup mock for this test to return disabled preferences
      emailService['supabase'].from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockImplementation((field, value) => ({
          single: jest.fn().mockResolvedValue({
            data: {
              notify_trade_proposal: false, // Disabled for this notification type
              notify_new_message: false,
              email: 'disabled@example.com',
              full_name: 'Disabled User',
            },
            error: null,
          }),
        })),
      });
      
      const mockNotificationData = {
        traderId: 'user-123',
        traderName: 'Jane Smith',
        skillName: 'Web Development',
        tradeId: 'trade-456',
      };
      
      const result = await emailService.sendNotificationEmail(
        'user-with-disabled-emails',
        'trade_proposal',
        mockNotificationData
      );
      
      // It should still return success, but sendEmail should not be called
      expect(result.success).toBe(true);
      expect(sendEmailSpy).not.toHaveBeenCalled();
    });
    
    it('should handle errors when fetching user preferences', async () => {
      // Setup mock for this test to simulate a DB error
      emailService['supabase'].from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockImplementation((field, value) => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: new Error('Database error'),
          }),
        })),
      });
      
      const mockNotificationData = {
        traderId: 'user-123',
        traderName: 'Jane Smith',
        skillName: 'Web Development',
        tradeId: 'trade-456',
      };
      
      const result = await emailService.sendNotificationEmail(
        'error-user',
        'trade_proposal',
        mockNotificationData
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
