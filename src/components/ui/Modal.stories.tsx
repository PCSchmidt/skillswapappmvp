import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Button from './Button'; // Assuming Button is available for examples
import Modal, { ModalProps } from './Modal';

/**
 * The Modal component is used to display content in a layer above the main application content.
 * It is typically used for important information, user input, or confirmations.
 */
const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal component that follows the SkillSwap design system specifications, built with Headless UI.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      description: 'Controls whether the modal is open or closed',
      control: 'boolean',
    },
    onClose: {
      description: 'Callback function when the modal is closed',
      action: 'closed',
    },
    title: {
      description: 'The title displayed in the modal header',
      control: 'text',
    },
    children: {
      description: 'The content of the modal body',
      control: false, // Children are typically custom content in stories
    },
    size: {
      description: 'The size of the modal',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Helper component to manage modal state in stories
const ModalStoryWrapper = ({ children, ...args }: ModalProps & { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={handleClose}>
        {children}
      </Modal>
    </>
  );
};

// Base story with default props
export const Default: Story = {
  render: (args) => (
    <ModalStoryWrapper {...args}>
      <p className="text-sm text-gray-500">
        This is the default modal content. You can place any React nodes here.
      </p>
    </ModalStoryWrapper>
  ),
  args: {
    title: 'Default Modal Title',
  },
};

// Different sizes showcase
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col space-y-4">
      <ModalStoryWrapper {...args} size="sm" title="Small Modal">
        <p className="text-sm text-gray-500">Small modal content.</p>
      </ModalStoryWrapper>
      <ModalStoryWrapper {...args} size="md" title="Medium Modal">
        <p className="text-sm text-gray-500">Medium modal content.</p>
      </ModalStoryWrapper>
      <ModalStoryWrapper {...args} size="lg" title="Large Modal">
        <p className="text-sm text-gray-500">Large modal content.</p>
      </ModalStoryWrapper>
      <ModalStoryWrapper {...args} size="xl" title="Extra Large Modal">
        <p className="text-sm text-gray-500">Extra large modal content.</p>
      </ModalStoryWrapper>
    </div>
  ),
  args: {
    // Default args for the wrapper, size and title are overridden in render
  },
};

// Modal with complex content
export const ComplexContent: Story = {
  render: (args) => (
    <ModalStoryWrapper {...args}>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          This modal contains more complex content, such as form elements or other components.
        </p>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter your name"
            />
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <div className="mt-1">
            <textarea
              id="message"
              name="message"
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter your message"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" size="sm">Cancel</Button>
          <Button variant="primary" size="sm">Submit</Button>
        </div>
      </div>
    </ModalStoryWrapper>
  ),
  args: {
    title: 'Complex Modal Example',
  },
};

// Modal with long content (for scrolling demonstration)
export const LongContent: Story = {
  render: (args) => (
    <ModalStoryWrapper {...args}>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          This modal has a lot of content to demonstrate scrolling behavior.
        </p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-sm text-gray-500">
            Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        ))}
      </div>
    </ModalStoryWrapper>
  ),
  args: {
    title: 'Modal with Long Content',
  },
};

// Usage guidelines example
export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Modal Usage Guidelines

### When to use Modals:

- **Critical information**: Alerts, errors, or important updates that require immediate user attention.
- **User input**: Forms for creating or editing data, configuration settings.
- **Confirmations**: Actions that require user confirmation (e.g., deleting data).
- **Focused tasks**: Tasks that need to be completed without navigating away from the current page.

### When NOT to use Modals:

- **Non-critical information**: Use banners, toasts, or notifications instead.
- **Primary navigation**: Modals should not be the primary way to navigate the application.
- **Content that requires frequent reference**: Content that users need to see while interacting with the main page.

### Best Practices:

1. **Keep modals focused**: Limit the content and actions within a modal to a single task or piece of information.
2. **Provide a clear title**: The title should clearly indicate the purpose of the modal.
3. **Include a close button**: Allow users to easily dismiss the modal.
4. **Support closing via escape key and clicking outside**: Enhance usability and accessibility.
5. **Ensure accessibility**: Modals should be keyboard navigable and screen reader friendly.
6. **Avoid stacking too many modals**: This can lead to a confusing user experience.
7. **Consider modal size**: Use appropriate sizes based on the content complexity.

### Accessibility Tips:

- Ensure the modal is properly announced by screen readers when it opens.
- Manage focus within the modal to prevent users from interacting with the background content.
- Restore focus to the element that triggered the modal when it closes.
- Use appropriate ARIA roles and attributes (e.g., \`role="dialog"\`, \`aria-modal="true"\`).
        `
      }
    }
  },
  render: (args) => (
    <ModalStoryWrapper {...args}>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          This section provides guidelines on when and how to use the Modal component effectively.
        </p>
        <div className="p-4 border border-gray-200 rounded-md">
          <h3 className="font-medium mb-3">Do</h3>
          <p className="text-sm text-gray-700">Use modals for critical actions like deleting data.</p>
          <Button size="sm" variant="danger">Delete Item</Button>
        </div>
        <div className="p-4 border border-gray-200 rounded-md">
          <h3 className="font-medium mb-3">Don't</h3>
          <p className="text-sm text-gray-700">Avoid using modals for simple notifications.</p>
        </div>
      </div>
    </ModalStoryWrapper>
  ),
  args: {
    title: 'Modal Usage Guidelines',
  },
};
