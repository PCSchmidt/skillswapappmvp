/**
 * Password Strength Indicator Component
 * 
 * Shows real-time feedback on password strength and requirements
 */

'use client';

import React from 'react';
import { auditPasswordStrength, getPasswordStrengthDescription } from '@/lib/auth/passwordAudit';

interface PasswordStrengthIndicatorProps {
  password: string;
  userEmail?: string;
  userName?: string;
  className?: string;
}

export default function PasswordStrengthIndicator({ 
  password, 
  userEmail, 
  userName,
  className = '' 
}: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const audit = auditPasswordStrength(password, userEmail, userName);
  const strengthInfo = getPasswordStrengthDescription(audit.strengthScore);

  const getStrengthColor = (score: number) => {
    if (score < 20) return 'bg-red-500';
    if (score < 40) return 'bg-red-400';
    if (score < 60) return 'bg-yellow-400';
    if (score < 80) return 'bg-blue-400';
    if (score < 95) return 'bg-green-400';
    return 'bg-green-500';
  };

  const getTextColor = (score: number) => {
    if (score < 20) return 'text-red-700';
    if (score < 40) return 'text-red-600';
    if (score < 60) return 'text-yellow-600';
    if (score < 80) return 'text-blue-600';
    if (score < 95) return 'text-green-600';
    return 'text-green-700';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Password Strength</span>
          <span className={`font-medium ${getTextColor(audit.strengthScore)}`}>
            {strengthInfo.level}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(audit.strengthScore)}`}
            style={{ width: `${audit.strengthScore}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{strengthInfo.description}</p>
      </div>

      {/* Issues */}
      {audit.weaknessReasons.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-red-700">Issues to fix:</h4>
          <ul className="space-y-1">
            {audit.weaknessReasons.map((reason, index) => (
              <li key={index} className="flex items-start text-sm text-red-600">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {audit.suggestions.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-blue-700">Suggestions:</h4>
          <ul className="space-y-1">
            {audit.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start text-sm text-blue-600">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success message */}
      {!audit.isWeak && audit.strengthScore >= 80 && (
        <div className="flex items-center text-sm text-green-600">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Great! Your password is strong and secure.
        </div>
      )}
    </div>
  );
}
