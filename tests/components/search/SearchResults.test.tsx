/**
 * Search Results Component Tests
 * 
 * Tests for the component that displays search results
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SearchResults from '@/components/search/SearchResults';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => {
      if (param === 'q') return 'web development';
      if (param === 'type') return 'skills';
      return null;
    }),
  })),
}));

// Mock useSupabase hook
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: jest.fn(() => ({
    supabase: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      textSearch: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      range: jest.fn().mockResolvedValue({
        data: [
          {
            id: 'skill-1',
            title: 'Web Development',
            description: 'Frontend and backend development',
            category: { name: 'Programming' },
            user_id: 'user-1',
            users: {
              full_name: 'John Doe',
              profile_image_url: 'https://example.com/john.jpg',
              location: 'New York'
            }
          },
          {
            id: 'skill-2',
            title: 'Web Design',
            description: 'UI/UX and responsive design',
            category: { name: 'Design' },
            user_id: 'user-2',
            users: {
              full_name: 'Jane Smith',
              profile_image_url: 'https://example.com/jane.jpg',
              location: 'San Francisco'
            }
          }
        ],
        error: null,
        count: 2
      }),
    },
    session: {
      user: { id: 'current-user-id' }
    },
  })),
}));

// Mock the SkillCard component
jest.mock('@/components/skills/SkillCard', () => ({
  __esModule: true,
  default: ({ skill, onClick }: any) => (
    <div 
      data-testid={`skill-card-${skill.id}`}
      className="skill-card-mock"
      onClick={() => onClick && onClick(skill)}
    >
      <h3>{skill.title}</h3>
      <p>{skill.description}</p>
      <div>By: {skill.users.full_name}</div>
    </div>
  ),
}));

// Mock the UserCard component
jest.mock('@/components/users/UserCard', () => ({
  __esModule: true,
  default: ({ user, onClick }: any) => (
    <div 
      data-testid={`user-card-${user.id}`}
      className="user-card-mock"
      onClick={() => onClick && onClick(user)}
    >
      <h3>{user.full_name}</h3>
      <p>Location: {user.location}</p>
    </div>
  ),
}));

// Mock the SearchTypeFilter component
jest.mock('@/components/search/SearchTypeFilter', () => ({
  __esModule: true,
  default: ({ value, onChange }: any) => (
    <div data-testid="search-type-filter-mock">
      <div 
        className={`type-option ${value === 'skills' ? 'active' : ''}`}
        onClick={() => onChange && onChange('skills')}
        data-testid="skills-option"
      >
        Skills
      </div>
      <div 
        className={`type-option ${value === 'users' ? 'active' : ''}`}
        onClick={() => onChange && onChange('users')}
        data-testid="users-option"
      >
        Users
      </div>
    </div>
  ),
}));

describe('SearchResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders search results for skills correctly', async () => {
    render(<SearchResults />);
    
    // Check that search query is displayed
    expect(screen.getByText(/results for "web development"/i)).toBeInTheDocument();
    
    // Check that filters are rendered (only SearchTypeFilter remains)
    expect(screen.getByTestId('search-type-filter-mock')).toBeInTheDocument();
    
    // Check that skill cards are rendered
    await waitFor(() => {
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('Web Design')).toBeInTheDocument();
    });
    
    // Check skill details
    expect(screen.getByText('Frontend and backend development')).toBeInTheDocument();
    expect(screen.getByText('UI/UX and responsive design')).toBeInTheDocument();
    
    // Check user info in skill cards
    expect(screen.getByText('By: John Doe')).toBeInTheDocument();
    expect(screen.getByText('By: Jane Smith')).toBeInTheDocument();
  });
  
  it('changes search type from skills to users', async () => {
    const { useSupabase } = require('@/contexts/SupabaseContext');
    
    // Mock users search result
    useSupabase().supabase.from().select().textSearch().eq().order().limit().range = jest.fn().mockResolvedValue({
      data: [
        {
          id: 'user-1',
          full_name: 'John Doe',
          profile_image_url: 'https://example.com/john.jpg',
          location: 'New York',
          bio: 'Full-stack developer',
          skills_count: 5
        },
        {
          id: 'user-2',
          full_name: 'Jane Smith',
          profile_image_url: 'https://example.com/jane.jpg',
          location: 'San Francisco',
          bio: 'UX Designer',
          skills_count: 3
        }
      ],
      error: null,
      count: 2
    });
    
    render(<SearchResults />);
    
    // Change search type to users
    const usersOption = screen.getByTestId('users-option');
    fireEvent.click(usersOption);
    
    // Check that user cards are rendered
    await waitFor(() => {
      expect(screen.getByTestId('user-card-user-1')).toBeInTheDocument();
      expect(screen.getByTestId('user-card-user-2')).toBeInTheDocument();
    });
    
    // Check user details
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Location: New York')).toBeInTheDocument();
    expect(screen.getByText('Location: San Francisco')).toBeInTheDocument();
  });
  
  // Removed the 'changes location filter' test case as LocationFilter is no longer used
  
  it('navigates to skill detail page when skill is clicked', async () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<SearchResults />);
    
    // Wait for skills to render
    await waitFor(() => {
      expect(screen.getByTestId('skill-card-skill-1')).toBeInTheDocument();
    });
    
    // Click on a skill
    const skillCard = screen.getByTestId('skill-card-skill-1');
    fireEvent.click(skillCard);
    
    // Check navigation to skill detail page
    expect(mockPush).toHaveBeenCalledWith('/skills/skill-1');
  });
  
  it('handles empty search results gracefully', async () => {
    const { useSupabase } = require('@/contexts/SupabaseContext');
    
    // Mock empty search results
    useSupabase().supabase.from().select().textSearch().eq().order().limit().range = jest.fn().mockResolvedValue({
      data: [],
      error: null,
      count: 0
    });
    
    render(<SearchResults />);
    
    // Check for empty state message
    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
    
    // Check for suggestions
    expect(screen.getByText(/try different keywords/i)).toBeInTheDocument();
  });
  
  it('handles search error states', async () => {
    const { useSupabase } = require('@/contexts/SupabaseContext');
    
    // Mock search error
    useSupabase().supabase.from().select().textSearch().eq().order().limit().range = jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Database error'),
      count: null
    });
    
    render(<SearchResults />);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/error loading search results/i)).toBeInTheDocument();
    });
  });
  
  it('shows loading state while fetching results', () => {
    const { useSupabase } = require('@/contexts/SupabaseContext');
    
    // Make search take time to resolve
    useSupabase().supabase.from().select().textSearch().eq().order().limit().range = jest.fn(() => 
      new Promise(resolve => setTimeout(() => resolve({
        data: [],
        error: null,
        count: 0
      }), 1000))
    );
    
    render(<SearchResults />);
    
    // Check for loading indicator
    expect(screen.getByTestId('search-loading-indicator')).toBeInTheDocument();
  });
});
