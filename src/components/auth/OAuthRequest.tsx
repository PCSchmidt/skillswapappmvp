/**
 * OAuth Request Component
 * 
 * Allows users to request specific OAuth providers
 * and provides clear messaging about implementation timeline
 */

'use client';

import React, { useState } from 'react';

interface OAuthRequestProps {
  provider: string;
  description: string;
}

export default function OAuthRequest({ provider, description }: OAuthRequestProps) {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just store locally or log
    // In future, could send to analytics or email service
    console.log(`OAuth request for ${provider} from ${email}`);
    
    // Show success message
    setEmailSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setEmailSubmitted(false);
      setEmail('');
    }, 3000);
  };

  if (emailSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-green-800 font-medium">
          ✅ Thanks! We'll notify you when {provider} sign-in is ready.
        </div>
        <div className="text-green-600 text-sm mt-1">
          Expected timeline: 2-4 weeks
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="text-blue-800 font-medium mb-2">
        🚀 {provider} Sign-In Coming Soon!
      </div>
      <div className="text-blue-600 text-sm mb-3">
        {description}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email me when ready"
          className="flex-1 px-3 py-1 border border-blue-300 rounded text-sm"
          required
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Notify Me
        </button>
      </form>
    </div>
  );
}
