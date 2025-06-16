/**
 * Skill Card Component
 * 
 * A card displaying skill information with options to edit or delete if the user owns the skill.
 */

'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { Skill } from '@/types/supabase';

// Re-export the Skill type for backward compatibility
export type { Skill };

export interface SkillCardProps {
  skill: Skill;
  isOwner?: boolean;
  isProfileView?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export default function SkillCard({
  skill,
  isOwner = false,
  isProfileView = false,
  onEdit,
  onDelete,
  onClick,
}: SkillCardProps) {
  const experienceBadgeColor = {
    beginner: 'bg-blue-100 text-blue-800 border-blue-200',
    intermediate: 'bg-green-100 text-green-800 border-green-200',
    expert: 'bg-purple-100 text-purple-800 border-purple-200',
  }[skill.experience_level || 'beginner'];

  const offeringBadgeColor = skill.is_offering
    ? 'bg-primary-100 text-primary-800 border-primary-200'
    : 'bg-secondary-100 text-secondary-800 border-secondary-200';

  const offeringText = skill.is_offering ? 'Offering' : 'Seeking';

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Card 
      className={`h-full transition-all ${onClick && !isProfileView ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={isProfileView ? undefined : handleClick}
    >
      <Card.Body>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mr-2">{skill.title}</h3>
          {isOwner && (
            <div className="flex space-x-2">
              {onEdit && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="text-gray-500 hover:text-primary-600"
                  aria-label="Edit skill"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-gray-500 hover:text-red-600"
                  aria-label="Delete skill"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

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

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Category</div>
          <div className="text-gray-700">
            {skill.category}
            {skill.subcategory && ` • ${skill.subcategory}`}
          </div>
        </div>

        {skill.description && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500 mb-1">Description</div>
            <p className="text-gray-700 text-sm line-clamp-3">{skill.description}</p>
          </div>
        )}

        {skill.hourly_equivalent_value && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500 mb-1">Value</div>
            <div className="text-gray-700">${skill.hourly_equivalent_value}/hour equivalent</div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
