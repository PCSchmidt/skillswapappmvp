/**
 * Email Preferences Page
 * 
 * This page allows users to manage their email notification settings.
 */

'use client';

import React from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import EmailPreferences from '@/components/settings/EmailPreferences';
import { redirect } from 'next/navigation';

export default function EmailPreferencesPage() {
  const { session, isLoading } = useSupabase();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="card p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-surface-raised rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-surface-raised rounded"></div>
                <div className="h-4 bg-surface-raised rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login?returnTo=/settings/email-preferences');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-display font-semibold text-text-primary mb-6">Email Notification Settings</h1>
        <p className="text-text-secondary mb-8">
          Control which emails you receive from SkillSwap. You'll always receive essential
          emails like account security updates.
        </p>
        
        <EmailPreferences userId={session.user.id} />
      </div>
    </div>
  );
}
