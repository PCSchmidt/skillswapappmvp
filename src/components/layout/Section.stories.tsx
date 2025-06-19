import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Container from './Container';
import Section from './Section';

const meta: Meta<typeof Section> = {
  title: 'Components/Layout/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to be rendered within the section.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling.',
    },
    spacingY: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Vertical padding of the section.',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'neutral', 'dark'],
      description: 'Background color variant of the section.',
    },
  },
  args: {
    children: (
      <Container className="bg-blue-100 p-8 text-center text-blue-800">
        This is content inside a Section.
      </Container>
    ),
    spacingY: 'md',
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  args: {},
};

export const WithLightBackground: Story = {
  args: {
    variant: 'default', // 'light' maps to 'default' variant
    children: (
      <Container className="p-8 text-center text-gray-800">
        This section has a light background.
      </Container>
    ),
  },
};

export const WithDarkBackground: Story = {
  args: {
    variant: 'dark',
    children: (
      <Container className="p-8 text-center text-gray-100">
        This section has a dark background.
      </Container>
    ),
  },
};

export const WithPrimaryBackground: Story = {
  args: {
    variant: 'primary',
    children: (
      <Container className="p-8 text-center text-primary-foreground">
        This section has a primary background.
      </Container>
    ),
  },
};

export const WithLargePadding: Story = {
  args: {
    spacingY: 'lg',
    children: (
      <Container className="bg-green-100 p-8 text-center text-green-800">
        This section has large vertical padding.
      </Container>
    ),
  },
};
