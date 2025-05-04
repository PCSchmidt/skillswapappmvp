/**
 * Profile Skills Component Tests
 * 
 * Tests for the component that displays a user's skills on their profile
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileSkills from '@/components/profile/ProfileSkills';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
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
      <span>Category: {skill.category.name}</span>
    </div>
  ),
}));

describe('ProfileSkills', () => {
  const mockSkills = [
    {
      id: 'skill-1',
      title: 'Web Development',
      description: 'HTML, CSS, JavaScript, React',
      category: { id: 'cat-1', name: 'Programming' },
      created_at: '2024-03-15T10:00:00.000Z',
      updated_at: '2024-03-15T10:00:00.000Z',
      user_id: 'user-123',
    },
    {
      id: 'skill-2',
      title: 'Graphic Design',
      description: 'Photoshop, Illustrator, UI/UX',
      category: { id: 'cat-2', name: 'Design' },
      created_at: '2024-03-16T11:00:00.000Z',
      updated_at: '2024-03-16T11:00:00.000Z',
      user_id: 'user-123',
    },
    {
      id: 'skill-3',
      title: 'Photography',
      description: 'Portrait, Landscape, Event photography',
      category: { id: 'cat-3', name: 'Photography' },
      created_at: '2024-03-17T12:00:00.000Z',
      updated_at: '2024-03-17T12:00:00.000Z',
      user_id: 'user-123',
    }
  ];

  const mockUserId = 'user-123';
  
  it('renders skills correctly', () => {
    render(<ProfileSkills skills={mockSkills} userId={mockUserId} isCurrentUser={false} />);
    
    // Check that the section title is rendered
    expect(screen.getByText('Skills')).toBeInTheDocument();
    
    // Check that all skills are rendered
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Graphic Design')).toBeInTheDocument();
    expect(screen.getByText('Photography')).toBeInTheDocument();
    
    // Check that skill descriptions are rendered
    expect(screen.getByText('HTML, CSS, JavaScript, React')).toBeInTheDocument();
    expect(screen.getByText('Photoshop, Illustrator, UI/UX')).toBeInTheDocument();
    expect(screen.getByText('Portrait, Landscape, Event photography')).toBeInTheDocument();
    
    // Check that categories are rendered
    expect(screen.getByText('Category: Programming')).toBeInTheDocument();
    expect(screen.getByText('Category: Design')).toBeInTheDocument();
    expect(screen.getByText('Category: Photography')).toBeInTheDocument();
  });
  
  it('shows add skill button for current user', () => {
    render(<ProfileSkills skills={mockSkills} userId={mockUserId} isCurrentUser={true} />);
    
    // Check for add skill button
    const addButton = screen.getByRole('button', { name: /add skill/i });
    expect(addButton).toBeInTheDocument();
  });
  
  it('does not show add skill button for other users', () => {
    render(<ProfileSkills skills={mockSkills} userId={mockUserId} isCurrentUser={false} />);
    
    // Add skill button should not be present
    expect(screen.queryByRole('button', { name: /add skill/i })).not.toBeInTheDocument();
  });
  
  it('navigates to add skill page when add button is clicked', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<ProfileSkills skills={mockSkills} userId={mockUserId} isCurrentUser={true} />);
    
    // Click add skill button
    const addButton = screen.getByRole('button', { name: /add skill/i });
    fireEvent.click(addButton);
    
    // Check navigation to add skill page
    expect(mockPush).toHaveBeenCalledWith('/skills/new');
  });
  
  it('navigates to skill detail page when skill is clicked', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<ProfileSkills skills={mockSkills} userId={mockUserId} isCurrentUser={false} />);
    
    // Click on a skill
    const skillCard = screen.getByTestId('skill-card-skill-2');
    fireEvent.click(skillCard);
    
    // Check navigation to skill detail page
    expect(mockPush).toHaveBeenCalledWith('/skills/skill-2');
  });
  
  it('handles empty skills array gracefully', () => {
    render(<ProfileSkills skills={[]} userId={mockUserId} isCurrentUser={false} />);
    
    // Check for empty state message
    expect(screen.getByText(/no skills yet/i)).toBeInTheDocument();
  });
  
  it('shows proper empty state for current user with no skills', () => {
    render(<ProfileSkills skills={[]} userId={mockUserId} isCurrentUser={true} />);
    
    // Check for empty state with call to action
    expect(screen.getByText(/you haven't added any skills yet/i)).toBeInTheDocument();
    expect(screen.getByText(/add your first skill/i)).toBeInTheDocument();
  });
  
  it('sorts skills by category when category view is selected', () => {
    render(<ProfileSkills skills={mockSkills} userId={mockUserId} isCurrentUser={false} />);
    
    // Click on category view button
    const categoryViewButton = screen.getByRole('button', { name: /by category/i });
    fireEvent.click(categoryViewButton);
    
    // Check that skills are grouped by category
    const skillCards = screen.getAllByTestId(/skill-card-/);
    
    // In category view, we should see category headers
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Photography')).toBeInTheDocument();
  });
  
  it('filters skills by search query', () => {
    render(<ProfileSkills skills={mockSkills} userId={mockUserId} isCurrentUser={false} />);
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText(/search skills/i);
    fireEvent.change(searchInput, { target: { value: 'web' } });
    
    // Check that only matching skills are shown
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.queryByText('Graphic Design')).not.toBeInTheDocument();
    expect(screen.queryByText('Photography')).not.toBeInTheDocument();
  });
});
