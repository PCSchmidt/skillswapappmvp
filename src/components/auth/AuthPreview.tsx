'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import { classNames } from '@/lib/utils';

interface AuthPreviewProps {
  className?: string;
  variant?: 'inline' | 'card';
}

export default function AuthPreview({ 
  className = '', 
  variant = 'card' 
}: AuthPreviewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [mockEmail, setMockEmail] = useState('');
  const [mockPassword, setMockPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This is just a preview, so we'll redirect to the real auth page
    if (activeTab === 'login') {
      window.location.href = '/login';
    } else {
      window.location.href = '/signup';
    }
  };
  
  return (
    <div className={classNames(
      variant === 'card' ? 'bg-white rounded-xl shadow-lg p-6 border border-gray-100' : '',
      className
    )}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Join SkillSwap</h2>
        <p className="text-gray-600 mt-2">
          Create an account to start sharing and discovering skills
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('login')}
          className={classNames(
            'py-2 px-4 text-sm font-medium flex-1 text-center',
            activeTab === 'login'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-800'
          )}
        >
          Log In
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className={classNames(
            'py-2 px-4 text-sm font-medium flex-1 text-center',
            activeTab === 'signup'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-800'
          )}
        >
          Sign Up
        </button>
      </div>
      
      {/* Form Fields (Preview Only) */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={mockEmail}
            onChange={(e) => setMockEmail(e.target.value)}
            placeholder="yourname@example.com"
            fullWidth
            required
          />
          
          <Input
            label="Password"
            type="password"
            value={mockPassword}
            onChange={(e) => setMockPassword(e.target.value)}
            placeholder={activeTab === 'login' ? '••••••••' : 'Min. 8 characters'}
            fullWidth
            required
          />
          
          {activeTab === 'signup' && (
            <div className="flex items-center">
              <input 
                id="terms" 
                name="terms" 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the <Link href="/terms" className="text-primary-600 hover:text-primary-500">Terms of Service</Link> and <Link href="/privacy" className="text-primary-600 hover:text-primary-500">Privacy Policy</Link>
              </label>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {activeTab === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </div>
      </form>
      
      {/* Benefits Section */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">With a SkillSwap account, you can:</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Offer your skills to others in your community
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Request help with skills you want to learn
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Connect with like-minded individuals in your area
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Build your reputation with reviews and testimonials
          </li>
        </ul>
      </div>
      
      {/* Footer Links */}
      <div className="mt-6 text-center text-sm">
        <Link href={activeTab === 'login' ? '/forgot-password' : '/login'} className="text-primary-600 hover:text-primary-500">
          {activeTab === 'login' ? 'Forgot password?' : 'Already have an account?'}
        </Link>
      </div>
    </div>
  );
}
