/**
 * Notification Service Tests
 * 
 * Tests for the notification service that handles sending in-app notifications
 */

import { notificationService } from '@/lib/notifications/notificationService';

// Import types from the notification service
import { NotificationType, NotificationPriority } from '@/lib/notifications/notificationService';

// Mock data for notifications
const mockNotifications = [
  { id: 'notif-1', title: 'Notification 1', is_read: false },
  { id: 'notif-2', title: 'Notification 2', is_read: true }
];

// Mock the Supabase client with a more complete implementation
jest.mock('@supabase/supabase-js', () => {
  // Create a function to generate a chainable mock
  const createChainableMock = () => {
    const mock: any = {};
    const chainableMethods = [
      'from', 'select', 'insert', 'update', 'delete', 
      'eq', 'neq', 'order', 'limit', 'range', 'single'
    ];
    
    chainableMethods.forEach(method => {
      mock[method] = jest.fn().mockReturnValue(mock);
    });
    
    // Add promise resolution for terminal methods
    mock.then = jest.fn(callback => 
      Promise.resolve({ data: mockNotifications, error: null }).then(callback)
    );
    
    return mock;
  };
  
  // Create the main mock
  const supabaseMock: any = {
    from: jest.fn(() => {
      const mock = createChainableMock();
      
      // Override specific methods with custom implementations
      mock.insert = jest.fn().mockImplementation((data: any) => {
        const insertMock = createChainableMock();
        insertMock.select = jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'mock-notification-id', ...data },
            error: null
          })
        });
        return insertMock;
      });
      
      return mock;
    })
  };
  
  return {
    createClient: jest.fn(() => supabaseMock)
  };
});

