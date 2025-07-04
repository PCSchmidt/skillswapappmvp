/**
 * Login Form Component
 * 
 * Provides a form for users to sign in to their SkillSwap account.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '@/contexts/SupabaseContext';

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useSupabase();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { success, error } = await signIn(email, password);
      
      if (success) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        // Check if error is due to email not being confirmed
        if (error?.toLowerCase().includes('email not confirmed') || 
            error?.toLowerCase().includes('email not verified')) {
          setError('Your email is not verified. Please check your inbox or request a new verification email.');
        } else {
          setError(error || 'Failed to sign in');
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
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md">
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
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Your email address"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Your password"
            required
          />
          <div className="mt-1 text-sm text-right">
            <Link href="/auth/forgot-password" className="text-primary-600 hover:text-primary-500">
              Forgot password?
            </Link>
          </div>
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        
        <div className="mt-6 text-center text-sm">
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
