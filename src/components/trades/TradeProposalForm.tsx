/**
 * Trade Proposal Form Component
 * 
 * This component allows users to propose a trade by selecting a skill they offer
 * in exchange for a skill they want from another user, and specifying details like
 * the proposed schedule and location.
 */

'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';

type Skill = Database['public']['Tables']['skills']['Row'] & {
  users?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
  } | null;
};

interface TradeProposalFormProps {
  requestedSkill: Skill;
  onCancel: () => void;
  onSuccess: (tradeId: string) => void;
}

export default function TradeProposalForm({
  requestedSkill,
  onCancel,
  onSuccess
}: TradeProposalFormProps) {
  const router = useRouter();
  const { supabase, user } = useSupabase();
  
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [proposedHours, setProposedHours] = useState<string>('1');
  const [proposedDates, setProposedDates] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [locationType, setLocationType] = useState<'remote' | 'in-person'>('remote');
  const [locationDetails, setLocationDetails] = useState<string>('');
  
  // Date options for the next 2 weeks
  const dateOptions = React.useMemo(() => {
    const options = [];
    const now = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      
      options.push({
        value: date.toISOString(),
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return options;
  }, []);
  
  // Fetch user's skills that they are offering
  useEffect(() => {
    const fetchMySkills = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*, users:user_id(id, full_name, profile_image_url)')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .eq('is_offering', true) // Only skills the user is offering
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setMySkills(data || []);
        
        // Set the first skill as default if available
        if (data && data.length > 0) {
          setSelectedSkillId(data[0].id);
        }
        
      } catch (err: any) {
        console.error('Error fetching skills:', err);
        setError('Failed to load your skills');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMySkills();
  }, [user, supabase]);
  
  // Handle date selection
  const handleDateToggle = (dateValue: string) => {
    if (proposedDates.includes(dateValue)) {
      setProposedDates(proposedDates.filter(d => d !== dateValue));
    } else {
      setProposedDates([...proposedDates, dateValue]);
    }
  };
  
  // Validate the form
  const validateForm = (): boolean => {
    if (!selectedSkillId) {
      setError('Please select a skill to offer');
      return false;
    }
    
    if (proposedDates.length === 0) {
      setError('Please select at least one proposed date');
      return false;
    }
    
    if (locationType === 'in-person' && !locationDetails.trim()) {
      setError('Please specify the location details for an in-person meeting');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to propose a trade');
      return;
    }
    
    // Check if user is trying to trade with themselves
    if (user.id === requestedSkill.user_id) {
      setError('You cannot propose a trade with yourself');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Create the trade proposal object
      const tradeData = {
        proposer_id: user.id,
        receiver_id: requestedSkill.user_id,
        skill_offered_id: selectedSkillId,
        skill_requested_id: requestedSkill.id,
        status: 'proposed',
        proposed_hours: parseFloat(proposedHours),
        proposed_schedule: JSON.stringify(proposedDates),
        location_type: locationType,
        location_details: locationDetails,
        trade_notes: notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Insert the trade proposal
      const { data, error } = await supabase
        .from('trades')
        .insert(tradeData)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Call the success callback with the trade ID
        onSuccess(data.id);
      }
      
    } catch (err: any) {
      console.error('Error proposing trade:', err);
      setError(err.message || 'Failed to propose trade');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-6">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading your skills...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Propose a Trade</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Requested Skill (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requesting Skill
            </label>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <div className="font-medium text-gray-900">{requestedSkill.title}</div>
              <div className="text-sm text-gray-500">
                {requestedSkill.category} {requestedSkill.subcategory ? `• ${requestedSkill.subcategory}` : ''}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                From: {requestedSkill.users?.full_name || 'Unknown User'}
              </div>
            </div>
          </div>
          
          {/* User's Skills to Offer */}
          <div>
            <label htmlFor="offered-skill" className="block text-sm font-medium text-gray-700 mb-2">
              Your Offered Skill <span className="text-error-600">*</span>
            </label>
            
            {mySkills.length === 0 ? (
              <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                <p className="text-yellow-700">
                  You don't have any skills to offer. Please add a skill first.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/skills/new?type=offering')}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-500"
                >
                  Add a skill to offer →
                </button>
              </div>
            ) : (
              <select
                id="offered-skill"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                required
              >
                <option value="">Select a skill to offer</option>
                {mySkills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.title} ({skill.category})
                  </option>
                ))}
              </select>
            )}
          </div>
          
          {/* Proposed Hours */}
          <div>
            <label htmlFor="proposed-hours" className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Hours <span className="text-error-600">*</span>
            </label>
            <select
              id="proposed-hours"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={proposedHours}
              onChange={(e) => setProposedHours(e.target.value)}
              required
            >
              <option value="0.5">0.5 hours</option>
              <option value="1">1 hour</option>
              <option value="1.5">1.5 hours</option>
              <option value="2">2 hours</option>
              <option value="2.5">2.5 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
              <option value="5">5 hours</option>
              <option value="6">6 hours</option>
              <option value="7">7 hours</option>
              <option value="8">8 hours</option>
            </select>
          </div>
          
          {/* Proposed Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Dates <span className="text-error-600">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Select all dates that work for you. The other person can choose one.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {dateOptions.map((date) => (
                <div key={date.value} className="flex items-center">
                  <input
                    id={`date-${date.value}`}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={proposedDates.includes(date.value)}
                    onChange={() => handleDateToggle(date.value)}
                  />
                  <label htmlFor={`date-${date.value}`} className="ml-2 block text-sm text-gray-700">
                    {date.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Location Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Type <span className="text-error-600">*</span>
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="remote"
                  name="location-type"
                  type="radio"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  checked={locationType === 'remote'}
                  onChange={() => setLocationType('remote')}
                />
                <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
                  Remote (virtual)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="in-person"
                  name="location-type"
                  type="radio"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  checked={locationType === 'in-person'}
                  onChange={() => setLocationType('in-person')}
                />
                <label htmlFor="in-person" className="ml-2 block text-sm text-gray-700">
                  In-person
                </label>
              </div>
            </div>
          </div>
          
          {/* Location Details */}
          <div>
            <label htmlFor="location-details" className="block text-sm font-medium text-gray-700 mb-2">
              {locationType === 'remote' ? 'Virtual Meeting Details' : 'Meeting Location'} 
              {locationType === 'in-person' && <span className="text-error-600">*</span>}
            </label>
            <textarea
              id="location-details"
              name="location-details"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder={locationType === 'remote' 
                ? "Optional: Suggest Zoom, Google Meet, etc."
                : "Please provide the address or general location"
              }
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              required={locationType === 'in-person'}
            />
            <p className="mt-1 text-xs text-gray-500">
              {locationType === 'remote'
                ? "You'll be able to share specific meeting links after the trade is accepted."
                : "For safety, consider meeting in public places."
              }
            </p>
          </div>
          
          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Share any additional details about your trade proposal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || mySkills.length === 0}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending Proposal...' : 'Propose Trade'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
