/**
 * Login Form Component
 * 
 * Provides a form for users to sign in to their SkillSwap account.
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{email?: string; password?: string}>({});
  
  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
    // Form validation
  const validateForm = () => {
    const errors: {email?: string; password?: string} = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle Google OAuth sign in - temporarily disabled
  const handleGoogleSignIn = async () => {
    // Show message about using regular signup instead
    setError('Future Enhancement - Google sign-in is not yet available. Please use the regular email and password option to sign up or sign in.');
  };
  
  // Handle navigation to forgot password  
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/reset-password');
  };
  
  // Handle navigation to sign up
  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/signup');
  };  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setValidationErrors({});
    
    // Validate form - this will set validation errors if any
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { success, error: authError } = await signIn(email, password);
      
      if (success) {
        router.push('/dashboard');
      } else {
        // Check for specific error messages that tests expect
        if (authError?.toLowerCase().includes('invalid login credentials')) {
          setError('Invalid login credentials');
        } else if (authError?.toLowerCase().includes('email not confirmed') || 
            authError?.toLowerCase().includes('email not verified')) {
          setError('Your email is not verified. Please check your inbox or request a new verification email.');
        } else {
          setError(authError || 'Invalid login credentials');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded-lg" data-testid="login-form">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md" data-testid="auth-error">
            {error}
            {(error.toLowerCase().includes('email not verified') || 
              error.toLowerCase().includes('email not confirmed')) && (
              <div className="mt-2">
                <Link href={`/auth/resend-verification?email=${encodeURIComponent(email)}`} className="text-primary-600 hover:text-primary-500 font-medium">
                  Resend verification email
                </Link>
              </div>
            )}
          </div>
        )}
          <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Your email address"
            required
            data-testid="email-input"
          />          {validationErrors.email && (
            <div style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{validationErrors.email}</div>
          )}
        </div>
          <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-bold text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded pr-10"
              placeholder="Your password"
              required
              data-testid="password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.342 6.342m7.536 7.536l3.536 3.536M9.878 9.878A3 3 0 109.88 9.88l4.242 4.242" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {validationErrors.password && (
            <div style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{validationErrors.password}</div>
          )}
          <div className="mt-1 text-sm text-right">
            <a 
              href="/auth/forgot-password" 
              onClick={handleForgotPassword}
              className="text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </a>
          </div>
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
          data-testid="login-button"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        
        <div className="mt-4 text-center">
          <span className="text-gray-500 text-sm">or</span>
        </div>
        
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn btn-google w-full mt-4"
          disabled={loading}
          data-testid="google-login-button"
        >
          Sign in with Google (Coming Soon)
        </button>
          <div className="mt-6 text-center text-sm">
          <p>
            Don't have an account?{' '}
            <a 
              href="/signup" 
              onClick={handleSignUp}
              className="text-primary-600 hover:text-primary-500 font-medium" 
              data-testid="signup-link"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
