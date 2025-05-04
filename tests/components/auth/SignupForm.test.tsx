/**
 * Signup Form Component Tests
 * 
 * Tests for the signup form component that allows users to create a new account
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupForm from '@/components/auth/SignupForm';

// Mock the Supabase auth
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn().mockImplementation(({ email, password }) => {
        // Simulate successful signup for non-existing email
        if (email !== 'exists@example.com') {
          return Promise.resolve({
            data: { user: { id: 'new-user-123', email } },
            error: null,
          });
        }
        // Simulate signup error for existing email
        return Promise.resolve({
          data: null,
          error: { message: 'User already registered' },
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
}));

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the signup form correctly', () => {
    render(<SignupForm />);
    
    // Check for form elements
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    
    // Check for OAuth options
    expect(screen.getByText(/sign up with google/i)).toBeInTheDocument();
    
    // Check for login link
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
  
  it('validates form inputs correctly', async () => {
    render(<SignupForm />);
    
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    
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
    const passwordInput = screen.getByLabelText(/^password$/i);
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
    const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs');
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
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
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButton);
    
    // Verify signUp was called with correct data
    await waitFor(() => {
      expect(createClientComponentClient().auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'John Doe',
          },
        },
      });
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/verification email has been sent/i)).toBeInTheDocument();
    });
  });
  
  it('handles signup error correctly', async () => {
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
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButton);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/user already registered/i)).toBeInTheDocument();
    });
  });
  
  it('handles OAuth signup correctly', async () => {
    const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs');
    
    render(<SignupForm />);
    
    // Click on Google sign up
    const googleButton = screen.getByText(/sign up with google/i);
    fireEvent.click(googleButton);
    
    // Verify OAuth sign in was called with Google provider
    await waitFor(() => {
      expect(createClientComponentClient().auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.any(String),
        },
      });
    });
  });
  
  it('navigates to sign in page', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<SignupForm />);
    
    // Click on sign in link
    const signInLink = screen.getByText(/sign in/i);
    fireEvent.click(signInLink);
    
    // Check navigation to sign in page
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
  
  it('shows loading state during signup', async () => {
    // Make auth method take some time
    const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs');
    createClientComponentClient().auth.signUp = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: { user: { id: 'new-user-123', email: 'new@example.com' } },
            error: null,
          });
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
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButton);
    
    // Button should show loading state
    expect(signUpButton).toBeDisabled();
    expect(screen.getByText(/signing up/i)).toBeInTheDocument();
  });
});
