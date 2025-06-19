import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './Avatar';

/**
 * The Avatar component is used to represent a user or entity, typically with an image or initials.
 * It supports different sizes and shapes.
 */
const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for displaying user avatars, with support for images and initials fallback.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      description: 'The image URL for the avatar',
      control: 'text',
    },
    alt: {
      description: 'Alt text for the avatar image, used for accessibility and initials fallback',
      control: 'text',
    },
    size: {
      description: 'The size of the avatar',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    shape: {
      description: 'The shape of the avatar',
      control: 'select',
      options: ['circle', 'square'],
      table: {
        defaultValue: { summary: 'circle' },
      },
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// Base story with default props and initials fallback
export const Initials: Story = {
  args: {
    alt: 'John Doe',
  },
};

// Avatar with an image
export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    alt: 'User Photo',
  },
};

// Different sizes showcase (Initials)
export const SizesInitials: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar size="xs" alt="JD" />
      <Avatar size="sm" alt="JD" />
      <Avatar size="md" alt="JD" />
      <Avatar size="lg" alt="JD" />
      <Avatar size="xl" alt="JD" />
    </div>
  ),
};

// Different sizes showcase (Image)
export const SizesImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    alt: 'User Photo',
  },
  render: (args) => (
    <div className="flex items-center space-x-4">
      <Avatar {...args} size="xs" />
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
};

// Different shapes showcase (Initials)
export const ShapesInitials: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar shape="circle" alt="JD" />
      <Avatar shape="square" alt="JD" />
    </div>
  ),
};

// Different shapes showcase (Image)
export const ShapesImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    alt: 'User Photo',
  },
  render: (args) => (
    <div className="flex items-center space-x-4">
      <Avatar {...args} shape="circle" />
      <Avatar {...args} shape="square" />
    </div>
  ),
};

// Initials fallback with different names
export const InitialsFallback: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar alt="Alice" size="md" />
      <Avatar alt="Bob Smith" size="md" />
      <Avatar alt="Charlie Brown" size="md" />
      <Avatar alt="David Lee Jones" size="md" /> {/* Should show DL */}
    </div>
  ),
};

// Usage guidelines example
export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Avatar Usage Guidelines

### When to use Avatars:

- To represent individual users in profiles, comments, lists, etc.
- To provide a visual cue for user identity.

### Sizing Guidelines:

- **xs**: Use in very compact UIs or alongside small text.
- **sm**: Use in lists, tables, or alongside small components.
- **md**: Default size, appropriate for most general use cases.
- **lg**: Use in profile headers or prominent user displays.
- **xl**: Use for large profile displays or hero sections.

### Shape Guidelines:

- **circle**: Standard shape for user avatars.
- **square**: Can be used for group avatars, application icons, or specific design needs.

### Best Practices:

1. **Always provide meaningful \`alt\` text**: This is crucial for accessibility and the initials fallback.
2. **Use appropriate sizes**: Choose a size that fits the context without being too large or too small.
3. **Maintain consistency**: Use the same shape and size for avatars within a specific context (e.g., all avatars in a list should be the same size and shape).
4. **Ensure images are appropriately sized and optimized**: Avoid using very large images that can impact performance.

### Accessibility Tips:

- The \`alt\` text is read by screen readers, so make it descriptive (e.g., "User's profile picture").
- Ensure sufficient contrast for the initials fallback text against the background.
        `
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Do</h3>
        <div className="flex items-center space-x-4">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Jane Doe's profile picture" size="md" />
          <Avatar alt="John Smith" size="md" />
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Don't</h3>
        <div className="flex items-center space-x-4">
          <Avatar alt="" size="md" /> {/* Missing alt text */}
          <Avatar alt="User" size="md" /> {/* Vague alt text */}
        </div>
      </div>
    </div>
  ),
};
