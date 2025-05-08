/**
 * Profile Header Component
 * 
 * Displays user profile information with an option to edit.
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProfileHeaderProps {
  profile: {
    id: string;
    full_name?: string;
    username?: string;
    email?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    member_since?: string;
    social_links?: Record<string, string>;
  };
  onUpdateProfile: (updatedProfile: any) => Promise<void>;
}

export default function ProfileHeader({ profile, onUpdateProfile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    username: profile.username || '',
    bio: profile.bio || '',
    location: profile.location || '',
    social_links: profile.social_links || {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const displayName = profile.full_name || profile.username || 'User';
  const memberSince = profile.member_since
    ? new Date(profile.member_since).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : 'Unknown';
  const avatarSrc = profile.avatar_url || '/images/default-avatar.png';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {!isEditing ? (
        // Display mode
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
                  {profile.email && (
                    <p className="text-gray-600">
                      <span className="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                          <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                          <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                        </svg>
                        {profile.email}
                      </span>
                    </p>
                  )}
                  
                  {profile.location && (
                    <p className="text-gray-600">
                      <span className="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                          <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                        </svg>
                        {profile.location}
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
            
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </button>
          </div>
          
          {profile.bio && (
            <div className="mt-6">
              <h2 className="text-gray-500 text-sm font-medium">About</h2>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{profile.bio}</p>
            </div>
          )}
          
          {profile.social_links && Object.keys(profile.social_links).length > 0 && (
            <div className="mt-6">
              <h2 className="text-gray-500 text-sm font-medium">Links</h2>
              <div className="mt-2 flex flex-wrap gap-3">
                {Object.entries(profile.social_links).map(([platform, url]) => (
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
      ) : (
        // Edit mode
        <div className="p-6">
          <form onSubmit={handleSubmit}>
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Your Profile</h2>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell others about yourself, your skills, and what you're looking to learn or teach."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Social Links</h3>
                <div className="space-y-4">
                  {['linkedin', 'github', 'twitter', 'website'].map(platform => (
                    <div key={platform}>
                      <label htmlFor={`social-${platform}`} className="block text-sm font-medium text-gray-700 capitalize">
                        {platform}
                      </label>
                      <input
                        type="text"
                        id={`social-${platform}`}
                        value={formData.social_links[platform] || ''}
                        onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                        placeholder={`Your ${platform} URL or username`}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