// Mock the email service
jest.mock('@/lib/email/emailService', () => ({
  emailService: {
    sendNotificationEmail: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('sendNotification', () => {
    it('should successfully create an in-app notification', async () => {
      const notification = {
        userId: 'user-123',
        type: 'trade_proposal' as NotificationType,
        title: 'New Trade Proposal',
        content: 'You have received a new trade proposal',
        link: '/trades/123',
        sendEmail: false,
      };
      
      const result = await notificationService.sendNotification(notification);
      
      expect(result.success).toBe(true);
      expect(notificationService['supabase'].from).toHaveBeenCalledWith('notifications');
      // We need to verify the insert was called with the correct data
      // The mock structure has changed, so we need to adjust how we verify
      const insertCall = notificationService['supabase'].from().insert.mock.calls[0][0];
      expect(insertCall).toEqual({
        user_id: 'user-123',
        type: 'trade_proposal',
        title: 'New Trade Proposal',
        content: 'You have received a new trade proposal',
        link: '/trades/123',
        priority: 'normal',
      });
    });
    
    it('should send both in-app and email notifications when sendEmail is true', async () => {
      const { emailService } = require('@/lib/email/emailService');
      
      const notification = {
        userId: 'user-123',
        type: 'trade_proposal' as NotificationType,
        title: 'New Trade Proposal',
        content: 'You have received a new trade proposal',
        link: '/trades/123',
        sendEmail: true,
        emailData: {
          traderId: 'trader-456',
          traderName: 'John Doe',
          skillName: 'Web Development',
          tradeId: 'trade-123',
        },
      };
      
      const result = await notificationService.sendNotification(notification);
      
      expect(result.success).toBe(true);
      
      // Check that both in-app notification and email were sent
      expect(notificationService['supabase'].from).toHaveBeenCalledWith('notifications');
      expect(notificationService['supabase'].from().insert).toHaveBeenCalled();
      expect(emailService.sendNotificationEmail).toHaveBeenCalledWith(
        'user-123',
        'trade_proposal',
        notification.emailData
      );
    });
    
    it('should not send email when sendEmail is true but emailData is missing', async () => {
      const { emailService } = require('@/lib/email/emailService');
      
      const notification = {
        userId: 'user-123',
        type: 'trade_proposal' as NotificationType,
        title: 'New Trade Proposal',
        content: 'You have received a new trade proposal',
        link: '/trades/123',
        sendEmail: true, // true but no emailData
      };
      
      const result = await notificationService.sendNotification(notification);
      
      // Should still create in-app notification but not send email
      expect(result.success).toBe(true);
      expect(notificationService['supabase'].from().insert).toHaveBeenCalled();
      expect(emailService.sendNotificationEmail).not.toHaveBeenCalled();
    });
    
    it('should handle errors when creating notification', async () => {
      // Override the mock to simulate an error
      const mockSelect = jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error'),
        })
      });
      
      notificationService['supabase'].from().insert = jest.fn().mockReturnValue({
        select: mockSelect
      });
      
      const notification = {
        userId: 'user-123',
        type: 'trade_proposal' as NotificationType,
        title: 'New Trade Proposal',
        content: 'You have received a new trade proposal',
        link: '/trades/123',
      };
      
      const result = await notificationService.sendNotification(notification);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
  
  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const result = await notificationService.markAsRead('notification-123');
      
      expect(result.success).toBe(true);
      expect(notificationService['supabase'].from).toHaveBeenCalledWith('notifications');
      // Verify update was called with correct data
      const updateCall = notificationService['supabase'].from().update.mock.calls[0][0];
      expect(updateCall).toEqual({
        is_read: true,
      });
      expect(notificationService['supabase'].from().update().eq).toHaveBeenCalledWith('id', 'notification-123');
    });
    
    it('should handle errors when marking as read', async () => {
      // Override the mock to simulate an error
      notificationService['supabase'].from().update = jest.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });
      
      const result = await notificationService.markAsRead('notification-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
  
  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const result = await notificationService.deleteNotification('notification-123');
      
      expect(result.success).toBe(true);
      expect(notificationService['supabase'].from).toHaveBeenCalledWith('notifications');
      expect(notificationService['supabase'].from().delete).toHaveBeenCalled();
      expect(notificationService['supabase'].from().delete().eq).toHaveBeenCalledWith('id', 'notification-123');
    });
    
    it('should handle errors when deleting', async () => {
      // Override the mock to simulate an error
      notificationService['supabase'].from().delete = jest.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });
      
      const result = await notificationService.deleteNotification('notification-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
  
  describe('getNotifications', () => {
    it('should return notifications for a user', async () => {
      // Setup the mock to return notifications
      const mockNotifications = [
        { id: 'notif-1', title: 'Notification 1', is_read: false },
        { id: 'notif-2', title: 'Notification 2', is_read: true }
      ];
      
      notificationService['supabase'].from().select().eq().order().limit().range = jest.fn().mockResolvedValue({
        data: mockNotifications,
        error: null
      });
      
      const result = await notificationService.getNotifications('user-123');
      
      // Since we've changed the mock structure, we need to ensure the test data matches
      expect(result.data).toEqual(mockNotifications);
      expect(notificationService['supabase'].from).toHaveBeenCalledWith('notifications');
      expect(notificationService['supabase'].from().select).toHaveBeenCalledWith('*');
      expect(notificationService['supabase'].from().select().eq).toHaveBeenCalledWith('user_id', 'user-123');
    });
    
    it('should filter for unread notifications when specified', async () => {
      // Setup the mock returns
      notificationService['supabase'].from().select().eq().eq = jest.fn().mockReturnThis();
      notificationService['supabase'].from().select().eq().eq.order = jest.fn().mockReturnThis();
      notificationService['supabase'].from().select().eq().eq.order().limit = jest.fn().mockReturnThis();
      notificationService['supabase'].from().select().eq().eq.order().limit().range = jest.fn().mockResolvedValue({
        data: [{ id: 'notif-1', title: 'Unread Notification', is_read: false }],
        error: null
      });
      
      const result = await notificationService.getNotifications('user-123', { unreadOnly: true });
      
      expect(result.data.length).toBe(1);
      expect(notificationService['supabase'].from().select().eq().eq).toHaveBeenCalledWith('is_read', false);
    });
    
    it('should handle errors when fetching notifications', async () => {
      // Override the mock to simulate an error
      notificationService['supabase'].from().select().eq().order().limit().range = jest.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error')
      });
      
      const result = await notificationService.getNotifications('user-123');
      
      expect(result.data).toEqual([]);
      expect(result.error).toBeDefined();
    });
  });
});
