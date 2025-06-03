import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import Alert, { AlertProps } from './Alert';

/**
 * The Alert component is used to display important messages, notifications, or feedback to users.
 * It comes in different types to convey the severity or nature of the message.
 */
const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for displaying important messages, notifications, or feedback to users, with different types and optional dismissible behavior.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: 'The type of alert, indicating its severity or nature',
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      table: {
        defaultValue: { summary: 'info' },
      },
    },
    title: {
      description: 'An optional title for the alert',
      control: 'text',
    },
    children: {
      description: 'The main content of the alert message',
      control: 'text',
    },
    icon: {
      description: 'A custom icon to display instead of the default icon for the alert type',
      control: false, // Custom icons are typically React nodes
    },
    dismissible: {
      description: 'Whether the alert can be dismissed by the user',
      control: 'boolean',
    },
    onDismiss: {
      description: 'Callback function when the dismiss button is clicked',
      action: 'dismissed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

// Helper component to manage dismissible state in stories
const DismissibleAlertWrapper = (args: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (args.onDismiss) {
      args.onDismiss();
    }
  };

  if (!isVisible) return null;

  return <Alert {...args} dismissible onDismiss={handleDismiss} />;
};

// Default Info Alert
export const Info: Story = {
  args: {
    type: 'info',
    children: 'This is an informational alert.',
  },
};

// Success Alert
export const Success: Story = {
  args: {
    type: 'success',
    children: 'Your operation was successful.',
  },
};

// Warning Alert
export const Warning: Story = {
  args: {
    type: 'warning',
    children: 'This is a warning message.',
  },
};

// Error Alert
export const Error: Story = {
  args: {
    type: 'error',
    children: 'An error occurred.',
  },
};

// Alerts with Titles
export const WithTitles: Story = {
  render: () => (
    <div className="flex flex-col space-y-4 w-[400px]">
      <Alert type="info" title="Information">
        This is an informational alert with a title.
      </Alert>
      <Alert type="success" title="Success">
        Your operation was successful.
      </Alert>
      <Alert type="warning" title="Warning">
        This is a warning message.
      </Alert>
      <Alert type="error" title="Error">
        An error occurred.
      </Alert>
    </div>
  ),
};

// Alerts with Custom Icons
export const WithCustomIcons: Story = {
  render: () => (
    <div className="flex flex-col space-y-4 w-[400px]">
      <Alert type="info" icon={<FiInfo className="w-5 h-5" />}>
        Custom info icon.
      </Alert>
      <Alert type="success" icon={<FiCheckCircle className="w-5 h-5" />}>
        Custom success icon.
      </Alert>
      <Alert type="warning" icon={<FiAlertTriangle className="w-5 h-5" />}>
        Custom warning icon.
      </Alert>
      <Alert type="error" icon={<FiXCircle className="w-5 h-5" />}>
        Custom error icon.
      </Alert>
    </div>
  ),
};

// Dismissible Alerts
export const Dismissible: Story = {
  render: (args) => (
    <div className="flex flex-col space-y-4 w-[400px]">
      <DismissibleAlertWrapper {...args} type="info" title="Dismissible Info">
        You can close this alert.
      </DismissibleAlertWrapper>
      <DismissibleAlertWrapper {...args} type="success" title="Dismissible Success">
        This success alert can be dismissed.
      </DismissibleAlertWrapper>
      <DismissibleAlertWrapper {...args} type="warning" title="Dismissible Warning">
        Dismiss this warning.
      </DismissibleAlertWrapper>
      <DismissibleAlertWrapper {...args} type="error" title="Dismissible Error">
        Close this error alert.
      </DismissibleAlertWrapper>
    </div>
  ),
  args: {
    onDismiss: () => console.log('Alert dismissed'), // Example action
  },
};

// Usage guidelines example
export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Alert Usage Guidelines

### When to use each type:

- **Info**: For general information or updates that are not critical.
- **Success**: To indicate that an action was completed successfully.
- **Warning**: For potential issues or actions that require caution.
- **Error**: To indicate that an error occurred or an action failed.

### Best Practices:

1. **Keep messages concise**: Alerts should be brief and to the point.
2. **Use appropriate types**: Choose the type that best reflects the message's severity.
3. **Provide a clear title**: Use a title for important alerts to summarize the message.
4. **Use dismissible alerts sparingly**: Only make alerts dismissible if the user doesn't need to see the message again.
5. **Ensure accessibility**: Alerts should be perceivable by users with disabilities.

### Accessibility Tips:

- Ensure sufficient color contrast for text and background.
- Use ARIA live regions to announce dynamic alert content to screen readers.
- Provide clear and descriptive text for screen readers.
        `
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Do</h3>
        <Alert type="success" title="Profile Updated">
          Your profile information has been successfully saved.
        </Alert>
        <Alert type="warning">
          Your free trial is ending soon. Upgrade your plan to continue using all features.
        </Alert>
      </div>

      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Don't</h3>
        <Alert type="info">
          This is just a regular message that doesn't require an alert.
        </Alert>
        <Alert type="error" title="Error">
          Something went wrong.
        </Alert> {/* Error message is too vague */}
      </div>
    </div>
  ),
};
