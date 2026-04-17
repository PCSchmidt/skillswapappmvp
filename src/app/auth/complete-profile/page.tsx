/**
 * Complete Profile Page
 * 
 * This page allows users to complete their profile after email verification.
 * It collects additional information beyond the basic signup data.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-text-secondary">Please log in to continue.</p>
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="eyebrow mb-2">Profile Setup</p>
          <h1 className="text-display-sm font-display font-semibold">Complete Your Profile</h1>
          <p className="mt-2 text-lg text-text-secondary">
            Help others learn more about you and your skills
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-error-500/10 border border-error-500/20 text-error-500">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-700/30 text-emerald-400">
            Profile updated successfully! Redirecting to your dashboard...
          </div>
        )}
        
        <div className="card overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Bio */}
                <div className="sm:col-span-6">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <div className="mt-1">
                    <textarea id="bio" name="bio" rows={3}
                      className="form-input"
                      placeholder="Tell others about yourself, your skills, and what you're looking to learn or share"
                      value={profile.bio} onChange={handleInputChange} />
                  </div>
                </div>
                
                {/* Phone Number */}
                <div className="sm:col-span-3">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number (optional)</label>
                  <div className="mt-1">
                    <input type="tel" id="phoneNumber" name="phoneNumber"
                      className="form-input"
                      value={profile.phoneNumber} onChange={handleInputChange} />
                  </div>
                </div>
                
                {/* City */}
                <div className="sm:col-span-2">
                  <label htmlFor="city" className="form-label">City</label>
                  <div className="mt-1">
                    <input type="text" id="city" name="city"
                      className="form-input"
                      value={profile.city} onChange={handleInputChange} required />
                  </div>
                </div>
                
                {/* State/Province */}
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="form-label">State/Province</label>
                  <div className="mt-1">
                    <input type="text" id="state" name="state"
                      className="form-input"
                      value={profile.state} onChange={handleInputChange} required />
                  </div>
                </div>
                
                {/* Country */}
                <div className="sm:col-span-2">
                  <label htmlFor="country" className="form-label">Country</label>
                  <div className="mt-1">
                    <select id="country" name="country"
                      className="form-input"
                      value={profile.country} onChange={handleInputChange} required>
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
                  <label className="form-label mb-2">
                    Skill Categories You're Interested In (Select up to 5)
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {skillCategories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`category-${category}`}
                          name={`category-${category}`}
                          type="checkbox"
                          className="h-4 w-4 accent-emerald-600 border-border"
                          checked={profile.categories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          disabled={!profile.categories.includes(category) && profile.categories.length >= 5}
                        />
                        <label htmlFor={`category-${category}`}
                          className="ml-2 block text-sm text-text-secondary">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-text-muted">
                    {5 - profile.categories.length} categories remaining
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 border-t border-border text-right sm:px-6 flex justify-between">
              <button type="button" className="btn btn-ghost" onClick={handleSkip}>
                Skip for Now
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
