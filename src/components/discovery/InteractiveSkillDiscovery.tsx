/**
 * Interactive Skill Discovery Component
 * 
 * Provides an engaging, tutorial-like experience for new users to discover
 * skills and understand how skill swapping works. Includes demo content
 * and guided interactions.
 */

'use client';

import { MagnifyingGlassIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { useDemoData, DemoSkill } from '@/components/demo/DemoDataProvider';

interface InteractiveSkillDiscoveryProps {
  onSkillSelect?: (skill: DemoSkill) => void;
  className?: string;
}

export default function InteractiveSkillDiscovery({ 
  onSkillSelect, 
  className = '' 
}: InteractiveSkillDiscoveryProps) {
  const { demoSkills } = useDemoData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const categories = [
    { id: 'all', name: 'All Skills', icon: '🎯' },
    { id: 'Technology', name: 'Technology', icon: '💻' },
    { id: 'Music', name: 'Music', icon: '🎵' },
    { id: 'Culinary', name: 'Culinary', icon: '🍳' },
    { id: 'Fitness & Wellness', name: 'Fitness', icon: '🧘' },
    { id: 'Languages', name: 'Languages', icon: '🗣️' },
    { id: 'Arts & Crafts', name: 'Arts', icon: '🎨' }
  ];

  const tutorialSteps = [
    {
      title: "Welcome to Skill Discovery!",
      description: "Let's explore amazing skills you can learn from your community. Click through categories to see what's available.",
      highlight: "categories"
    },
    {
      title: "Find Your Perfect Match",
      description: "Each skill shows the teacher's experience level and rating. Look for skills that match your learning goals!",
      highlight: "skills"
    },
    {
      title: "Ready to Swap?",
      description: "When you find something interesting, you can propose a skill trade. It's that simple to start learning!",
      highlight: "action"
    }
  ];

  const filteredSkills = selectedCategory === 'all' 
    ? demoSkills 
    : demoSkills.filter(skill => skill.category === selectedCategory);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (showTutorial && currentStep === 0) {
      setCurrentStep(1);
    }
  };

  const handleSkillClick = (skill: DemoSkill) => {
    if (showTutorial && currentStep === 1) {
      setCurrentStep(2);
    }
    onSkillSelect?.(skill);
  };

  const nextTutorialStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const skipTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                {tutorialSteps[currentStep].title}
              </h3>
              <p className="text-primary-700 mb-4">
                {tutorialSteps[currentStep].description}
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={nextTutorialStep}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  {currentStep === tutorialSteps.length - 1 ? 'Get Started!' : 'Next'}
                </button>
                <button
                  onClick={skipTutorial}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  Skip tutorial
                </button>
              </div>
            </div>
            <div className="ml-4 text-primary-600">
              <span className="text-2xl">💡</span>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex space-x-2 mt-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full ${
                  index <= currentStep ? 'bg-primary-600' : 'bg-primary-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className={`${showTutorial && tutorialSteps[currentStep].highlight === 'categories' ? 'ring-2 ring-primary-500 ring-opacity-50 rounded-lg' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
          Explore by Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`p-3 rounded-lg border text-center transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-100 border-primary-300 text-primary-800'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className={`${showTutorial && tutorialSteps[currentStep].highlight === 'skills' ? 'ring-2 ring-primary-500 ring-opacity-50 rounded-lg p-4' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Available Skills ({filteredSkills.length})
          </h3>
          <div className="text-sm text-gray-500">
            Click any skill to learn more
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => handleSkillClick(skill)}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-primary-300 group"
            >
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {skill.user.full_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{skill.user.full_name}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {skill.user.location_city}, {skill.user.location_state}
                  </div>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{skill.user.rating}</span>
                </div>
              </div>

              {/* Skill Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {skill.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {skill.description}
                </p>
                
                {/* Skill Details */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {skill.category}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {skill.experience_level}
                  </span>
                  {skill.is_remote && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Remote OK
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {skill.user.completedTrades} trades
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Available
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className={`mt-4 ${showTutorial && tutorialSteps[currentStep].highlight === 'action' ? 'ring-2 ring-primary-500 ring-opacity-50 rounded' : ''}`}>
                <button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-2 px-4 rounded-md hover:from-primary-700 hover:to-secondary-700 transition-all group-hover:shadow-md">
                  Propose Skill Swap
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No skills found in {categories.find(c => c.id === selectedCategory)?.name}
          </h3>
          <p className="text-gray-600 mb-4">
            Try browsing other categories or check back later for new skills!
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All Skills
          </button>
        </div>
      )}
    </div>
  );
}
