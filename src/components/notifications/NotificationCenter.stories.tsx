import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from '@/types/supabase';

import NotificationCenter from './NotificationCenter';

const mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: 'user123',
    type: 'skill_exchange_request',
    title: 'New Skill Exchange Request',
    content: 'You have a new skill exchange request from John Doe for "Web Development".',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    expires_at: null,
    metadata: { sender: 'John Doe', skill: 'Web Development' },
    priority: 'high',
    link: '/dashboard/exchanges/123',
  },
  {
    id: '2',
    user_id: 'user123',
    type: 'new_message',
    title: 'New Message',
    content: 'You received a new message from Sarah.',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    expires_at: null,
    metadata: { sender: 'Sarah' },
    priority: 'urgent',
    link: '/messages/456',
  },
  {
    id: '3',
    user_id: 'user123',
    type: 'system_alert',
    title: 'System Maintenance',
    content: 'Scheduled system maintenance tonight from 10 PM to 12 AM UTC.',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    expires_at: null,
    metadata: null,
    priority: 'medium',
    link: null,
  },
  {
    id: '4',
    user_id: 'user123',
    type: 'profile_update',
    title: 'Profile Updated',
    content: 'Your profile picture was successfully updated.',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    expires_at: null,
    metadata: null,
    priority: 'low',
    link: '/profile',
  },
  {
    id: '5',
    user_id: 'user123',
    type: 'skill_update',
    title: 'Skill Views Increased',
    content: 'Your "React Development" skill has received 10 new views this week!',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    expires_at: null,
    metadata: { skill: 'React Development' },
    priority: 'high',
    link: '/skills/react-development',
  },
];

const meta: Meta<typeof NotificationCenter> = {
  title: 'Components/Notifications/NotificationCenter',
  component: NotificationCenter,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    // No direct props for NotificationCenter, it manages its own state and data fetching
  },
  render: () => { // Removed args as it's not used
    // In a real application, NotificationCenter would fetch its own data.
    // For Storybook, we can simulate initial data or provide controls for it.
    return <NotificationCenter />;
  },
};

export default meta;
type Story = StoryObj<typeof NotificationCenter>;

export const Default: Story = {
  args: {},
};

export const Empty: Story = {
  render: () => { // Removed args as it's not used
    // Simulate an empty state by providing no notifications
    return <NotificationCenter />;
  },
  parameters: {
    // Mock the useSupabase hook to return no notifications
    supabase: {
      from: () => ({
        select: () => ({
          eq: () => ({            order: () => ({
              then: (onFulfilled: (value: { data: unknown[], error: unknown }) => unknown) => {
                return Promise.resolve({ data: [], error: null }).then(onFulfilled);
              },
            }),
          }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      channel: () => ({
        on: () => ({
          subscribe: () => ({
            unsubscribe: () => {},
          }),
        }),
        removeChannel: () => Promise.resolve({ data: null, error: null }),
      }),
      rpc: () => Promise.resolve({ data: null, error: null }),
    },
  },
};

export const Loading: Story = {
  render: () => { // Removed args as it's not used
    // Simulate a loading state
    return <NotificationCenter />;
  },
  parameters: {
    // Mock the useSupabase hook to return a loading state
    supabase: {
      from: () => ({
        select: () => ({
          eq: () => ({            order: () => ({
              then: () => {
                // Never resolve the promise to simulate loading
                return new Promise(() => {}); 
              },
            }),
          }),
        }),
      }),
    },
  },
};

export const WithVariedNotifications: Story = {
  render: () => { // Removed args as it's not used
    // Simulate varied notifications
    return <NotificationCenter />;
  },
  parameters: {
    // Mock the useSupabase hook to return mockNotifications
    supabase: {
      from: () => ({
        select: () => ({
          eq: () => ({            order: () => ({
              then: (onFulfilled: (value: { data: unknown[], error: unknown }) => unknown) => {
                return Promise.resolve({ data: mockNotifications, error: null }).then(onFulfilled);
              },
            }),
          }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      channel: () => ({
        on: () => ({
          subscribe: () => ({
            unsubscribe: () => {},
          }),
        }),
        removeChannel: () => Promise.resolve({ data: null, error: null }),
      }),
      rpc: () => Promise.resolve({ data: null, error: null }),
    },
  },
};

export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
          The \`NotificationCenter\` component provides a centralized view for all user notifications.
          It includes filtering by type, priority, and read status, as well as bulk actions.
          
          ### Data Fetching:
          This component is designed to fetch its own data using the \`useSupabase\` hook.
          It subscribes to real-time updates for new notifications.
          
          ### Filtering:
          Users can filter notifications by:
          - **Status**: All, Read, Unread
          - **Time Range**: All Time, Today, This Week, This Month
          - **Type**: e.g., Skill Exchange Request, New Message, System Alert
          - **Priority**: Urgent, High, Medium, Low
          
          ### Grouping:
          Notifications are automatically grouped by context (if available in metadata) or by type.
          
          ### Best Practices:
          - Ensure notification messages are clear and actionable.
          - Use appropriate priority levels to highlight important information.
          - Provide clear navigation links for users to follow up on notifications.
          - Test responsiveness across various devices.
        `,
      },
    },
  },
  render: () => <NotificationCenter />, // Removed args as it's not used
};
