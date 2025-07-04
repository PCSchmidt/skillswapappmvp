/**
 * Signup Form Component Tests
 * 
 * Tests for the signup form component that allows users to create a new account
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SignupForm from '@/components/auth/SignupForm';

// Mock the SupabaseContext
const mockSignUp = jest.fn();
const mockSupabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    }),
  },
  from: jest.fn(() => ({
    upsert: jest.fn().mockResolvedValue({ error: null }),
  })),
};

jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: () => ({
    signUp: mockSignUp,
    supabase: mockSupabase,
  }),
}));

// Mock the toast hook
const mockToast = {
  toasts: [],
  success: jest.fn(),
  error: jest.fn(), 
  removeToast: jest.fn(),
};

jest.mock('@/hooks/useToast', () => ({
  useToast: () => mockToast,
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignUp.mockResolvedValue({ success: true, error: null });
    mockToast.success.mockClear();
    mockToast.error.mockClear();
  });

  it('renders the signup form correctly', () => {
    render(<SignupForm />);
    
    // Check for form elements
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    
    // Check for login link
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
  it('validates form inputs correctly', async () => {
    render(<SignupForm />);
    
    // Fill in fields to test password length validation
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } }); // Too short
    fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });
    
    // Submit form with short password
    const signUpButton = screen.getByRole('button', { name: /create account/i });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(signUpButton);
      // Check for password length validation
    await waitFor(() => {
      expect(screen.getByTestId('auth-error')).toHaveTextContent(/password must be at least 8 characters long/i);
    });
    
    // Now test password mismatch validation
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
    fireEvent.click(signUpButton);
      // Check validation errors for password mismatch
    await waitFor(() => {
      expect(screen.getByTestId('auth-error')).toHaveTextContent(/passwords do not match/i);
    });
  });

  it('handles successful signup correctly', async () => {
    render(<SignupForm />);
    
    // Fill in valid form data
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    // Submit form
    const signUpButton = screen.getByRole('button', { name: /create account/i });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(signUpButton);
    
    // Verify signUp was called with correct data
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('new@example.com', 'password123');
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
    });
  });

  it('handles signup error correctly', async () => {
    mockSignUp.mockResolvedValue({ success: false, error: 'User already exists' });
    
    render(<SignupForm />);
    
    // Fill in email that will trigger error
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'exists@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    // Submit form
    const signUpButton = screen.getByRole('button', { name: /create account/i });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(signUpButton);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
    });
  });

  it('navigates to sign in page', () => {
    render(<SignupForm />);
    
    // Check for sign in link
    const signInLink = screen.getByTestId('login-link');
    expect(signInLink).toHaveAttribute('href', '/login');
  });

  it('shows loading state during signup', async () => {
    // Make auth method take some time
    mockSignUp.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ success: true, error: null });
        }, 100);
      });
    });
    
    render(<SignupForm />);
    
    // Fill in valid form data
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    // Submit form
    const signUpButton = screen.getByRole('button', { name: /create account/i });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(signUpButton);
    
    // Button should show loading state
    expect(signUpButton).toBeDisabled();
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
  });
});
