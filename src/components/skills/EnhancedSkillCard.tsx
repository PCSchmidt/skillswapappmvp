/**
 * Enhanced Skill Card Component
 * 
 * An upgraded version of the SkillCard with enhanced visual design for landing page usage.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Skill } from '@/types/supabase';

interface EnhancedSkillCardProps {
  skill: Skill;
  showActions?: boolean;
  featured?: boolean;
}

export default function EnhancedSkillCard({ 
  skill, 
  showActions = true,
  featured = false
}: EnhancedSkillCardProps) {
  const experienceBadgeColor = {
    beginner: 'bg-blue-100 text-blue-800 border-blue-200',
    intermediate: 'bg-green-100 text-green-800 border-green-200',
    expert: 'bg-purple-100 text-purple-800 border-purple-200',
  }[skill.experience_level || 'beginner'];
  
  const offeringBadgeColor = skill.is_offering
    ? 'bg-primary-100 text-primary-800 border-primary-200'
    : 'bg-secondary-100 text-secondary-800 border-secondary-200';
  
  const offeringText = skill.is_offering ? 'Offering' : 'Seeking';
  
  // Category icon mapping
  const categoryIcons: {[key: string]: JSX.Element} = {
    'Programming': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 0 1 .527.92l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.526ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
      </svg>
    ),
    'Design': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 0 0-3.471 2.987 10.04 10.04 0 0 1 4.815 4.815 18.748 18.748 0 0 0 2.987-3.472l3.386-5.079A1.902 1.902 0 0 0 20.599 1.5Zm-8.3 14.025a18.76 18.76 0 0 0 1.896-1.207 8.026 8.026 0 0 0-4.513-4.513A18.75 18.75 0 0 0 8.475 11.7l-.278.5a5.26 5.26 0 0 1 3.601 3.602l.502-.278ZM6.75 13.5a3.75 3.75 0 0 0-3.75 3.75v1.5c0 .414.336.75.75.75h1.5a3.75 3.75 0 0 0 3.75-3.75V14.25a.75.75 0 0 0-.75-.75H6.75Z" clipRule="evenodd" />
      </svg>
    ),
    'Music': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z" />
      </svg>
    ),
    'Cooking': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M15 1.784l-.796.796a1.125 1.125 0 1 0 1.591 0L15 1.784ZM12 1.784l-.796.796a1.125 1.125 0 1 0 1.591 0L12 1.784ZM9 1.784l-.796.796a1.125 1.125 0 1 0 1.591 0L9 1.784ZM9.75 7.547c.498-.02.998-.035 1.5-.042V6.75a.75.75 0 0 1 1.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 0 1 1.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 0 0-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 0 1 1.5 0v.797ZM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 0 1 2.585.364 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 2.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0 0 12 12.75ZM21.75 18.131a2.604 2.604 0 0 0-1.915.165 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.604 2.604 0 0 0-1.915-.165v2.494c0 1.036.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-2.494Z" />
      </svg>
    ),
    'Language': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 0 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clipRule="evenodd" />
      </svg>
    ),
    'Sports': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-3.71 9.664a.75.75 0 1 0 1.42.001 .75.75 0 0 0-1.42-.001Zm3.71-3.914a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm3.71 3.914a.75.75 0 1 0 1.42.001.75.75 0 0 0-1.42-.001Z" clipRule="evenodd" />
      </svg>
    ),
    // Default icon for other categories
    'default': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z" />
      </svg>
    )
  };
  
  const categoryIcon = categoryIcons[skill.category] || categoryIcons['default'];
  
  return (
    <div className={`relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 ${featured ? 'border-2 border-primary-300' : 'border border-gray-100'}`}>
      {featured && (
        <div className="absolute top-0 right-0">
          <div className="relative h-16 w-16 overflow-hidden">
            <div className="absolute transform rotate-45 bg-primary-600 text-white py-1 right-[-35px] top-[15px] w-[140px] text-center text-xs font-medium">
              Featured
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          {/* Category icon and title */}
          <div className="flex gap-3 items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${skill.is_offering ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-700'}`}>
              {categoryIcon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                {skill.title}
              </h3>
              <p className="text-sm text-gray-500">
                {skill.category} {skill.subcategory ? `• ${skill.subcategory}` : ''}
              </p>
            </div>
          </div>
          
          {/* Badges */}
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium border ${offeringBadgeColor}`}>
              {offeringText}
            </span>
            
            {skill.experience_level && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium border ${experienceBadgeColor}`}>
                {skill.experience_level.charAt(0).toUpperCase() + skill.experience_level.slice(1)}
              </span>
            )}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-700 mb-6 line-clamp-3 pl-4 border-l-2 border-gray-200">
          {skill.description || 'No description provided.'}
        </p>
        
        {/* Remote badge */}
        {skill.is_remote_friendly && (
          <div className="mb-4 flex items-center">
            <span className="inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 1-11-4.69v.001a6.5 6.5 0 0 1 11 4.69Z" clipRule="evenodd" />
              </svg>
              Remote Friendly
            </span>
          </div>
        )}
        
        {/* User info */}
        {skill.users && (
          <div className="flex items-center mt-6 border-t pt-4 border-gray-100">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3">
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
              <p className="text-sm text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 text-gray-400">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                </svg>
                {skill.users.location_city && skill.users.location_state
                  ? `${skill.users.location_city}, ${skill.users.location_state}`
                  : skill.users.location_city || skill.users.location_state || 'Remote'}
              </p>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        {showActions && (
          <div className="mt-5 flex justify-between items-center gap-2">
            <Link
              href={`/skills/${skill.id}`}
              className="text-sm font-medium flex items-center text-primary-600 hover:text-primary-500 transition-colors"
            >
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform">
                <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
              </svg>
            </Link>
            
            <button className={`btn ${skill.is_offering ? 'btn-primary' : 'btn-secondary'} text-sm`}>
              {skill.is_offering ? 'Request Skill' : 'Offer Help'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
