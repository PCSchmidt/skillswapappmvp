/**
 * New Skill Page
 * 
 * This page allows users to create a new skill (either offering or seeking).
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/contexts/SupabaseContext';
import SkillForm from '@/components/skills/SkillForm';

export default function NewSkillPage() {
  const router = useRouter();
  const { user, isLoading } = useSupabase();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, show a message
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center">
          <p className="text-text-secondary">You need to be logged in to create a skill.</p>
        </div>
      </div>
    );
  }
  
  // Handle successful skill creation
  const handleSuccess = (skillId: string) => {
    // Navigate to the skill detail page
    setTimeout(() => {
      router.push(`/skills/${skillId}`);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-canvas py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="eyebrow">Create</p>
          <h1 className="text-3xl font-display font-semibold text-text-primary">Add a New Skill</h1>
          <p className="mt-2 text-sm text-text-muted">
            Share what you have to offer or what you're looking to learn
          </p>
        </div>
        
        <SkillForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
