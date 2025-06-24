/**
 * My Skills Page
 * 
 * Allows users to manage their offered and wanted skills
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserSkillsManager from '@/components/skills/UserSkillsManager';
import { useSupabase } from '@/contexts/SupabaseContext';

export default function MySkillsPage() {
  const { user, isLoading } = useSupabase();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/skills/my-skills');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your skills...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage the skills you offer and the skills you want to learn.
          </p>
        </div>

        {/* Skills Management */}
        <div className="space-y-8">
          {/* Offered Skills */}
          <UserSkillsManager
            userId={user.id}
            skillType="offered"
            title="Skills I Offer"
            description="Skills you can teach or help others with"
          />

          {/* Wanted Skills */}
          <UserSkillsManager
            userId={user.id}
            skillType="wanted"
            title="Skills I Want to Learn"
            description="Skills you'd like to learn from others"
          />
        </div>

        {/* Help Text */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Tips for Managing Your Skills
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Be specific about your skill level to help others understand what you can offer or need</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Add detailed descriptions to help potential skill partners find you</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Keep your skills updated as you learn and grow</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Use the search feature to find others with complementary skills</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
