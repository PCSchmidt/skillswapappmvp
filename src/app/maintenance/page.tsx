'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * Maintenance Page Component
 * 
 * This page is shown when the application is in maintenance mode.
 * It provides users with information about the ongoing maintenance
 * and an option to try refreshing the page.
 */
export default function MaintenancePage() {
  const router = useRouter();
  
  // Handle refresh button click
  const handleRefresh = () => {
    router.refresh();
  };
  
  // Get the maintenance message from environment variable, or use a default message
  const maintenanceMessage = process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE || 
    'We are currently performing scheduled maintenance to improve your experience.';
  
  // Get estimated completion time, if available
  const estimatedCompletion = process.env.NEXT_PUBLIC_MAINTENANCE_END_TIME || null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          {/* Logo */}
          <div className="relative w-32 h-32">
            <Image 
              src="/logo.svg" 
              alt="SkillSwap Logo" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-indigo-700">
          We'll Be Back Soon
        </h1>
        
        <div className="mb-6">
          <div className="w-20 h-1 bg-indigo-500 mx-auto mb-6 rounded"></div>
          
          <p className="text-lg text-gray-700 mb-4">
            {maintenanceMessage}
          </p>
          
          {estimatedCompletion && (
            <p className="text-md text-gray-600 mb-4">
              Expected completion: <span className="font-semibold">{estimatedCompletion}</span>
            </p>
          )}
          
          <p className="text-sm text-gray-500 mb-6">
            Thank you for your patience as we work to make SkillSwap better for you.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={handleRefresh}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
          
          <a
            href="https://status.skillswap.app"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            System Status
          </a>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you need assistance, please contact{' '}
            <a
              href="mailto:support@skillswap.app"
              className="text-indigo-600 hover:underline"
            >
              support@skillswap.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
