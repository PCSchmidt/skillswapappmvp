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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <p className="eyebrow mb-2">Account Recovery</p>
          <h2 className="text-display-sm font-display font-semibold">Reset Your Password</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        <div className="card py-8 px-4 sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-error-500/10 border border-error-500/20 text-error-500">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="text-center">
              <div className="mb-4 mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-900/30 border border-emerald-700/40">
                <svg className="h-6 w-6 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-text-primary">Check Your Email</h3>
              <div className="mt-2">
                <p className="text-sm text-text-muted">
                  We've sent a password reset link to your email address. Please check your inbox.
                </p>
              </div>
              <div className="mt-5">
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
                    Remember your password?
                  </Link>
                </div>
                <div className="text-sm">
                  <Link href="/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
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
