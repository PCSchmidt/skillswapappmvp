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
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: () => ({
    signUp: mockSignUp,
  }),
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the Supabase client used in the component
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
    from: jest.fn(() => ({
      upsert: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignUp.mockResolvedValue({ success: true, error: null });
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
    
    const signUpButton = screen.getByRole('button', { name: /create account/i });
    
    // Try to submit with empty fields (need to check the checkbox first)
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(signUpButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
    
    // Fill in fields with mismatched passwords
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
    
    // Submit form with invalid data
    fireEvent.click(signUpButton);
    
    // Check validation errors for password mismatch
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
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
      expect(screen.getByText(/your account has been created/i)).toBeInTheDocument();
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
