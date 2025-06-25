/**
 * Enhanced Skill Search with Autocomplete
 * 
 * Provides a search input with real-time suggestions and popular/trending skills.
 */

'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchSkills, TRENDING_SEARCHES, POPULAR_SKILLS, SkillSuggestion } from '@/data/skillSuggestions';

interface SkillSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSkillSelect?: (skill: string) => void;
  redirectOnSearch?: boolean; // Whether to redirect to browse page
  className?: string;
  showSuggestions?: boolean;
  maxSuggestions?: number;
}

export default function SkillSearch({
  placeholder = 'Search for skills...',
  onSearch,
  onSkillSelect,
  redirectOnSearch = false,
  className = '',
  showSuggestions = true,
  maxSuggestions = 8
}: SkillSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showingType, setShowingType] = useState<'suggestions' | 'trending' | 'popular'>('trending');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (searchQuery.length >= 2) {
      const results = searchSkills(searchQuery);
      setSuggestions(results.slice(0, maxSuggestions));
      setShowingType('suggestions');
    } else if (searchQuery.length === 0) {
      setSuggestions([]);
      setShowingType('trending');
    }
    setHighlightedIndex(-1);
  }, [maxSuggestions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, debouncedSearch]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (showSuggestions) {
      setShowDropdown(true);
    }
  };

  const handleInputFocus = () => {
    if (showSuggestions) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

    const itemCount = showingType === 'suggestions' 
      ? suggestions.length 
      : showingType === 'trending' 
        ? TRENDING_SEARCHES.length 
        : POPULAR_SKILLS.slice(0, maxSuggestions).length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % itemCount);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev <= 0 ? itemCount - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionSelect(highlightedIndex);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionSelect = (index: number) => {
    let selectedItem: string;

    if (showingType === 'suggestions') {
      selectedItem = suggestions[index]?.name || '';
    } else if (showingType === 'trending') {
      selectedItem = TRENDING_SEARCHES[index] || '';
    } else {
      selectedItem = POPULAR_SKILLS[index]?.name || '';
    }

    if (selectedItem) {
      setQuery(selectedItem);
      setShowDropdown(false);
      setHighlightedIndex(-1);
      
      if (onSkillSelect) {
        onSkillSelect(selectedItem);
      } else {
        handleSearchWithQuery(selectedItem);
      }
    }
  };

  const handleSearch = () => {
    handleSearchWithQuery(query);
  };

  const handleSearchWithQuery = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setShowDropdown(false);
    
    if (onSearch) {
      onSearch(searchQuery);
    }
    
    if (redirectOnSearch) {
      const params = new URLSearchParams();
      params.set('search', searchQuery);
      router.push(`/skills/browse?${params.toString()}`);
    }
  };

  const renderSuggestionsList = () => {
    if (showingType === 'suggestions') {
      return suggestions.map((skill, index) => (
        <button
          key={`suggestion-${index}`}
          className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3 ${
            highlightedIndex === index ? 'bg-primary-50 border-l-2 border-primary-500' : ''
          }`}
          onClick={() => handleSuggestionSelect(index)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 text-sm truncate">
                {skill.name}
              </span>
              {skill.isPopular && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  Popular
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 line-clamp-1">
              {skill.description}
            </p>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
              {skill.subcategory}
            </span>
          </div>
        </button>
      ));
    }

    if (showingType === 'trending') {
      return TRENDING_SEARCHES.map((term, index) => (
        <button
          key={`trending-${index}`}
          className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 ${
            highlightedIndex === index ? 'bg-primary-50 border-l-2 border-primary-500' : ''
          }`}
          onClick={() => handleSuggestionSelect(index)}
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-sm text-gray-700">{term}</span>
        </button>
      ));
    }

    return POPULAR_SKILLS.slice(0, maxSuggestions).map((skill, index) => (
      <button
        key={`popular-${index}`}
        className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 ${
          highlightedIndex === index ? 'bg-primary-50 border-l-2 border-primary-500' : ''
        }`}
        onClick={() => handleSuggestionSelect(index)}
      >
        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <span className="text-sm text-gray-700">{skill.name}</span>
      </button>
    ));
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            onClick={handleSearch}
            className="mr-1 p-2 text-gray-400 hover:text-primary-600 focus:outline-none focus:text-primary-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {showingType === 'suggestions' && suggestions.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-600">
                  Search Results ({suggestions.length})
                </span>
              </div>
              {renderSuggestionsList()}
            </>
          )}
          
          {showingType === 'trending' && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-600">
                  🔥 Trending Searches
                </span>
              </div>
              {renderSuggestionsList()}
            </>
          )}
          
          {showingType === 'popular' && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-600">
                  ⭐ Popular Skills
                </span>
              </div>
              {renderSuggestionsList()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
