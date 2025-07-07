/**
 * Password Strength Indicator Component
 * 
 * Shows real-time feedback on password strength and requirements
 */

'use client';

import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  weight: number; // Higher weight = more important for strength
}

const requirements: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 12 characters',
    test: (password) => password.length >= 12,
    weight: 3
  },
  {
    id: 'uppercase',
    label: 'Contains uppercase letter',
    test: (password) => /[A-Z]/.test(password),
    weight: 1
  },
  {
    id: 'lowercase',
    label: 'Contains lowercase letter',
    test: (password) => /[a-z]/.test(password),
    weight: 1
  },
  {
    id: 'number',
    label: 'Contains number',
    test: (password) => /\d/.test(password),
    weight: 1
  },
  {
    id: 'special',
    label: 'Contains special character (@$!%*?&)',
    test: (password) => /[@$!%*?&]/.test(password),
    weight: 2
  },
  {
    id: 'no-repeats',
    label: 'No more than 2 consecutive identical characters',
    test: (password) => !/(.)\1{2,}/.test(password),
    weight: 1
  },
  {
    id: 'no-common',
    label: 'Avoids common weak passwords',
    test: (password) => {
      const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123', 'admin', 'welcome'];
      return !commonPasswords.some(common => password.toLowerCase().includes(common));
    },
    weight: 2
  }
];

export default function PasswordStrengthIndicator({ password, className = '' }: PasswordStrengthIndicatorProps) {
  if (!password) {
    return null;
  }

  const passedRequirements = requirements.filter(req => req.test(password));
  const totalWeight = requirements.reduce((sum, req) => sum + req.weight, 0);
  const passedWeight = passedRequirements.reduce((sum, req) => sum + req.weight, 0);
  const strengthPercentage = (passedWeight / totalWeight) * 100;

  const getStrengthLevel = (percentage: number) => {
    if (percentage < 30) return { level: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-700' };
    if (percentage < 50) return { level: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-700' };
    if (percentage < 70) return { level: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    if (percentage < 90) return { level: 'Good', color: 'bg-blue-500', textColor: 'text-blue-700' };
    return { level: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700' };
  };

  const strength = getStrengthLevel(strengthPercentage);
  const isStrong = strengthPercentage >= 70;

  return (
    <div className={`mt-2 ${className}`}>
      {/* Strength bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">Password Strength</span>
          <span className={`text-xs font-medium ${strength.textColor}`}>
            {strength.level}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        <p className="text-xs text-gray-600 mb-2">Password must have:</p>
        {requirements.map((req) => {
          const passed = req.test(password);
          return (
            <div key={req.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                passed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {passed ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-xs ${
                passed ? 'text-green-700' : 'text-gray-500'
              }`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Security tips */}
      {isStrong && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-xs text-green-700 font-medium">Great password!</p>
              <p className="text-xs text-green-600">Your password meets our security requirements.</p>
            </div>
          </div>
        </div>
      )}

      {!isStrong && password.length > 6 && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-xs text-blue-700 font-medium">Security tip:</p>
              <p className="text-xs text-blue-600">
                Consider using a passphrase with multiple words, numbers, and symbols for better security.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
