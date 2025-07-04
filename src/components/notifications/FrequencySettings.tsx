/**
 * Copyright Paul C. Schmidt 2025. All rights reserved.
 * Unauthorized use, reproduction, or distribution of this software is prohibited.
 * 
 * FrequencySettings Component
 * 
 * This component allows users to control how frequently they receive notifications,
 * including options for immediate notifications, digests, quiet hours, and "do not disturb" modes.
 */

import { useState, useEffect, useCallback } from 'react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Switch from '@/components/ui/Switch';
import { useSupabase } from '@/contexts/SupabaseContext';

type FrequencyPreference = {
  id: string;
  user_id: string;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string; // format: HH:MM
  quiet_hours_end: string; // format: HH:MM
  do_not_disturb: boolean;
  digest_frequency: 'none' | 'daily' | 'weekly';
  max_notifications_per_hour: number;
  max_emails_per_day: number;
};

const FrequencySettings = () => {
  const { supabase, user } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Frequency preferences
  const [frequencyPrefs, setFrequencyPrefs] = useState<FrequencyPreference | null>(null);
  
  // Time picker states
  const [startTime, setStartTime] = useState('22:00');
  const [endTime, setEndTime] = useState('07:00');

  // Create default frequency preferences
  const createDefaultFrequencyPreferences = useCallback((): FrequencyPreference => ({
    id: 'new',
    user_id: user?.id || '',
    digest_frequency: 'daily',
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '07:00',
    do_not_disturb: false,
    max_notifications_per_hour: 5,
    max_emails_per_day: 5,
  }), [user?.id]);

  // Load user preferences
  const loadPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load notification frequency preferences
      const { data: freqData, error: freqError } = await supabase
        .from('notification_frequency_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (freqError && freqError.code !== 'PGRST116') { // Not found is okay
        throw freqError;
      }
      
      const prefs = freqData || createDefaultFrequencyPreferences();
      setFrequencyPrefs(prefs);
      
      // Set time picker states
      if (prefs.quiet_hours_start) {
        setStartTime(prefs.quiet_hours_start);
      }
      
      if (prefs.quiet_hours_end) {
        setEndTime(prefs.quiet_hours_end);
      }
    } catch (error: unknown) {
      console.error('Error loading frequency preferences:', error);
      setError('Failed to load notification frequency preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, supabase, createDefaultFrequencyPreferences]);
  
  // Load preferences when user changes
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user, loadPreferences]);

  const handleTogglePreference = (key: keyof FrequencyPreference) => {
    if (!frequencyPrefs) return;
    
    setFrequencyPrefs({
      ...frequencyPrefs,
      [key]: !frequencyPrefs[key],
    });
  };
  
  const handleDigestFrequencyChange = (frequency: 'none' | 'daily' | 'weekly') => {
    if (!frequencyPrefs) return;
    
    setFrequencyPrefs({
      ...frequencyPrefs,
      digest_frequency: frequency,
    });
  };
  
  const handleMaxNotificationsChange = (value: number) => {
    if (!frequencyPrefs) return;
    
    setFrequencyPrefs({
      ...frequencyPrefs,
      max_notifications_per_hour: value,
    });
  };
  
  const handleMaxEmailsChange = (value: number) => {
    if (!frequencyPrefs) return;
    
    setFrequencyPrefs({
      ...frequencyPrefs,
      max_emails_per_day: value,
    });
  };
  
  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    
    if (frequencyPrefs) {
      setFrequencyPrefs({
        ...frequencyPrefs,
        quiet_hours_start: time,
      });
    }
  };
  
  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    
    if (frequencyPrefs) {
      setFrequencyPrefs({
        ...frequencyPrefs,
        quiet_hours_end: time,
      });
    }
  };
  
  const savePreferences = async () => {
    if (!user || !frequencyPrefs) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Save frequency preferences
      const { error: freqError } = await supabase
        .from('notification_frequency_preferences')
        .upsert(frequencyPrefs, { onConflict: 'user_id' });
      
      if (freqError) throw freqError;
      
      setSuccess('Your notification frequency preferences have been saved!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);    } catch (error: unknown) {
      console.error('Error saving frequency preferences:', error);
      setError('Failed to save your frequency preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <Card className="mb-8">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Frequency</h2>
        <p className="text-gray-600 mb-6">
          Control how often you receive notifications and set quiet hours.
        </p>
        
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert type="success" className="mb-6">
            {success}
          </Alert>
        )}
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Digest Settings</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="digest-none"
                  name="digest-frequency"
                  className="mr-2"
                  checked={frequencyPrefs?.digest_frequency === 'none'}
                  onChange={() => handleDigestFrequencyChange('none')}
                />
                <label htmlFor="digest-none">No digest (receive notifications immediately)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="digest-daily"
                  name="digest-frequency"
                  className="mr-2"
                  checked={frequencyPrefs?.digest_frequency === 'daily'}
                  onChange={() => handleDigestFrequencyChange('daily')}
                />
                <label htmlFor="digest-daily">Daily digest (receive a summary once per day)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="digest-weekly"
                  name="digest-frequency"
                  className="mr-2"
                  checked={frequencyPrefs?.digest_frequency === 'weekly'}
                  onChange={() => handleDigestFrequencyChange('weekly')}
                />
                <label htmlFor="digest-weekly">Weekly digest (receive a summary once per week)</label>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Quiet Hours</h3>
                <p className="text-sm text-gray-500">
                  No notifications will be sent during these hours
                </p>
              </div>
              <Switch
                checked={frequencyPrefs?.quiet_hours_enabled || false}
                onChange={() => handleTogglePreference('quiet_hours_enabled')}
              />
            </div>
            
            {frequencyPrefs?.quiet_hours_enabled && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="quiet-start" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="quiet-start"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="quiet-end" className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="quiet-end"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={endTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Do Not Disturb</h3>
                <p className="text-sm text-gray-500">
                  Pause all notifications temporarily
                </p>
              </div>
              <Switch
                checked={frequencyPrefs?.do_not_disturb || false}
                onChange={() => handleTogglePreference('do_not_disturb')}
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium mb-4">Rate Limiting</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="max-notifications" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum notifications per hour: {frequencyPrefs?.max_notifications_per_hour}
                </label>
                <input
                  type="range"
                  id="max-notifications"
                  min="1"
                  max="30"
                  step="1"
                  className="w-full"
                  value={frequencyPrefs?.max_notifications_per_hour || 10}
                  onChange={(e) => handleMaxNotificationsChange(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>15</span>
                  <span>30</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="max-emails" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum emails per day: {frequencyPrefs?.max_emails_per_day}
                </label>
                <input
                  type="range"
                  id="max-emails"
                  min="0"
                  max="10"
                  step="1"
                  className="w-full"
                  value={frequencyPrefs?.max_emails_per_day || 5}
                  onChange={(e) => handleMaxEmailsChange(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button onClick={savePreferences} disabled={saving} className="w-full sm:w-auto">
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FrequencySettings;
