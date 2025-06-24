/**
 * New Skill Page
 * 
 * This page allows users to create a new skill (either offering or seeking).
 */

'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import SkillForm from '@/components/skills/SkillForm';
import { useSupabase } from '@/contexts/SupabaseContext';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, show a message
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700">You need to be logged in to create a skill.</p>
        </div>
      </div>
    );  }
  
  // Handle successful skill creation
  const handleSave = () => {
    // Navigate back to skills page or profile
    router.push('/profile');
  };

  const handleCancel = () => {
    // Navigate back to previous page
    router.back();
  };

  const handleSuccess = (skillId: string) => {
    // Navigate to the skill detail page
    setTimeout(() => {
      router.push(`/skills/${skillId}`);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Add a New Skill</h1>
          <p className="mt-2 text-sm text-gray-500">
            Share what you have to offer or what you're looking to learn
          </p>
        </div>
        
        <SkillForm 
          userId={user.id}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
