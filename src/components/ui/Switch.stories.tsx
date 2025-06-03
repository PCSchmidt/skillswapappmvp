import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Switch, { SwitchProps } from './Switch';

/**
 * The Switch component is a toggle control used for boolean settings or options.
 * It provides a visual representation of an on/off or true/false state.
 */
const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toggle switch control for boolean settings, with support for different sizes and disabled states.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      description: 'Whether the switch is in the "on" state',
      control: 'boolean',
    },
    onChange: {
      description: 'Callback function when the switch state changes',
      action: 'state changed',
    },
    disabled: {
      description: 'Whether the switch is disabled',
      control: 'boolean',
    },
    label: {
      description: 'An optional label for the switch',
      control: 'text',
    },
    size: {
      description: 'The size of the switch',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    ariaLabel: {
      description: 'ARIA label for accessibility, overrides the label prop if provided',
      control: 'text',
    },
  },
};

export default meta;
interface SwitchStoryWrapperProps extends Omit<SwitchProps, 'checked'> {
  initialChecked?: boolean;
}

type Story = StoryObj<SwitchStoryWrapperProps>;

// Helper component to manage switch state in stories
const SwitchStoryWrapper = ({ initialChecked = false, ...args }: Partial<SwitchStoryWrapperProps>) => {
  const [checked, setChecked] = useState(initialChecked);

  const handleChange = () => {
    const newState = !checked;
    setChecked(newState);
    if (args.onChange) {
      args.onChange(newState);
    }
  };

  return <Switch {...args} checked={checked} onChange={handleChange} />;
};

// Default Switch (unchecked)
export const Default: Story = {
  render: (args) => <SwitchStoryWrapper {...args} />,
  args: {
    label: 'Enable Feature',
    initialChecked: false,
  },
};

// Checked Switch
export const Checked: Story = {
  render: (args) => <SwitchStoryWrapper {...args} />,
  args: {
    label: 'Enable Feature',
    initialChecked: true,
  },
};

// Different sizes showcase
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center space-x-6">
      <SwitchStoryWrapper {...args} size="sm" label="Small" />
      <SwitchStoryWrapper {...args} size="md" label="Medium" />
      <SwitchStoryWrapper {...args} size="lg" label="Large" />
    </div>
  ),
  args: {
    initialChecked: true, // Show checked state for sizes
  },
};

// Disabled Switch
export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center space-x-6">
      <SwitchStoryWrapper {...args} label="Disabled (Off)" disabled={true} initialChecked={false} />
      <SwitchStoryWrapper {...args} label="Disabled (On)" disabled={true} initialChecked={true} />
    </div>
  ),
  args: {
    // Disabled state is handled in render
  },
};

// Switch without label (using ariaLabel)
export const NoLabel: Story = {
  render: (args) => <SwitchStoryWrapper {...args} />,
  args: {
    ariaLabel: 'Toggle notification settings',
    initialChecked: true,
  },
};

// Usage guidelines example
export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Switch Usage Guidelines

### When to use Switches:

- For binary settings that can be toggled on or off (e.g., enable/disable a feature, subscribe/unsubscribe).
- When the change takes effect immediately without requiring a save action.

### When NOT to use Switches:

- For actions that trigger complex workflows or require confirmation (use buttons instead).
- For selecting multiple options from a list (use checkboxes instead).
- For mutually exclusive options (use radio buttons or a select dropdown instead).

### Best Practices:

1. **Always include a clear label** or \`ariaLabel\` to indicate the switch's purpose.
2. **Ensure the state change is immediately reflected** in the UI.
3. **Use appropriate sizes** based on the context and surrounding elements.
4. **Consider the default state**: The default state should be the safest or most common option.

### Accessibility Tips:

- Use the \`role="switch"\` attribute.
- Use the \`aria-checked\` attribute to indicate the current state.
- Provide a clear and descriptive label using the \`label\` prop or \`ariaLabel\`.
- Ensure sufficient contrast between the switch states.
        `
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Do</h3>
        <div className="flex flex-col space-y-4">
          <SwitchStoryWrapper label="Receive Email Notifications" initialChecked={true} />
          <SwitchStoryWrapper label="Share My Location" initialChecked={false} />
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Don't</h3>
        <div className="flex flex-col space-y-4">
          <SwitchStoryWrapper label="Missing Label Example" /> {/* Added label for clarity */}
          <SwitchStoryWrapper label="Delete Account" /> {/* Should be a button */}
        </div>
      </div>
    </div>
  ),
  args: {
    // Args handled in render
  },
};
