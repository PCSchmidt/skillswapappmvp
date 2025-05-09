'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { useSupabase } from '@/contexts/SupabaseContext';

interface EmailPreferenceOption {
  id: string;
  label: string;
  description: string;
  default: boolean;
}

interface EmailFrequencyOption {
  id: string;
  label: string;
  description: string;
}

interface EmailPreferencesFormProps {
  userId: string;
  className?: string;
}

const EMAIL_PREFERENCE_OPTIONS: EmailPreferenceOption[] = [
  {
    id: 'messages',
    label: 'Messages',
    description: 'Receive email notifications when you get new messages',
    default: true,
  },
  {
    id: 'matches',
    label: 'Skill Matches',
    description: 'Receive email notifications about new potential skill matches',
    default: true,
  },
  {
    id: 'trade_updates',
    label: 'Trade Updates',
    description: 'Receive email notifications when your trades are updated',
    default: true,
  },
  {
    id: 'system',
    label: 'System Announcements',
    description: 'Receive important system announcements and updates',
    default: true,
  },
  {
    id: 'reviews',
    label: 'Reviews',
    description: 'Receive email notifications when you get new reviews',
    default: true,
  },
];

const EMAIL_FREQUENCY_OPTIONS: EmailFrequencyOption[] = [
  {
    id: 'immediate',
    label: 'Immediate',
    description: 'Send emails as events happen',
  },
  {
    id: 'daily',
    label: 'Daily Digest',
    description: 'Send a daily summary of all notifications',
  },
  {
    id: 'weekly',
    label: 'Weekly Digest',
    description: 'Send a weekly summary of all notifications',
  },
];

export function EmailPreferencesForm({ userId, className = '' }: EmailPreferencesFormProps) {
  const { supabase } = useSupabase();
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [frequency, setFrequency] = useState<string>('immediate');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [unsubscribeKey, setUnsubscribeKey] = useState<string>('');

  // Load existing preferences from database
  useEffect(() => {
    async function loadPreferences() {
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('email_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is the error code for "no rows returned"
          console.error('Error loading email preferences:', error);
          return;
        }

        if (data) {
          // Format preferences object
          const prefs: Record<string, boolean> = {};
          EMAIL_PREFERENCE_OPTIONS.forEach((option) => {
            prefs[option.id] = data[option.id] ?? option.default;
          });

          setPreferences(prefs);
          setFrequency(data.frequency || 'immediate');
          setUnsubscribeKey(data.unsubscribe_key || '');
        } else {
          // Set defaults if no preferences exist
          const defaults: Record<string, boolean> = {};
          EMAIL_PREFERENCE_OPTIONS.forEach((option) => {
            defaults[option.id] = option.default;
          });
          setPreferences(defaults);

          // Generate unsubscribe key if it doesn't exist
          setUnsubscribeKey(
            crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)
          );
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      loadPreferences();
    }
  }, [userId, supabase]);

  // Handle preference toggle
  const handleTogglePreference = (preferenceId: string) => {
    setPreferences((prev) => ({
      ...prev,
      [preferenceId]: !prev[preferenceId],
    }));
  };

  // Handle frequency change
  const handleFrequencyChange = (frequencyId: string) => {
    setFrequency(frequencyId);
  };

  // Save preferences to database
  const handleSave = async () => {
    if (!userId) return;

    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });

    try {
      // Prepare the data to save
      const dataToSave = {
        user_id: userId,
        frequency,
        unsubscribe_key: unsubscribeKey,
        ...preferences,
      };

      // Upsert to email_preferences table
      const { error } = await supabase
        .from('email_preferences')
        .upsert(dataToSave, { onConflict: 'user_id' });

      if (error) {
        throw error;
      }

      setSaveStatus({
        type: 'success',
        message: 'Email preferences saved successfully',
      });

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error saving email preferences:', error);
      setSaveStatus({
        type: 'error',
        message: 'Failed to save preferences. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Email Notification Preferences</h2>
        <p className="text-gray-600">
          Choose which emails you'd like to receive and how often you'd like to receive them.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Notification Types</h3>
            <div className="space-y-4">
              {EMAIL_PREFERENCE_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-start">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox rounded text-primary h-5 w-5"
                      checked={preferences[option.id] ?? option.default}
                      onChange={() => handleTogglePreference(option.id)}
                    />
                    <div className="ml-3">
                      <span className="block font-medium">{option.label}</span>
                      <span className="block text-sm text-gray-500">{option.description}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Email Frequency</h3>
            <div className="space-y-4">
              {EMAIL_FREQUENCY_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-start">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-primary h-5 w-5"
                      checked={frequency === option.id}
                      onChange={() => handleFrequencyChange(option.id)}
                      name="email-frequency"
                    />
                    <div className="ml-3">
                      <span className="block font-medium">{option.label}</span>
                      <span className="block text-sm text-gray-500">{option.description}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Unsubscribe Link</h3>
            <p className="text-sm text-gray-600 mb-2">
              This unique link allows you to unsubscribe from all emails with one click.
            </p>
            <div className="flex">
              <Input
                value={`${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe/${unsubscribeKey}`}
                readOnly
                className="flex-grow"
              />
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe/${unsubscribeKey}`
                  );
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              {saveStatus.type && (
                <div
                  className={`text-sm ${
                    saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {saveStatus.message}
                </div>
              )}
            </div>
            <button
              type="button"
              className={`px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition ${
                isSaving
                  ? 'opacity-70 cursor-not-allowed'
                  : 'opacity-100 hover:shadow-md'
              }`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </>
      )}
    </Card>
  );
}
