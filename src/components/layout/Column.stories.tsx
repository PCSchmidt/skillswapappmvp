import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Column from './Column';

const meta: Meta<typeof Column> = {
  title: 'Components/Layout/Column',
  component: Column,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    span: {
      control: 'object',
      description: 'Number of columns the item should span (e.g., { default: 1, sm: 2 }).',
    },
    start: {
      control: 'object',
      description: 'Starting column for the item (e.g., { default: 1, sm: 2 }).',
    },
    order: {
      control: 'object',
      description: 'Column ordering (e.g., { default: "first", md: 1 }).',
    },
    auto: {
      control: 'boolean',
      description: 'Auto sizing (true: column will automatically size based on content).',
    },
    debug: {
      control: 'boolean',
      description: 'Apply debug borders to help visualize column boundaries.',
    },
    as: {
      control: 'select',
      options: ['div', 'li', 'article', 'section'],
      description: 'HTML element to render as the column.',
    },
    children: {
      control: 'text',
      description: 'Content to be rendered within the column.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling.',
    },
  },
  args: {
    span: 1,
    children: (
      <div className="bg-blue-100 p-4 rounded-md text-center h-24 flex items-center justify-center">
        Column Content
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Column>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="grid grid-cols-3 gap-4 w-full">
        <Story />
        <div className="bg-gray-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Sibling 1</div>
        <div className="bg-gray-200 p-4 rounded-md text-center h-24 flex items-center justify-center">Sibling 2</div>
      </div>
    ),
  ],
};

export const SpanTwoColumns: Story = {
  args: {
    span: 2,
  },
  decorators: [
    (Story) => (
      <div className="grid grid-cols-3 gap-4 w-full">
        <Story />
        <div className="bg-gray-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Sibling</div>
      </div>
    ),
  ],
};

export const ResponsiveSpan: Story = {
  args: {
    span: { default: 3, md: 2, lg: 1 },
  },
  decorators: [
    (Story) => (
      <div className="grid grid-cols-3 gap-4 w-full">
        <Story />
        <div className="bg-gray-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Sibling 1</div>
        <div className="bg-gray-200 p-4 rounded-md text-center h-24 flex items-center justify-center">Sibling 2</div>
      </div>
    ),
  ],
};

export const StartColumn: Story = {
  args: {
    start: 2,
    span: 2, // Span 2 columns starting from column 2
    children: (
      <div className="bg-green-100 p-4 rounded-md text-center h-24 flex items-center justify-center">
        Starts at col 2, spans 2
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="grid grid-cols-4 gap-4 w-full">
        <div className="bg-gray-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Col 1</div>
        <Story />
        <div className="bg-gray-200 p-4 rounded-md text-center h-24 flex items-center justify-center">Col 4</div>
      </div>
    ),
  ],
};

export const OrderedColumn: Story = {
  args: {
    order: 'last',
    children: (
      <div className="bg-yellow-100 p-4 rounded-md text-center h-24 flex items-center justify-center">
        Last Column
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="bg-gray-100 p-4 rounded-md text-center h-24 flex items-center justify-center">First</div>
        <div className="bg-gray-200 p-4 rounded-md text-center h-24 flex items-center justify-center">Middle</div>
        <Story />
      </div>
    ),
  ],
};
