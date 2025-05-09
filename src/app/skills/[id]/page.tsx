/**
 * Skill Details Page
 * 
 * Displays detailed information about a specific skill, 
 * including contact options and similar skills.
 */

'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import NotificationBar from '@/components/notifications/NotificationBar';
import { Skill } from '@/components/skills/SkillCard';
import { useSupabase } from '@/contexts/SupabaseContext';

interface SkillOwner {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  social_links?: Record<string, string>;
}

export default function SkillDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { supabase, user } = useSupabase();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [owner, setOwner] = useState<SkillOwner | null>(null);
  const [similarSkills, setSimilarSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const skillId = params.id as string;

  useEffect(() => {
    async function loadSkillData() {
      if (!skillId) return;

      try {
        // Fetch skill data
        const { data: skillData, error: skillError } = await supabase
          .from('skills')
          .select('*')
          .eq('id', skillId)
          .eq('is_active', true)
          .single();

        if (skillError) throw skillError;
        if (!skillData) {
          router.push('/search');
          return;
        }

        setSkill(skillData);

        // Fetch owner profile data
        const { data: ownerData, error: ownerError } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, bio, location, social_links')
          .eq('id', skillData.user_id)
          .single();

        if (ownerError) throw ownerError;
        setOwner(ownerData);

        // Fetch similar skills
        const { data: similarData, error: similarError } = await supabase
          .from('skills')
          .select('*')
          .eq('category', skillData.category)
          .eq('is_active', true)
          .neq('id', skillId)
          .limit(4);

        if (similarError) throw similarError;
        setSimilarSkills(similarData || []);
      } catch (error) {
        console.error('Error loading skill data:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load skill details. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    }

    loadSkillData();
  }, [skillId, supabase, router]);

  const handleContactRequest = async () => {
    if (!user) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/skills/${skillId}`));
      return;
    }

    try {
      // Create a skill exchange request
      const { error } = await supabase
        .from('skill_exchange_requests')
        .insert({
          requestor_id: user.id,
          skill_id: skillId,
          skill_owner_id: skill?.user_id,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      setNotification({
        type: 'success',
        message: 'Contact request sent! The skill owner will be notified.',
      });
      setContactModalOpen(false);
    } catch (error) {
      console.error('Error sending contact request:', error);
      setNotification({
        type: 'error',
        message: 'Failed to send contact request. Please try again.',
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
              <p className="mt-4 text-gray-600">Loading skill details...</p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (!skill || !owner) {
    return (
      <Section>
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Skill Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the skill you're looking for.</p>
            <button
              onClick={() => router.push('/search')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            >
              Browse Skills
            </button>
          </div>
        </Container>
      </Section>
    );
  }

  const isOwner = user && user.id === owner.id;
  const displayName = owner.full_name || owner.username || 'User';
  const avatarSrc = owner.avatar_url || '/images/default-avatar.png';
  
  const experienceBadgeColor = {
    beginner: 'bg-blue-100 text-blue-800 border-blue-200',
    intermediate: 'bg-green-100 text-green-800 border-green-200',
    expert: 'bg-purple-100 text-purple-800 border-purple-200',
  }[skill.experience_level || 'beginner'];

  const offeringBadgeColor = skill.is_offering
    ? 'bg-primary-100 text-primary-800 border-primary-200'
    : 'bg-secondary-100 text-secondary-800 border-secondary-200';

  const offeringText = skill.is_offering ? 'Offering' : 'Seeking';

  return (
    <>
      {notification && (
        <NotificationBar
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <Section className="py-8">
        <Container>
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{skill.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${offeringBadgeColor}`}>
                      {offeringText}
                    </span>
                    
                    {skill.experience_level && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${experienceBadgeColor}`}>
                        {skill.experience_level.charAt(0).toUpperCase() + skill.experience_level.slice(1)}
                      </span>
                    )}
                    
                    {skill.is_remote_friendly && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium border bg-green-50 text-green-700 border-green-200">
                        Remote
                      </span>
                    )}
                  </div>
                </div>

                {!isOwner && (
                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="mt-4 md:mt-0 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                  >
                    Request Contact Info
                  </button>
                )}

                {isOwner && (
                  <button
                    onClick={() => router.push('/profile')}
                    className="mt-4 md:mt-0 inline-flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                      <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                    </svg>
                    Edit in Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  {skill.description && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                      <p className="text-gray-700 whitespace-pre-line">{skill.description}</p>
                    </div>
                  )}

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Category</h2>
                    <p className="text-gray-700">
                      {skill.category}
                      {skill.subcategory && ` > ${skill.subcategory}`}
                    </p>
                  </div>

                  {skill.hourly_equivalent_value && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Value</h2>
                      <p className="text-gray-700">${skill.hourly_equivalent_value}/hour equivalent</p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">About the {skill.is_offering ? 'Provider' : 'Requester'}</h2>
                    
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={avatarSrc}
                          alt={displayName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{displayName}</p>
                        {owner.location && (
                          <p className="text-sm text-gray-500">{owner.location}</p>
                        )}
                      </div>
                    </div>
                    
                    {owner.bio && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-3">{owner.bio}</p>
                      </div>
                    )}
                    
                    {!isOwner && (
                      <button
                        onClick={() => setContactModalOpen(true)}
                        className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                      >
                        Request Contact Info
                      </button>
                    )}

                    {isOwner && (
                      <button
                        onClick={() => router.push('/profile')}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                      >
                        View Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {similarSkills.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Skills</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarSkills.map(similarSkill => (
                  <div 
                    key={similarSkill.id}
                    onClick={() => router.push(`/skills/${similarSkill.id}`)}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{similarSkill.title}</h3>
                    <div className="flex items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
                        similarSkill.is_offering
                          ? 'bg-primary-100 text-primary-800 border-primary-200'
                          : 'bg-secondary-100 text-secondary-800 border-secondary-200'
                      }`}>
                        {similarSkill.is_offering ? 'Offering' : 'Seeking'}
                      </span>
                    </div>
                    {similarSkill.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">{similarSkill.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Contact Request</h3>
              <button onClick={() => setContactModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-700 mb-4">
              Request contact information for this skill? The owner will be notified and can choose to share their details with you.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setContactModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleContactRequest}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
