/**
 * Skill List Component
 * 
 * Displays a grid of skill cards with filtering and pagination.
 */

'use client';

import React, { useState, useEffect } from 'react';
import SkillCard from './SkillCard';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';

type Skill = Database['public']['Tables']['skills']['Row'] & {
  users?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
    location_city: string | null;
    location_state: string | null;
  } | null;
};

interface SkillListProps {
  initialSkills?: Skill[];
  category?: string;
  isOffering?: boolean;
  searchQuery?: string;
  isRemoteFriendly?: boolean;
  limit?: number;
  featured?: boolean;
}

export default function SkillList({
  initialSkills,
  category,
  isOffering,
  searchQuery,
  isRemoteFriendly,
  limit = 12,
  featured = false,
}: SkillListProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills || []);
  const [loading, setLoading] = useState(!initialSkills);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const skillsPerPage = limit;
  
  const { supabase } = useSupabase();
  
  const fetchSkills = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      // Start building the query
      let query = supabase
        .from('skills')
        .select('*, users:user_id(id, full_name, profile_image_url, location_city, location_state)')
        .eq('is_active', true);
      
      // Apply filters if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      if (isOffering !== undefined) {
        query = query.eq('is_offering', isOffering);
      }
      
      if (isRemoteFriendly !== undefined) {
        query = query.eq('is_remote_friendly', isRemoteFriendly);
      }
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      // Add featured flag if requested
      if (featured) {
        // This is a simplistic implementation - you could create a more sophisticated
        // featured algorithm based on ratings, popularity, etc.
        query = query.order('created_at', { ascending: false });
      }
      
      // Add pagination
      const from = (page - 1) * skillsPerPage;
      const to = from + skillsPerPage - 1;
      query = query.range(from, to);
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Update state
      if (page === 1) {
        setSkills(data as Skill[]);
      } else {
        setSkills((prevSkills) => [...prevSkills, ...(data as Skill[])]);
      }
      
      // Check if there are more skills to load
      setHasMore(data.length === skillsPerPage);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch skills on initial render or when filters change
  useEffect(() => {
    if (!initialSkills) {
      fetchSkills(1);
    }
  }, [category, isOffering, searchQuery, isRemoteFriendly]);
  
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchSkills(currentPage + 1);
    }
  };
  
  if (loading && skills.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block w-8 h-8 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-2 text-text-secondary">Loading skills...</p>
      </div>
    );
  }
  
  if (error && skills.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="bg-error-500/10 border border-error-500/20 text-error-500 p-4 mx-auto max-w-md">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          <button
            onClick={() => fetchSkills(1)}
            className="mt-2 text-sm font-medium text-error-500 hover:text-error-400"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (skills.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="card p-6 mx-auto max-w-md">
          <h3 className="text-lg font-medium text-text-primary">No skills found</h3>
          <p className="mt-2 text-text-secondary">
            Try adjusting your filters or search criteria to find skills matching your interests.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? 'Loading...' : 'Load More Skills'}
          </button>
        </div>
      )}
    </div>
  );
}
