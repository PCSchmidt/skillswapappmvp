/**
 * Signup Form Component
 * 
 * Provides a form for users to create a new SkillSwap account.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '../../contexts/SupabaseContext';
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
      <form onSubmit={handleSignup} className="bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md">
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
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="form-input"
            placeholder="Your full name"
            required
          />
        </div>
        
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
        
        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Create a password"
            required
          />
          <div className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters long
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              required
            />
            <span className="text-sm text-gray-700">
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
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="mt-6 text-center text-sm">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
