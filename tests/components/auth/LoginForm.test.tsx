/**
 * Login Form Component Tests
 *
 * Tests for the login form component that allows users to sign in
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import LoginForm from '@/components/auth/LoginForm';
import SupabaseProvider from '@/contexts/SupabaseContext'; // MODIFIED_LINE: Import SupabaseProvider

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

// Mock Sentry for useErrorHandler hook if it's used within LoginForm or its children
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));


describe('LoginForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset mock function implementations if they are changed per test
    const { createBrowserClient } = require('@supabase/ssr');
    const supabaseMock = createBrowserClient(); // Get the mocked client
    supabaseMock.auth.signInWithPassword.mockResolvedValue({ data: { user: {id: 'user-123'} }, error: null });
    supabaseMock.auth.signInWithOAuth.mockResolvedValue({ data: {}, error: null });

  });

  it('renders the login form correctly', () => {
    render(
      <SupabaseProvider>
        <LoginForm />
      </SupabaseProvider>
    );

    // Check for form elements
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();

    // Check for OAuth options - Assuming button text might be just "Google" or similar
    // expect(screen.getByText(/sign in with google/i)).toBeInTheDocument(); // MODIFIED_LINE - Commented out for now
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument(); // MODIFIED_LINE - More robust query

    // Check for forgot password link
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();

    // Check for sign up link
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('validates form inputs before submission', async () => {
    render(
      <SupabaseProvider>
        <LoginForm />
      </SupabaseProvider>
    );

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
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    // Supabase client should be mocked globally by jest.setup.js
    // We can access the mock through require('@supabase/ssr').createBrowserClient()
    const { createBrowserClient } = require('@supabase/ssr');
    const supabaseMock = createBrowserClient();
    supabaseMock.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: 'user-123', email: 'test@example.com' }, session: {} },
      error: null
    });

    render(
      <SupabaseProvider>
        <LoginForm />
      </SupabaseProvider>
    );

    // Fill in correct credentials
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login errors correctly', async () => {
    const { createBrowserClient } = require('@supabase/ssr');
    const supabaseMock = createBrowserClient();
    supabaseMock.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' }
    });

    render(
      <SupabaseProvider>
        <LoginForm />
      </SupabaseProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
    });
  });

  it('handles OAuth sign in correctly', async () => {
    const { createBrowserClient } = require('@supabase/ssr');
    const supabaseMock = createBrowserClient();
    // Ensure signInWithOAuth is part of the mock if not already
    supabaseMock.auth.signInWithOAuth = supabaseMock.auth.signInWithOAuth || jest.fn();
    supabaseMock.auth.signInWithOAuth.mockResolvedValueOnce({ data: {}, error: null });

    render(
      <SupabaseProvider>
        <LoginForm />
      </SupabaseProvider>
    );

    const googleButton = screen.getByRole('button', { name: /google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(supabaseMock.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'), // Default redirect if not specified
        },
      });
    });
  });

  it('navigates to forgot password page', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    render(
      <SupabaseProvider>
        <LoginForm />
      </SupabaseProvider>
    );

    const forgotPasswordLink = screen.getByText(/forgot password/i);
    fireEvent.click(forgotPasswordLink);

    expect(mockPush).toHaveBeenCalledWith('/reset-password');
  });

  it('navigates to sign up page', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    render(
      <SupabaseProvider>
        <LoginForm />
      </SupabaseProvider>
    );

    const signUpLink = screen.getByText(/sign up/i);
    fireEvent.click(signUpLink);

    expect(mockPush).toHaveBeenCalledWith('/signup');
  });

  it('shows loading state during login', async () => {
    const { createBrowserClient } = require('@supabase/ssr');
    const supabaseMock = createBrowserClient();
    supabaseMock.auth.signInWithPassword.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: { user: { id: 'user-123', email: 'test@example.com' }, session: {} },
            error: null,
          });
        }, 100);
      });
    });

    render(
      <SupabaseProvider>
        <LoginForm />
      </SupabaseProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => expect(signInButton).toBeDisabled());
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });
});
