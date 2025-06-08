import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Tabs, { Tab, TabsProps } from './Tabs';

/**
 * The Tabs component provides a way to organize and navigate between different sections of content
 * within the same view. It consists of a list of tab headers and corresponding content panels.
 */
const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A tabbed interface component for organizing and switching between different content views.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    activeTab: {
      description: 'The ID of the currently active tab',
      control: 'text',
    },
    onChange: {
      description: 'Callback function when the active tab changes',
      action: 'tab changed',
    },
    children: {
      description: 'The Tab components representing each tab',
      control: false, // Children are typically Tab components in stories
    },
    className: {
      description: 'Additional CSS classes for the main tabs container',
      control: 'text',
    },
    tabListClassName: {
      description: 'Additional CSS classes for the tab list container',
      control: 'text',
    },
    tabClassName: {
      description: 'Additional CSS classes for individual tab buttons (when not active)',
      control: 'text',
    },
    activeTabClassName: {
      description: 'Additional CSS classes for the active tab button',
      control: 'text',
    },
    contentClassName: {
      description: 'Additional CSS classes for the active tab content container',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// Helper component to manage active tab state in stories
const TabsStoryWrapper = ({ children, initialTab, ...args }: Omit<TabsProps, 'activeTab' | 'onChange'> & { initialTab: string; children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <Tabs {...args} activeTab={activeTab} onChange={setActiveTab}>
      {children}
    </Tabs>
  );
};

// Basic Tabs example
export const Default: Story = {
  render: (args) => (
    <TabsStoryWrapper {...args} initialTab="tab1">
      <Tab id="tab1" label="Tab 1">
        <div className="text-gray-700 dark:text-gray-300">Content for Tab 1.</div>
      </Tab>
      <Tab id="tab2" label="Tab 2">
        <div className="text-gray-700 dark:text-gray-300">Content for Tab 2.</div>
      </Tab>
      <Tab id="tab3" label="Tab 3">
        <div className="text-gray-700 dark:text-gray-300">Content for Tab 3.</div>
      </Tab>
    </TabsStoryWrapper>
  ),
  args: {
    // initialTab is handled by the wrapper
  },
};

// Tabs with different content
export const WithDifferentContent: Story = {
  render: (args) => (
    <TabsStoryWrapper {...args} initialTab="profile">
      <Tab id="profile" label="Profile">
        <div className="text-gray-700 dark:text-gray-300">
          <h3>User Profile Settings</h3>
          <p>Manage your profile information here.</p>
        </div>
      </Tab>
      <Tab id="settings" label="Settings">
        <div className="text-gray-700 dark:text-gray-300">
          <h3>Application Settings</h3>
          <p>Configure your application preferences.</p>
        </div>
      </Tab>
      <Tab id="notifications" label="Notifications">
        <div className="text-gray-700 dark:text-gray-300">
          <h3>Notification Preferences</h3>
          <p>Adjust your notification settings.</p>
        </div>
      </Tab>
    </TabsStoryWrapper>
  ),
  args: {
    // initialTab is handled by the wrapper
  },
};

// Tabs with custom styling
export const WithCustomStyling: Story = {
  render: (args) => (
    <TabsStoryWrapper
      {...args}
      initialTab="tabA"
      tabListClassName="bg-gray-100 dark:bg-gray-800 rounded-t-md"
      tabClassName="hover:bg-gray-200 dark:hover:bg-gray-700 px-4"
      activeTabClassName="bg-white dark:bg-gray-900 border-primary-600 text-primary-600 dark:text-primary-400"
      contentClassName="border border-gray-200 dark:border-gray-700 rounded-b-md p-6"
    >
      <Tab id="tabA" label="Tab A">
        <div className="text-gray-700 dark:text-gray-300">Content for Tab A with custom styling.</div>
      </Tab>
      <Tab id="tabB" label="Tab B">
        <div className="text-gray-700 dark:text-gray-300">Content for Tab B with custom styling.</div>
      </Tab>
    </TabsStoryWrapper>
  ),
  args: {
    // initialTab and styling classes are handled by the wrapper
  },
};

// Usage guidelines example
export const UsageGuidelines: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Tabs Usage Guidelines

### When to use Tabs:

- To organize related content into distinct sections within a single view.
- When users need to switch between different sets of information or tasks frequently.

### When NOT to use Tabs:

- For unrelated content.
- As a primary navigation method for the entire application.
- When the content in each tab is very short and could be displayed together.

### Best Practices:

1. **Use clear and concise labels** for each tab.
2. **Ensure content within each tab is relevant** to the tab label.
3. **Provide a visual indicator** for the currently active tab.
4. **Maintain consistency** in the layout and styling of tab content.
5. **Consider accessibility**: Ensure tabs are keyboard navigable and screen reader friendly.

### Accessibility Tips:

- Use appropriate ARIA roles and attributes (\`role="tablist"\`, \`role="tab"\`, \`role="tabpanel"\`, \`aria-controls\`, \`aria-selected\`).
- Ensure keyboard navigation allows users to move between tabs and activate the selected tab's content.
- The active tab should be clearly indicated visually and programmatically.
        `
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Do</h3>
        <TabsStoryWrapper initialTab="info">
          <Tab id="info" label="Information">
            <p className="text-gray-700 dark:text-gray-300">General account information.</p>
          </Tab>
          <Tab id="security" label="Security">
            <p className="text-gray-700 dark:text-gray-300">Security settings.</p>
          </Tab>
        </TabsStoryWrapper>
      </div>

      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-3">Don't</h3>
        {/* Example of misuse - unrelated content */}
        <TabsStoryWrapper initialTab="news">
          <Tab id="news" label="Latest News">
            <p className="text-gray-700 dark:text-gray-300">News content...</p>
          </Tab>
          <Tab id="weather" label="Local Weather">
            <p className="text-gray-700 dark:text-gray-300">Weather content...</p>
          </Tab>
        </TabsStoryWrapper>
      </div>
    </div>
  ),
  args: {
    // initialTab is handled by the wrapper
  },
};
