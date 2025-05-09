/**
 * NotificationSettingsPage Component
 * 
 * A comprehensive settings page that allows users to manage all notification preferences
 * including email, push, and in-app notification settings.
 */

import { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Switch from '@/components/ui/Switch';
import Tabs, { Tab } from '@/components/ui/Tabs';
import { useSupabase } from '@/contexts/SupabaseContext';

type NotificationPreference = {
  id: string;
  user_id: string;
  notify_trade_proposal: boolean;
  notify_trade_status_accepted: boolean;
  notify_trade_status_declined: boolean;
  notify_trade_status_cancelled: boolean;
  notify_trade_status_completed: boolean;
  notify_new_message: boolean;
  notify_new_rating: boolean;
  daily_digest: boolean;
  weekly_digest: boolean;
};

type ChannelPreference = {
  id: string;
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
};

const NotificationSettingsPage = () => {
  const { supabase, user } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  
  // Notification preferences
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [channelPrefs, setChannelPrefs] = useState<ChannelPreference | null>(null);
  
  // Load user preferences
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);
  
  const loadPreferences = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load notification type preferences
      const { data: prefData, error: prefError } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (prefError) throw prefError;
      
      // Load channel preferences
      const { data: channelData, error: channelError } = await supabase
        .from('notification_channel_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (channelError && channelError.code !== 'PGRST116') { // Not found is okay
        throw channelError;
      }
      
      setPreferences(prefData || createDefaultPreferences());
      setChannelPrefs(channelData || createDefaultChannelPreferences());
    } catch (error: any) {
      console.error('Error loading preferences:', error);
      setError('Failed to load notification preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const createDefaultPreferences = (): NotificationPreference => ({
    id: 'new',
    user_id: user?.id || '',
    notify_trade_proposal: true,
    notify_trade_status_accepted: true,
    notify_trade_status_declined: true,
    notify_trade_status_cancelled: true,
    notify_trade_status_completed: true,
    notify_new_message: true,
    notify_new_rating: true,
    daily_digest: false,
    weekly_digest: true,
  });
  
  const createDefaultChannelPreferences = (): ChannelPreference => ({
    id: 'new',
    user_id: user?.id || '',
    email_enabled: true,
    push_enabled: true,
    in_app_enabled: true,
  });
  
  const handleTogglePreference = (key: keyof NotificationPreference) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };
  
  const handleToggleChannel = (key: keyof ChannelPreference) => {
    if (!channelPrefs) return;
    
    setChannelPrefs({
      ...channelPrefs,
      [key]: !channelPrefs[key],
    });
  };
  
  const savePreferences = async () => {
    if (!user || !preferences || !channelPrefs) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Save notification type preferences
      const { error: prefError } = await supabase
        .from('email_preferences')
        .upsert(preferences, { onConflict: 'user_id' });
      
      if (prefError) throw prefError;
      
      // Save channel preferences
      const { error: channelError } = await supabase
        .from('notification_channel_preferences')
        .upsert(channelPrefs, { onConflict: 'user_id' });
      
      if (channelError) throw channelError;
      
      setSuccess('Your notification preferences have been saved!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      setError('Failed to save your preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Section>
        <Container>
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        </Container>
      </Section>
    );
  }
  
  return (
    <Section>
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>
          <p className="text-gray-600 mb-8">
            Manage how and when you receive notifications from SkillSwap.
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
          
          <Tabs
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-6"
          >
            <Tab id="general" label="General Settings">
              <Card className="mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Notification Channels</h2>
                  <p className="text-gray-600 mb-6">
                    Choose how you want to receive notifications.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={channelPrefs?.email_enabled || false}
                        onChange={() => handleToggleChannel('email_enabled')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                      </div>
                      <Switch
                        checked={channelPrefs?.push_enabled || false}
                        onChange={() => handleToggleChannel('push_enabled')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">In-App Notifications</h3>
                        <p className="text-sm text-gray-500">See notifications within the SkillSwap interface</p>
                      </div>
                      <Switch
                        checked={channelPrefs?.in_app_enabled || false}
                        onChange={() => handleToggleChannel('in_app_enabled')}
                      />
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Digest Settings</h2>
                  <p className="text-gray-600 mb-6">
                    Receive summaries of your activity on SkillSwap.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Daily Digest</h3>
                        <p className="text-sm text-gray-500">Receive a daily summary of your activity</p>
                      </div>
                      <Switch
                        checked={preferences?.daily_digest || false}
                        onChange={() => handleTogglePreference('daily_digest')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Weekly Digest</h3>
                        <p className="text-sm text-gray-500">Receive a weekly summary of your activity</p>
                      </div>
                      <Switch
                        checked={preferences?.weekly_digest || false}
                        onChange={() => handleTogglePreference('weekly_digest')}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Tab>
            
            <Tab id="types" label="Notification Types">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Trade Notifications</h2>
                  <p className="text-gray-600 mb-6">
                    Choose which trade-related notifications you want to receive.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Trade Proposals</h3>
                        <p className="text-sm text-gray-500">When someone proposes a new trade with you</p>
                      </div>
                      <Switch
                        checked={preferences?.notify_trade_proposal || false}
                        onChange={() => handleTogglePreference('notify_trade_proposal')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Accepted Trades</h3>
                        <p className="text-sm text-gray-500">When your trade proposal is accepted</p>
                      </div>
                      <Switch
                        checked={preferences?.notify_trade_status_accepted || false}
                        onChange={() => handleTogglePreference('notify_trade_status_accepted')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Declined Trades</h3>
                        <p className="text-sm text-gray-500">When your trade proposal is declined</p>
                      </div>
                      <Switch
                        checked={preferences?.notify_trade_status_declined || false}
                        onChange={() => handleTogglePreference('notify_trade_status_declined')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Cancelled Trades</h3>
                        <p className="text-sm text-gray-500">When a trade is cancelled</p>
                      </div>
                      <Switch
                        checked={preferences?.notify_trade_status_cancelled || false}
                        onChange={() => handleTogglePreference('notify_trade_status_cancelled')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Completed Trades</h3>
                        <p className="text-sm text-gray-500">When a trade is marked as completed</p>
                      </div>
                      <Switch
                        checked={preferences?.notify_trade_status_completed || false}
                        onChange={() => handleTogglePreference('notify_trade_status_completed')}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200"></div>
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Communication Notifications</h2>
                  <p className="text-gray-600 mb-6">
                    Choose which communication-related notifications you want to receive.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">New Messages</h3>
                        <p className="text-sm text-gray-500">When you receive a new message</p>
                      </div>
                      <Switch
                        checked={preferences?.notify_new_message || false}
                        onChange={() => handleTogglePreference('notify_new_message')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">New Ratings</h3>
                        <p className="text-sm text-gray-500">When someone rates you</p>
                      </div>
                      <Switch
                        checked={preferences?.notify_new_rating || false}
                        onChange={() => handleTogglePreference('notify_new_rating')}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Tab>
          </Tabs>
          
          <div className="flex justify-end mt-8">
            <Button onClick={savePreferences} disabled={saving} className="w-full sm:w-auto">
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default NotificationSettingsPage;
