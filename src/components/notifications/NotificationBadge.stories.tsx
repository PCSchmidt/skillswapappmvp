import type { Meta, StoryObj } from '@storybook/react';

import NotificationBadge from './NotificationBadge';

const meta: Meta<typeof NotificationBadge> = {
  title: 'Components/Notifications/NotificationBadge',
  component: NotificationBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number', min: 0 },
      description: 'The number of unread notifications to display.',
    },
    max: { // Changed from maxCount to max
      control: { type: 'number', min: 0 },
      description: 'The maximum number to display before showing "+".',
    },
    hideZero: { // Changed from showZero to hideZero and inverted logic
      control: 'boolean',
      description: 'Whether to hide the badge when the count is zero.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling.',
    },
  },
  args: {
    count: 5,
    max: 99, // Changed from maxCount to max
    hideZero: true, // Inverted from showZero: false
  },
};

export default meta;
type Story = StoryObj<typeof NotificationBadge>;

export const Default: Story = {
  args: {},
};

export const WithHighCount: Story = {
  args: {
    count: 120,
  },
};

export const ShowZero: Story = {
  args: {
    count: 0,
    hideZero: false, // Inverted from showZero: true
  },
};

export const CustomMaxCount: Story = {
  args: {
    count: 10,
    max: 5, // Changed from maxCount to max
  },
};

export const CustomStyling: Story = {
  args: {
    count: 3,
    className: 'bg-purple-500 text-white',
  },
};
