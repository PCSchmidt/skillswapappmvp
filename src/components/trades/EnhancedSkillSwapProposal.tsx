/**
 * Enhanced Skill Swap Proposal Modal
 * 
 * Provides an engaging, step-by-step skill swap proposal experience
 * with premium feature teases and guided interactions for trial users.
 */

'use client';

import { StarIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

import { DemoSkill } from '@/components/demo/DemoDataProvider';

export interface SkillSwapProposal {
  offeredSkill: string;
  requestedSkill: string;
  message: string;
  timeCommitment: string;
  meetingPreference: string;
}

interface EnhancedSkillSwapProposalProps {
  skill: DemoSkill;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (proposal: SkillSwapProposal) => void;
}

export default function EnhancedSkillSwapProposal({
  skill,
  isOpen,
  onClose,
  onSubmit
}: EnhancedSkillSwapProposalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOwnSkill, setSelectedOwnSkill] = useState('');
  const [message, setMessage] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('1-2 hours');
  const [meetingPreference, setMeetingPreference] = useState('flexible');

  // Demo user skills for proposal
  const userSkills = [
    { id: '1', title: 'Web Design (HTML/CSS)', category: 'Technology' },
    { id: '2', title: 'French Conversation', category: 'Languages' },
    { id: '3', title: 'Graphic Design', category: 'Arts & Crafts' },
    { id: '4', title: 'Personal Training', category: 'Fitness & Wellness' }
  ];

  const steps = [
    { id: 1, title: 'Choose Your Skill', description: 'What can you offer in exchange?' },
    { id: 2, title: 'Set Details', description: 'When and how would you like to meet?' },
    { id: 3, title: 'Send Message', description: 'Add a personal touch to your proposal' }
  ];

  const handleSubmit = () => {
    const proposal: SkillSwapProposal = {
      offeredSkill: selectedOwnSkill,
      requestedSkill: skill.id,
      message,
      timeCommitment,
      meetingPreference
    };
    
    onSubmit?.(proposal);
    onClose();
    
    // Reset form
    setCurrentStep(1);
    setSelectedOwnSkill('');
    setMessage('');
    setTimeCommitment('1-2 hours');
    setMeetingPreference('flexible');
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return selectedOwnSkill !== '';
      case 2: return timeCommitment !== '' && meetingPreference !== '';
      case 3: return message.trim() !== '';
      default: return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Propose Skill Swap
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${
                    index + 1 <= currentStep ? 'text-primary-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-full mx-4 ${
                    index + 1 < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Skill Being Requested */}
          <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <h3 className="font-medium text-primary-900 mb-2">You want to learn:</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold">
                {skill.user.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-primary-900">{skill.title}</h4>
                <div className="flex items-center text-sm text-primary-700">
                  <span>with {skill.user.full_name}</span>
                  <StarIcon className="h-4 w-4 text-yellow-400 ml-2 mr-1" />
                  <span>{skill.user.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select a skill to offer in exchange:
                </label>
                <div className="space-y-3">
                  {userSkills.map((userSkill) => (
                    <label
                      key={userSkill.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedOwnSkill === userSkill.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ownSkill"
                        value={userSkill.id}
                        checked={selectedOwnSkill === userSkill.id}
                        onChange={(e) => setSelectedOwnSkill(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{userSkill.title}</h4>
                        <p className="text-sm text-gray-500">{userSkill.category}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedOwnSkill === userSkill.id
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedOwnSkill === userSkill.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                
                {/* Premium Feature Tease */}
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">⭐</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">
                        Premium Feature: AI-Powered Skill Matching
                      </p>
                      <p className="text-xs text-yellow-700">
                        Get personalized suggestions for the best skills to offer based on demand and your expertise.
                      </p>
                    </div>
                    <button className="text-yellow-700 text-xs font-medium hover:text-yellow-800">
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Time commitment per session:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['1-2 hours', '2-3 hours', '3-4 hours', 'Flexible'].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        timeCommitment === option
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="time"
                        value={option}
                        checked={timeCommitment === option}
                        onChange={(e) => setTimeCommitment(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Meeting preference:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'flexible', label: 'Flexible (your choice)', icon: '🤝' },
                    { id: 'in-person', label: 'In-person meetings', icon: '📍' },
                    { id: 'remote', label: 'Remote/video calls', icon: '💻' },
                    { id: 'hybrid', label: 'Mix of both', icon: '🔄' }
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        meetingPreference === option.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="meeting"
                        value={option.id}
                        checked={meetingPreference === option.id}
                        onChange={(e) => setMeetingPreference(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-xl mr-3">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Premium Feature Tease */}
              <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-xl mr-2">🗓️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-800">
                      Premium Feature: Smart Scheduling
                    </p>
                    <p className="text-xs text-purple-700">
                      Automatically sync calendars and find the perfect meeting times for both parties.
                    </p>
                  </div>
                  <button className="text-purple-700 text-xs font-medium hover:text-purple-800">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Personal message to {skill.user.full_name}:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={`Hi ${skill.user.full_name}! I'm interested in learning ${skill.title} and would love to trade skills with you. I can offer ${userSkills.find(s => s.id === selectedOwnSkill)?.title || 'my skills'} in exchange. Looking forward to hearing from you!`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Mention why you're excited to learn this skill and what makes your offered skill valuable!
                </p>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Proposal Summary:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">You want to learn:</span>
                    <span className="font-medium">{skill.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">You'll offer:</span>
                    <span className="font-medium">
                      {userSkills.find(s => s.id === selectedOwnSkill)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time commitment:</span>
                    <span className="font-medium">{timeCommitment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meeting preference:</span>
                    <span className="font-medium">{meetingPreference}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Back
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            
            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNext()}
                className={`px-6 py-2 rounded-md font-medium ${
                  canProceedToNext()
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceedToNext()}
                className={`px-6 py-2 rounded-md font-medium ${
                  canProceedToNext()
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Send Proposal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
