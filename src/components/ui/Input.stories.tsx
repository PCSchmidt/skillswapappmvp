import type { Meta, StoryObj } from '@storybook/react';
import { FiMail, FiSearch, FiUser, FiLock, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import Input from './Input';

/**
 * The Input component is used for collecting user data through form fields
 * across the application. It supports various states, sizes, and layouts to
 * accommodate different UI requirements.
 */
const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile input component that follows the SkillSwap design system specifications.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'The visual style of the input',
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: 'The size of the input',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      description: 'Label text displayed above the input',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text displayed inside the input when empty',
      control: 'text',
    },
    helperText: {
      description: 'Helper text displayed below the input',
      control: 'text',
    },
    error: {
      description: 'Error message displayed below the input',
      control: 'text',
    },
    disabled: {
      description: 'Whether the input is disabled',
      control: 'boolean',
    },
    required: {
      description: 'Whether the input is required',
      control: 'boolean',
    },
    fullWidth: {
      description: 'Whether the input should take up the full width of its container',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Base story with default props
export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

// Different variants showcase
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Input
        variant="default"
        label="Default variant"
        placeholder="Default input"
      />
      <Input
        variant="filled"
        label="Filled variant"
        placeholder="Filled input"
      />
      <Input
        variant="outlined"
        label="Outlined variant"
        placeholder="Outlined input"
      />
    </div>
  ),
};

// Different sizes showcase
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Input
        size="sm"
        label="Small size"
        placeholder="Small input"
      />
      <Input
        size="md"
        label="Medium size"
        placeholder="Medium input"
      />
      <Input
        size="lg"
        label="Large size"
        placeholder="Large input"
      />
    </div>
  ),
};

// With icons examples
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Input
        label="Email"
        placeholder="Enter your email"
        startIcon={<FiMail />}
      />
      <Input
        label="Search"
        placeholder="Search..."
        startIcon={<FiSearch />}
      />
      <Input
        label="Username"
        placeholder="Enter your username"
        startIcon={<FiUser />}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        startIcon={<FiLock />}
      />
      <Input
        label="Date"
        type="date"
        startIcon={<FiCalendar />}
      />
      <Input
        label="With both icons"
        placeholder="Type to search"
        startIcon={<FiSearch />}
        endIcon={<FiAlertCircle />}
      />
    </div>
  ),
};

// Helper text examples
export const HelperText: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        helperText="Password must be at least 8 characters"
      />
      <Input
        label="Username"
        placeholder="Enter your username"
        helperText="This will be visible to other users"
      />
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        helperText="We'll never share your email with anyone else"
      />
    </div>
  ),
};

// Error state examples
export const ErrorStates: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        error="Please enter a valid email address"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        error="Password must be at least 8 characters"
        startIcon={<FiLock />}
      />
      <Input
        label="Username"
        placeholder="Enter your username"
        error="This username is already taken"
        variant="filled"
      />
    </div>
  ),
};

// Disabled state example
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Input
        label="Username"
        placeholder="Enter your username"
        disabled
      />
      <Input
        label="Email"
        placeholder="Enter your email"
        startIcon={<FiMail />}
        disabled
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        disabled
        variant="filled"
      />
    </div>
  ),
};

// Required field examples
export const Required: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Input
        label="Username"
        placeholder="Enter your username"
        required
      />
      <Input
        label="Email"
        placeholder="Enter your email"
        startIcon={<FiMail />}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        helperText="Must be at least 8 characters"
        required
      />
    </div>
  ),
};

// Full width example
export const FullWidth: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-lg">
      <Input
        label="Full width input"
        placeholder="This input takes up the full width of its container"
        fullWidth
      />
      <Input
        label="Full width with icon"
        placeholder="Full width input with icon"
        startIcon={<FiSearch />}
        fullWidth
        variant="filled"
      />
    </div>
  ),
};

// Input types example
export const InputTypes: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Input
        label="Text input"
        type="text"
        placeholder="Regular text"
      />
      <Input
        label="Password input"
        type="password"
        placeholder="Enter password"
      />
      <Input
        label="Email input"
        type="email"
        placeholder="name@example.com"
      />
      <Input
        label="Number input"
        type="number"
        placeholder="Enter a number"
      />
      <Input
        label="Date input"
        type="date"
      />
      <Input
        label="Time input"
        type="time"
      />
    </div>
  ),
};

// Form example
export const FormExample: Story = {
  render: () => (
    <div className="p-6 border border-gray-200 rounded-md w-full max-w-md">
      <h3 className="text-lg font-medium mb-4">Sign Up Form</h3>
      <form className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          required
          startIcon={<FiUser />}
        />
        <Input
          label="Email"
          type="email"
          placeholder="name@example.com"
          required
          startIcon={<FiMail />}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          required
          startIcon={<FiLock />}
          helperText="Password must be at least 8 characters"
        />
        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Create Account
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
## Input Usage Guidelines

### When to use each variant:

- **Default**: Use for most forms and standard inputs across the application
- **Filled**: Use in dense UIs or where you want to visually separate the input field from the background
- **Outlined**: Use when you want a lighter visual style with clear boundaries

### Sizing Guidelines:

- **sm**: Use in compact forms, data tables, or where space is limited
- **md**: Default size, appropriate for most forms and inputs
- **lg**: Use for primary forms where you want to emphasize input fields or improve touch targets

### Best Practices:

1. **Always include a label** for inputs to improve accessibility
2. **Use placeholder text** as hints, not as replacements for labels
3. **Provide helper text** for complex inputs to guide users
4. **Show validation errors** inline, directly below the input field
5. **Use appropriate input types** (email, number, etc.) to ensure correct keyboard on mobile
6. **Include icons** when they help clarify the input's purpose
7. **Mark required fields** clearly with the asterisk symbol

### Accessibility Tips:

- Ensure inputs have appropriate ARIA attributes when necessary
- Maintain sufficient color contrast for text and borders
- Group related inputs with fieldset and legend for screen readers
- Connect labels to inputs properly for screen reader support
        `
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Do</h3>
        <div className="space-y-4">
          <Input
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            required
            helperText="We'll never share your email with anyone else"
          />
          <Input
            label="Phone Number"
            placeholder="(555) 555-5555"
            type="tel"
            startIcon={<span className="text-lg">📱</span>}
          />
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Don't</h3>
        <div className="space-y-4">
          <Input
            placeholder="Enter your email (no label - bad practice)"
          />
          <Input
            label="Password with vague error"
            type="password"
            error="Invalid"
          />
        </div>
      </div>
    </div>
  ),
};
