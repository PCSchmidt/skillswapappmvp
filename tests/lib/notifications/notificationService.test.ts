/**
 * Notification Service Tests
 * 
 * Tests for the notification service that handles sending in-app notifications
 */

import { notificationService } from '@/lib/notifications/notificationService';
import { mockSelectRange, mockSelectEq, mockSelectSingle } from '@supabase/supabase-js'; // Import from shared mock

// Import types from the notification service
import { NotificationType, NotificationPriority } from '@/lib/notifications/notificationService';

// Mock the Supabase client - now uses the __mocks__ version automatically
jest.mock('@supabase/supabase-js');

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
      expect(notificationService['supabase'].from().insert).toHaveBeenCalledWith({
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
        {
          ...notification.emailData,
          title: notification.title,
          content: notification.content,
        }
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
      
      // Should still create in-app notification and send a generic email
      expect(result.success).toBe(true);
      expect(notificationService['supabase'].from().insert).toHaveBeenCalled();
      expect(emailService.sendNotificationEmail).toHaveBeenCalledWith(
        notification.userId,
        notification.type,
        {
          title: notification.title,
          content: notification.content,
        }
      );
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
      expect(notificationService['supabase'].from().update).toHaveBeenCalledWith({
        is_read: true,
      });
      expect(notificationService['supabase'].from().update().eq).toHaveBeenCalledWith('id', 'notification-123');
    });
    
    it('should handle errors when marking as read', async () => {
      // Override the mock to simulate an error
      notificationService['supabase'].from().update = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error'),
        })
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
      notificationService['supabase'].from().delete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error'),
        })
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
      
      // Use the imported mockSelectRange from the shared mock
      mockSelectRange.mockResolvedValueOnce({
        data: mockNotifications,
        error: null
      });
      
      const result = await notificationService.getNotifications('user-123');
      
      expect(result.data).toEqual(mockNotifications);
      expect(notificationService['supabase'].from).toHaveBeenCalledWith('notifications');
      expect(notificationService['supabase'].from().select).toHaveBeenCalledWith('*');
      // Check that 'eq' was called with 'user_id'
      expect(mockSelectEq).toHaveBeenCalledWith('user_id', 'user-123');
    });
    
    it('should filter for unread notifications when specified', async () => {
      const expectedUnread = [{ id: 'notif-1', title: 'Unread Notification', is_read: false }];
      // Use the imported mockSelectRange from the shared mock
      mockSelectRange.mockResolvedValueOnce({ data: expectedUnread, error: null });
      
      const result = await notificationService.getNotifications('user-123', { unreadOnly: true });
      
      expect(result.data.length).toBe(1);
      expect(result.data).toEqual(expectedUnread); // Also check content
      // Check that the 'eq' mock was called with 'is_read', false
      expect(mockSelectEq).toHaveBeenCalledWith('is_read', false);
    });
    
    it('should handle errors when fetching notifications', async () => {
      // Use the imported mockSelectRange from the shared mock
      mockSelectRange.mockResolvedValueOnce({
        data: null,
        error: new Error('Database error')
      });
      
      const result = await notificationService.getNotifications('user-123');
      
      expect(result.data).toEqual([]);
      expect(result.error).toBeDefined();
    });
  });
});
