/**
 * Skill Detail Page
 * 
 * This page displays the details of a specific skill and options
 * to interact with the skill owner (e.g., propose a trade).
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';
import TradeProposalForm from '@/components/trades/TradeProposalForm';

type Skill = Database['public']['Tables']['skills']['Row'] & {
  users?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
    location_city: string | null;
    location_state: string | null;
    bio: string | null;
  } | null;
};

export default function SkillDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { supabase, user } = useSupabase();
  
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userOwnsSkill, setUserOwnsSkill] = useState(false);
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [tradeId, setTradeId] = useState<string | null>(null);
  
  // Fetch skill data on initial load
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select(`
            *,
            users:user_id (
              id,
              full_name,
              profile_image_url,
              location_city,
              location_state,
              bio
            )
          `)
          .eq('id', params.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setSkill(data);
          // Check if the current user owns this skill
          if (user && data.user_id === user.id) {
            setUserOwnsSkill(true);
          }
        }
      } catch (err: any) {
        console.error('Error fetching skill:', err);
        setError('Failed to load skill details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkill();
  }, [params.id, supabase, user]);
  
  // Format availability for display
  const formatAvailability = (availabilityJson: string | null) => {
    if (!availabilityJson) return 'Not specified';
    
    try {
      const days = JSON.parse(availabilityJson);
      if (!Array.isArray(days) || days.length === 0) return 'Not specified';
      return days.join(', ');
    } catch (e) {
      return 'Not specified';
    }
  };
  
  // Format experience level for display
  const formatExperienceLevel = (level: string | null) => {
    if (!level) return 'Not specified';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };
  
  // Handle skill deletion
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user?.id); // Safety check to ensure user owns the skill
      
      if (error) {
        throw error;
      }
      
      // Redirect to dashboard after successful deletion
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error deleting skill:', err);
      setError('Failed to delete skill');
    }
  };
  
  // Handle trade proposal
  const handleProposeTrade = () => {
    if (!user) {
      router.push(`/login?redirect=/skills/${params.id}`);
      return;
    }
    
    setShowTradeForm(true);
  };
  
  // Handle trade success
  const handleTradeSuccess = (newTradeId: string) => {
    setTradeId(newTradeId);
    setTradeSuccess(true);
    setShowTradeForm(false);
  };
  
  // Handle trade form cancel
  const handleTradeCancel = () => {
    setShowTradeForm(false);
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading skill details...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error || !skill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-error-600 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Skill Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The skill you are looking for does not exist or has been removed.'}
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // Determine badge colors for experience level and offering type
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        
        {/* Trade success message */}
        {tradeSuccess && (
          <div className="mb-6 bg-success-100 border border-success-400 text-success-700 px-4 py-5 rounded-md shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-success-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Trade Proposed Successfully!</h3>
                <div className="mt-2 text-sm">
                  <p>
                    Your trade proposal has been sent. You can view and manage your trades in your dashboard.
                  </p>
                  <div className="mt-4">
                    <Link 
                      href={`/trades/${tradeId}`} 
                      className="text-success-700 font-medium hover:text-success-600"
                    >
                      View Trade Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Trade proposal form or main content */}
        {showTradeForm ? (
          <div className="mb-6">
            <TradeProposalForm 
              requestedSkill={skill}
              onCancel={handleTradeCancel}
              onSuccess={handleTradeSuccess}
            />
          </div>
        ) : (
          /* Main content - only show if not showing the trade form */
          !tradeSuccess && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {/* Header section */}
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="flex justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{skill.title}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                      {skill.category} {skill.subcategory ? `• ${skill.subcategory}` : ''}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${offeringBadgeColor}`}>
                      {offeringText}
                    </span>
                    
                    {skill.experience_level && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${experienceBadgeColor}`}>
                        {formatExperienceLevel(skill.experience_level)}
                      </span>
                    )}
                    
                    {skill.is_remote_friendly && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        Remote Friendly
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {skill.description || 'No description provided.'}
                  </p>
                </div>
                
                {/* Details section */}
                <div className="mb-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  {/* Availability */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Availability</h3>
                    <p className="mt-1 text-gray-900">
                      {formatAvailability(skill.availability as string)}
                    </p>
                  </div>
                  
                  {/* Hourly Value */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Estimated Value</h3>
                    <p className="mt-1 text-gray-900">
                      {skill.hourly_equivalent_value 
                        ? `$${skill.hourly_equivalent_value.toFixed(2)}/hour` 
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
                
                {/* User/owner information */}
                {skill.users && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      {skill.is_offering ? 'Offered by' : 'Requested by'}
                    </h2>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 relative h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                        {skill.users.profile_image_url ? (
                          <Image
                            src={skill.users.profile_image_url}
                            alt={skill.users.full_name || 'User profile'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-semibold text-2xl">
                            {(skill.users.full_name?.charAt(0) || '?').toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {skill.users.full_name || 'Anonymous User'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {skill.users.location_city && skill.users.location_state
                            ? `${skill.users.location_city}, ${skill.users.location_state}`
                            : skill.users.location_city || skill.users.location_state || 'Location not specified'}
                        </p>
                        
                        {skill.users.bio && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {skill.users.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="mt-8 pt-4 border-t border-gray-200 flex flex-wrap justify-end gap-3">
                  {userOwnsSkill ? (
                    // Actions for skill owner
                    <>
                      <Link 
                        href={`/skills/${params.id}/edit`}
                        className="btn btn-secondary"
                      >
                        Edit Skill
                      </Link>
                      <button
                        onClick={handleDelete}
                        className="btn btn-error"
                      >
                        Delete Skill
                      </button>
                    </>
                  ) : (
                    // Actions for other users
                    <button
                      onClick={handleProposeTrade}
                      className="btn btn-primary"
                    >
                      {skill.is_offering ? 'Request This Skill' : 'Offer Your Help'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
