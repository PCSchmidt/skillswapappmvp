/**
 * New Trade Proposal Page
 * 
 * This page allows users to create trade proposals with other users.
 */

'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSupabase } from '@/contexts/SupabaseContext';

type UserSkill = {
  id: string;
  skill_id: string;
  skill_type: 'offered' | 'wanted';
  skills: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
  } | null;
};

interface TargetUser {
  id: string;
  full_name: string | null;
  profile_image_url: string | null;
  location_city: string | null;
  location_state: string | null;
}

interface TargetSkill {
  id: string;
  title: string;
  description: string | null;
  is_offering: boolean;
}

export default function NewTradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, supabase } = useSupabase();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Get pre-filled data from URL params
  const targetUserId = searchParams.get('user_id');
  const skillId = searchParams.get('skill_id');
  
  // Form state
  const [formData, setFormData] = useState({
    receiverId: targetUserId || '',
    skillOfferedId: '',
    skillRequestedId: skillId || '',
    proposedHours: '',
    tradeNotes: '',
    locationType: 'remote' as 'remote' | 'in-person',
    locationDetails: '',
  });
  
  // Available skills state
  const [mySkills, setMySkills] = useState<UserSkill[]>([]);
  const [targetUser, setTargetUser] = useState<TargetUser | null>(null);
  const [targetSkill, setTargetSkill] = useState<TargetSkill | null>(null);
  
  const fetchData = useCallback(async () => {
    if (!user || !supabase) return;

    try {
      // Fetch my skills
      const { data: mySkillsData, error: mySkillsError } = await supabase
        .from('user_skills')
        .select(`
          *,
          skills:skill_id (
            id,
            title,
            description,
            category
          )
        `)
        .eq('user_id', user.id);

      if (mySkillsError) throw mySkillsError;
      setMySkills((mySkillsData as UserSkill[]) || []);

      // If we have a target user ID, fetch their info
      if (targetUserId) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, full_name, profile_image_url, location_city, location_state')
          .eq('id', targetUserId)
          .single();

        if (userError) throw userError;
        setTargetUser(userData);
      }

      // If we have a skill ID, fetch the skill info
      if (skillId) {
        const { data: skillData, error: skillError } = await supabase
          .from('skills')
          .select('id, title, description, is_offering')
          .eq('id', skillId)
          .single();

        if (skillError) throw skillError;
        setTargetSkill(skillData);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    }
  }, [user, supabase, targetUserId, skillId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('trade_proposals')
        .insert({
          sender_id: user.id,
          receiver_id: formData.receiverId,
          skill_offered_id: formData.skillOfferedId,
          skill_requested_id: formData.skillRequestedId,
          proposed_hours: parseInt(formData.proposedHours) || 1,
          notes: formData.tradeNotes,
          location_type: formData.locationType,
          location_details: formData.locationDetails,
          status: 'pending'
        })
        .select('*')
        .single();

      if (error) throw error;

      setSuccess('Trade proposal sent successfully!');
      setTimeout(() => {
        router.push('/trades');
      }, 2000);

    } catch (err) {
      console.error('Error creating trade proposal:', err);
      setError('Failed to send trade proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Please sign in to create trade proposals
          </h2>
          <Button
            onClick={() => router.push('/auth/signin')}
            variant="primary"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create Trade Proposal
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          {/* Target User Info */}
          {targetUser && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-medium text-blue-900 mb-2">Trading with:</h3>
              <div className="flex items-center gap-3">
                {targetUser.profile_image_url ? (
                  <img
                    src={targetUser.profile_image_url}
                    alt={targetUser.full_name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {targetUser.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {targetUser.full_name || 'SkillSwap User'}
                  </p>
                  {(targetUser.location_city || targetUser.location_state) && (
                    <p className="text-sm text-gray-600">
                      {[targetUser.location_city, targetUser.location_state]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Target Skill Info */}
          {targetSkill && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-medium text-green-900 mb-2">
                Skill you're interested in:
              </h3>
              <div>
                <p className="font-medium text-gray-900">{targetSkill.title}</p>
                {targetSkill.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {targetSkill.description}
                  </p>
                )}
                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                  targetSkill.is_offering 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {targetSkill.is_offering ? 'They are offering' : 'They are seeking'}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skill I'm Offering */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill I'm offering *
              </label>
              <select
                value={formData.skillOfferedId}
                onChange={(e) => handleInputChange('skillOfferedId', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a skill you're offering</option>
                {mySkills
                  .filter(us => us.skill_type === 'offered')
                  .map(userSkill => (
                    <option key={userSkill.id} value={userSkill.skill_id}>
                      {userSkill.skills?.title}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Skill I Want */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill I want in return
              </label>
              <Input
                value={formData.skillRequestedId}
                onChange={(e) => handleInputChange('skillRequestedId', e.target.value)}
                placeholder="Enter skill ID or leave blank for general request"
              />
            </div>

            {/* Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposed hours *
              </label>
              <Input
                type="number"
                value={formData.proposedHours}
                onChange={(e) => handleInputChange('proposedHours', e.target.value)}
                placeholder="e.g., 2"
                min="1"
                max="40"
                required
              />
            </div>

            {/* Trade Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional notes
              </label>
              <textarea
                value={formData.tradeNotes}
                onChange={(e) => handleInputChange('tradeNotes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what you'd like to teach or learn, preferred schedule, etc."
              />
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting preference *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="locationType"
                    value="remote"
                    checked={formData.locationType === 'remote'}
                    onChange={(e) => handleInputChange('locationType', e.target.value)}
                    className="mr-2"
                  />
                  Remote (video call)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="locationType"
                    value="in-person"
                    checked={formData.locationType === 'in-person'}
                    onChange={(e) => handleInputChange('locationType', e.target.value)}
                    className="mr-2"
                  />
                  In-person
                </label>
              </div>
            </div>

            {/* Location Details */}
            {formData.locationType === 'in-person' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location details
                </label>
                <Input
                  value={formData.locationDetails}
                  onChange={(e) => handleInputChange('locationDetails', e.target.value)}
                  placeholder="e.g., Coffee shop in downtown, my office, etc."
                />
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                disabled={loading}
                className="flex-1"
              >
                Send Trade Proposal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
