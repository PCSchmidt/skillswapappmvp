/**
 * Complete Profile Page
 * 
 * This page allows users to complete their profile after email verification.
 * It collects additional information beyond the basic signup data.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@lib/supabase';
import { useSupabase } from '@/contexts/SupabaseContext';
import Link from 'next/link';

export default function CompleteProfile() {
  const router = useRouter();
  const { user } = useSupabase();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Profile form state
  const [profile, setProfile] = useState({
    bio: '',
    phoneNumber: '',
    city: '',
    state: '',
    country: '',
    categories: [] as string[],
  });
  
  // Skill categories
  const skillCategories = [
    'Technology',
    'Arts & Crafts',
    'Culinary',
    'Education',
    'Fitness & Wellness',
    'Home Improvement',
    'Languages',
    'Music',
    'Professional Services',
    'Other'
  ];
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login');
    }
    
    // Fetch existing profile data if any
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setProfile({
            bio: data.bio || '',
            phoneNumber: data.phone || '',
            city: data.location_city || '',
            state: data.location_state || '',
            country: data.location_country || '',
            categories: [],  // Categories will be implemented separately
          });
        }
      }
    };
    
    fetchProfile();
  }, [user, router]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (category: string) => {
    setProfile((prev) => {
      const categories = [...prev.categories];
      
      if (categories.includes(category)) {
        // Remove if already selected
        return {
          ...prev,
          categories: categories.filter(c => c !== category)
        };
      } else {
        // Add if not selected (max 5)
        if (categories.length < 5) {
          return {
            ...prev,
            categories: [...categories, category]
          };
        }
      }
      
      return prev;
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to complete your profile');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          bio: profile.bio,
          phone: profile.phoneNumber,
          location_city: profile.city,
          location_state: profile.state,
          location_country: profile.country,
          updated_at: new Date().toISOString(),
          // We'll handle interest categories separately in a later enhancement
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkip = () => {
    router.push('/dashboard');
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-gray-700">Please log in to continue.</p>
          <div className="mt-4">
            <Link href="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-lg text-gray-600">
            Help others learn more about you and your skills
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-success-50 text-success-700 rounded-md">
            Profile updated successfully! Redirecting to your dashboard...
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Bio */}
                <div className="sm:col-span-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Tell others about yourself, your skills, and what you're looking to learn or share"
                      value={profile.bio}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                {/* Phone Number */}
                <div className="sm:col-span-3">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={profile.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                {/* City */}
                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={profile.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                {/* State/Province */}
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State/Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={profile.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                {/* Country */}
                <div className="sm:col-span-2">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="country"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={profile.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="MX">Mexico</option>
                      <option value="UK">United Kingdom</option>
                      {/* Add more countries as needed */}
                    </select>
                  </div>
                </div>
                
                {/* Interest Categories */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Categories You're Interested In (Select up to 5)
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {skillCategories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`category-${category}`}
                          name={`category-${category}`}
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={profile.categories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          disabled={!profile.categories.includes(category) && profile.categories.length >= 5}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {5 - profile.categories.length} categories remaining
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={handleSkip}
              >
                Skip for Now
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
