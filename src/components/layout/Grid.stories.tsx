import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Column from './Column';
import Grid from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Components/Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'object', // Use object control for responsive columns
      description: 'Number of columns in the grid (e.g., { default: 1, sm: 2 }).',
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the gap between grid items.',
    },
    rowGap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Vertical gap (row gap) - if different from main gap.',
    },
    colGap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Horizontal gap (column gap) - if different from main gap.',
    },
    autoFlow: {
      control: 'select',
      options: ['auto-fit', 'auto-fill', undefined],
      description: 'Auto-fit or auto-fill behavior (only applies when columns is a number).',
    },
    minColWidth: {
      control: 'text',
      description: 'Minimum column width when using autoFlow (e.g., "200px").',
    },
    debug: {
      control: 'boolean',
      description: 'Apply debug borders to help visualize grid boundaries.',
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'ul', 'ol'],
      description: 'HTML element to render as the grid.',
    },
    children: {
      control: 'text',
      description: 'Content to be rendered within the grid (typically Column components).',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling.',
    },
  },
  args: {
    columns: { default: 1, sm: 2, md: 3, lg: 4 },
    gap: 'md',
    children: (
      <>
        <Column>
          <div className="bg-blue-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Item 1</div>
        </Column>
        <Column>
          <div className="bg-green-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Item 2</div>
        </Column>
        <Column>
          <div className="bg-red-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Item 3</div>
        </Column>
        <Column>
          <div className="bg-yellow-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Item 4</div>
        </Column>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
  args: {},
};

export const TwoColumns: Story = {
  args: {
    columns: 2,
    children: (
      <>
        <Column>
          <div className="bg-blue-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Item 1</div>
        </Column>
        <Column>
          <div className="bg-green-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Item 2</div>
        </Column>
      </>
    ),
  },
};

export const CustomGap: Story = {
  args: {
    gap: 'lg', // Use predefined gap size
    children: (
      <>
        <Column>
          <div className="bg-purple-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Item 1</div>
        </Column>
        <Column>
          <div className="bg-orange-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Item 2</div>
        </Column>
        <Column>
          <div className="bg-teal-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Item 3</div>
        </Column>
      </>
    ),
  },
};

export const ResponsiveGrid: Story = {
  args: {
    columns: { default: 1, sm: 2, lg: 4 }, // Use object for responsive columns
    gap: 'md', // Use predefined gap size
    children: (
      <>
        <Column>
          <div className="bg-gray-100 p-4 rounded-md text-center h-24 flex items-center justify-center">Responsive 1</div>
        </Column>
        <Column>
          <div className="bg-gray-200 p-4 rounded-md text-center h-24 flex items-center justify-center">Responsive 2</div>
        </Column>
        <Column>
          <div className="bg-gray-300 p-4 rounded-md text-center h-24 flex items-center justify-center">Responsive 3</div>
        </Column>
        <Column>
          <div className="bg-gray-400 p-4 rounded-md text-center h-24 flex items-center justify-center">Responsive 4</div>
        </Column>
        <Column>
          <div className="bg-gray-500 p-4 rounded-md text-center h-24 flex items-center justify-center">Responsive 5</div>
        </Column>
        <Column>
          <div className="bg-gray-600 p-4 rounded-md text-center h-24 flex items-center justify-center">Responsive 6</div>
        </Column>
      </>
    ),
  },
};
