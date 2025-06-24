import type { StoryObj } from '@storybook/react';
import { Stack } from './Stack';

const meta = {
  title: 'Components/Layout/Stack',
  component: Stack,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'radio',
      options: ['row', 'col'],
      description: 'Direction of the stack (row or column)',
    },
    spacing: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Spacing between stack items',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around'],
      description: 'Justify content alignment',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'Align items alignment',
    },
    wrap: {
      control: 'boolean',
      description: 'Whether items should wrap',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child of the element',
    },
  },
  args: {
    direction: 'col',
    spacing: 'md',
    justify: 'start',
    align: 'stretch',
    wrap: false,
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded">Item 1</div>
        <div className="w-16 h-16 bg-green-500 text-white flex items-center justify-center rounded">Item 2</div>
        <div className="w-16 h-16 bg-red-500 text-white flex items-center justify-center rounded">Item 3</div>
      </>
    ),
  },
};

export const RowStack: Story = {
  args: {
    direction: 'row',
    spacing: 'lg',
    children: (
      <>
        <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded">Item 1</div>
        <div className="w-16 h-16 bg-green-500 text-white flex items-center justify-center rounded">Item 2</div>
        <div className="w-16 h-16 bg-red-500 text-white flex items-center justify-center rounded">Item 3</div>
      </>
    ),
  },
};

export const CenteredStack: Story = {
  args: {
    direction: 'col',
    justify: 'center',
    align: 'center',
    spacing: 'xl',
    children: (
      <>
        <div className="w-20 h-20 bg-purple-500 text-white flex items-center justify-center rounded">Centered 1</div>
        <div className="w-20 h-20 bg-yellow-500 text-white flex items-center justify-center rounded">Centered 2</div>
      </>
    ),
  },
};

export const WrappedStack: Story = {
  args: {
    direction: 'row',
    wrap: true,
    spacing: 'sm',
    className: 'w-64', // Constrain width to demonstrate wrapping
    children: (
      <>
        <div className="w-24 h-12 bg-indigo-500 text-white flex items-center justify-center rounded">Wrap 1</div>
        <div className="w-24 h-12 bg-pink-500 text-white flex items-center justify-center rounded">Wrap 2</div>
        <div className="w-24 h-12 bg-teal-500 text-white flex items-center justify-center rounded">Wrap 3</div>
        <div className="w-24 h-12 bg-orange-500 text-white flex items-center justify-center rounded">Wrap 4</div>
      </>
    ),
  },
};
