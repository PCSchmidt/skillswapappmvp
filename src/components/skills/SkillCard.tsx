/**
 * Skill Card Component
 * 
 * Displays a card with information about a skill offered or requested by a user.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Database } from '@/types/supabase';

type Skill = Database['public']['Tables']['skills']['Row'] & {
  users?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
    location_city: string | null;
    location_state: string | null;
  } | null;
};

interface SkillCardProps {
  skill: Skill;
  showActions?: boolean;
}

export default function SkillCard({ skill, showActions = true }: SkillCardProps) {
  const experienceBadgeColor = {
    beginner: 'bg-blue-100 text-blue-800',
    intermediate: 'bg-green-100 text-green-800',
    expert: 'bg-purple-100 text-purple-800',
  }[skill.experience_level || 'beginner'];
  
  const offeringBadgeColor = skill.is_offering
    ? 'bg-primary-100 text-primary-800'
    : 'bg-secondary-100 text-secondary-800';
  
  const offeringText = skill.is_offering ? 'Offering' : 'Seeking';
  
  return (
    <div className="card overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{skill.title}</h3>
            <p className="text-sm text-gray-500 mb-2">
              {skill.category} {skill.subcategory ? `• ${skill.subcategory}` : ''}
            </p>
          </div>
          
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${offeringBadgeColor}`}>
              {offeringText}
            </span>
            
            {skill.experience_level && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${experienceBadgeColor}`}>
                {skill.experience_level.charAt(0).toUpperCase() + skill.experience_level.slice(1)}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-2">
          {skill.description || 'No description provided.'}
        </p>
        
        {skill.users && (
          <div className="flex items-center mt-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
              {skill.users.profile_image_url ? (
                <Image
                  src={skill.users.profile_image_url}
                  alt={skill.users.full_name || 'User profile'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-semibold text-xl">
                  {(skill.users.full_name?.charAt(0) || '?').toUpperCase()}
                </div>
              )}
            </div>
            
            <div>
              <p className="font-medium text-gray-900">{skill.users.full_name || 'Anonymous User'}</p>
              <p className="text-sm text-gray-500">
                {skill.users.location_city && skill.users.location_state
                  ? `${skill.users.location_city}, ${skill.users.location_state}`
                  : skill.users.location_city || skill.users.location_state || 'Location not specified'}
              </p>
            </div>
          </div>
        )}
        
        {showActions && (
          <div className="mt-4 flex justify-between items-center">
            <Link
              href={`/skills/${skill.id}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View Details
            </Link>
            
            <button className="btn btn-primary text-sm">
              {skill.is_offering ? 'Request Skill' : 'Offer Help'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
