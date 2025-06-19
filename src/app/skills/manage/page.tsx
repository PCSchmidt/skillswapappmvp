/**
 * Skills Management Page
 * 
 * This page allows users to view and manage all their skills in one place.
 * Users can see both the skills they're offering and the skills they're seeking,
 * with options to edit or delete each skill.
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import SkillCard from '@/components/skills/SkillCard';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Skill } from '@/types/supabase';

export default function ManageSkillsPage() {
  const router = useRouter();
  const { supabase, user, isLoading } = useSupabase();
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'offering' | 'seeking'>('offering');
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Fetch user's skills
  useEffect(() => {
    const fetchSkills = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('skills')
          .select(`
            *,
            users:user_id (
              id,
              full_name,
              profile_image_url,
              location_city,
              location_state
            )
          `)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setSkills(Array.isArray(data) ? (data as Skill[]) : []);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load your skills');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchSkills();
    }
  }, [user, supabase]);
  
  // Filter skills based on active tab
  const filteredSkills = skills.filter(skill => 
    activeTab === 'offering' ? skill.is_offering : !skill.is_offering
  );
  
  // Handle skill deletion
  const handleDelete = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    
    setDeleting(skillId);
    
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId)
        .eq('user_id', user?.id); // Safety check to ensure user owns the skill
      
      if (error) throw error;
      
      // Update the skills list after successful deletion
      setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
      
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError('Failed to delete skill');
    } finally {
      setDeleting(null);
    }
  };
  
  // Show loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading your skills...</p>
        </div>
      </div>
    );
  }
  
  // Show unauthorized state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-error-600 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to manage your skills.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Your Skills</h1>
            <p className="mt-1 text-sm text-gray-500">
              View, edit, and delete the skills you're offering or seeking
            </p>
          </div>
          
          <Link 
            href="/skills/new" 
            className="mt-4 md:mt-0 btn btn-primary inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Skill
          </Link>
        </div>
        
        {/* Display error if any */}
        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-md">
            {error}
          </div>
        )}
        
        {/* Tabs */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-lg font-medium text-gray-900">Your Skills</h2>
              
              <div className="mt-4 sm:mt-0">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('offering')}
                    className={`
                      whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'offering'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    Offering ({skills.filter(s => s.is_offering).length})
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('seeking')}
                    className={`
                      whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'seeking'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    Seeking ({skills.filter(s => !s.is_offering).length})
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Skills list/grid */}
          <div className="px-4 py-5 sm:p-6">
            {filteredSkills.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No skills {activeTab === 'offering' ? 'offered' : 'sought'} yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  You haven't added any skills you're {activeTab === 'offering' ? 'offering' : 'seeking'} yet.
                </p>
                
                <Link
                  href={{
                    pathname: "/skills/new",
                    query: { type: activeTab === 'offering' ? 'offering' : 'seeking' }
                  }}
                  className="btn btn-primary"
                >
                  Add {activeTab === 'offering' ? 'an Offering' : 'a Request'}
                </Link>
              </div>
            ) : (
              <div>
                {/* Skills grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSkills.map((skill) => (
                    <div key={skill.id} className="relative">
                      <SkillCard skill={skill} isOwner={true} />
                      
                      {/* Custom action buttons */}
                      <div className="mt-3 flex justify-end gap-2">
                        <Link
                          href={`/skills/${skill.id}/edit`}
                          className="btn btn-sm btn-secondary"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="btn btn-sm btn-error"
                          disabled={deleting === skill.id}
                        >
                          {deleting === skill.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
