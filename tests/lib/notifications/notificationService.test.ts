/**
 * Notification Service Tests
 * 
 * Tests for the notification service that handles sending in-app notifications
 */

import { notificationService } from '@/lib/notifications/notificationService';
// Import ALL necessary mock functions and the reset utility from our shared Supabase mock
import {
  resetAllSharedMocks, // Renamed from resetSupabaseMock for clarity if needed, but let's assume it's resetAllSharedMocks now
  mockFrom,
  mockSelect,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockEq,
  mockOrder,
  mockSingle,
  mockRange,
  mockLimit, // Added mockLimit
  // mockSelectSingle is available if needed, but getNotifications uses mockSingle or mockRange/mockOrder
} from '@supabase/supabase-js';

// Import types from the notification service
import { NotificationType, NotificationPriority } from '@/lib/notifications/notificationService';

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
    // resetAllSharedMocks() will now also reset mockLimit
    resetAllSharedMocks();

    // Configure specific chaining needed by notificationService tests
    const chainableAfterSelectOrFilter = {
      eq: mockEq,
      // neq: mockNeq, // Add other filter mocks if used by notificationService
      order: mockOrder,
      single: mockSingle,
      limit: mockLimit,
      range: mockRange,
      // then: jest.fn((onfulfilled) => Promise.resolve(onfulfilled({ data: [], error: null }))), // Removed .then from intermediate chain object
    };
    mockSelect.mockReturnValue(chainableAfterSelectOrFilter);
    mockEq.mockReturnValue(chainableAfterSelectOrFilter); // eq returns the object that includes .order, .limit, .single etc.

    mockInsert.mockReturnValue({
      select: mockSelect,
      // Making insert itself thenable for when it's directly awaited
      then: jest.fn((onfulfilled) => Promise.resolve(onfulfilled({data: {id: 'mock-insert-id'}, error: null})))
    });

    mockUpdate.mockReturnValue({ eq: mockEq });
    mockDelete.mockReturnValue({ eq: mockEq });

    mockOrder.mockReturnValue({
      limit: mockLimit,
    });
    mockLimit.mockReturnValue({
      range: mockRange,
    });
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
      
      // Configure mock for insert().select().single() chain
      mockSingle.mockResolvedValueOnce({ data: { id: 'mock-notification-id' }, error: null });

      const result = await notificationService.sendNotification(notification);
      
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'user-123',
        type: 'trade_proposal',
        title: 'New Trade Proposal',
        content: 'You have received a new trade proposal',
        link: '/trades/123',
        priority: 'normal',
      }));
      expect(mockSelect).toHaveBeenCalledTimes(1); // After insert
      expect(mockSingle).toHaveBeenCalledTimes(1); // After select
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

      mockSingle.mockResolvedValueOnce({ data: { id: 'mock-notification-id' }, error: null });
      
      const result = await notificationService.sendNotification(notification);
      
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockInsert).toHaveBeenCalledTimes(1);
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

      mockSingle.mockResolvedValueOnce({ data: { id: 'mock-notification-id' }, error: null });
      
      const result = await notificationService.sendNotification(notification);
      
      expect(result.success).toBe(true);
      expect(mockInsert).toHaveBeenCalledTimes(1);
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
      // Simulate an error from the .single() call after insert().select()
      mockSingle.mockResolvedValueOnce({ data: null, error: new Error('Database error') });
      
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
      expect(mockInsert).toHaveBeenCalledTimes(1); // Insert was still called
    });
  });
  
  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      // update().eq() is expected to be thenable for this service method
      // The default reset sets eq to return a thenable object.
      // We need to ensure that the object returned by eq resolves successfully.
      // The default for eq in resetAllSharedMocks might be sufficient if it resolves to { data: {}, error: null }
      // Or, more explicitly:
      mockEq.mockImplementationOnce(() => Promise.resolve({ data: { id: 'mock-notification-id' }, error: null }));


      const result = await notificationService.markAsRead('notification-123');
      
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
      expect(mockEq).toHaveBeenCalledWith('id', 'notification-123');
    });
    
    it('should handle errors when marking as read', async () => {
      mockEq.mockImplementationOnce(() => Promise.resolve({ data: null, error: new Error('Database error') }));
      
      const result = await notificationService.markAsRead('notification-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockUpdate).toHaveBeenCalledTimes(1); // Update was still called
    });
  });
  
  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      mockEq.mockImplementationOnce(() => Promise.resolve({ data: {}, error: null }));

      const result = await notificationService.deleteNotification('notification-123');
      
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockEq).toHaveBeenCalledWith('id', 'notification-123');
    });
    
    it('should handle errors when deleting', async () => {
      mockEq.mockImplementationOnce(() => Promise.resolve({ data: null, error: new Error('Database error') }));

      const result = await notificationService.deleteNotification('notification-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('getNotifications', () => {
    it('should return notifications for a user', async () => {
      const mockNotifications = [
        { id: 'notif-1', title: 'Notification 1', is_read: false },
        { id: 'notif-2', title: 'Notification 2', is_read: true }
      ];
      mockRange.mockResolvedValueOnce({ data: mockNotifications, error: null });
      
      const result = await notificationService.getNotifications('user-123');
      
      expect(result.data).toEqual(mockNotifications);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
      // Default order and limit/range are applied by the service
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(50); // Corrected default limit
      expect(mockRange).toHaveBeenCalledWith(0, 49);  // Corrected range
    });
    
    it('should filter for unread notifications when specified', async () => {
      const expectedUnread = [{ id: 'notif-1', title: 'Unread Notification', is_read: false }];
      mockRange.mockResolvedValueOnce({ data: expectedUnread, error: null });
      
      const result = await notificationService.getNotifications('user-123', { unreadOnly: true });
      
      expect(result.data.length).toBe(1);
      expect(result.data).toEqual(expectedUnread);
      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123'); // First eq
      expect(mockEq).toHaveBeenCalledWith('is_read', false);    // Second eq
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(50); // Corrected default limit
      expect(mockRange).toHaveBeenCalledWith(0, 49);  // Corrected range
    });
    
    it('should handle errors when fetching notifications', async () => {
      mockRange.mockResolvedValueOnce({ data: null, error: new Error('Database error') });
      
      const result = await notificationService.getNotifications('user-123');
      
      expect(result.data).toEqual([]);
      expect(result.error).toBeDefined();
      expect(mockFrom).toHaveBeenCalledWith('notifications'); // Ensure basic chain started
    });
  });
});
