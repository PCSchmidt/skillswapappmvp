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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <SignupForm />
          
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
