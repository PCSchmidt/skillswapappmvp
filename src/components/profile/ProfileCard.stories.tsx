import type { Meta, StoryObj } from '@storybook/react';
import { ProfileCard } from './ProfileCard';

const meta: Meta<typeof ProfileCard> = {
  title: 'Components/Profile/ProfileCard',
  component: ProfileCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    avatarUrl: {
      control: 'text',
      description: 'URL of the user\'s avatar image.',
    },
    fullName: {
      control: 'text',
      description: 'Full name of the user.',
    },
    bio: {
      control: 'text',
      description: 'Short description or bio of the user.',
    },
    skillCount: {
      control: 'number',
      description: 'Number of skills the user has.',
    },
    exchangeCount: {
      control: 'number',
      description: 'Number of successful exchanges the user has completed.',
    },
    onViewProfile: {
      action: 'viewProfileClicked',
      description: 'Callback function when the "View Profile" button is clicked.',
    },
  },
  args: {
    fullName: 'Jane Doe',
    bio: 'Frontend Developer | React Enthusiast',
    skillCount: 15,
    exchangeCount: 7,
  },
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

export const Default: Story = {
  args: {},
};

export const WithLongBio: Story = {
  args: {
    fullName: 'John Smith',
    bio: 'Passionate full-stack developer with expertise in Node.js, Python, and cloud technologies. Always eager to learn and build innovative solutions.',
    skillCount: 25,
    exchangeCount: 12,
  },
};

export const NoCounts: Story = {
  args: {
    fullName: 'Alice Johnson',
    bio: 'UX Designer and Prototyper',
    skillCount: undefined,
    exchangeCount: undefined,
  },
};

export const WithAvatar: Story = {
  args: {
    fullName: 'Bob Williams',
    avatarUrl: 'https://i.pravatar.cc/150?img=68', // Example avatar URL
    bio: 'Mobile App Developer',
    skillCount: 10,
    exchangeCount: 3,
  },
};
