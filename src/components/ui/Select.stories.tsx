import type { Meta, StoryObj } from '@storybook/react';
import Select from './Select';

/**
 * The Select component is used for allowing users to choose one option from a dropdown list.
 * It supports various states, sizes, and layouts to accommodate different UI requirements.
 */
const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile select component that follows the SkillSwap design system specifications.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'The size of the select input',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      description: 'Label text displayed above the select input',
      control: 'text',
    },
    helperText: {
      description: 'Helper text displayed below the select input',
      control: 'text',
    },
    error: {
      description: 'Error message displayed below the select input',
      control: 'text',
    },
    disabled: {
      description: 'Whether the select input is disabled',
      control: 'boolean',
    },
    required: {
      description: 'Whether the select input is required',
      control: 'boolean',
    },
    fullWidth: {
      description: 'Whether the select input should take up the full width of its container',
      control: 'boolean',
    },
    children: {
      description: 'The options for the select input',
      control: false, // Children are typically hardcoded options in stories
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Base story with default props
export const Default: Story = {
  args: {
    label: 'Choose an option',
    children: (
      <>
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  },
};

// Different sizes showcase
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Select
        size="sm"
        label="Small size"
      >
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
      <Select
        size="md"
        label="Medium size"
      >
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
      <Select
        size="lg"
        label="Large size"
      >
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    </div>
  ),
};

// Helper text examples
export const HelperText: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Select
        label="Category"
        helperText="Select the category for your skill"
      >
        <option value="">Select...</option>
        <option value="tech">Technology</option>
        <option value="art">Art</option>
      </Select>
      <Select
        label="Location"
        helperText="Choose your preferred meeting location"
      >
        <option value="">Select...</option>
        <option value="remote">Remote</option>
        <option value="in-person">In-person</option>
      </Select>
    </div>
  ),
};

// Error state examples
export const ErrorStates: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Select
        label="Skill Level"
        error="Please select a skill level"
      >
        <option value="">Select...</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
      </Select>
      <Select
        label="Availability"
        error="Availability is required"
      >
        <option value="">Select...</option>
        <option value="weekday">Weekdays</option>
        <option value="weekend">Weekends</option>
      </Select>
    </div>
  ),
};

// Disabled state example
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Select
        label="Choose an option"
        disabled
      >
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    </div>
  ),
};

// Required field examples
export const Required: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Select
        label="Required Field"
        required
      >
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    </div>
  ),
};

// Full width example
export const FullWidth: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-lg">
      <Select
        label="Full width select"
        fullWidth
      >
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    </div>
  ),
};

// Form example
export const FormExample: Story = {
  render: () => (
    <div className="p-6 border border-gray-200 rounded-md w-full max-w-md">
      <h3 className="text-lg font-medium mb-4">Settings</h3>
      <form className="space-y-4">
        <Select
          label="Theme Preference"
          required
        >
          <option value="">Select...</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </Select>
        <Select
          label="Notification Frequency"
          helperText="How often you want to receive notifications"
        >
          <option value="">Select...</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  ),
};

// Usage guidelines example
export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Select Usage Guidelines

### Sizing Guidelines:

- **sm**: Use in compact forms, data tables, or where space is limited
- **md**: Default size, appropriate for most forms and inputs
- **lg**: Use for primary forms where you want to emphasize input fields or improve touch targets

### Best Practices:

1. **Always include a label** for select inputs to improve accessibility
2. **Include a default "Select..." or empty option** unless a default value is pre-selected
3. **Provide helper text** for complex select inputs to guide users
4. **Show validation errors** inline, directly below the select input field
5. **Mark required fields** clearly with the asterisk symbol

### Accessibility Tips:

- Ensure select inputs have appropriate ARIA attributes when necessary
- Maintain sufficient color contrast for text and borders
- Connect labels to select inputs properly for screen reader support
        `
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Do</h3>
        <div className="space-y-4">
          <Select
            label="Country"
            required
            helperText="Select your country of residence"
          >
            <option value="">Select...</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
          </Select>
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Don't</h3>
        <div className="space-y-4">
          <Select
            label="Select an option (no label - bad practice)"
          >
            <option value="">Select...</option>
            <option value="option1">Option 1</option>
          </Select>
          <Select
            label="State with vague error"
            error="Invalid"
          >
            <option value="">Select...</option>
            <option value="ny">New York</option>
          </Select>
        </div>
      </div>
    </div>
  ),
};
