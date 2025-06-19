import type { Meta, StoryObj } from '@storybook/react';
import { FiInfo } from 'react-icons/fi'; // Example icon
import Button from './Button'; // Assuming Button is available for examples
import Tooltip from './Tooltip';

/**
 * The Tooltip component displays informative text or content when a user
 * hovers over or focuses on an element.
 */
const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for displaying tooltips on hover or focus.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: 'The content to display inside the tooltip',
      control: 'text',
    },
    children: {
      description: 'The element that triggers the tooltip',
      control: false, // Children are the trigger elements in stories
    },
    position: {
      description: 'The position of the tooltip relative to the trigger element',
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      table: {
        defaultValue: { summary: 'top' },
      },
    },
    className: {
      description: 'Optional CSS class names for the tooltip content',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// Base story with default position
export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <Button>Hover over me</Button>,
  },
};

// Different positions showcase
export const Positions: Story = {
  render: () => (
    <div className="flex flex-col items-center space-y-10 p-20"> {/* Added padding for visibility */}
      <Tooltip content="Tooltip on top" position="top">
        <Button size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Tooltip on bottom" position="bottom">
        <Button size="sm">Bottom</Button>
      </Tooltip>
      <div className="flex space-x-10">
        <Tooltip content="Tooltip on left" position="left">
          <Button size="sm">Left</Button>
        </Tooltip>
        <Tooltip content="Tooltip on right" position="right">
          <Button size="sm">Right</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

// Tooltip with different trigger elements
export const WithDifferentTriggers: Story = {
  render: () => (
    <div className="flex items-center space-x-10 p-10"> {/* Added padding for visibility */}
      <Tooltip content="Info about this field">
        <FiInfo size={20} className="text-gray-500 cursor-help" />
      </Tooltip>
      <Tooltip content="This is a text link tooltip">
        <a href="#" className="text-primary-600 hover:underline">Hover over this link</a>
      </Tooltip>
      <Tooltip content={<div><strong>Rich Content</strong><p>This tooltip has HTML.</p></div>}>
        <span>Hover for rich content</span>
      </Tooltip>
    </div>
  ),
};

// Usage guidelines example
export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Tooltip Usage Guidelines

### When to use Tooltips:

- To provide brief, supplementary information about an element on hover or focus.
- To explain the function of an icon or a concise label.

### When NOT to use Tooltips:

- For essential information that users must see to complete a task.
- For long or complex content.
- As a substitute for proper labeling or instructions.
- For interactive content (buttons, links) within the tooltip itself.

### Best Practices:

1. **Keep tooltip content concise**: Tooltips should be short phrases or sentences.
2. **Use tooltips for non-essential information**: The UI should be understandable without relying solely on tooltips.
3. **Ensure tooltips are accessible**: They should be keyboard focusable and perceivable by screen readers.
4. **Choose the appropriate position**: Ensure the tooltip does not obscure important content or the trigger element.
5. **Avoid nesting interactive elements** inside tooltips.

### Accessibility Tips:

- Ensure the trigger element is keyboard focusable (e.g., using a button or adding \`tabindex="0"\`).
- Use \`aria-describedby\` or \`aria-labelledby\` to associate the tooltip content with the trigger element for screen readers.
- Ensure the tooltip appears on focus as well as hover.
        `
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Do</h3>
        <div className="flex items-center space-x-4">
          <Tooltip content="Edit your profile">
            <Button size="sm" variant="outline">Edit</Button>
          </Tooltip>
          <Tooltip content="Information icon">
            <FiInfo size={20} className="text-gray-500 cursor-help" />
          </Tooltip>
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Don't</h3>
        <div className="flex items-center space-x-4">
          <Tooltip content="This is a very long and detailed explanation of how this feature works, including steps and examples. Avoid putting this much text in a tooltip.">
            <span>Hover for too much info</span>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
};
