import type { Meta, StoryObj } from '@storybook/react';
import Container from './Container';

const meta: Meta<typeof Container> = {
  title: 'Components/Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to be rendered inside the container.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling.',
    },
  },
  args: {
    children: (
      <div className="bg-blue-100 p-8 text-center text-blue-800">
        This is content inside the Container. It will have a max-width and be centered.
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {},
};

export const WithCustomBackground: Story = {
  args: {
    className: 'bg-green-200',
    children: (
      <div className="bg-green-100 p-8 text-center text-green-800">
        This container has a custom background color.
      </div>
    ),
  },
};

export const WithTallContent: Story = {
  args: {
    children: (
      <div className="bg-purple-100 p-8 text-center text-purple-800 h-64 flex items-center justify-center">
        This container has tall content.
      </div>
    ),
  },
};
