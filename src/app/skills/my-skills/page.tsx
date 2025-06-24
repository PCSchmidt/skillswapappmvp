/**
 * My Skills Page
 * 
 * Allows users to manage their offered and wanted skills
 */

import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import UserSkillsManager from '@/components/skills/UserSkillsManager';

export const metadata: Metadata = {
  title: 'My Skills | SkillSwap',
  description: 'Manage your skills - add skills you can offer and skills you want to learn',
};

export default async function MySkillsPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/skills/my-skills');
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
            userId={session.user.id}
            skillType="offered"
            title="Skills I Offer"
            description="Skills you can teach or help others with"
          />

          {/* Wanted Skills */}
          <UserSkillsManager
            userId={session.user.id}
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
              <span>Add detailed descriptions to help potential skill exchange partners understand your experience</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Regularly update your skills as you learn new things or want to learn different topics</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Your skills will be visible to other users looking for skill exchanges</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
