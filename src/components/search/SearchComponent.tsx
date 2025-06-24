'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import { debounce } from '@/lib/utils';

interface SearchComponentProps {
  placeholder?: string;
  className?: string;
  onSearch?: (searchTerm: string) => void;
}

export default function SearchComponent({
  placeholder = "Search for skills...",
  className = "",
  onSearch
}: SearchComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  
  // Handle search form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      // Default behavior: redirect to search page with query parameter
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
    
    setIsSearching(false);
  };
    // Debounced search function for auto-search functionality
  const debouncedSearch = useCallback(
    (term: string) => {
      const debouncedFn = debounce((searchTerm: string) => {
        if (onSearch) {
          onSearch(searchTerm);
        }
      }, 500);
      debouncedFn(term);
    },
    [onSearch]
  );
  
  // Update search when the term changes (if onSearch is provided)
  useEffect(() => {
    if (onSearch && searchTerm.length > 2) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, onSearch, debouncedSearch]);

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <Input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        fullWidth
        variant="outlined"
        size="md"
        startIcon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        }
        endIcon={
          isSearching ? (
            <svg className="animate-spin h-5 w-5 text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null
        }
      />
    </form>
  );
}
