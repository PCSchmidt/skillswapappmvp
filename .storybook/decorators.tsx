import React from 'react';
import { useRouter } from 'next/router';
import StorybookSupabaseProvider from './StorybookSupabaseProvider';


// Create a decorator that provides all necessary contexts
export const withContexts = (Story: React.ComponentType) => {
  // Use our Storybook-specific provider
  return (
    <StorybookSupabaseProvider>
      <Story />
    </StorybookSupabaseProvider>
  );
};
