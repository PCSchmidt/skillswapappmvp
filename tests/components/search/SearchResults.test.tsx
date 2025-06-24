/**
 * Search Results Component Tests
 * 
 * Tests for the component that displays search results
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import SearchResults from '@/components/search/SearchResults';

// Mock the useSupabase hook
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: jest.fn(),
}));

// Mock next/navigation
const mockPush = jest.fn();
const mockSearchParamsGet = jest.fn((param: string): string | null => {
  if (param === 'q') return 'web development';
  if (param === 'type') return 'skills';
  return null;
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
  useSearchParams: jest.fn(() => ({
    get: mockSearchParamsGet,
  })),
}));

// Mock the SkillCard component
jest.mock('@/components/skills/SkillCard', () => ({
  __esModule: true,
  default: ({ skill, onClick }: { skill: Record<string, unknown>; onClick?: (skill: Record<string, unknown>) => void }) => {
    const users = typeof skill.users === 'object' && skill.users !== null ? (skill.users as { full_name?: string }) : {};
    return (
      <div 
        data-testid={`skill-card-${skill.id}`}
        className="skill-card-mock"
        onClick={() => onClick && onClick(skill)}
      >
        <h3>{String(skill.title)}</h3>
        <p>{String(skill.description)}</p>
        <div>By: {users.full_name ?? ''}</div>
      </div>
    );
  },
}));

// Mock the UserCard component
jest.mock('@/components/users/UserCard', () => ({
  __esModule: true,
  default: ({ user, onClick }: { user: Record<string, unknown>; onClick?: (user: Record<string, unknown>) => void }) => (
    <div 
      data-testid={`user-card-${user.id}`}
      className="user-card-mock"
      onClick={() => onClick && onClick(user)}
    >
      <h3>{user.full_name as string}</h3>
      <p>Location: {user.location as string}</p>
    </div>
  ),
}));

// Mock the SearchTypeFilter component
jest.mock('@/components/search/SearchTypeFilter', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange?: (type: string) => void }) => (
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

import { useSupabase } from '@/contexts/SupabaseContext';

describe('SearchResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock to default behavior
    mockSearchParamsGet.mockImplementation((param: string): string | null => {
      if (param === 'q') return 'web development';
      if (param === 'type') return 'skills';
      return null;
    });

    // Setup the default mock implementation for useSupabase
    (useSupabase as jest.Mock).mockReturnValue({
      user: {
        id: 'current-user-id',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: '',
        email: 'test@example.com',
      },
      supabase: {
        from: jest.fn().mockImplementation(() => ({
          select: jest.fn().mockImplementation(() => ({
            ilike: jest.fn().mockImplementation(() => ({
              eq: jest.fn().mockImplementation(() => ({
                eq: jest.fn(() => Promise.resolve({
                  data: [],
                  error: null
                }))
              }))
            }))
          }))
        }))
      }
    });
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
  it('navigates to skill detail page when skill is clicked', async () => {
    // Reset and setup mock for this test    mockPush.mockClear();
    
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
    // Mock search params to return 'empty' query which should trigger empty state
    mockSearchParamsGet.mockImplementation((param) => {
      if (param === 'q') return 'empty';
      if (param === 'type') return 'skills';
      return null;    });
    
    render(<SearchResults />);
    
    // Check for empty state message
    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
    
    // Check for suggestions
    expect(screen.getByText(/try different keywords/i)).toBeInTheDocument();
  });
    it('handles search error states', async () => {
    // Mock search params to return 'error' query which should trigger error state
    mockSearchParamsGet.mockImplementation((param: string): string | null => {
      if (param === 'q') return 'error';
      if (param === 'type') return 'skills';
      return null;    });
    
    render(<SearchResults />);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/error loading search results/i)).toBeInTheDocument();
    });
  });
    it('shows loading state while fetching results', () => {
    render(<SearchResults />);
    
    // Check for loading indicator
    expect(screen.getByTestId('search-loading-indicator')).toBeInTheDocument();
  });
});
