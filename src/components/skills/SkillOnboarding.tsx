/**
 * Skill Onboarding Component
 * 
 * Helps new users understand how to add their first skill or find skills they need.
 * Provides guided suggestions and tips for effective skill sharing.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SKILL_CATEGORIES, POPULAR_SKILLS, TRENDING_SEARCHES } from '@/data/skillSuggestions';
import SkillSearch from '@/components/skills/SkillSearch';

interface SkillOnboardingProps {
  mode?: 'offering' | 'seeking' | 'both';
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function SkillOnboarding({
  mode = 'both',
  onComplete,
  onSkip
}: SkillOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userIntent, setUserIntent] = useState<'offer' | 'seek' | ''>('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const router = useRouter();

  const steps = [
    {
      title: "Welcome to SkillSwap! 🎉",
      subtitle: "Let's help you get started with sharing and finding skills",
    },
    {
      title: "What brings you here?",
      subtitle: "Choose what you'd like to do first",
    },
    {
      title: "What's your area of expertise?",
      subtitle: "Select a category that matches your skills",
    },
    {
      title: "Find your perfect match",
      subtitle: "Search or browse skills in your chosen area",
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      // Default completion behavior - redirect based on user intent
      if (userIntent === 'offer') {
        router.push('/skills/add');
      } else if (userIntent === 'seek') {
        router.push('/skills/browse');
      } else {
        router.push('/skills/browse');
      }
    }
  };

  const handleSkillSelect = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentStepData.subtitle}
              </p>
            </div>
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Skip tour
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full ${
                    index <= currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="max-w-md mx-auto">
                <p className="text-gray-600 mb-6">
                  SkillSwap is a community where people exchange knowledge and skills. 
                  Whether you want to teach others or learn something new, we'll help you get started!
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-600 font-medium mb-2">Share Skills</div>
                    <div className="text-green-700">Teach what you know and help others grow</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-medium mb-2">Learn Skills</div>
                    <div className="text-blue-700">Find experts to learn from in any field</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Intent Selection */}
          {currentStep === 1 && (
            <div className="max-w-lg mx-auto">
              <div className="space-y-4">
                <button
                  onClick={() => setUserIntent('offer')}
                  className={`w-full p-6 text-left border-2 rounded-lg transition-all ${
                    userIntent === 'offer'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">I want to share my skills</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Help others by teaching what you know best
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setUserIntent('seek')}
                  className={`w-full p-6 text-left border-2 rounded-lg transition-all ${
                    userIntent === 'seek'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">I want to learn new skills</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Find experts to learn from and grow your abilities
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Category Selection */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(SKILL_CATEGORIES).map(([categoryName, categoryData]) => (
                  <button
                    key={categoryName}
                    onClick={() => setSelectedCategory(categoryName)}
                    className={`p-4 text-center border-2 rounded-lg transition-all ${
                      selectedCategory === categoryName
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{categoryData.icon}</div>
                    <h3 className="font-medium text-gray-900 text-sm">{categoryName}</h3>
                  </button>
                ))}
              </div>
              
              {selectedCategory && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Popular skills in {selectedCategory}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(SKILL_CATEGORIES[selectedCategory].subcategories)
                      .flat()
                      .filter(skill => skill.isPopular)
                      .slice(0, 6)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white text-sm text-gray-700 rounded-full border"
                        >
                          {skill.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Skill Search/Browse */}
          {currentStep === 3 && (
            <div className="max-w-lg mx-auto">
              <div className="mb-6">
                <SkillSearch
                  placeholder={`Search for ${selectedCategory || 'skills'}...`}
                  onSkillSelect={handleSkillSelect}
                  showSuggestions={true}
                  maxSuggestions={6}
                />
              </div>

              {selectedSkills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Skills you're interested in:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-3">Or try these trending searches:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {TRENDING_SEARCHES.slice(0, 8).map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSkillSelect(term)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <div>
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && !userIntent}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
              >
                {userIntent === 'offer' ? 'Add My Skills' : userIntent === 'seek' ? 'Browse Skills' : 'Get Started'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
