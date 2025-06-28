'use client';

import Link from 'next/link';
import React from 'react';

interface ProfileCompletionStep {
  id: string;
  label: string;
  completed: boolean;
  link: string;
  icon: string;
}

interface ProfileCompletionBannerProps {
  completionPercentage: number;
  steps: ProfileCompletionStep[];
  className?: string;
}

export default function ProfileCompletionBanner({ 
  completionPercentage, 
  steps, 
  className = '' 
}: ProfileCompletionBannerProps) {
  const incompleteSteps = steps.filter(step => !step.completed);
  
  if (completionPercentage >= 100) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">✨</div>
          <div>
            <h3 className="font-semibold text-green-800">Profile Complete!</h3>
            <p className="text-green-700 text-sm">
              Your profile is fully optimized. You're ready to make great connections!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-primary-50 border border-primary-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="text-2xl">🚀</div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary-800 mb-2">
            Complete Your Profile ({completionPercentage}%)
          </h3>
          <p className="text-primary-700 text-sm mb-4">
            A complete profile gets 3x more connections and skill swap requests!
          </p>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="w-full bg-primary-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Next steps */}
          {incompleteSteps.length > 0 && (
            <div>
              <h4 className="font-medium text-primary-800 mb-3">Next Steps:</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {incompleteSteps.slice(0, 4).map((step) => (
                  <Link
                    key={step.id}
                    href={step.link}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-primary-200 hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className="text-sm font-medium text-primary-700">
                      {step.label}
                    </span>
                    <span className="ml-auto text-primary-400">→</span>
                  </Link>
                ))}
              </div>
              
              {incompleteSteps.length > 4 && (
                <p className="text-xs text-primary-600 mt-2">
                  +{incompleteSteps.length - 4} more steps available
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
