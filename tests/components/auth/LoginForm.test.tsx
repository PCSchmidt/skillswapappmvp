/**
 * Login Form Component Tests
 * 
 * Tests for the login form component that allows users to sign in
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import LoginForm from '@/components/auth/LoginForm';

// Mock the Supabase auth
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn().mockImplementation(({ email, password }) => {
        // Simulate successful login for specific credentials
        if (email === 'test@example.com' && password === 'password123') {
          return Promise.resolve({
            data: { user: { id: 'user-123', email: 'test@example.com' } },
            error: null,
          });
        }
        // Simulate login error for wrong credentials
        return Promise.resolve({
          data: null,
          error: { message: 'Invalid login credentials' },
        });
      }),
      signInWithOAuth: jest.fn().mockResolvedValue({
        data: {},
        error: null,
      }),
    },
  })),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => {
      if (param === 'returnTo') return '/dashboard';
      return null;
    }),
  })),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the login form correctly', () => {
    render(<LoginForm />);
    
    // Check for form elements
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    
    // Check for OAuth options
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument();
    
    // Check for forgot password link
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    
    // Check for sign up link
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
  
  it('validates form inputs before submission', async () => {
    render(<LoginForm />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    
    // Try to submit with empty fields
    fireEvent.click(signInButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    // Enter invalid email format
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Check for email format validation
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });
  
  it('handles successful login correctly', async () => {
    const { createBrowserClient } = require('@supabase/ssr');
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<LoginForm />);
    
    // Fill in correct credentials
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);
    
    // Verify sign in was called with correct credentials
    await waitFor(() => {
      expect(createBrowserClient().auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    // Check navigation to return URL
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
  
  it('handles login errors correctly', async () => {
    render(<LoginForm />);
    
    // Fill in incorrect credentials
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    // Submit form
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);
    
    // Check error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
    });
  });
  
  it('handles OAuth sign in correctly', async () => {
    const { createBrowserClient } = require('@supabase/ssr');
    
    render(<LoginForm />);
    
    // Click on Google sign in
    const googleButton = screen.getByText(/sign in with google/i);
    fireEvent.click(googleButton);
    
    // Verify OAuth sign in was called with Google provider
    await waitFor(() => {
      expect(createBrowserClient().auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.any(String),
        },
      });
    });
  });
  
  it('navigates to forgot password page', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<LoginForm />);
    
    // Click on forgot password link
    const forgotPasswordLink = screen.getByText(/forgot password/i);
    fireEvent.click(forgotPasswordLink);
    
    // Check navigation to forgot password page
    expect(mockPush).toHaveBeenCalledWith('/reset-password');
  });
  
  it('navigates to sign up page', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<LoginForm />);
    
    // Click on sign up link
    const signUpLink = screen.getByText(/sign up/i);
    fireEvent.click(signUpLink);
    
    // Check navigation to sign up page
    expect(mockPush).toHaveBeenCalledWith('/signup');
  });
  
  it('shows loading state during login', async () => {
    // Make auth method take some time
    const { createBrowserClient } = require('@supabase/ssr');
    createBrowserClient().auth.signInWithPassword = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: { user: { id: 'user-123', email: 'test@example.com' } },
            error: null,
          });
        }, 100);
      });
    });
    
    render(<LoginForm />);
    
    // Fill in correct credentials
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);
    
    // Button should show loading state
    expect(signInButton).toBeDisabled();
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });
});
