/**
 * Profile Completion Checker
 * 
 * Analyzes user profile data and provides completion status and suggestions
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Profile, Skill } from '@/types/supabase';

interface ProfileCompletionItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  required: boolean;
  weight: number;
  action?: string;
  href?: string;
}

interface ProfileCompletionProps {
  className?: string;
}

export default function ProfileCompletion({ className = '' }: ProfileCompletionProps) {
  const { user, supabase } = useSupabase();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Try to fetch user profile - handle gracefully if table doesn't exist
      let profile = null;
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned", which is acceptable
          console.warn('User profile fetch warning:', profileError);
        }
        profile = profileData;
      } catch (profileFetchError) {
        console.warn('Could not fetch user profile data, using fallback:', profileFetchError);
      }

      // Set profile data with fallback
      setProfileData(profile || {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        bio: '',
        location: '',
        avatar_url: user.user_metadata?.avatar_url || '',
        profile_image_url: ''
      });

      // Try to fetch user skills - handle gracefully if table doesn't exist
      let skills = [];
      try {
        const { data: userSkills, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (skillsError && skillsError.code !== 'PGRST116') {
          console.warn('Skills fetch warning:', skillsError);
        }
        skills = userSkills || [];
      } catch (skillsFetchError) {
        console.warn('Could not fetch skills data, using fallback:', skillsFetchError);
      }

      setSkills(skills);
    } catch (error) {
      console.warn('Error in fetchProfileData, using fallback data:', error);
      // Set minimal data to prevent crashes
      setProfileData({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        bio: '',
        location: '',
        avatar_url: user.user_metadata?.avatar_url || '',
        profile_image_url: ''
      });
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user && user.id) {
      fetchProfileData();
    } else {
      // No user or incomplete user data - set to not loading with empty data
      setLoading(false);
      setProfileData(null);
      setSkills([]);
    }
  }, [user, fetchProfileData]);

  const getCompletionItems = (): ProfileCompletionItem[] => {
    if (!profileData) return [];

    return [
      {
        id: 'email_verified',
        label: 'Email Verified',
        description: 'Verify your email address to access all features',
        completed: user?.email_confirmed_at != null,
        required: true,
        weight: 3,
        action: 'Verify Email',
        href: '/auth/resend-verification'
      },
      {
        id: 'basic_info',
        label: 'Basic Information',
        description: 'Full name and contact information',
        completed: !!(profileData?.full_name && profileData?.email),
        required: true,
        weight: 2
      },
      {
        id: 'profile_photo',
        label: 'Profile Photo',
        description: 'Add a profile picture to build trust',
        completed: !!(profileData?.profile_image_url || profileData?.avatar_url),
        required: false,
        weight: 1,
        action: 'Add Photo',
        href: '/profile/edit'
      },
      {
        id: 'bio',
        label: 'Bio & Description',
        description: 'Tell others about yourself and your interests',
        completed: !!(profileData?.bio && profileData.bio.length > 20),
        required: false,
        weight: 2,
        action: 'Write Bio',
        href: '/profile/edit'
      },
      {
        id: 'location',
        label: 'Location',
        description: 'Add your location to find local connections',
        completed: !!(profileData?.location),
        required: false,
        weight: 2,
        action: 'Add Location',
        href: '/profile/edit'
      },
      {
        id: 'skills_offering',
        label: 'Skills You Offer',
        description: 'Add at least 2 skills you can teach others',
        completed: skills.filter(s => s.is_offering === true).length >= 2,
        required: true,
        weight: 3,
        action: 'Add Skills',
        href: '/skills/new?type=offering'
      },
      {
        id: 'skills_seeking',
        label: 'Skills You Want',
        description: 'Add skills you want to learn',
        completed: skills.filter(s => s.is_offering === false).length >= 1,
        required: false,
        weight: 2,
        action: 'Add Interests',
        href: '/skills/new?type=seeking'
      }
    ];
  };

  // Don't render if there's no user
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const completionItems = getCompletionItems();
  const completedItems = completionItems.filter(item => item.completed);
  const requiredItems = completionItems.filter(item => item.required);
  const completedRequired = requiredItems.filter(item => item.completed);
  
  const totalWeight = completionItems.reduce((sum, item) => sum + item.weight, 0);
  const completedWeight = completedItems.reduce((sum, item) => sum + item.weight, 0);
  const completionPercentage = Math.round((completedWeight / totalWeight) * 100);

  const nextItem = completionItems.find(item => !item.completed && item.required) || 
                   completionItems.find(item => !item.completed);

  const isProfileComplete = completedRequired.length === requiredItems.length;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
        <div className="text-right">
          <div className={`text-2xl font-bold ${isProfileComplete ? 'text-green-600' : 'text-primary-600'}`}>
            {completionPercentage}%
          </div>
          <div className="text-xs text-gray-500">complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              isProfileComplete ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-secondary-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>{completedItems.length} of {completionItems.length} items</span>
          <span>Required: {completedRequired.length}/{requiredItems.length}</span>
        </div>
      </div>

      {/* Status message */}
      {isProfileComplete ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium">Profile Complete!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Your profile meets all requirements. You're ready to start skill swapping!
          </p>
        </div>
      ) : nextItem ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-blue-800 font-medium">Next Step: {nextItem.label}</h4>
              <p className="text-blue-700 text-sm mt-1">{nextItem.description}</p>
            </div>
            {nextItem.href && (
              <a
                href={nextItem.href}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors ml-3"
              >
                {nextItem.action || 'Complete'}
              </a>
            )}
          </div>
        </div>
      ) : null}

      {/* Completion items */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 text-sm">Profile Items:</h4>
        {completionItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              item.completed 
                ? 'bg-green-50 border-green-200' 
                : item.required 
                ? 'bg-orange-50 border-orange-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                item.completed 
                  ? 'bg-green-100 text-green-600' 
                  : item.required 
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {item.completed ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <div className={`text-sm font-medium ${
                  item.completed 
                    ? 'text-green-800' 
                    : item.required 
                    ? 'text-orange-800'
                    : 'text-gray-700'
                }`}>
                  {item.label}
                  {item.required && !item.completed && (
                    <span className="text-orange-600 text-xs ml-1">(Required)</span>
                  )}
                </div>
                <div className={`text-xs ${
                  item.completed 
                    ? 'text-green-600' 
                    : item.required 
                    ? 'text-orange-600'
                    : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </div>
            </div>
            {!item.completed && item.href && (
              <a
                href={item.href}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {item.action || 'Complete'} →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
