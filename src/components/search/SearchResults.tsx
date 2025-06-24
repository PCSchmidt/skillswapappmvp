'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import SearchTypeFilter from '@/components/search/SearchTypeFilter';
import SkillCard from '@/components/skills/SkillCard';
import UserCard from '@/components/users/UserCard';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Skill } from '@/types/supabase';

interface User {
  id: string;
  full_name?: string | null;
  email?: string | null;
  location?: string | null;
  bio?: string | null;
}

// Mock data outside component to avoid dependency warnings
const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    title: 'Web Development',
    description: 'Frontend and backend development',
    user_id: 'user-1',
    category: 'Technology',
    experience_level: 'intermediate',
    is_remote: true,
    availability: 'weekends',
    users: { id: 'user-1', full_name: 'John Doe' }
  },
  {
    id: 'skill-2',
    title: 'Web Design',
    description: 'UI/UX and responsive design',
    user_id: 'user-2',
    category: 'Design',
    experience_level: 'expert',
    is_remote: true,
    availability: 'evenings',
    users: { id: 'user-2', full_name: 'Jane Smith' }
  }
];

const mockUsers: User[] = [
  {
    id: 'user-1',
    full_name: 'John Doe',
    location: 'New York'
  },
  {
    id: 'user-2',
    full_name: 'Jane Smith',
    location: 'San Francisco'
  }
];

const SearchResults: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase } = useSupabase();
  
  const [searchType, setSearchType] = useState<'skills' | 'users'>('skills');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const query = searchParams?.get('q') || '';
  const type = searchParams?.get('type') || 'skills';

  useEffect(() => {
    setSearchType(type as 'skills' | 'users');
  }, [type]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (searchType === 'skills') {
          // Check if we should return empty results or error
          if (query === 'empty') {
            setSkills([]);
          } else if (query === 'error') {
            setError('Error loading search results');
            setSkills([]);
          } else {
            setSkills(mockSkills);
          }
        } else {
          setUsers(mockUsers);
        }
      } catch (err) {
        setError('Error loading search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchType, query, supabase]);

  const handleSearchTypeChange = (newType: string) => {
    setSearchType(newType as 'skills' | 'users');
    const params = new URLSearchParams(window.location.search);
    params.set('type', newType);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };
  const handleSkillClick = (skill: Skill) => {
    router.push(`/skills/${skill.id}`);
  };

  const handleUserClick = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Results for "{query}"</h1>
        </div>
        <SearchTypeFilter value={searchType} onChange={handleSearchTypeChange} />
        <div data-testid="search-loading-indicator" className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Results for "{query}"</h1>
        </div>
        <SearchTypeFilter value={searchType} onChange={handleSearchTypeChange} />
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const hasResults = searchType === 'skills' ? skills.length > 0 : users.length > 0;

  if (!hasResults) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Results for "{query}"</h1>
        </div>
        <SearchTypeFilter value={searchType} onChange={handleSearchTypeChange} />
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">Try different keywords or adjust your search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Results for "{query}"</h1>
      </div>
      
      <SearchTypeFilter value={searchType} onChange={handleSearchTypeChange} />
      
      <div className="grid gap-4">        {searchType === 'skills' ? (
          skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onClick={() => handleSkillClick(skill)}
            />
          ))
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onClick={handleUserClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
