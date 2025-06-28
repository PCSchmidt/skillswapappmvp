/**
 * Quick test to verify LoginForm Google sign-in changes
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import LoginForm from '@/components/auth/LoginForm';

// Mock the useSupabase hook
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: jest.fn(() => ({
    signIn: jest.fn(),
    supabase: {
      auth: {
        signInWithOAuth: jest.fn()
      }
    }
  }))
}));

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

describe('LoginForm Google Sign-in Changes', () => {
  it('should show updated Google button text', () => {
    render(<LoginForm />);
    
    const googleButton = screen.getByTestId('google-login-button');
    expect(googleButton).toHaveTextContent('Sign in with Google (Coming Soon)');
  });

  it('should show message when Google sign-in is clicked', async () => {
    render(<LoginForm />);
    
    const googleButton = screen.getByTestId('google-login-button');
    fireEvent.click(googleButton);
    
    // Check if the message appears
    expect(screen.getByText(/Future Enhancement - Google sign-in is not yet available/)).toBeInTheDocument();
  });
});
