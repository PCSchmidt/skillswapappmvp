import type { Preview } from '@storybook/react';
import '../src/app/globals.css'; // Import your Tailwind CSS
import './mockSupabase'; // Import mock Supabase configuration
import { withContexts } from './decorators';

const preview: Preview = {
  decorators: [withContexts],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8f9fa' },
        { name: 'dark', value: '#1a202c' },
      ],
    },
    docs: {
      story: { inline: true },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
      },
    },
  },
};

export default preview;
