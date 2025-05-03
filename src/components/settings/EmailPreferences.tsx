/**
 * Email Preferences Component
 * 
 * This component allows users to manage their email notification settings.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';

interface EmailPreferencesProps {
  userId: string;
}

interface EmailPreference {
  id: string;
  user_id: string;
  notify_trade_proposal: boolean;
  notify_trade_status_accepted: boolean;
  notify_trade_status_declined: boolean;
  notify_trade_status_cancelled: boolean;
  notify_trade_status_completed: boolean;
  notify_new_message: boolean;
  notify_new_rating: boolean;
  notify_platform_updates: boolean;
  daily_digest: boolean;
  weekly_digest: boolean;
}

export default function EmailPreferences({ userId }: EmailPreferencesProps) {
  const { supabase } = useSupabase();
  const [preferences, setPreferences] = useState<EmailPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch email preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('email_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) throw error;
        
        setPreferences(data);
      } catch (err: any) {
        console.error('Error fetching email preferences:', err);
        setError('Failed to load your email preferences');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreferences();
  }, [supabase, userId]);
  
  // Handle toggle change for a specific preference
  const handleToggleChange = (key: keyof EmailPreference, value: boolean) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [key]: value,
    });
  };
  
  // Save preferences to database
  const savePreferences = async () => {
    if (!preferences) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('email_preferences')
        .update(preferences)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      setSuccess('Email preferences saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error saving email preferences:', err);
      setError('Failed to save your preferences');
    } finally {
      setSaving(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // If no preferences found, show error
  if (!preferences && !loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-red-500">
          Failed to load email preferences. Please try refreshing the page.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Email Notification Preferences</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Trade Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="notify_trade_proposal" className="text-gray-700">
                New trade proposals
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="notify_trade_proposal"
                  checked={preferences?.notify_trade_proposal}
                  onChange={(e) => handleToggleChange('notify_trade_proposal', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="notify_trade_proposal"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="notify_trade_status_accepted" className="text-gray-700">
                Trade proposal accepted
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="notify_trade_status_accepted"
                  checked={preferences?.notify_trade_status_accepted}
                  onChange={(e) => handleToggleChange('notify_trade_status_accepted', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="notify_trade_status_accepted"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="notify_trade_status_declined" className="text-gray-700">
                Trade proposal declined
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="notify_trade_status_declined"
                  checked={preferences?.notify_trade_status_declined}
                  onChange={(e) => handleToggleChange('notify_trade_status_declined', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="notify_trade_status_declined"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="notify_trade_status_completed" className="text-gray-700">
                Trade completed
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="notify_trade_status_completed"
                  checked={preferences?.notify_trade_status_completed}
                  onChange={(e) => handleToggleChange('notify_trade_status_completed', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="notify_trade_status_completed"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Communication</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="notify_new_message" className="text-gray-700">
                New messages
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="notify_new_message"
                  checked={preferences?.notify_new_message}
                  onChange={(e) => handleToggleChange('notify_new_message', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="notify_new_message"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="notify_new_rating" className="text-gray-700">
                New ratings
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="notify_new_rating"
                  checked={preferences?.notify_new_rating}
                  onChange={(e) => handleToggleChange('notify_new_rating', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="notify_new_rating"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Digest Emails</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="daily_digest" className="text-gray-700">
                Daily activity summary
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="daily_digest"
                  checked={preferences?.daily_digest}
                  onChange={(e) => handleToggleChange('daily_digest', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="daily_digest"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="weekly_digest" className="text-gray-700">
                Weekly digest of new skills & opportunities
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="weekly_digest"
                  checked={preferences?.weekly_digest}
                  onChange={(e) => handleToggleChange('weekly_digest', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="weekly_digest"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="notify_platform_updates" className="text-gray-700">
                Platform updates and announcements
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="notify_platform_updates"
                  checked={preferences?.notify_platform_updates}
                  onChange={(e) => handleToggleChange('notify_platform_updates', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="notify_platform_updates"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={savePreferences}
          disabled={saving}
          className={`px-4 py-2 rounded-md text-white ${
            saving ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
      
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #7c3aed;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #7c3aed;
        }
      `}</style>
    </div>
  );
}
