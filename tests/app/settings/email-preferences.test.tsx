/**
 * Email Preferences Page Tests
 * 
 * Tests for the email preferences page component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailPreferencesPage from '@/app/settings/email-preferences/page';
import { useSupabase } from '@/contexts/SupabaseContext';

// Mock the SupabaseContext hook
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: jest.fn(),
}));

// Mock the EmailPreferences component
jest.mock('@/components/settings/EmailPreferences', () => ({
  __esModule: true,
  default: ({ userId }: { userId: string }) => (
    <div data-testid="email-preferences-component">
      Mock EmailPreferences Component for user: {userId}
    </div>
  ),
}));

// Mock the Next.js navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('EmailPreferencesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders loading state when authentication is loading', () => {
    // Mock the authentication loading state
    (useSupabase as jest.Mock).mockReturnValue({
      session: null,
      isLoading: true,
    });
    
    render(<EmailPreferencesPage />);
    
    // Check for loading indicators
    expect(screen.queryByText('Email Notification Settings')).not.toBeInTheDocument();
    expect(screen.queryByTestId('email-preferences-component')).not.toBeInTheDocument();
    
    // Expect loading skeleton or animation
    const loadingElements = screen.getAllByRole('generic');
    expect(loadingElements.length).toBeGreaterThan(0);
  });
  
  it('redirects to login when user is not authenticated', () => {
    // Import the redirect mock
    const { redirect } = require('next/navigation');
    
    // Mock the unauthenticated state
    (useSupabase as jest.Mock).mockReturnValue({
      session: null,
      isLoading: false,
    });
    
    render(<EmailPreferencesPage />);
    
    // Verify redirect was called with the correct path
    expect(redirect).toHaveBeenCalledWith('/login?returnTo=/settings/email-preferences');
  });
  
  it('renders email preferences component when user is authenticated', () => {
    // Mock the authenticated state
    (useSupabase as jest.Mock).mockReturnValue({
      session: {
        user: {
          id: 'test-user-id',
        },
      },
      isLoading: false,
    });
    
    render(<EmailPreferencesPage />);
    
    // Check that the page title and description are rendered
    expect(screen.getByText('Email Notification Settings')).toBeInTheDocument();
    expect(screen.getByText(/Control which emails you receive/)).toBeInTheDocument();
    
    // Check that the EmailPreferences component is rendered with the correct user ID
    const preferencesComponent = screen.getByTestId('email-preferences-component');
    expect(preferencesComponent).toBeInTheDocument();
    expect(preferencesComponent).toHaveTextContent('test-user-id');
  });
});
