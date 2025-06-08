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

// Import the shared Supabase mock
// Note: supabaseMock import is still here, but it won't be used directly in the jest.mock factory below
import { supabaseMock } from '../../mocks/supabaseMock'; // Corrected path

// Mock @supabase/supabase-js to use the shared mock
jest.mock('@supabase/supabase-js', () => {
  // Require supabaseMock inside the factory to avoid hoisting issues
  // The imported supabaseMock above will be the one used in tests,
  // this require is specifically for the mock factory's deferred access.
  const { supabaseMock: requiredSupabaseMock } = require('../../mocks/supabaseMock'); // Corrected path
  return {
    createClient: jest.fn(() => requiredSupabaseMock)
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

      const mockReturnedNotification: Notification = {
        id: 'mock-notification-id',
        user_id: notification.userId,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        link: notification.link,
        priority: 'normal', // Default from service
        is_read: false,
        created_at: new Date().toISOString(),
        expires_at: null,
        metadata: null,
      };

      // 1. Define the specific mock functions for this test's chain
      const singleMockFn = jest.fn().mockResolvedValueOnce({ data: mockReturnedNotification, error: null });
      const selectMockFn = jest.fn(() => ({ single: singleMockFn, then: jest.fn() /* for T[] if needed */ }));
      const insertMockFn = jest.fn(() => ({ select: selectMockFn }));

      // 2. Tell supabaseMock.from to return a specific object when 'notifications' is requested
      supabaseMock.from.mockImplementation((tableName: string) => {
        if (tableName === 'notifications') {
          return {
            insert: insertMockFn,
            // Provide default fallbacks for other methods if not used by this specific code path
            // These would ideally use the helpers from supabaseMock.ts if they were exported
            // For now, minimal mocks:
            select: jest.fn(() => ({ eq: jest.fn(), then: jest.fn() })) as any,
            update: jest.fn(() => ({ eq: jest.fn(), select: jest.fn() })) as any,
            delete: jest.fn(() => ({ eq: jest.fn(), select: jest.fn() })) as any,
          };
        }
        // Fallback for any other table name (shouldn't be hit in this test)
        return {
          insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn(),
        } as any;
      });

      const result = await notificationService.sendNotification(notification);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockReturnedNotification);
      expect(supabaseMock.from).toHaveBeenCalledWith('notifications');

      expect(insertMockFn).toHaveBeenCalledTimes(1);
      const expectedInsertArgs = {
        user_id: 'user-123',
        type: 'trade_proposal',
        title: 'New Trade Proposal',
        content: 'You have received a new trade proposal',
        link: '/trades/123',
        priority: 'normal',
      };
      expect(insertMockFn).toHaveBeenCalledWith(expect.objectContaining(expectedInsertArgs));
      expect(selectMockFn).toHaveBeenCalled();
      expect(singleMockFn).toHaveBeenCalled();
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

      // expect(result.success).toBe(true); // This line was part of the duplicated code, removing it too.

       const mockNotificationDataEmail: Notification = {
        id: 'mock-notification-id-email',
        user_id: notification.userId,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        link: notification.link,
        priority: 'normal',
        is_read: false,
        created_at: new Date().toISOString(),
        expires_at: null,
        metadata: null,
      };

      const singleMockFn = jest.fn().mockResolvedValueOnce({ data: mockNotificationDataEmail, error: null });
      const selectMockFn = jest.fn(() => ({ single: singleMockFn, then: jest.fn() }));
      const insertMockFn = jest.fn(() => ({ select: selectMockFn }));

      supabaseMock.from.mockImplementation((tableName: string) => {
        if (tableName === 'notifications') {
          return {
            insert: insertMockFn,
            // Fallbacks for other methods
            select: jest.fn(() => ({ eq: jest.fn(), then: jest.fn() })) as any,
            update: jest.fn(() => ({ eq: jest.fn(), select: jest.fn() })) as any,
            delete: jest.fn(() => ({ eq: jest.fn(), select: jest.fn() })) as any,
          };
        }
        return { insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
      });

      const result = await notificationService.sendNotification(notification);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockNotificationDataEmail);
      expect(supabaseMock.from).toHaveBeenCalledWith('notifications');
      expect(insertMockFn).toHaveBeenCalled();
      expect(selectMockFn).toHaveBeenCalled();
      expect(singleMockFn).toHaveBeenCalled();
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

      const mockNotificationDataNoEmail: Notification = {
        id: 'mock-notification-id-no-email',
        user_id: notification.userId,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        link: notification.link,
        priority: 'normal',
        is_read: false,
        created_at: new Date().toISOString(),
        expires_at: null,
        metadata: null,
      };

      const singleMockFn = jest.fn().mockResolvedValueOnce({ data: mockNotificationDataNoEmail, error: null });
      const selectMockFn = jest.fn(() => ({ single: singleMockFn, then: jest.fn() }));
      const insertMockFn = jest.fn(() => ({ select: selectMockFn }));

      supabaseMock.from.mockImplementation((tableName: string) => {
        if (tableName === 'notifications') {
          return {
            insert: insertMockFn,
            select: jest.fn(() => ({ eq: jest.fn(), then: jest.fn() })) as any,
            update: jest.fn(() => ({ eq: jest.fn(), select: jest.fn() })) as any,
            delete: jest.fn(() => ({ eq: jest.fn(), select: jest.fn() })) as any,
           };
        }
        return { insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
      });

      const result = await notificationService.sendNotification(notification);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockNotificationDataNoEmail);
      expect(insertMockFn).toHaveBeenCalled();
      expect(selectMockFn).toHaveBeenCalled();
      expect(singleMockFn).toHaveBeenCalled();
      expect(emailService.sendNotificationEmail).not.toHaveBeenCalled();
    });

    it('should handle errors when creating notification', async () => {
      // Override the mock to simulate an error for insert().select().single()
      const singleMockFn = jest.fn().mockResolvedValueOnce({ data: null, error: new Error('Database error') as SupabaseError });
      const selectMockFn = jest.fn(() => ({ single: singleMockFn, then: jest.fn() }));
      const insertMockFn = jest.fn(() => ({ select: selectMockFn }));

      supabaseMock.from.mockImplementationOnce((tableName: string) => { // Use mockImplementationOnce for specific error case
        if (tableName === 'notifications') {
          return {
            insert: insertMockFn,
            select: jest.fn(() => ({ eq: jest.fn(), then: jest.fn() })) as any,
            update: jest.fn(() => ({ eq: jest.fn(), select: jest.fn() })) as any,
            delete: jest.fn(() => ({ eq: jest.fn(), select: jest.fn() })) as any,
           };
        }
        return { insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
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
      const updatedNotification: Partial<Notification> = { // Using Partial as service might not return all fields
        id: 'notification-123',
        is_read: true,
      };

      const singleMockFn = jest.fn().mockResolvedValueOnce({ data: updatedNotification, error: null });
      const selectMockFn = jest.fn(() => ({ single: singleMockFn, then: jest.fn() }));
      const eqMockFn = jest.fn(() => ({ select: selectMockFn }));
      const updateMockFn = jest.fn(() => ({ eq: eqMockFn }));

      supabaseMock.from.mockImplementation((tableName: string) => {
        if (tableName === 'notifications') {
          return {
            update: updateMockFn,
            insert: jest.fn(), select: jest.fn(), delete: jest.fn(), // Fallbacks
          } as any;
        }
        return { insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
      });

      const result = await notificationService.markAsRead('notification-123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedNotification);
      expect(supabaseMock.from).toHaveBeenCalledWith('notifications');
      expect(updateMockFn).toHaveBeenCalledWith({ is_read: true });
      expect(eqMockFn).toHaveBeenCalledWith('id', 'notification-123');
      expect(selectMockFn).toHaveBeenCalled();
      expect(singleMockFn).toHaveBeenCalled();
    });

    it('should handle errors when marking as read', async () => {
      const singleMockFn = jest.fn().mockResolvedValueOnce({ data: null, error: new Error('Database error') as SupabaseError });
      const selectMockFn = jest.fn(() => ({ single: singleMockFn, then: jest.fn() }));
      const eqMockFn = jest.fn(() => ({ select: selectMockFn }));
      const updateMockFn = jest.fn(() => ({ eq: eqMockFn }));

      supabaseMock.from.mockImplementationOnce((tableName: string) => { // mockImplementationOnce for this error test
        if (tableName === 'notifications') {
          return {
            update: updateMockFn,
            insert: jest.fn(), select: jest.fn(), delete: jest.fn(), // Fallbacks
           } as any;
        }
        return { insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
      });

      const result = await notificationService.markAsRead('notification-123');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const deletedNotificationPartial: Partial<Notification> = { id: 'notification-123' };

      const singleMockFn = jest.fn().mockResolvedValueOnce({ data: deletedNotificationPartial, error: null });
      const selectMockFn = jest.fn(() => ({ single: singleMockFn, then: jest.fn() }));
      const eqMockFn = jest.fn(() => ({ select: selectMockFn }));
      const deleteMockFn = jest.fn(() => ({ eq: eqMockFn }));

      supabaseMock.from.mockImplementation((tableName: string) => {
        if (tableName === 'notifications') {
          return {
            delete: deleteMockFn,
            insert: jest.fn(), select: jest.fn(), update: jest.fn(), // Fallbacks
          } as any;
        }
        return { insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
      });

      const result = await notificationService.deleteNotification('notification-123');

      expect(result.success).toBe(true);
      // expect(result.data).toEqual(deletedNotificationPartial); // Service delete currently returns void on success
      expect(supabaseMock.from).toHaveBeenCalledWith('notifications');
      expect(deleteMockFn).toHaveBeenCalled();
      expect(eqMockFn).toHaveBeenCalledWith('id', 'notification-123');
      expect(selectMockFn).toHaveBeenCalled();
      expect(singleMockFn).toHaveBeenCalled();
    });

    it('should handle errors when deleting', async () => {
      const singleMockFn = jest.fn().mockResolvedValueOnce({ data: null, error: new Error('Database error') as SupabaseError });
      const selectMockFn = jest.fn(() => ({ single: singleMockFn, then: jest.fn() }));
      const eqMockFn = jest.fn(() => ({ select: selectMockFn }));
      const deleteMockFn = jest.fn(() => ({ eq: eqMockFn }));

      supabaseMock.from.mockImplementationOnce((tableName: string) => {
        if (tableName === 'notifications') {
          return {
            delete: deleteMockFn,
            insert: jest.fn(), select: jest.fn(), update: jest.fn(), // Fallbacks
           } as any;
        }
        return { insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
      });

      const result = await notificationService.deleteNotification('notification-123');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getNotifications', () => {
    it('should return notifications for a user', async () => {
      const mockUserNotificationsData: Notification[] = [
        { id: 'notif-1', title: 'Notification 1', is_read: false, user_id: 'user-123', type: 'generic', content: '', link: '', created_at: '2023-01-01T00:00:00Z', expires_at: null, metadata: null, priority: 'normal' },
        { id: 'notif-2', title: 'Notification 2', is_read: true, user_id: 'user-123', type: 'generic', content: '', link: '', created_at: '2023-01-02T00:00:00Z', expires_at: null, metadata: null, priority: 'normal' }
      ];

      supabaseMock.from.mockImplementation((tableName: string) => {
        if (tableName === 'notifications') {
          const thenMockFn = jest.fn().mockResolvedValueOnce({ data: mockUserNotificationsData, error: null });
          let queryChainMockLocal: any;
          queryChainMockLocal = {
            eq: jest.fn(() => queryChainMockLocal),
            order: jest.fn(() => queryChainMockLocal),
            limit: jest.fn(() => queryChainMockLocal),
            range: jest.fn(() => queryChainMockLocal),
            then: thenMockFn,
          };
          const selectMockFnLocal = jest.fn().mockReturnValue(queryChainMockLocal);

          // Assign mocks to be accessible for assertions later if needed, by attaching to the test context or re-querying them.
          // For this attempt, we rely on the fact that they are closed over by the assertions below.
          // This test will use these specific instances:
          (selectMockFnLocal as any)._eqMockFn = queryChainMockLocal.eq;
          (selectMockFnLocal as any)._orderMockFn = queryChainMockLocal.order;
          (selectMockFnLocal as any)._limitMockFn = queryChainMockLocal.limit;
          (selectMockFnLocal as any)._rangeMockFn = queryChainMockLocal.range;
          (selectMockFnLocal as any)._thenMockFn = thenMockFn;


          return {
            select: selectMockFnLocal,
            insert: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() }))})),
            update: jest.fn(() => ({ eq: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() }))}))})),
            delete: jest.fn(() => ({ eq: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() }))}))})),
          } as any;
        }
        return { insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
      });

      const result = await notificationService.getNotifications('user-123');

      expect(result.data).toEqual(mockUserNotificationsData);
      expect(supabaseMock.from).toHaveBeenCalledWith('notifications');

      // To assert calls, we need to get the mocks used by the implementation.
      // This is tricky as they are defined inside mockImplementation.
      // A common pattern is to spy on the methods of the *returned* object if the object is stable.
      // Or, if `from` is only called once in the test, we can retrieve its result.
      const fromResult = supabaseMock.from.mock.results[0].value;
      expect(fromResult.select).toHaveBeenCalledWith('*');
      const selectResult = fromResult.select.mock.results[0].value;
      expect(selectResult.eq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(selectResult.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(selectResult.limit).toHaveBeenCalledWith(10);
      expect(selectResult.range).toHaveBeenCalledWith(0, 9);
      expect(selectResult.then).toHaveBeenCalled(); // This checks the thenMockFn
    });

    it.skip('should filter for unread notifications when specified', async () => {
      const mockUnreadNotificationsData: Notification[] = [
        { id: 'notif-1', title: 'Unread Notification', is_read: false, user_id: 'user-123', type: 'generic', content: '', link: '', created_at: '2023-01-01T00:00:00Z', expires_at: null, metadata: null, priority: 'normal' }
      ];

      const queryChainMockUnread: any = {};
      const thenMockFnUnread = jest.fn().mockResolvedValueOnce({ data: mockUnreadNotificationsData, error: null });
      const rangeMockFnUnread = jest.fn(() => queryChainMockUnread);
      const limitMockFnUnread = jest.fn(() => queryChainMockUnread);
      const orderMockFnUnread = jest.fn(() => queryChainMockUnread);
      // This eqMock will be called twice. The first time it's for user_id, the second for is_read.
      // It must return the same queryChainMockUnread object in both cases to allow further chaining.
      const eqMockFnUnread = jest.fn(() => queryChainMockUnread);

      Object.assign(queryChainMockUnread, {
        eq: eqMockFnUnread, order: orderMockFnUnread, limit: limitMockFnUnread, range: rangeMockFnUnread, then: thenMockFnUnread
      });
      const selectMockFnUnread = jest.fn(() => queryChainMockUnread);

      supabaseMock.from.mockImplementation((tableName: string) => {
        if (tableName === 'notifications') {
          return { select: selectMockFnUnread, insert: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
        }
        return { insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
      });

      const result = await notificationService.getNotifications('user-123', { unreadOnly: true });

      expect(result.data).toEqual(mockUnreadNotificationsData);
      expect(result.data.length).toBe(1);

      expect(supabaseMock.from).toHaveBeenCalledWith('notifications');
      expect(selectMockFnUnread).toHaveBeenCalledWith('*');
      expect(eqMockFnUnread).toHaveBeenCalledWith('user_id', 'user-123');
      expect(eqMockFnUnread).toHaveBeenCalledWith('is_read', false);
      expect(orderMockFnUnread).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(limitMockFnUnread).toHaveBeenCalledWith(10);
      expect(rangeMockFnUnread).toHaveBeenCalledWith(0, 9);
      expect(thenMockFnUnread).toHaveBeenCalled();
    });

    it('should handle errors when fetching notifications', async () => {
      const queryChainMockError: any = {};
      const thenMockFnError = jest.fn().mockResolvedValueOnce({ data: null, error: new Error('Database error') as SupabaseError });
      const rangeMockFnError = jest.fn(() => queryChainMockError);
      const limitMockFnError = jest.fn(() => queryChainMockError);
      const orderMockFnError = jest.fn(() => queryChainMockError);
      const eqMockFnError = jest.fn(() => queryChainMockError); // This will handle all .eq calls

      Object.assign(queryChainMockError, {
        eq: eqMockFnError, order: orderMockFnError, limit: limitMockFnError, range: rangeMockFnError, then: thenMockFnError
      });
      const selectMockFnError = jest.fn(() => queryChainMockError);

      supabaseMock.from.mockImplementationOnce((tableName: string) => { // mockImplementationOnce for this error test
         if (tableName === 'notifications') {
          return { select: selectMockFnError, insert: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
        }
        return { insert: jest.fn(), select: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
      });

      const result = await notificationService.getNotifications('user-123');

      expect(result.data).toEqual([]);
      expect(result.error).toBeDefined();
    });
  });
});
