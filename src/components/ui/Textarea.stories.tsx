import type { Meta, StoryObj } from '@storybook/react';
import Textarea from './Textarea';

/**
 * The Textarea component is used for collecting multi-line text input from users.
 * It supports various states, sizes, and layouts to accommodate different UI requirements.
 */
const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile textarea component that follows the SkillSwap design system specifications.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'The size of the textarea',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      description: 'Label text displayed above the textarea',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text displayed inside the textarea when empty',
      control: 'text',
    },
    helperText: {
      description: 'Helper text displayed below the textarea',
      control: 'text',
    },
    error: {
      description: 'Error message displayed below the textarea',
      control: 'text',
    },
    disabled: {
      description: 'Whether the textarea is disabled',
      control: 'boolean',
    },
    required: {
      description: 'Whether the textarea is required',
      control: 'boolean',
    },
    fullWidth: {
      description: 'Whether the textarea should take up the full width of its container',
      control: 'boolean',
    },
    rows: {
      description: 'The number of visible text lines for the control',
      control: 'number',
      table: {
        defaultValue: { summary: '3' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// Base story with default props
export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description',
    rows: 4,
  },
};

// Different sizes showcase
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Textarea
        size="sm"
        label="Small size"
        placeholder="Small textarea"
        rows={3}
      />
      <Textarea
        size="md"
        label="Medium size"
        placeholder="Medium textarea"
        rows={4}
      />
      <Textarea
        size="lg"
        label="Large size"
        placeholder="Large textarea"
        rows={5}
      />
    </div>
  ),
};

// Helper text examples
export const HelperText: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Textarea
        label="Notes"
        placeholder="Add any additional notes"
        helperText="This information will be visible to others"
        rows={4}
      />
      <Textarea
        label="Feedback"
        placeholder="Provide your feedback here"
        helperText="Your feedback is valuable to us"
        rows={5}
      />
    </div>
  ),
};

// Error state examples
export const ErrorStates: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Textarea
        label="Description"
        placeholder="Enter a description"
        error="Description is required"
        rows={4}
      />
      <Textarea
        label="Comments"
        placeholder="Add your comments"
        error="Comments must be at least 10 characters"
        rows={5}
      />
    </div>
  ),
};

// Disabled state example
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Textarea
        label="Description"
        placeholder="Enter a description"
        disabled
        rows={4}
      />
      <Textarea
        label="Notes"
        placeholder="Add any additional notes"
        disabled
        rows={5}
      />
    </div>
  ),
};

// Required field examples
export const Required: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 w-[300px]">
      <Textarea
        label="Description"
        placeholder="Enter a description"
        required
        rows={4}
      />
      <Textarea
        label="Notes"
        placeholder="Add any additional notes"
        required
        rows={5}
      />
    </div>
  ),
};

// Full width example
export const FullWidth: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-lg">
      <Textarea
        label="Full width textarea"
        placeholder="This textarea takes up the full width of its container"
        fullWidth
        rows={5}
      />
    </div>
  ),
};

// Form example
export const FormExample: Story = {
  render: () => (
    <div className="p-6 border border-gray-200 rounded-md w-full max-w-md">
      <h3 className="text-lg font-medium mb-4">Feedback Form</h3>
      <form className="space-y-4">
        <Textarea
          label="Your Feedback"
          placeholder="Please share your thoughts..."
          required
          rows={6}
          helperText="Tell us what you think!"
        />
        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Submit Feedback
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
## Textarea Usage Guidelines

### Sizing Guidelines:

- **sm**: Use in compact forms or data tables where space is limited
- **md**: Default size, appropriate for most forms and inputs
- **lg**: Use for primary forms where you want to emphasize input fields or improve touch targets

### Best Practices:

1. **Always include a label** for textareas to improve accessibility
2. **Use placeholder text** as hints, not as replacements for labels
3. **Provide helper text** for complex textareas to guide users
4. **Show validation errors** inline, directly below the textarea field
5. **Set an appropriate number of rows** based on the expected input length
6. **Mark required fields** clearly with the asterisk symbol

### Accessibility Tips:

- Ensure textareas have appropriate ARIA attributes when necessary
- Maintain sufficient color contrast for text and borders
- Connect labels to textareas properly for screen reader support
        `
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Do</h3>
        <div className="space-y-4">
          <Textarea
            label="Project Description"
            placeholder="Describe your project..."
            required
            rows={5}
            helperText="Provide a detailed description of your project."
          />
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Don't</h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your comments (no label - bad practice)"
            rows={3}
          />
          <Textarea
            label="Notes with vague error"
            error="Invalid input"
            rows={4}
          />
        </div>
      </div>
    </div>
  ),
};
