'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Skill } from '@/types/supabase';

interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

interface SkillFiltersProps {
  onFilterChange?: (filters: {
    categories: string[];
    experienceLevels: string[];
    offeringType: 'all' | 'offering' | 'seeking';
    locationTypes: string[];
  }) => void;
  className?: string;
  showCounts?: boolean;
}

export default function SkillFilters({
  onFilterChange,
  className = '',
  showCounts = true
}: SkillFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase } = useSupabase();

  // Initialize filters from URL params
  const initialCategories = searchParams?.getAll('category') || [];
  const initialExperience = searchParams?.getAll('experience') || [];
  const initialOfferingType = 
    (searchParams?.get('type') as 'all' | 'offering' | 'seeking') || 'all';
  const initialLocationTypes = searchParams?.getAll('location') || [];

  // State for selected filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedExperience, setSelectedExperience] = useState<string[]>(initialExperience);
  const [offeringType, setOfferingType] = useState<'all' | 'offering' | 'seeking'>(initialOfferingType);
  const [locationTypes, setLocationTypes] = useState<string[]>(initialLocationTypes);

  // State for available filter options
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Experience level options
  const experienceLevels: FilterOption[] = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'expert', name: 'Expert' }
  ];

  // Location type options
  const locationTypeOptions: FilterOption[] = [
    { id: 'in_person', name: 'In Person' },
    { id: 'remote', name: 'Remote' }
  ];

  // Fetch categories from database with counts
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Query to get categories with counts
        const { data, error } = await supabase
          .from('skills')
          .select('category, id')
          .eq('is_active', true);

        if (error) throw error;

        // Process data to get unique categories with counts
        const categoryMap = new Map<string, number>();
        
        (data as Skill[])?.forEach((skill: Skill) => {
          if (skill.category) {
            const count = categoryMap.get(skill.category) || 0;
            categoryMap.set(skill.category, count + 1);
          }
        });

        // Convert map to array of objects
        const categoryOptions: FilterOption[] = Array.from(categoryMap.entries())
          .map(([id, count]) => ({
            id,
            name: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize first letter
            count
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(categoryOptions);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [supabase]);

  // Update URL and callback when filters change
  useEffect(() => {
    // Skip on initial render
    if (isLoading) return;

    // Call the onFilterChange callback if provided
    if (onFilterChange) {
      onFilterChange({
        categories: selectedCategories,
        experienceLevels: selectedExperience,
        offeringType,
        locationTypes
      });
    }    // Update URL with filter params if no callback is provided
    if (!onFilterChange) {
      const params = new URLSearchParams();

      selectedCategories.forEach(cat => params.append('category', cat));
      selectedExperience.forEach(exp => params.append('experience', exp));
      if (offeringType !== 'all') params.set('type', offeringType);
      locationTypes.forEach(loc => params.append('location', loc));

      // Preserve search query if exists
      const query = searchParams?.get('q');
      if (query) params.set('q', query);

      router.push(`/skills?${params.toString()}`);
    }
  }, [selectedCategories, selectedExperience, offeringType, locationTypes, isLoading, onFilterChange, router, searchParams]);

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Toggle experience level selection
  const toggleExperience = (expId: string) => {
    setSelectedExperience(prev => 
      prev.includes(expId)
        ? prev.filter(e => e !== expId)
        : [...prev, expId]
    );
  };

  // Toggle location type selection
  const toggleLocationType = (locId: string) => {
    setLocationTypes(prev => 
      prev.includes(locId)
        ? prev.filter(l => l !== locId)
        : [...prev, locId]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedExperience([]);
    setOfferingType('all');
    setLocationTypes([]);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {(selectedCategories.length > 0 || selectedExperience.length > 0 || 
          offeringType !== 'all' || locationTypes.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Offering Type Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Skill Type</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setOfferingType('all')}
            className={`px-3 py-1.5 text-sm rounded-full ${
              offeringType === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            All
          </button>
          <button
            onClick={() => setOfferingType('offering')}
            className={`px-3 py-1.5 text-sm rounded-full ${
              offeringType === 'offering'
                ? 'bg-primary-600 text-white'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            } transition-colors`}
          >
            Offering
          </button>
          <button
            onClick={() => setOfferingType('seeking')}
            className={`px-3 py-1.5 text-sm rounded-full ${
              offeringType === 'seeking'
                ? 'bg-secondary-600 text-white'
                : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
            } transition-colors`}
          >
            Seeking
          </button>
        </div>
      </div>
      
      {/* Categories Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            categories.map(category => (
              <div key={category.id} className="flex items-center">
                <input
                  id={`category-${category.id}`}
                  name="category"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="ml-3 text-sm text-gray-700 flex-grow cursor-pointer"
                >
                  {category.name}
                </label>
                {showCounts && category.count !== undefined && (
                  <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                    {category.count}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Experience Level Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Experience Level</h4>
        <div className="space-y-2">
          {experienceLevels.map(level => (
            <div key={level.id} className="flex items-center">
              <input
                id={`exp-${level.id}`}
                name="experience"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={selectedExperience.includes(level.id)}
                onChange={() => toggleExperience(level.id)}
              />
              <label
                htmlFor={`exp-${level.id}`}
                className="ml-3 text-sm text-gray-700 cursor-pointer"
              >
                {level.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Location Type Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Location Type</h4>
        <div className="space-y-2">
          {locationTypeOptions.map(locType => (
            <div key={locType.id} className="flex items-center">
              <input
                id={`loc-${locType.id}`}
                name="location"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={locationTypes.includes(locType.id)}
                onChange={() => toggleLocationType(locType.id)}
              />
              <label
                htmlFor={`loc-${locType.id}`}
                className="ml-3 text-sm text-gray-700 cursor-pointer"
              >
                {locType.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
