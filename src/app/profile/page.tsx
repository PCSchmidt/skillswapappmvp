/**
 * Profile Page
 * 
 * Displays the user's profile information, their offered and requested skills,
 * and allows them to edit their profile and manage their skills.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import NotificationBar from '@/components/notifications/NotificationBar';
import ProfileHeader, { User as ProfileUser } from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { Skill } from '@/components/skills/SkillCard';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Skill as SupabaseSkill } from '@/types/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const { supabase, user } = useSupabase();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [offeredSkills, setOfferedSkills] = useState<Skill[]>([]);
  const [requestedSkills, setRequestedSkills] = useState<Skill[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Fetch profile and skills when user is available
  useEffect(() => {
    async function loadUserData() {
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Set profile data
        setProfile({
          id: user.id,
          email: user.email,
          ...profileData,
          member_since: profileData.created_at || user.created_at,
        });

        // Fetch user's skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('updated_at', { ascending: false });

        if (skillsError) throw skillsError;

        // Separate offered and requested skills
        if (skillsData) {
          setOfferedSkills(skillsData.filter((skill: SupabaseSkill) => skill.is_offering));
          setRequestedSkills(skillsData.filter((skill: SupabaseSkill) => !skill.is_offering));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load profile data. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user, supabase, router]);

  // const handleUpdateProfile = async (updatedProfile: Partial<ProfileUser>) => {
  //   try {
  //     setLoading(true);
      
  //     const { error } = await supabase
  //       .from('profiles')
  //       .update(updatedProfile)
  //       .eq('id', user!.id);

  //     if (error) throw error;

  //     // Update local state with new profile data
  //     setProfile(prev => {
  //       if (!prev) return null;
  //       return {
  //         ...prev,
  //         ...updatedProfile,
  //         id: prev.id, // always preserve id
  //       };
  //     });

  //     setNotification({
  //       type: 'success',
  //       message: 'Profile updated successfully!'
  //     });
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     setNotification({
  //       type: 'error',
  //       message: 'Failed to update profile. Please try again.'
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSkillsChange = async () => {
    try {
      // Refetch user's skills
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Separate offered and requested skills
      if (data) {
        setOfferedSkills(data.filter((skill: SupabaseSkill) => skill.is_offering));
        setRequestedSkills(data.filter((skill: SupabaseSkill) => !skill.is_offering));
      }

      setNotification({
        type: 'success',
        message: 'Skills updated successfully!'
      });
    } catch (error) {
      console.error('Error refreshing skills:', error);
      setNotification({
        type: 'error',
        message: 'Failed to refresh skills. Please try again.'
      });
    }
  };

  if (loading) {
    return (
      <Section>
        <Container>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (!profile) {
    return (
      <Section>
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find your profile information.</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            >
              Back to Home
            </button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      {notification && (
        <NotificationBar
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <Section className="py-6 md:py-10">
        <Container>
          <div className="space-y-8">
            <ProfileHeader 
              user={profile}
              isCurrentUser={true}
              onFollow={() => {}}
            />
            
            <ProfileTabs
              userId={user!.id}
              offeredSkills={offeredSkills}
              requestedSkills={requestedSkills}
              onSkillsChange={handleSkillsChange}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
