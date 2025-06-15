/**
 * Mock Supabase client and environment variables for Storybook
 */

// Mock environment variables that would normally be in .env
export const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://storybook-mock.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon-key-for-storybook-environment',
};

// Expose the mock environment variables to the global process.env
if (typeof window !== 'undefined') {
  // Only run in browser context
  window.process = {
    ...window.process,
    env: {
      ...window.process?.env,
      ...mockEnv
    }
  };
}
