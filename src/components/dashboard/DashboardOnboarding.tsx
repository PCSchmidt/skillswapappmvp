'use client';

import Link from 'next/link';
import React from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action: string;
  href: string;
  completed: boolean;
  icon: string;
}

interface DashboardOnboardingProps {
  steps: OnboardingStep[];
  completedSteps: number;
  totalSteps: number;
  className?: string;
}

export default function DashboardOnboarding({ 
  steps, 
  completedSteps, 
  totalSteps, 
  className = '' 
}: DashboardOnboardingProps) {
  const progressPercentage = (completedSteps / totalSteps) * 100;
  const nextStep = steps.find(step => !step.completed);

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Welcome to SkillSwap! 🎉</h2>
          <p className="text-gray-600 mt-1">
            Complete your setup to get the most out of your experience
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">{completedSteps}/{totalSteps}</div>
          <div className="text-xs text-gray-500">completed</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Next step highlight */}
      {nextStep && (
        <div className="bg-white rounded-lg p-4 border-2 border-primary-200 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{nextStep.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{nextStep.title}</h3>
              <p className="text-gray-600 text-sm">{nextStep.description}</p>
            </div>
            <Link
              href={nextStep.href}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              {nextStep.action}
            </Link>
          </div>
        </div>
      )}
      
      {/* All steps overview */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700 mb-3">Setup Steps:</h4>
        <div className="grid md:grid-cols-2 gap-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                step.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-lg">{step.icon}</div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  step.completed ? 'text-green-800' : 'text-gray-700'
                }`}>
                  {step.title}
                </div>
              </div>
              {step.completed ? (
                <div className="text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <Link
                  href={step.href}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Start →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
