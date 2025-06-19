import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { SearchFilter } from './SearchFilter';

const meta: Meta<typeof SearchFilter> = {
  title: 'Components/Feature/SearchFilter',
  component: SearchFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    query: {
      control: 'text',
      description: 'Current search query string.',
    },
    onQueryChange: {
      action: 'queryChanged',
      description: 'Callback for when the search query changes.',
    },
    category: {
      control: 'select',
      options: ['Technology', 'Arts', 'Science', 'Business'],
      description: 'Current selected category.',
    },
    categoryOptions: {
      control: 'object',
      description: 'Options for category selection.',
    },
    onCategoryChange: {
      action: 'categoryChanged',
      description: 'Callback for when the category changes.',
    },
    experienceLevel: {
      control: 'select',
      options: ['Beginner', 'Intermediate', 'Expert'],
      description: 'Current selected experience level.',
    },
    experienceLevelOptions: {
      control: 'object',
      description: 'Options for experience level selection.',
    },
    onExperienceLevelChange: {
      action: 'experienceLevelChanged',
      description: 'Callback for when the experience level changes.',
    },
    onApplyFilters: {
      action: 'applyFilters',
      description: 'Callback for when the search filters are applied.',
    },
    onResetFilters: {
      action: 'resetFilters',
      description: 'Callback for when the filters are reset.',
    },
  },
  args: {
    query: '',
    category: '',
    experienceLevel: '',
    categoryOptions: [
      { value: 'technology', label: 'Technology' },
      { value: 'arts', label: 'Arts' },
      { value: 'science', label: 'Science' },
      { value: 'business', label: 'Business' },
    ],
    experienceLevelOptions: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'expert', label: 'Expert' },
    ],
  },
  render: (args) => {
    const StoryComponent = () => {
      const [query, setQuery] = useState(args.query);
      const [category, setCategory] = useState(args.category);
      const [experienceLevel, setExperienceLevel] = useState(args.experienceLevel);

      const handleReset = () => {
        setQuery('');
        setCategory('');
        setExperienceLevel('');
        args.onResetFilters();
      };

      return (
        <SearchFilter
          {...args}
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          experienceLevel={experienceLevel}
          onExperienceLevelChange={setExperienceLevel}
          onResetFilters={handleReset}
        />
      );
    };
    return <StoryComponent />;
  },
};

export default meta;
type Story = StoryObj<typeof SearchFilter>;

export const Default: Story = {
  args: {},
};

export const WithInitialValues: Story = {
  args: {
    query: 'React Development',
    category: 'technology',
    experienceLevel: 'expert',
  },
};

export const NoCategoryOptions: Story = {
  args: {
    categoryOptions: [],
  },
};

export const NoExperienceLevelOptions: Story = {
  args: {
    experienceLevelOptions: [],
  },
};
