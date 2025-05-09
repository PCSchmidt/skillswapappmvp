/**
 * Featured Skills Component
 * 
 * Displays a visually enhanced grid of featured skills for the landing page.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';
import EnhancedSkillCard from './EnhancedSkillCard';

type Skill = Database['public']['Tables']['skills']['Row'] & {
  users?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
    location_city: string | null;
    location_state: string | null;
  } | null;
};

interface FeaturedSkillsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  isOffering?: boolean;
}

export default function FeaturedSkills({
  title = "Featured Skills",
  subtitle = "Discover our community's most popular skill exchanges",
  limit = 6,
  isOffering
}: FeaturedSkillsProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { supabase } = useSupabase();
  
  useEffect(() => {
    const fetchFeaturedSkills = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Start building the query
        let query = supabase
          .from('skills')
          .select('*, users:user_id(id, full_name, profile_image_url, location_city, location_state)')
          .eq('is_active', true);
        
        // Filter by offering/seeking if specified
        if (isOffering !== undefined) {
          query = query.eq('is_offering', isOffering);
        }
        
        // Order by most recent first (or could use ratings/views if those exist)
        query = query.order('created_at', { ascending: false });
        
        // Limit the number of results
        query = query.limit(limit);
        
        // Execute the query
        const { data, error: apiError } = await query;
        
        if (apiError) throw apiError;
        
        setSkills(data as Skill[]);
      } catch (err) {
        console.error('Error fetching featured skills:', err);
        setError('Failed to load featured skills.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedSkills();
  }, [supabase, limit, isOffering]);
  
  return (
    <Section className="py-16 bg-gray-50">
      <Container>
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="bg-error-50 text-error-700 p-6 rounded-lg mx-auto max-w-md text-center">
            <p className="font-medium">Error</p>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-error-700 bg-error-100 hover:bg-error-200"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && skills.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 010-1.06l1.5-1.5zm-.53-3.44l-9.97 9.97a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06l9.97-9.97a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800">No featured skills yet</h3>
            <p className="mt-2 text-gray-600">
              Check back soon as our community continues to grow!
            </p>
          </div>
        )}
        
        {/* Skills grid */}
        {!loading && !error && skills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <EnhancedSkillCard 
                key={skill.id} 
                skill={skill} 
                featured={index === 0} // Mark the first skill as featured
                showActions={true}
              />
            ))}
          </div>
        )}
        
        {/* View all link */}
        {!loading && !error && skills.length > 0 && (
          <div className="mt-12 text-center">
            <a 
              href="/skills"
              className="inline-flex items-center px-6 py-3 border-2 border-primary-600 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50 transition-colors"
            >
              View All Skills
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}
      </Container>
    </Section>
  );
}
