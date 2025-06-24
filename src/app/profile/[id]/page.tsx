/**
 * User Profile Page
 * 
 * This page displays another user's profile including their information
 * and a list of skills they're offering or seeking.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import RatingsList from '@/components/ratings/RatingsList';
import StarRating from '@/components/ratings/StarRating';
import SkillCard from '@/components/skills/SkillCard';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { supabase, user } = useSupabase();
    const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [skills, setSkills] = useState<Database['public']['Tables']['skills']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [ratings, setRatings] = useState<Database['public']['Tables']['ratings']['Row'][]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  
  // Filter states
  const [activeTab, setActiveTab] = useState<'offering' | 'seeking'>('offering');
  
  // Fetch user profile and skills on initial load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (profileError) throw profileError;
        
        if (profileData) {
          setProfile(profileData);
          
          // Check if this is the logged-in user's profile
          if (user && profileData.id === user.id) {
            setIsOwnProfile(true);
          }
          
          // Fetch user's skills
          const { data: skillsData, error: skillsError } = await supabase
            .from('skills')
            .select(`
              *,
              users:user_id (
                id,
                full_name,
                profile_image_url,
                location_city,
                location_state
              )
            `)
            .eq('user_id', params.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });
          
          if (skillsError) throw skillsError;
          
          setSkills((skillsData as Database['public']['Tables']['skills']['Row'][]) || []);
          
          // Fetch user's ratings
          const { data: ratingsData, error: ratingsError } = await supabase
            .from('ratings')
            .select(`
              *,
              rater:rater_id(id, full_name, profile_image_url),
              skill:skill_id(id, title, category)
            `)
            .eq('ratee_id', params.id)
            .eq('is_public', true)
            .order('created_at', { ascending: false });
          
          if (ratingsError) throw ratingsError;
          
          setRatings((ratingsData as Database['public']['Tables']['ratings']['Row'][]) || []);          // Calculate average rating
          if (ratingsData && ratingsData.length > 0) {
            const typedRatings = ratingsData as Database['public']['Tables']['ratings']['Row'][];
            const sum = typedRatings.reduce((acc, rating) => acc + rating.rating, 0);
            setAverageRating(sum / ratingsData.length);
          }
        }      } catch (err: unknown) {
        console.error('Error fetching profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [params.id, supabase, user]);
  
  // Filter skills based on active tab
  const filteredSkills = skills.filter(skill => 
    activeTab === 'offering' ? skill.is_offering : !skill.is_offering
  );
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-error-600 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The user profile you are looking for does not exist.'}
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        
        {/* Profile header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-6 sm:px-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0 relative h-32 w-32 rounded-full overflow-hidden bg-gray-200">
              {profile.profile_image_url ? (
                <Image
                  src={profile.profile_image_url}
                  alt={profile.full_name || 'User profile'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-semibold text-5xl">
                  {(profile.full_name?.charAt(0) || profile.email?.charAt(0) || '?').toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.full_name || 'Anonymous User'}
              </h1>
              
              <p className="text-sm text-gray-500 mb-2">
                {profile.location_city && profile.location_state
                  ? `${profile.location_city}, ${profile.location_state}`
                  : profile.location_city || profile.location_state || 'Location not specified'}
                {profile.location_country && (profile.location_city || profile.location_state) && `, ${profile.location_country}`}
                {!profile.location_city && !profile.location_state && profile.location_country}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  Member since {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                </span>
                
                {/* Show other badges */}
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  {skills.filter(s => s.is_offering).length} skills offered
                </span>
                
                <span className="bg-secondary-100 text-secondary-800 text-xs px-2 py-1 rounded-full">
                  {skills.filter(s => !s.is_offering).length} skills sought
                </span>
              </div>
              
              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap gap-3">
                {isOwnProfile ? (
                  <>
                    <Link href="/profile/edit" className="btn btn-primary">
                      Edit Profile
                    </Link>
                    <Link href="/skills/new" className="btn btn-secondary">
                      Add New Skill
                    </Link>
                  </>
                ) : (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => alert('Messaging feature coming soon!')}
                  >
                    Message
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Bio section */}
          {profile.bio && (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">About</h2>
              <p className="whitespace-pre-wrap text-gray-700">{profile.bio}</p>
            </div>
          )}
          
          {/* Ratings summary */}
          <div className={`${profile.bio ? '' : 'border-t'} border-gray-200 px-4 py-5 sm:px-6`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium text-gray-900">Ratings & Reviews</h2>
              <div className="flex items-center">
                {ratings.length > 0 && (
                  <>
                    <StarRating rating={averageRating} size="md" />
                    <span className="ml-2 text-sm text-gray-500">
                      {averageRating.toFixed(1)} ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {ratings.length > 0 ? (
                <RatingsList 
                  ratings={ratings.slice(0, 3)} 
                  emptyMessage="No reviews yet" 
                  showRater={true}
                  linkToTrade={true}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {isOwnProfile ? 'You have not received any ratings yet' : 'This user has not received any ratings yet'}
                  </p>
                </div>
              )}
              
              {ratings.length > 3 && (
                <div className="text-center mt-4">
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    View all {ratings.length} reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Skills section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Skills</h2>
              
              {isOwnProfile && (
                <Link href="/skills/new" className="btn btn-sm btn-primary">
                  Add New Skill
                </Link>
              )}
            </div>
            
            {/* Tabs */}
            <div className="mt-4 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('offering')}
                  className={`
                    whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                    ${activeTab === 'offering'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  Offering ({skills.filter(s => s.is_offering).length})
                </button>
                
                <button
                  onClick={() => setActiveTab('seeking')}
                  className={`
                    whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                    ${activeTab === 'seeking'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  Seeking ({skills.filter(s => !s.is_offering).length})
                </button>
              </nav>
            </div>
          </div>
          
          {/* Skills grid */}
          <div className="px-4 py-5 sm:p-6">
            {filteredSkills.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No skills {activeTab === 'offering' ? 'offered' : 'sought'} yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {isOwnProfile
                    ? `You haven't added any skills you're ${activeTab === 'offering' ? 'offering' : 'seeking'} yet.`
                    : `This user hasn't added any skills they're ${activeTab === 'offering' ? 'offering' : 'seeking'} yet.`}
                </p>
                
                {isOwnProfile && (
                  <Link
                    href={{
                      pathname: "/skills/new",
                      query: { type: activeTab === 'offering' ? 'offering' : 'seeking' }
                    }}
                    className="btn btn-primary"
                  >
                    Add {activeTab === 'offering' ? 'an Offering' : 'a Request'}
                  </Link>
                )}
              </div>
            ) : (              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSkills.map((skill) => (
                  <SkillCard 
                    key={skill.id} 
                    skill={skill} 
                    isOwner={profile?.id === user?.id}
                    isProfileView={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
