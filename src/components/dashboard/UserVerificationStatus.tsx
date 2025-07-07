/**
 * User Verification Status Component
 * 
 * Shows detailed verification status and next steps for user onboarding
 */

'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';

interface UserVerificationStatusProps {
  className?: string;
}

export default function UserVerificationStatus({ className = '' }: UserVerificationStatusProps) {
  const { user, isVerified, refreshUser, supabase } = useSupabase();
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const handleCheckVerification = async () => {
    if (!user || isChecking) return;
    
    setIsChecking(true);
    try {
      // Force refresh the user data from Supabase
      const { data } = await supabase.auth.getUser();
      
      if (data?.user) {
        // Log the email verification status
        console.log('Manual verification check:', {
          user_id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
          is_confirmed: data.user.email_confirmed_at !== null
        });
        
        // Refresh user data in context
        await refreshUser();
        setLastChecked(new Date());
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendVerification = () => {
    // Redirect to resend verification page with email pre-filled
    window.location.href = `/auth/resend-verification?email=${encodeURIComponent(user?.email || '')}`;
  };

  if (!user) {
    return null;
  }

  if (isVerified) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-800">Email Verified ✅</h3>
            <p className="text-sm text-green-700 mt-1">
              Your account is verified and ready to use. You can now access all SkillSwap features!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Email Verification Required</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Please verify your email address to access all SkillSwap features and start connecting with other members.
          </p>
          <p className="text-xs text-yellow-600 mt-2">
            <strong>Email:</strong> {user.email}
          </p>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleResendVerification}
              className="inline-flex items-center px-3 py-2 border border-yellow-300 shadow-sm text-sm leading-4 font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Resend Verification Email
            </button>
            
            <button
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Check Status
                </>
              )}
            </button>
          </div>

          {lastChecked && (
            <p className="text-xs text-yellow-600 mt-2">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Help section */}
      <div className="mt-4 pt-4 border-t border-yellow-200">
        <details className="group">
          <summary className="flex items-center cursor-pointer text-sm text-yellow-700 hover:text-yellow-800">
            <svg className="w-4 h-4 mr-2 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Need help with email verification?
          </summary>
          <div className="mt-2 pl-6 text-xs text-yellow-600 space-y-2">
            <p>• Check your spam/junk folder for the verification email</p>
            <p>• Make sure you're checking the correct email address: <strong>{user.email}</strong></p>
            <p>• Verification emails are valid for 24 hours</p>
            <p>• If you can't find it, click "Resend Verification Email" above</p>
            <p>• Contact support if you continue having issues: <Link href="/help" className="text-yellow-700 underline hover:text-yellow-800">Get Help</Link></p>
          </div>
        </details>
      </div>
    </div>
  );
}
