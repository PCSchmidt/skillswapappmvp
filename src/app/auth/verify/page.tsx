/**
 * Email Verification Page
 * 
 * This page handles email verification through token validation.
 * Users land here after clicking the verification link sent to their email.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from URL parameters
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token || type !== 'email_verification') {
          setVerificationStatus('error');
          setErrorMessage('Invalid verification link. Please request a new verification email.');
          return;
        }
        
        // Verify the token with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });
        
        if (error) {
          console.error('Verification error:', error);
          setVerificationStatus('error');
          setErrorMessage(error.message || 'Failed to verify email. The link may have expired.');
        } else {
          setVerificationStatus('success');
          
          // Update user's verification status in our database
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Check if the user exists in our database first
            const { data: userData } = await supabase
              .from('users')
              .select('id')
              .eq('id', user.id)
              .single();
              
            if (userData) {
              // Update existing user record  
              await supabase.from('users')
                .update({ is_verified: true })
                .eq('id', user.id);
            } else {
              // Insert new user record if it doesn't exist
              await supabase.from('users')
                .insert({
                  id: user.id,
                  email: user.email,
                  is_verified: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
            }
          }
          
          // Redirect to profile completion after a short delay if it's a new user
          setTimeout(() => {
            router.push('/auth/complete-profile');
          }, 3000);
        }
      } catch (err) {
        console.error('Error during verification:', err);
        setVerificationStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    };
    
    verifyEmail();
  }, [searchParams, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <p className="eyebrow mb-2">Verification</p>
          <h2 className="text-display-sm font-display font-semibold">Email Verification</h2>
        </div>
        
        <div className="card py-8 px-4 sm:px-10">
          {verificationStatus === 'loading' && (
            <div className="text-center">
              <div className="spinner mb-4"></div>
              <p className="text-text-secondary">Verifying your email address...</p>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="text-center">
              <div className="mb-4 mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-900/30 border border-emerald-700/40">
                <svg className="h-6 w-6 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-text-primary">Email Verified Successfully</h3>
              <div className="mt-2">
                <p className="text-sm text-text-muted">
                  Your email has been verified. You will be redirected to complete your profile.
                </p>
              </div>
              <div className="mt-5">
                <Link href="/auth/complete-profile" className="text-emerald-400 hover:text-emerald-300">
                  Continue to profile
                </Link>
              </div>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="text-center">
              <div className="mb-4 mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-500/20 border border-error-500/30">
                <svg className="h-6 w-6 text-error-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-text-primary">Verification Failed</h3>
              <div className="mt-2">
                <p className="text-sm text-text-muted">{errorMessage}</p>
              </div>
              <div className="mt-5">
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
                  Return to login
                </Link>
                <span className="mx-2 text-text-muted">|</span>
                <Link href="/auth/resend-verification" className="text-emerald-400 hover:text-emerald-300">
                  Resend verification email
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
