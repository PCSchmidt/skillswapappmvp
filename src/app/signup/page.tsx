/**
 * Signup Page
 */

import React from 'react';
import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';

export const metadata = {
  title: 'Create Account | SkillSwap',
  description: 'Join SkillSwap to connect with skilled people in your community and trade skills',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="eyebrow mb-2">Get Started</p>
            <h1 className="text-display-sm font-display font-semibold">Create Your Account</h1>
          </div>
          <SignupForm />
          
          <div className="mt-6 text-center">
            <div className="text-sm text-text-muted">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
