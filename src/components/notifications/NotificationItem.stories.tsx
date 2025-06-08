import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import NotificationItem from './NotificationItem';

const meta: Meta<typeof NotificationItem> = {
  title: 'Components/Notifications/NotificationItem',
  component: NotificationItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    notification: {
      control: 'object',
      description: 'The notification object to display.',
    },
    onMarkAsRead: {
      action: 'markAsRead',
      description: 'Callback function to mark the notification as read.',
    },
    onDelete: {
      action: 'deleteNotification',
      description: 'Callback function to delete the notification.',
    },
  },
  args: {
    notification: {
      id: '1',
      user_id: 'user123',
      type: 'skill_exchange_request',
      title: 'New Skill Exchange Request',
      content: 'You have a new skill exchange request from John Doe for "Web Development".',
      is_read: false,
      created_at: new Date().toISOString(),
      expires_at: null, // Explicitly set optional properties
      metadata: null, // Explicitly set optional properties
      priority: 'high',
      link: '/dashboard/exchanges/123',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationItem>;

export const Default: Story = {
  args: {},
};

export const Unread: Story = {
  args: {
    notification: {
      id: '2', // Explicitly provide required properties
      user_id: 'user123',
      type: 'message',
      created_at: new Date().toISOString(),
      expires_at: null,
      metadata: null,
      is_read: false,
      title: 'Unread Message',
      content: 'You have 3 new messages in your inbox.',
      priority: 'urgent',
      link: null,
    },
  },
};

export const Read: Story = {
  args: {
    notification: {
      id: '3', // Explicitly provide required properties
      user_id: 'user123',
      type: 'system_notification',
      created_at: new Date().toISOString(),
      expires_at: null,
      metadata: null,
      is_read: true,
      title: 'Read Notification',
      content: 'Your profile has been updated successfully.',
      priority: 'low',
      link: null,
    },
  },
};

export const WithLongMessage: Story = {
  args: {
    notification: {
      id: '4', // Explicitly provide required properties
      user_id: 'user123',
      type: 'info',
      title: 'Important Information',
      created_at: new Date().toISOString(),
      expires_at: null,
      metadata: null,
      is_read: false,
      content: 'This is a very long notification message that should ideally wrap and not overflow the container. It provides detailed information about a recent activity on your account that requires your attention. Please review it carefully.',
      priority: 'medium',
      link: null,
    },
  },
};

export const DifferentTypes: Story = {
  render: (args) => (
    <div className="space-y-4">
      <NotificationItem
        {...args}
        notification={{
          id: '5',
          user_id: 'user123',
          created_at: new Date().toISOString(),
          expires_at: null,
          metadata: null,
          is_read: false,
          link: null,
          type: 'system_alert',
          title: 'System Alert',
          content: 'System maintenance scheduled for tonight.',
          priority: 'medium',
        }}
      />
      <NotificationItem
        {...args}
        notification={{
          id: '6',
          user_id: 'user123',
          created_at: new Date().toISOString(),
          expires_at: null,
          metadata: null,
          is_read: false,
          link: null,
          type: 'new_message',
          title: 'New Message',
          content: 'You received a new message from Sarah.',
          priority: 'high',
        }}
      />
      <NotificationItem
        {...args}
        notification={{
          id: '7',
          user_id: 'user123',
          created_at: new Date().toISOString(),
          expires_at: null,
          metadata: null,
          is_read: false,
          link: null,
          type: 'profile_update',
          title: 'Profile Update',
          content: 'Your profile picture was changed.',
          priority: 'low',
        }}
      />
    </div>
  ),
};

export const DifferentPriorities: Story = {
  render: (args) => (
    <div className="space-y-4">
      <NotificationItem
        {...args}
        notification={{
          id: '8',
          user_id: 'user123',
          type: 'task_reminder',
          created_at: new Date().toISOString(),
          expires_at: null,
          metadata: null,
          is_read: false,
          link: null,
          title: 'Urgent Task',
          content: 'Your task "Complete onboarding" is overdue.',
          priority: 'urgent',
        }}
      />
      <NotificationItem
        {...args}
        notification={{
          id: '9',
          user_id: 'user123',
          type: 'match_found',
          created_at: new Date().toISOString(),
          expires_at: null,
          metadata: null,
          is_read: false,
          link: null,
          title: 'High Priority Item',
          content: 'A new skill match has been found for you.',
          priority: 'high',
        }}
      />
      <NotificationItem
        {...args}
        notification={{
          id: '10',
          user_id: 'user123',
          type: 'skill_update',
          created_at: new Date().toISOString(),
          expires_at: null,
          metadata: null,
          is_read: false,
          link: null,
          title: 'Medium Priority Update',
          content: 'Your skill "React Development" has received 5 new views.',
          priority: 'medium',
        }}
      />
      <NotificationItem
        {...args}
        notification={{
          id: '11',
          user_id: 'user123',
          type: 'digest',
          created_at: new Date().toISOString(),
          expires_at: null,
          metadata: null,
          is_read: false,
          link: null,
          title: 'Low Priority Info',
          content: 'Weekly digest is available.',
          priority: 'low',
        }}
      />
    </div>
  ),
};

export const WithLink: Story = {
  args: {
    notification: {
      id: '12', // Explicitly provide required properties
      user_id: 'user123',
      type: 'match_found',
      title: 'View Your New Match',
      content: 'A perfect match for your "Photography" skill has been found!',
      is_read: false,
      created_at: new Date().toISOString(),
      expires_at: null,
      metadata: null,
      priority: 'medium',
      link: '/dashboard/matches/456',
    },
  },
};

export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
          The \`NotificationItem\` component is used to display individual notifications within the application.
          It supports different types, priorities, and read/unread states.
          
          ### Best Practices:
          - Keep messages concise and actionable.
          - Use appropriate priority levels to guide user attention.
          - Provide a clear link or action for the user to follow up on the notification.
          - Ensure accessibility by providing clear \`aria-label\` attributes for interactive elements.
          
          ### When to use:
          - Displaying new messages, skill exchange requests, system alerts, or profile updates.
          - Within a \`NotificationList\` or \`NotificationCenter\` component.
        `,
      },
    },
  },
  render: (args) => (
    <div className="space-y-4">
      <NotificationItem
        {...args}
        notification={{
          id: '13', // Explicitly provide required properties
          user_id: 'user123',
          type: 'example',
          created_at: new Date().toISOString(),
          expires_at: null,
          metadata: null,
          is_read: false,
          link: null,
          title: 'Example Usage',
          content: 'This is an example of how to use the NotificationItem component.',
          priority: 'medium',
        }}
      />
    </div>
  ),
};
