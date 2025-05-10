/**
 * Edit Skill Page
 * 
 * This page allows users to edit an existing skill.
 * It loads the current skill data and prepopulates the skill form.
 */

'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import SkillForm from '@/components/skills/SkillForm';
import { useSupabase } from '@/contexts/SupabaseContext';

export default function EditSkillPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { supabase, user, isLoading } = useSupabase();
  
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Fetch skill data on initial load
  useEffect(() => {
    const fetchSkill = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Check if the current user owns this skill
          if (data.user_id !== user.id) {
            setUnauthorized(true);
            setError("You don't have permission to edit this skill");
            return;
          }
          
          // Parse availability from JSON string to array
          if (data.availability && typeof data.availability === 'string') {
            try {
              data.availability = JSON.parse(data.availability);
            } catch (e) {
              data.availability = [];
            }
          } else {
            data.availability = [];
          }
          
          // Convert hourly value to string for the form
          if (data.hourly_equivalent_value !== null) {
            data.hourly_equivalent_value = data.hourly_equivalent_value.toString();
          }
          
          setSkill(data);
        }
      } catch (err: any) {
        console.error('Error fetching skill:', err);
        setError('Failed to load skill details');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchSkill();
    }
  }, [params.id, supabase, user]);
  
  // Handle successful edit
  const handleSuccess = (skillId: string) => {
    // Navigate back to the skill detail page
    setTimeout(() => {
      router.push(`/skills/${skillId}`);
    }, 1500);
  };
  
  // Show loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show unauthorized message
  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-error-600 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized</h1>
          <p className="text-gray-600 mb-6">
            {error || "You don't have permission to edit this skill."}
          </p>
          <button
            onClick={() => router.back()}
            className="btn btn-primary"
          >
            Go Back
          </button>
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
            {error || 'The skill you are trying to edit does not exist or has been removed.'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Edit Skill</h1>
          <p className="mt-2 text-sm text-gray-500">
            Update the details of your skill
          </p>
        </div>
        
        <SkillForm 
          initialData={skill}
          skillId={params.id}
          isEdit={true}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
