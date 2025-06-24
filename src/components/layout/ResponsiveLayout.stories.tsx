import type { StoryObj } from '@storybook/react';
import { ResponsiveLayout } from './ResponsiveLayout';

const meta = {
  title: 'Components/Layout/ResponsiveLayout',
  component: ResponsiveLayout,
  parameters: {
    layout: 'fullscreen', // Use fullscreen layout to better demonstrate responsiveness
  },
  tags: ['autodocs'],
  argTypes: {
    maxWidth: {
      control: 'text',
      description: 'Tailwind CSS max-width class (e.g., "max-w-screen-xl")',
    },
    paddingX: {
      control: 'text',
      description: 'Tailwind CSS horizontal padding class (e.g., "px-4")',
    },
    paddingY: {
      control: 'text',
      description: 'Tailwind CSS vertical padding class (e.g., "py-8")',
    },
    children: {
      control: 'text',
      description: 'Content to be rendered inside the layout',
    },
  },
  args: {
    maxWidth: 'max-w-7xl',
    paddingX: 'px-4',
    paddingY: 'py-8',
    children: (
      <div className="bg-blue-100 p-4 rounded-md text-center text-blue-800">
        This is content inside the ResponsiveLayout. Observe how it adapts to different screen sizes.
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof ResponsiveLayout>;

export const Default: Story = {
  args: {},
};

export const SmallWidth: Story = {
  args: {
    maxWidth: 'max-w-sm',
    children: (
      <div className="bg-green-100 p-4 rounded-md text-center text-green-800">
        This layout has a small maximum width.
      </div>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    paddingX: 'px-16',
    paddingY: 'py-20',
    children: (
      <div className="bg-purple-100 p-4 rounded-md text-center text-purple-800">
        This layout has larger padding.
      </div>
    ),
  },
};

export const CustomBreakpoints: Story = {
  args: {
    maxWidth: 'max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl',
    paddingX: 'px-2 sm:px-4 md:px-6 lg:px-8',
    children: (
      <div className="bg-yellow-100 p-4 rounded-md text-center text-yellow-800">
        This layout uses custom breakpoints for width and padding. Resize the browser to see changes.
      </div>
    ),
  },
};
