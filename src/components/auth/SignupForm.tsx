/**
 * Signup Form Component
 * 
 * Provides a form for users to create a new SkillSwap account.
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { supabase } from '@/lib/supabase';

export default function SignupForm() {
  const router = useRouter();
  const { signUp } = useSupabase();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Individual field errors for better UX and E2E testing
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Field validation functions
  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address';
    return '';
  };
  
  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  };
  
  const validateField = (fieldName: string, value: string) => {
    let errorMessage = '';
    
    switch (fieldName) {
      case 'fullName':
        errorMessage = !value ? 'Full name is required' : '';
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      case 'confirmPassword':
        errorMessage = !value 
          ? 'Please confirm your password' 
          : value !== password 
            ? 'Passwords do not match' 
            : '';
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    
    return errorMessage === '';
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { success, error } = await signUp(email, password);
      
      if (success) {
        // After successful signup, update the user's profile
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { error: profileError } = await supabase
              .from('users')
              .upsert({
                id: user.id,
                email: email,
                full_name: fullName,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            
            if (profileError) {
              console.error('Error updating user profile:', profileError);
            }
          }
        } catch (profileError) {
          console.error('Error getting user or updating profile:', profileError);
        }
        
        setSuccessMessage('Your account has been created. Please check your email for verification.');
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(error || 'Failed to create account');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSignup} className="bg-white p-8 shadow-md rounded-lg" data-testid="signup-form">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create an account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md" data-testid="auth-error">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-success-50 text-success-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              validateField('fullName', e.target.value);
            }}
            onBlur={(e) => validateField('fullName', e.target.value)}
            className="form-input"
            placeholder="Your full name"
            required
            data-testid="full-name-input"
          />
          {fieldErrors.fullName && (
            <div className="mt-1 text-xs text-error-700" data-testid="full-name-error">
              {fieldErrors.fullName}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            Email
          </label>          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField('email', e.target.value);
            }}
            onBlur={(e) => validateField('email', e.target.value)}
            className="form-input"
            placeholder="Your email address"
            required
            data-testid="email-input"
          />
          {fieldErrors.email && (
            <div className="mt-1 text-xs text-error-700" data-testid="email-error">
              {fieldErrors.email}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validateField('password', e.target.value);
              // Re-validate confirm password if it has been entered
              if (confirmPassword) {
                validateField('confirmPassword', confirmPassword);
              }
            }}
            onBlur={(e) => validateField('password', e.target.value)}
            className="form-input"
            placeholder="Create a password"
            required
            data-testid="password-input"
          />
          <div className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters long
          </div>
          {fieldErrors.password && (
            <div className="mt-1 text-xs text-error-700" data-testid="password-error">
              {fieldErrors.password}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateField('confirmPassword', e.target.value);
            }}
            onBlur={(e) => validateField('confirmPassword', e.target.value)}
            className="form-input"
            placeholder="Confirm your password"
            required
            data-testid="confirm-password-input"
          />
          {fieldErrors.confirmPassword && (
            <div className="mt-1 text-xs text-error-700" data-testid="confirm-password-error">
              {fieldErrors.confirmPassword}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">            <input
              type="checkbox"
              className="mr-2"
              required
              data-testid="terms-checkbox"
            />
            <span className="text-sm text-gray-500">
              I agree to the{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>
          <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
          data-testid="signup-button"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="mt-6 text-center text-sm">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-500 font-medium" data-testid="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
