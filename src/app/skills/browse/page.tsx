/**
 * Browse Skills Page
 * 
 * This page allows users to browse, search, and filter skills from other users.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '@/contexts/SupabaseContext';
import SkillCard from '@/components/skills/SkillCard';

// Define filter state structure
interface FilterState {
  search: string;
  category: string;
  offering: string; // 'all', 'offering', 'seeking'
  experience: string; // 'all', 'beginner', 'intermediate', 'expert'
  remote: boolean;
}

export default function BrowseSkillsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase, user } = useSupabase();
  
  // Get initial filter values from URL params or defaults
  const initialFilters: FilterState = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    offering: searchParams.get('offering') || 'all',
    experience: searchParams.get('experience') || 'all',
    remote: searchParams.get('remote') === 'true',
  };
  
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  
  // List of predefined skill categories (same as in SkillForm)
  const categories = [
    'Technology',
    'Arts & Crafts', 
    'Culinary',
    'Education',
    'Fitness & Wellness',
    'Home Improvement',
    'Languages',
    'Music',
    'Professional Services',
    'Other'
  ];
  
  // Fetch skills with applied filters
  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      
      try {
        // Start with a base query
        let query = supabase
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
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        // Apply filters
        if (filters.search) {
          query = query.ilike('title', `%${filters.search}%`);
        }
        
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        
        if (filters.offering !== 'all') {
          query = query.eq('is_offering', filters.offering === 'offering');
        }
        
        if (filters.experience !== 'all') {
          query = query.eq('experience_level', filters.experience);
        }
        
        if (filters.remote) {
          query = query.eq('is_remote_friendly', true);
        }
        
        // Limit results to a reasonable number
        query = query.limit(100);
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setSkills(data || []);
      } catch (err: any) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkills();
  }, [supabase, filters]);
  
  // Update URL with filters for shareable links
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.offering !== 'all') params.set('offering', filters.offering);
    if (filters.experience !== 'all') params.set('experience', filters.experience);
    if (filters.remote) params.set('remote', 'true');
    
    const url = `/skills/browse${params.toString() ? '?' + params.toString() : ''}`;
    
    // Update URL without refreshing page
    window.history.pushState({}, '', url);
  }, [filters]);
  
  // Handle filter changes
  const handleFilterChange = (name: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already being handled by the filter state
    // Just prevent form submission default behavior
  };
  
  // Handle clearing all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      offering: 'all',
      experience: 'all',
      remote: false,
    });
  };
  
  return (
    <div className="min-h-screen bg-canvas py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="eyebrow">Discover</p>
          <h1 className="text-3xl font-display font-semibold text-text-primary">Browse Skills</h1>
          <p className="mt-2 text-sm text-text-muted">
            Discover skills from our community members
          </p>
        </div>
        
        {/* Filters section */}
        <div className="mb-8">
          <div className="card overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
                <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Clear all filters
                </button>
              </div>
              
              {/* Search form */}
              <form onSubmit={handleSearch} className="mt-4 mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search for skills..."
                      className="form-input pl-4 pr-10"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                    {filters.search && (
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-text-muted hover:text-text-secondary"
                        onClick={() => handleFilterChange('search', '')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Search
                  </button>
                </div>
              </form>
              
              {/* Filter options */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Category filter */}
                <div>
                  <label htmlFor="category-filter" className="form-label mb-1">
                    Category
                  </label>
                  <select
                    id="category-filter"
                    className="form-input"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* Offering/Seeking filter */}
                <div>
                  <label htmlFor="offering-filter" className="form-label mb-1">
                    Type
                  </label>
                  <select
                    id="offering-filter"
                    className="form-input"
                    value={filters.offering}
                    onChange={(e) => handleFilterChange('offering', e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="offering">Skills Offered</option>
                    <option value="seeking">Skills Sought</option>
                  </select>
                </div>
                
                {/* Experience level filter */}
                <div>
                  <label htmlFor="experience-filter" className="form-label mb-1">
                    Experience Level
                  </label>
                  <select
                    id="experience-filter"
                    className="form-input"
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                
                {/* Remote friendly filter */}
                <div className="flex items-center">
                  <input
                    id="remote-filter"
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-600 border-border mt-5"
                    checked={filters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.checked)}
                  />
                  <label htmlFor="remote-filter" className="ml-2 block text-sm text-text-secondary mt-5">
                    Remote Friendly Only
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results section */}
        <div>
          {/* Results count and add skill button */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-text-muted">
              {loading ? 'Loading skills...' : `${skills.length} skill${skills.length !== 1 ? 's' : ''} found`}
            </p>
            
            {user && (
              <Link
                href="/skills/new"
                className="btn btn-primary"
              >
                Add Your Skill
              </Link>
            )}
          </div>
          
          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-text-muted">Loading skills...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="text-error-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-text-secondary mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Empty state */}
          {!loading && !error && skills.length === 0 && (
            <div className="text-center py-12 card">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">No skills found</h3>
              <p className="text-text-muted mb-6 max-w-md mx-auto">
                No skills match your current filters. Try adjusting your search criteria or add your own skill to the platform.
              </p>
              <div className="space-x-4">
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary"
                >
                  Clear Filters
                </button>
                
                {user && (
                  <Link
                    href="/skills/new"
                    className="btn btn-primary"
                  >
                    Add Your Skill
                  </Link>
                )}
              </div>
            </div>
          )}
          
          {/* Skills grid */}
          {!loading && !error && skills.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
