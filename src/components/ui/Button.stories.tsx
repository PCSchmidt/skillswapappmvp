import type { Meta, StoryObj } from '@storybook/react';
import { FiSearch, FiArrowRight, FiPlus, FiCheck } from 'react-icons/fi';
import Button from './Button';

/**
 * The Button component is a versatile UI element used throughout the application
 * for user interactions. It comes in multiple variants, sizes, and states to fit 
 * different design needs while maintaining consistency.
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component that follows the SkillSwap design system specifications.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'The visual style of the button',
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      description: 'The size of the button',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    isLoading: {
      description: 'Shows a loading spinner in the button',
      control: 'boolean',
    },
    disabled: {
      description: 'Disables the button',
      control: 'boolean',
    },
    fullWidth: {
      description: 'Makes the button take up the full width of its container',
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Base story with all default props
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

// Different variants showcase
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

// Different sizes showcase
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

// With icons examples
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button icon={<FiSearch />}>Search</Button>
      <Button icon={<FiArrowRight />} iconPosition="right">Next</Button>
      <Button icon={<FiPlus />} variant="secondary">Add Item</Button>
      <Button icon={<FiCheck />} variant="outline">Confirm</Button>
      <Button icon={<FiSearch />} variant="ghost">Browse</Button>
    </div>
  ),
};

// Loading state examples
export const LoadingState: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button isLoading>Loading</Button>
      <Button isLoading loadingText="Saving...">Save</Button>
      <Button isLoading variant="secondary">Loading</Button>
      <Button isLoading variant="outline" loadingText="Processing...">Submit</Button>
    </div>
  ),
};

// Full width examples
export const FullWidth: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Button fullWidth>Full Width Button</Button>
      <Button fullWidth variant="secondary">Full Width Secondary</Button>
      <Button fullWidth variant="outline">Full Width Outline</Button>
    </div>
  ),
};

// Disabled state examples
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled</Button>
      <Button disabled variant="secondary">Disabled</Button>
      <Button disabled variant="outline">Disabled</Button>
      <Button disabled variant="ghost">Disabled</Button>
      <Button disabled variant="danger">Disabled</Button>
    </div>
  ),
};

// Button with different colors based on variant
export const ColorUsage: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Primary Actions (High Emphasis)</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Secondary Actions (Medium Emphasis)</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Destructive Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="danger">Danger Button</Button>
        </div>
      </div>
    </div>
  ),
};

// Accessibility examples 
export const AccessibilityExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Keyboard Navigation</h3>
        <p className="text-sm text-gray-600 mb-2">All buttons are focusable and can be activated with Space or Enter keys.</p>
        <div className="flex gap-4">
          <Button>Tab to Focus</Button>
          <Button variant="outline">Press Space/Enter</Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Loading States</h3>
        <p className="text-sm text-gray-600 mb-2">Loading buttons have aria-busy attribute set to true.</p>
        <Button isLoading loadingText="Loading...">Submit</Button>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Disabled States</h3>
        <p className="text-sm text-gray-600 mb-2">Disabled buttons have aria-disabled attribute set to true.</p>
        <Button disabled>Disabled Button</Button>
      </div>
    </div>
  ),
};

// Usage guidelines example
export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Button Usage Guidelines

### When to use each variant:

- **Primary**: Use for the main action in a section or form
- **Secondary**: Use for alternative actions that are still important
- **Outline**: Use for secondary actions that should be less visually prominent
- **Ghost**: Use for tertiary actions or in compact UIs where buttons should be subtle
- **Danger**: Use for destructive actions like delete or remove

### Sizing Guidelines:

- **xs**: Use in very compact UIs or inside tables
- **sm**: Use in cards, compact forms, or alongside other small components
- **md**: Default size, appropriate for most use cases
- **lg**: Use for prominent actions or when buttons need to be more easily tappable
- **xl**: Use for very prominent CTAs, especially on marketing pages

### Accessibility Tips:

- Ensure button text clearly indicates the action (e.g., "Save Changes" instead of just "Submit")
- Use the most appropriate variant for the action's importance
- Add appropriate aria attributes for custom behaviors
- Maintain adequate touch target size (44x44px) for mobile interfaces by using md size or larger
        `
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Form Example</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 p-3 rounded">Form fields would go here</div>
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Dialog Example</h3>
        <div className="space-y-4">
          <p className="text-sm">Are you sure you want to delete this item?</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button variant="danger">Delete Item</Button>
          </div>
        </div>
      </div>
    </div>
  ),
};
