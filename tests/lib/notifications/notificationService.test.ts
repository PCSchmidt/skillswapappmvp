/**
 * Notification Service Tests
 * 
 * Tests for the notification service that handles sending in-app notifications
 */

import { notificationService, NotificationType } from '@/lib/notifications/notificationService';
import {
  resetAllSharedMocks,
  mockFrom,
  mockSelect,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockEq,
  mockOrder,
  mockSingle,
  mockRange,
  mockLimit,
  mockChainThen, // For controlling resolution of chains ending in filters/order/limit/range
} from '@supabase/supabase-js';

import { EmailTemplateType } from '@/lib/email/emailService'; // For casting in sendNotification test

// Mock the Supabase client - uses the __mocks__/@supabase/supabase-js.ts file automatically
jest.mock('@supabase/supabase-js');

// Mock the email service
jest.mock('@/lib/email/emailService', () => ({
  emailService: {
    sendNotificationEmail: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe('NotificationService', () => {
  beforeEach(() => {
    resetAllSharedMocks();
    // emailService mock needs to be cleared if its call counts are asserted per test
    require('@/lib/email/emailService').emailService.sendNotificationEmail.mockClear();
  });
  
  describe('sendNotification', () => {
    it('should successfully create an in-app notification', async () => {
      const notificationInput = {
        userId: 'user-123', type: 'trade_proposal' as NotificationType,
        title: 'New Trade', content: 'Trade for you', link: '/trade/1', sendEmail: false,
      };
      const expectedDbRecord = {
        user_id: 'user-123', type: 'trade_proposal', title: 'New Trade',
        content: 'Trade for you', link: '/trade/1', priority: 'normal', expires_at: undefined
      };
      const mockNotificationOutput = { id: 'notif-1', ...expectedDbRecord };

      mockSingle.mockResolvedValueOnce({ data: mockNotificationOutput, error: null });

      const result = await notificationService.sendNotification(notificationInput);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockNotificationOutput);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      // The insert mock from shared mock returns defaultBuilder, which has select, which returns defaultBuilder, which has single.
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining(expectedDbRecord)); // insert called with a single object
      expect(mockSelect).toHaveBeenCalledTimes(1);
      expect(mockSingle).toHaveBeenCalledTimes(1);
    });
    
    it('should send both in-app and email notifications when sendEmail is true', async () => {
      const { emailService } = require('@/lib/email/emailService');
      const notificationInput = {
        userId: 'user-123', type: 'trade_proposal' as NotificationType,
        title: 'New Trade', content: 'Trade for you', link: '/trade/1', sendEmail: true,
        emailData: { custom: 'data' }
      };
      const mockNotificationOutput = { id: 'notif-1', user_id: 'user-123' };
      mockSingle.mockResolvedValueOnce({ data: mockNotificationOutput, error: null });
      
      const result = await notificationService.sendNotification(notificationInput);
      
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockInsert).toHaveBeenCalledTimes(1);
      expect(emailService.sendNotificationEmail).toHaveBeenCalledWith(
        'user-123', notificationInput.type as EmailTemplateType,
        { custom: 'data', title: 'New Trade', content: 'Trade for you' }
      );
    });
    
    it('should use default email data if specific emailData is missing but sendEmail is true', async () => {
      const { emailService } = require('@/lib/email/emailService');
      const notificationInput = {
        userId: 'user-123', type: 'trade_proposal' as NotificationType,
        title: 'Generic Title', content: 'Generic Content', sendEmail: true,
      };
      mockSingle.mockResolvedValueOnce({ data: { id: 'notif-2' }, error: null });

      await notificationService.sendNotification(notificationInput);

      expect(emailService.sendNotificationEmail).toHaveBeenCalledWith(
        'user-123', 'trade_proposal',
        { title: 'Generic Title', content: 'Generic Content' }
      );
    });

    it('should handle errors when creating notification', async () => {
      const notificationInput = { userId: 'user-123', type: 'trade_proposal' as NotificationType, title: 'New Trade', content: 'Trade for you' };
      const dbError = new Error('DB Insert Error');
      mockSingle.mockResolvedValueOnce({ data: null, error: dbError });
      
      const result = await notificationService.sendNotification(notificationInput);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(dbError);
      expect(mockInsert).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      // The chain is update().eq(). The result of eq() is awaited.
      // mockChainThen is the .then() method of the defaultBuilder returned by mockEq.
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: { id: 'mock-notification-id' }, error: null }))
      );

      const result = await notificationService.markAsRead('notification-123');
      
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
      expect(mockEq).toHaveBeenCalledWith('id', 'notification-123');
    });
    
    it('should handle errors when marking as read', async () => {
      const dbError = new Error('Database error');
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: null, error: dbError }))
      );
      
      const result = await notificationService.markAsRead('notification-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toEqual(dbError);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: {}, error: null }))
      );

      const result = await notificationService.deleteNotification('notification-123');
      
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockEq).toHaveBeenCalledWith('id', 'notification-123');
    });
    
    it('should handle errors when deleting', async () => {
      const dbError = new Error('Database error');
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: null, error: dbError }))
      );

      const result = await notificationService.deleteNotification('notification-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toEqual(dbError);
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('getNotifications', () => {
    const defaultUserId = 'user-xyz';
    const mockNotificationsData = [{ id: 'n1', content: 'Notification 1' }, { id: 'n2', content: 'Notification 2' }];

    it('should return notifications for a user', async () => {
      // The chain is from().select().eq().order().limit().range(). <then is called on result of range>
      // resetAllSharedMocks sets mockRange to return defaultBuilder, whose .then is mockChainThen.
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: mockNotificationsData, error: null }))
      );
      
      const result = await notificationService.getNotifications(defaultUserId);
      
      expect(result.data).toEqual(mockNotificationsData);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', defaultUserId);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(50);
      expect(mockRange).toHaveBeenCalledWith(0, 49);
    });
    
    it('should filter for unread notifications when specified', async () => {
      const mockUnreadNotificationsData = [{ id: 'n3', content: 'Unread Notification', is_read: false }];
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: mockUnreadNotificationsData, error: null }))
      );
      
      const result = await notificationService.getNotifications(defaultUserId, { unreadOnly: true });
      
      expect(result.data).toEqual(mockUnreadNotificationsData);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', defaultUserId);
      expect(mockEq).toHaveBeenCalledWith('is_read', false);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(50);
      expect(mockRange).toHaveBeenCalledWith(0, 49);
    });
    
    it('should handle errors when fetching notifications', async () => {
      const dbError = new Error('DB Fetch Error');
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: null, error: dbError }))
      );

      const result = await notificationService.getNotifications(defaultUserId);
      expect(result.data).toEqual([]);
      expect(result.error).toEqual(dbError);
    });
  });
});
