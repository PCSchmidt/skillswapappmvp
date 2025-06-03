import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button'; // Assuming Button is available for examples
import Card from './Card';

/**
 * The Card component is a flexible container used to group related content.
 * It supports different variants, padding, radius, and can include Header, Body, and Footer sections.
 */
const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible container component that follows the SkillSwap design system specifications.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'The visual style of the card',
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    padding: {
      description: 'The internal padding of the card',
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    radius: {
      description: 'The border radius of the card',
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    bordered: {
      description: 'Whether the card has a border',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      description: 'Whether the card should take up the full width of its container',
      control: 'boolean',
    },
    children: {
      description: 'The content of the card',
      control: false, // Children are typically custom content in stories
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Base story with default props
export const Default: Story = {
  args: {
    children: (
      <div className="text-gray-700 dark:text-gray-300">
        This is a default card with standard padding and radius.
      </div>
    ),
  },
};

// Different variants showcase
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Card variant="default">
        <div className="text-gray-700 dark:text-gray-300">Default Card</div>
      </Card>
      <Card variant="outlined">
        <div className="text-gray-700 dark:text-gray-300">Outlined Card</div>
      </Card>
      <Card variant="elevated">
        <div className="text-gray-700 dark:text-gray-300">Elevated Card</div>
      </Card>
    </div>
  ),
};

// Different padding showcase
export const Padding: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Card padding="none">
        <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4">No Padding</div>
      </Card>
      <Card padding="sm">
        <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">Small Padding</div>
      </Card>
      <Card padding="md">
        <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">Medium Padding</div>
      </Card>
      <Card padding="lg">
        <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">Large Padding</div>
      </Card>
    </div>
  ),
};

// Different radius showcase
export const Radius: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Card radius="none">
        <div className="text-gray-700 dark:text-gray-300">No Radius</div>
      </Card>
      <Card radius="sm">
        <div className="text-gray-700 dark:text-gray-300">Small Radius</div>
      </Card>
      <Card radius="md">
        <div className="text-gray-700 dark:text-gray-300">Medium Radius</div>
      </Card>
      <Card radius="lg">
        <div className="text-gray-700 dark:text-gray-300">Large Radius</div>
      </Card>
      <Card radius="full">
        <div className="text-gray-700 dark:text-gray-300 text-center">Full Radius</div>
      </Card>
    </div>
  ),
};

// Bordered card example
export const Bordered: Story = {
  args: {
    bordered: true,
    children: (
      <div className="text-gray-700 dark:text-gray-300">
        This is a bordered card.
      </div>
    ),
  },
};

// Full width example
export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <Card fullWidth>
        <div className="text-gray-700 dark:text-gray-300">
          This card takes up the full width of its container.
        </div>
      </Card>
    </div>
  ),
};

// Card with Header, Body, and Footer
export const WithSections: Story = {
  render: () => (
    <div className="w-[400px]">
      <Card>
        <Card.Header title="Card Title" subtitle="Optional subtitle" action={<Button size="sm" variant="ghost">Action</Button>} separator />
        <Card.Body>
          <div className="text-gray-700 dark:text-gray-300">
            This is the main content area of the card body.
            You can place any content here, such as text, images, or other components.
          </div>
        </Card.Body>
        <Card.Footer align="end" separator>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button variant="primary" size="sm">Save</Button>
        </Card.Footer>
      </Card>
    </div>
  ),
};

// Card with only Header and Body
export const HeaderAndBody: Story = {
  render: () => (
    <div className="w-[400px]">
      <Card>
        <Card.Header title="Card Title" separator />
        <Card.Body>
          <div className="text-gray-700 dark:text-gray-300">
            This card has a header and a body, but no footer.
          </div>
        </Card.Body>
      </Card>
    </div>
  ),
};

// Card with only Body and Footer
export const BodyAndFooter: Story = {
  render: () => (
    <div className="w-[400px]">
      <Card>
        <Card.Body>
          <div className="text-gray-700 dark:text-gray-300">
            This card has a body and a footer, but no header.
          </div>
        </Card.Body>
        <Card.Footer align="center">
          <Button variant="secondary" size="sm">Learn More</Button>
        </Card.Footer>
      </Card>
    </div>
  ),
};

// Card with custom content in Header/Footer
export const CustomSections: Story = {
  render: () => (
    <div className="w-[400px]">
      <Card>
        <Card.Header separator>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Custom Header Content</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="text-gray-700 dark:text-gray-300">
            This card demonstrates using custom content directly within the Header and Footer components instead of using the provided props.
          </div>
        </Card.Body>
        <Card.Footer separator>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: 2 hours ago
          </div>
        </Card.Footer>
      </Card>
    </div>
  ),
};

// Usage guidelines example
export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Card Usage Guidelines

### When to use each variant:

- **Default**: Standard card for general content grouping.
- **Outlined**: Use for less prominent content or when you need a lighter visual style.
- **Elevated**: Use for important content or interactive elements that need to stand out.

### Padding Guidelines:

- **none**: Use when the content inside the card provides its own spacing (e.g., images, lists).
- **sm**: Use for compact cards or lists of items.
- **md**: Default padding, suitable for most content blocks.
- **lg**: Use for cards with more substantial content or forms.

### Radius Guidelines:

- **none**: Use for sharp, angular designs.
- **sm**: Slightly rounded corners, subtle.
- **md**: Default radius, balanced and common.
- **lg**: More pronounced rounded corners, softer look.
- **full**: Use for circular elements (e.g., avatars within a card).

### Best Practices:

1. **Use Card.Header, Card.Body, and Card.Footer** for structured content.
2. **Keep card content focused** on a single topic or task.
3. **Ensure sufficient contrast** for text and elements within the card.
4. **Use elevation sparingly** for emphasis.
5. **Consider accessibility** when adding interactive elements within a card.
        `
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Do</h3>
        <Card>
          <Card.Header title="User Profile" subtitle="View and edit your profile" action={<Button size="sm">Edit</Button>} />
          <Card.Body>
            <p className="text-gray-700 dark:text-gray-300">
              This card uses Header, Body, and includes relevant actions.
            </p>
          </Card.Body>
        </Card>
      </div>

      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Don't</h3>
        <Card>
          <div className="p-4 text-gray-700 dark:text-gray-300">
            Avoid putting all content directly in the main Card div without using sections, especially for complex layouts.
          </div>
        </Card>
      </div>
    </div>
  ),
};
