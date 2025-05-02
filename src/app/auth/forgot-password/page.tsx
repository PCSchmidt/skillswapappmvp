/**
 * Forgot Password Page
 * 
 * This page allows users to request a password reset email.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/contexts/SupabaseContext';
import Link from 'next/link';

export default function ForgotPassword() {
  const router = useRouter();
  const { sendPasswordReset } = useSupabase();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { success, error } = await sendPasswordReset(email);
      
      if (success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(error || 'Failed to send password reset email');
      }
    } catch (err: any) {
      console.error('Error sending password reset:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="text-center">
              <div className="mb-4 mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Check Your Email</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  We've sent a password reset link to your email address. Please check your inbox.
                </p>
              </div>
              <div className="mt-5">
                <Link href="/login" className="text-primary-600 hover:text-primary-500">
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                    Remember your password?
                  </Link>
                </div>
                <div className="text-sm">
                  <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                    Need an account?
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
