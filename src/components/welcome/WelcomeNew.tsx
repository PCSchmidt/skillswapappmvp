/**
 * Welcome New User Component
 * 
 * Onboarding flow for new users including:
 * - Welcome message and platform introduction
 * - Profile completion (bio, location, skills interests)
 * - First skill addition workflow
 * - Tour of key features
 */

'use client';

import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import SkillOnboarding from '@/components/skills/SkillOnboarding';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSupabase } from '@/contexts/SupabaseContext';

interface UserProfile {
  id: string;
  full_name?: string | null;
  bio?: string | null;
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  created_at?: string;
}

interface WelcomeNewProps {
  user: User;
  profile: UserProfile | null;
  onComplete: () => void;
}

export default function WelcomeNew({ user, profile, onComplete }: WelcomeNewProps) {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    location_city: profile?.location_city || '',
    location_state: profile?.location_state || '',
    location_country: profile?.location_country || 'United States',
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to SkillSwap! 🎉',
      subtitle: 'Let\'s get you started on your skill-sharing journey',
    },
    {
      id: 'profile',
      title: 'Tell us about yourself',
      subtitle: 'Help others get to know you better',
    },
    {
      id: 'skills',
      title: 'Add your first skills',
      subtitle: 'What skills do you want to share or learn?',
    },
    {
      id: 'complete',
      title: 'You\'re all set! 🚀',
      subtitle: 'Welcome to the SkillSwap community',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipStep = () => {
    handleNext();
  };

  const handleProfileSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          ...profileData,
          updated_at: new Date().toISOString(),
        });
        
      if (updateError) throw updateError;
      
      handleNext();
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsComplete = () => {
    handleNext();
  };

  const handleFinish = () => {
    onComplete();
    router.push('/dashboard');
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-4xl">🤝</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to SkillSwap!
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join a community where everyone has something to teach and something to learn. 
                Let's help you get started on your skill-sharing journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold mb-2">Share Your Skills</h3>
                <p className="text-gray-600">Teach others what you know and help them grow</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-lg font-semibold mb-2">Learn New Skills</h3>
                <p className="text-gray-600">Discover and learn from talented people in your community</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-3xl mb-4">🌟</div>
                <h3 className="text-lg font-semibold mb-2">Build Connections</h3>
                <p className="text-gray-600">Meet like-minded people and expand your network</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button onClick={handleNext} variant="primary" size="lg">
                Get Started
              </Button>
              <Button onClick={() => router.push('/dashboard')} variant="outline" size="lg">
                Skip Tour
              </Button>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell us about yourself</h2>
              <p className="text-lg text-gray-600">
                Help other users get to know you better with a brief profile
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <div className="space-y-6">
              <Input
                label="Full Name"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us a bit about yourself, your interests, and what brings you to SkillSwap..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={profileData.location_city}
                  onChange={(e) => setProfileData({ ...profileData, location_city: e.target.value })}
                  placeholder="Your city"
                />
                <Input
                  label="State/Province"
                  value={profileData.location_state}
                  onChange={(e) => setProfileData({ ...profileData, location_state: e.target.value })}
                  placeholder="Your state or province"
                />
              </div>
              
              <Input
                label="Country"
                value={profileData.location_country}
                onChange={(e) => setProfileData({ ...profileData, location_country: e.target.value })}
                placeholder="Your country"
              />
            </div>
            
            <div className="flex justify-between mt-8">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <div className="flex gap-3">
                <Button onClick={handleSkipStep} variant="ghost">
                  Skip for now
                </Button>
                <Button 
                  onClick={handleProfileSave} 
                  variant="primary"
                  isLoading={loading}
                  disabled={!profileData.full_name.trim()}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Add your first skills</h2>
              <p className="text-lg text-gray-600">
                What skills would you like to share or learn? You can always add more later.
              </p>
            </div>
            
            <SkillOnboarding
              mode="both"
              onComplete={handleSkillsComplete}
              onSkip={handleSkillsComplete}
            />
            
            <div className="flex justify-between mt-8">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleSkillsComplete} variant="ghost">
                Skip for now
              </Button>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">🚀</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                You're all set!
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Welcome to the SkillSwap community! Your profile is ready and you can start 
                connecting with other skill enthusiasts.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">What's Next?</h3>
                <ul className="text-left space-y-2 text-gray-700">
                  <li>• Browse skills in your area</li>
                  <li>• Connect with other users</li>
                  <li>• Propose skill exchanges</li>
                  <li>• Build your reputation</li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/skills/browse" className="block text-blue-600 hover:text-blue-800">
                    → Browse Skills
                  </Link>
                  <Link href="/skills/my-skills" className="block text-blue-600 hover:text-blue-800">
                    → Manage My Skills
                  </Link>
                  <Link href="/profile" className="block text-blue-600 hover:text-blue-800">
                    → Edit Profile
                  </Link>
                </div>
              </div>
            </div>
            
            <Button onClick={handleFinish} variant="primary" size="lg">
              Go to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600 mt-1">
              {steps[currentStep].subtitle}
            </p>
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
