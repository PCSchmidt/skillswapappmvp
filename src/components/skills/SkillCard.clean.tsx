'use client';

/**
 * Skill Card Component
 * 
 * A card displaying skill information with options to edit or delete if the user owns the skill.
 */

import React, { useState } from 'react';
import Image from 'next/image';

import ContactUser from '@/components/contact/ContactUser';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';

export type Skill = Database['public']['Tables']['skills']['Row'] & {
  users?: {
    id: string;
    full_name?: string | null;
    username?: string | null;
    profile_image_url?: string | null;
    avatar_url?: string | null;
    location?: string | null;
    location_city?: string | null;
    location_state?: string | null;
  } | null;
  user_skills?: {
    id: string;
    skill_type: 'offered' | 'wanted';
  }[];
};

interface SkillCardProps {
  skill: Skill;
  currentUserId?: string;
  showContactButton?: boolean;
  onEdit?: (skill: Skill) => void;
  onDelete?: (skillId: string) => void;
  onClick?: (skill: Skill) => void;
}

export default function SkillCard({ 
  skill, 
  currentUserId, 
  showContactButton = false,
  onEdit, 
  onDelete, 
  onClick 
}: SkillCardProps) {
  const { user } = useSupabase();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  
  const isOwner = currentUserId ? skill.users?.id === currentUserId : skill.users?.id === user?.id;
  const canShowContactButton = showContactButton && !isOwner && skill.users;

  const handleCardClick = () => {
    if (onClick) {
      onClick(skill);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(skill);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this skill?')) {
      onDelete(skill.id);
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setContactModalOpen(true);
  };

  const getSkillTypeDisplay = () => {
    if (!skill.user_skills || skill.user_skills.length === 0) {
      return skill.is_offering ? 'Offering' : 'Seeking';
    }
    
    const skillType = skill.user_skills[0].skill_type;
    return skillType === 'offered' ? 'Offering' : 'Seeking';
  };

  const getLocationDisplay = () => {
    if (!skill.users) return null;
    
    const { location_city, location_state, location } = skill.users;
    
    // Use specific city/state if available
    if (location_city && location_state) {
      return `${location_city}, ${location_state}`;
    } else if (location_city) {
      return location_city;
    } else if (location_state) {
      return location_state;
    } else if (location) {
      return location;
    }
    return null;
  };

  return (
    <Card 
      className={`h-full transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}`}
      onClick={handleCardClick}
    >
      <Card.Header className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {skill.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                getSkillTypeDisplay() === 'Offering' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {getSkillTypeDisplay()}
              </span>
              {skill.category && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {skill.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card.Header>

      <Card.Body className="pt-0">
        {skill.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {skill.description}
          </p>
        )}

        {/* User Info */}
        {skill.users && (
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 mr-3">
              {(skill.users.profile_image_url || skill.users.avatar_url) ? (
                <Image
                  src={skill.users.profile_image_url || skill.users.avatar_url || ''}
                  alt={(skill.users.full_name || skill.users.username) || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">
                    {(skill.users.full_name || skill.users.username)?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {(skill.users.full_name || skill.users.username) || 'SkillSwap User'}
              </p>
              {getLocationDisplay() && (
                <p className="text-xs text-gray-500 truncate">
                  {getLocationDisplay()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(isOwner || canShowContactButton) && (
          <div className="flex gap-2">
            {isOwner ? (
              <>
                {onEdit && (
                  <Button
                    onClick={handleEditClick}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    onClick={handleDeleteClick}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                )}
              </>
            ) : canShowContactButton && (
              <Button
                onClick={handleContactClick}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                Contact User
              </Button>
            )}
          </div>
        )}
      </Card.Body>

      {/* Contact Modal */}
      {canShowContactButton && skill.users && (
        <ContactUser
          targetUser={{
            id: skill.users.id,
            full_name: skill.users.full_name || skill.users.username || null,
            profile_image_url: skill.users.profile_image_url || skill.users.avatar_url || null,
            location_city: skill.users.location_city || null,
            location_state: skill.users.location_state || null,
          }}
          skill={{
            id: skill.id,
            title: skill.title,
            is_offering: skill.is_offering || false,
            description: skill.description,
          }}
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
        />
      )}
    </Card>
  );
}
