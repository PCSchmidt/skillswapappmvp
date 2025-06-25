/**
 * Skill Suggestions Component
 * 
 * Provides helpful skill suggestions to guide users when adding or searching for skills.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { getSkillsByCategory, searchSkills, POPULAR_SKILLS, TRENDING_SEARCHES, SkillSuggestion } from '@/data/skillSuggestions';

interface SkillSuggestionsProps {
  selectedCategory?: string;
  searchTerm?: string;
  onSkillSelect: (skillName: string) => void;
  mode?: 'form' | 'search'; // Different layouts for different use cases
  className?: string;
}

export default function SkillSuggestions({
  selectedCategory = '',
  searchTerm = '',
  onSkillSelect,
  mode = 'form',
  className = ''
}: SkillSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([]);
  const [showingType, setShowingType] = useState<'popular' | 'category' | 'search' | 'trending'>('popular');

  useEffect(() => {
    if (searchTerm.length >= 2) {
      // Show search results
      const searchResults = searchSkills(searchTerm);
      setSuggestions(searchResults.slice(0, 8));
      setShowingType('search');
    } else if (selectedCategory) {
      // Show category-specific suggestions
      const categorySkills = getSkillsByCategory(selectedCategory);
      setSuggestions(categorySkills.slice(0, 8));
      setShowingType('category');
    } else {
      // Show popular skills by default
      setSuggestions(POPULAR_SKILLS.slice(0, 8));
      setShowingType('popular');
    }
  }, [selectedCategory, searchTerm]);

  const handleSkillClick = (skillName: string) => {
    onSkillSelect(skillName);
  };

  const showTrendingSearches = mode === 'search' && !searchTerm && !selectedCategory;

  if (mode === 'search' && showTrendingSearches) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 ${className}`}>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Trending Searches</h3>
        <div className="flex flex-wrap gap-2">
          {TRENDING_SEARCHES.map((term, index) => (
            <button
              key={index}
              onClick={() => onSkillSelect(term)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            {showingType === 'search' && `Search results for "${searchTerm}"`}
            {showingType === 'category' && `${selectedCategory} skills`}
            {showingType === 'popular' && 'Popular skills'}
          </h3>
          {showingType === 'search' && (
            <span className="text-xs text-gray-500">
              {suggestions.length} result{suggestions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {suggestions.map((skill, index) => (
            <button
              key={index}
              onClick={() => handleSkillClick(skill.name)}
              className="text-left p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-700 truncate">
                      {skill.name}
                    </h4>
                    {skill.isPopular && (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {skill.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {skill.subcategory}
                    </span>
                  </div>
                </div>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {showingType === 'popular' && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              💡 Select a category above to see more specific suggestions
            </p>
          </div>
        )}
        
        {showingType === 'category' && selectedCategory && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Showing skills in {selectedCategory}. More skills available in this category!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for inline suggestions
export function SkillSuggestionsInline({
  category,
  onSkillSelect,
  maxItems = 6
}: {
  category: string;
  onSkillSelect: (skillName: string) => void;
  maxItems?: number;
}) {
  const skills = getSkillsByCategory(category).slice(0, maxItems);

  if (skills.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="text-xs text-gray-600 mb-2">Popular in {category}:</p>
      <div className="flex flex-wrap gap-1">
        {skills.map((skill, index) => (
          <button
            key={index}
            onClick={() => onSkillSelect(skill.name)}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-primary-100 hover:text-primary-700 transition-colors"
          >
            {skill.name}
          </button>
        ))}
      </div>
    </div>
  );
}
