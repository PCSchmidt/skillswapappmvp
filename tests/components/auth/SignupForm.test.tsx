/**
 * Signup Form Component Tests
 *
 * Tests for the signup form component that allows users to create a new account
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SignupForm from '@/components/auth/SignupForm';
import SupabaseProvider from '@/contexts/SupabaseContext'; // MODIFIED_LINE: Import SupabaseProvider

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

// Mock Sentry for useErrorHandler hook if it's used within SignupForm or its children
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset mock function implementations if they are changed per test
    const { createBrowserClient } = require('@supabase/ssr');
    const supabaseMock = createBrowserClient(); // Get the mocked client
    supabaseMock.auth.signUp.mockResolvedValue({ data: { user: {id: 'new-user-123'} }, error: null });
    supabaseMock.auth.signInWithOAuth.mockResolvedValue({ data: {}, error: null });
  });

  it('renders the signup form correctly', () => {
    render(
      <SupabaseProvider>
        <SignupForm />
      </SupabaseProvider>
    );

    // Check for form elements
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument(); // MODIFIED_LINE: More specific
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument(); // MODIFIED_LINE: Button text updated

    // Check for OAuth options
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument(); // MODIFIED_LINE: More robust query

    // Check for login link
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('validates form inputs correctly', async () => {
    render(
      <SupabaseProvider>
        <SignupForm />
      </SupabaseProvider>
    );

    const signUpButton = screen.getByRole('button', { name: /create account/i }); // MODIFIED_LINE: Button text updated

    // Try to submit with empty fields
    fireEvent.click(signUpButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    // Fill in fields with invalid data
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i); // MODIFIED_LINE: More specific
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(nameInput, { target: { value: 'A' } }); // Too short
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } }); // Too short
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });

    // Submit form with invalid data
    fireEvent.click(signUpButton);

    // Check validation errors for invalid inputs
    await waitFor(() => {
      expect(screen.getByText(/name must be at least/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('handles successful signup correctly', async () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    const { createBrowserClient } = require('@supabase/ssr');
    const supabaseMock = createBrowserClient();
    supabaseMock.auth.signUp.mockResolvedValueOnce({
      data: { user: { id: 'new-user-123', email: 'new@example.com' }, session: {} },
      error: null
    });

    render(
      <SupabaseProvider>
        <SignupForm />
      </SupabaseProvider>
    );

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i); // MODIFIED_LINE: More specific
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const termsCheckbox = screen.getByLabelText(/i agree to the terms of service and privacy policy/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);

    const signUpButton = screen.getByRole('button', { name: /create account/i }); // MODIFIED_LINE: Button text updated
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(supabaseMock.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'John Doe',
          },
          // emailRedirectTo: expect.any(String) // This was in the original component, ensure mock supports or component handles its absence
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/verification email has been sent/i)).toBeInTheDocument();
    });
  });

  it('handles signup error correctly', async () => {
    const { createBrowserClient } = require('@supabase/ssr');
    const supabaseMock = createBrowserClient();
    supabaseMock.auth.signUp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'User already registered' }
    });

    render(
      <SupabaseProvider>
        <SignupForm />
      </SupabaseProvider>
    );

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i); // MODIFIED_LINE: More specific
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const termsCheckbox = screen.getByLabelText(/i agree to the terms of service and privacy policy/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'exists@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);

    const signUpButton = screen.getByRole('button', { name: /create account/i }); // MODIFIED_LINE: Button text updated
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText(/user already registered/i)).toBeInTheDocument();
    });
  });

  it('handles OAuth signup correctly', async () => {
    const { createBrowserClient } = require('@supabase/ssr');
    const supabaseMock = createBrowserClient();
    supabaseMock.auth.signInWithOAuth = supabaseMock.auth.signInWithOAuth || jest.fn(); // Ensure it's a mock
    supabaseMock.auth.signInWithOAuth.mockResolvedValueOnce({ data: {}, error: null });

    render(
      <SupabaseProvider>
        <SignupForm />
      </SupabaseProvider>
    );

    const googleButton = screen.getByRole('button', { name: /google/i }); // MODIFIED_LINE: More robust query
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(supabaseMock.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
        },
      });
    });
  });

  it('navigates to sign in page', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    render(
      <SupabaseProvider>
        <SignupForm />
      </SupabaseProvider>
    );

    const signInLink = screen.getByText(/sign in/i);
    fireEvent.click(signInLink);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('shows loading state during signup', async () => {
    const { createBrowserClient } = require('@supabase/ssr');
    const supabaseMock = createBrowserClient();
    supabaseMock.auth.signUp.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: { user: { id: 'new-user-123', email: 'new@example.com' }, session: {} },
            error: null,
          });
        }, 100);
      });
    });

    render(
      <SupabaseProvider>
        <SignupForm />
      </SupabaseProvider>
    );

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i); // MODIFIED_LINE: More specific
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const termsCheckbox = screen.getByLabelText(/i agree to the terms of service and privacy policy/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);

    const signUpButton = screen.getByRole('button', { name: /create account/i }); // MODIFIED_LINE: Button text updated
    fireEvent.click(signUpButton);

    await waitFor(() => expect(signUpButton).toBeDisabled());
    expect(screen.getByText(/creating account/i)).toBeInTheDocument(); // MODIFIED_LINE: Text might change
  });
});
