import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { RatingComponent } from './RatingComponent';

const meta: Meta<typeof RatingComponent> = {
  title: 'Components/Shared/RatingComponent',
  component: RatingComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rating: {
      control: { type: 'range', min: 0, max: 5, step: 0.5 },
      description: 'The current rating value (e.g., from 0 to 5).',
    },
    maxRating: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'The maximum possible rating value.',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the rating is read-only or interactive.',
    },
    onRatingChange: {
      action: 'ratingChanged',
      description: 'Callback function when the rating changes (only if not readOnly).',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the stars.',
    },
  },
  args: {
    rating: 3.5,
    maxRating: 5,
    readOnly: true,
    size: 'md',
  },
  render: (args) => {
    const StoryComponent = () => {
      const [currentRating, setCurrentRating] = useState(args.rating);

      const handleRatingChange = (newRating: number) => {
        setCurrentRating(newRating);
        args.onRatingChange?.(newRating);
      };

      return (
        <RatingComponent
          {...args}
          rating={currentRating}
          onRatingChange={handleRatingChange}
        />
      );
    };
    return <StoryComponent />;
  },
};

export default meta;
type Story = StoryObj<typeof RatingComponent>;

export const Default: Story = {
  args: {},
};

export const ReadOnly: Story = {
  args: {
    rating: 4,
    readOnly: true,
  },
};

export const Interactive: Story = {
  args: {
    rating: 2.5,
    readOnly: false,
  },
};

export const LargeStars: Story = {
  args: {
    rating: 4.5,
    size: 'lg',
  },
};

export const SmallStars: Story = {
  args: {
    rating: 3,
    size: 'sm',
  },
};

export const MaxRating10: Story = {
  args: {
    rating: 7,
    maxRating: 10,
    readOnly: false,
  },
};
