/**
 * Profile Header Component
 * 
 * Displays user profile information with an option to edit.
 */

'use client';

import Image from 'next/image';
import React from 'react';

interface User {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  bio?: string;
  location?: string;
  avatar_url?: string | null;
  profile_image_url?: string | null;
  created_at?: string;
  updated_at?: string;
  member_since?: string;
  skills_count?: number;
  trades_count?: number;
  rating?: number;
  ratings_count?: number;
  followers_count?: number;
  following_count?: number;
  is_following?: boolean;
  is_verified?: boolean;
  social_links?: Record<string, string>;
  // Add any other fields as needed
}

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
  onFollow: (isFollowing: boolean) => void;
}

export default function ProfileHeader({ user, isCurrentUser, onFollow }: ProfileHeaderProps) {
  const displayName = user.full_name || user.username || 'User';
  const memberSince = user.member_since
    ? new Date(user.member_since).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : 'Unknown';
  const avatarSrc = user.avatar_url || user.profile_image_url || '/images/default-avatar.png';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div className="sm:flex sm:items-center">
            <div className="h-24 w-24 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0 mb-4 sm:mb-0">
              <Image
                src={avatarSrc}
                alt={displayName}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="sm:ml-6">
              <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {user.email && (
                  <p className="text-gray-600">
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                      </svg>
                      {user.email}
                    </span>
                  </p>
                )}
                
                {user.location && (
                  <p className="text-gray-600">
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                      </svg>
                      {user.location}
                    </span>
                  </p>
                )}
                
                <p className="text-gray-600">
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                    </svg>
                    Member since {memberSince}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Show edit button if current user, else show follow button */}
          {isCurrentUser ? (
            <button
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => {/* navigate to edit profile */}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </button>
          ) : (
            <button
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => onFollow(!user.is_following)}
            >
              {user.is_following ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        
        {user.bio && (
          <div className="mt-6">
            <h2 className="text-gray-500 text-sm font-medium">About</h2>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{user.bio}</p>
          </div>
        )}
        
        {user.social_links && Object.keys(user.social_links).length > 0 && (
          <div className="mt-6">
            <h2 className="text-gray-500 text-sm font-medium">Links</h2>
            <div className="mt-2 flex flex-wrap gap-3">
              {Object.entries(user.social_links).map(([platform, url]) => (
                url && (
                  <a
                    key={platform}
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                    </svg>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export type { User };
