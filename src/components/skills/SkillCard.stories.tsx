import type { Meta, StoryObj } from '@storybook/react';

import { Skill } from '@/types/supabase';

import SkillCard from './SkillCard';

const defaultSkill: Skill = {
  id: '1',
  user_id: 'user123',
  title: 'Web Development',
  description: 'Proficient in building responsive and dynamic web applications using modern frameworks.',
  category: 'Technology',
  subcategory: 'Frontend',
  experience_level: 'expert',
  is_offering: true,
  hourly_equivalent_value: 50,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_remote_friendly: true,
  is_remote: false, // Assuming default is false
  availability: '', // Assuming it's a string
};

const meta: Meta<typeof SkillCard> = {
  title: 'Components/Feature/SkillCard',
  component: SkillCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    skill: {
      control: 'object',
      description: 'The skill object to display.',
    },
    isOwner: {
      control: 'boolean',
      description: 'Whether the current user owns this skill.',
    },
    isProfileView: {
      control: 'boolean',
      description: 'Whether the card is displayed in a profile view (disables click behavior).',
    },
    onEdit: {
      action: 'editSkill',
      description: 'Callback function when the edit button is clicked.',
    },
    onDelete: {
      action: 'deleteSkill',
      description: 'Callback function when the delete button is clicked.',
    },
    onClick: {
      action: 'cardClicked',
      description: 'Callback function when the card is clicked (if not in profile view).',
    },
  },
  args: {
    skill: defaultSkill,
    isOwner: false,
    isProfileView: false,
  },
};

export default meta;
type Story = StoryObj<typeof SkillCard>;

export const Default: Story = {
  args: {},
};

export const OwnedSkill: Story = {
  args: {
    skill: { ...defaultSkill, title: 'Graphic Design', experience_level: 'intermediate' },
    isOwner: true,
    onEdit: () => alert('Edit clicked!'),
    onDelete: () => alert('Delete clicked!'),
  },
};

export const SeekingSkill: Story = {
  args: {
    skill: { ...defaultSkill, title: 'Data Analysis', is_offering: false, experience_level: 'beginner' },
  },
};

export const RemoteFriendly: Story = {
  args: {
    skill: { ...defaultSkill, title: 'Cloud Computing', is_remote_friendly: true },
  },
};

export const ProfileView: Story = {
  args: {
    skill: { ...defaultSkill, title: 'Project Management' },
    isProfileView: true,
    isOwner: true, // Can still be owner in profile view
    onEdit: () => alert('Edit clicked!'),
    onDelete: () => alert('Delete clicked!'),
  },
};

export const LongDescription: Story = {
  args: {
    skill: {
      ...defaultSkill,
      title: 'Advanced Machine Learning',
      description: 'Developing and deploying complex machine learning models, including deep learning architectures, natural language processing, and computer vision. Expertise in TensorFlow, PyTorch, and scikit-learn.',
    },
  },
};
