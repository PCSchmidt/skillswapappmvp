/**
 * Welcome Page
 * 
 * This page serves as the main landing page for authenticated users.
 * It detects if the user is new (first-time login) or returning and
 * shows the appropriate welcome flow.
 */

'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import WelcomeBack from '@/components/welcome/WelcomeBack';
import WelcomeNew from '@/components/welcome/WelcomeNew';
import { useSupabase } from '@/contexts/SupabaseContext';

export default function WelcomePage() {
  const router = useRouter();
  const { user, isLoading, supabase } = useSupabase();
  const [userProfile, setUserProfile] = useState<{
    id: string;
    full_name: string | null;
    bio: string | null;
    location_city: string | null;
    location_state: string | null;
  } | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  
  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch user profile data
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        setPageLoading(false);
        return;
      }
      
      // Fetch user's skills to help determine if they're a new user
      const { data: userSkills, error: skillsError } = await supabase
        .from('user_skills')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
        
      if (skillsError) {
        console.error('Error fetching user skills:', skillsError);
      }
      
      setUserProfile(profile);
      
      // Determine if user is new based on:
      // 1. No profile data OR
      // 2. Profile created recently (within last 24 hours) AND no skills added
      const isProfileNew = !profile || 
        (new Date(profile.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000);
      const hasNoSkills = !userSkills || userSkills.length === 0;
      
      setIsNewUser(isProfileNew && hasNoSkills);
      setPageLoading(false);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setPageLoading(false);
    }
  }, [user, supabase]);
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      fetchUserProfile();
    }
  }, [user, isLoading, router, fetchUserProfile]);
  
  const handleWelcomeComplete = () => {
    // User has completed onboarding, mark them as not new anymore
    setIsNewUser(false);
  };
  
  if (isLoading || pageLoading || isNewUser === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  if (isNewUser) {
    return (
      <WelcomeNew 
        user={user}
        profile={userProfile}
        onComplete={handleWelcomeComplete}
      />
    );
  }
  
  return (
    <WelcomeBack 
      user={user}
      profile={userProfile}
    />
  );
}
