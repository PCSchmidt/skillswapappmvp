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
    beginner: 'bg-blue-900/20 text-blue-400 border border-blue-500/20',
    intermediate: 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20',
    expert: 'bg-purple-900/20 text-purple-400 border border-purple-500/20',
  }[skill.experience_level || 'beginner'];
  
  const offeringBadgeColor = skill.is_offering
    ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20'
    : 'bg-amber-900/30 text-amber-400 border border-amber-500/20';
  
  const offeringText = skill.is_offering ? 'Offering' : 'Seeking';
  
  return (
    <div className="card overflow-hidden hover:shadow-glow-sm transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{skill.title}</h3>
            <p className="text-sm text-text-muted mb-2">
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
        
        <p className="text-text-secondary mb-4 line-clamp-2">
          {skill.description || 'No description provided.'}
        </p>
        
        {skill.users && (
          <div className="flex items-center mt-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-surface-raised mr-3">
              {skill.users.profile_image_url ? (
                <Image
                  src={skill.users.profile_image_url}
                  alt={skill.users.full_name || 'User profile'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-900/30 text-emerald-400 font-semibold text-xl">
                  {(skill.users.full_name?.charAt(0) || '?').toUpperCase()}
                </div>
              )}
            </div>
            
            <div>
              <p className="font-medium text-text-primary">{skill.users.full_name || 'Anonymous User'}</p>
              <p className="text-sm text-text-muted">
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
              className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
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
