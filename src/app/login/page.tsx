/**
 * Login Page
 */

import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In | SkillSwap',
  description: 'Sign in to your SkillSwap account to connect with skilled people in your community',
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="eyebrow mb-3 block">Welcome Back</span>
          <h1 className="font-display text-display-sm">Sign In</h1>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-xs text-text-muted">
          By signing in, you agree to our{' '}
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
  );
}
