/**
 * Skill Card Component Tests
 * 
 * Tests for the component that displays a skill card
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SkillCard, { Skill } from '../../../src/components/skills/SkillCard';

// Mock the Avatar component
jest.mock('../../../src/components/shared/Avatar', () => ({
  __esModule: true,
  default: ({ user, size }: any) => (
    <div data-testid="avatar-mock">
      Avatar for {user?.full_name || 'Unknown'} (size: {size})
    </div>
  ),
}));

// Create a mock CategoryBadge component directly
const MockCategoryBadge = ({ category }: { category: string }) => (
  <div data-testid="category-badge">
    {category}
  </div>
);

// Mock the SkillCard's internal import of CategoryBadge
jest.mock('../../../src/components/skills/CategoryBadge', () => ({
  __esModule: true,
  default: (props: any) => <MockCategoryBadge {...props} />
}), { virtual: true });

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    <img
      {...props}
      data-testid="next-image"
      alt={props.alt}
    />
  ),
}));

describe('SkillCard', () => {
  const mockSkill: Skill = {
    id: 'skill-123',
    title: 'Web Development',
    description: 'Full-stack development with React, Node.js, and PostgreSQL',
    category: 'Programming',
    subcategory: 'Full-stack',
    user_id: 'user-456',
    created_at: '2024-04-15T12:00:00.000Z',
    updated_at: '2024-04-16T14:00:00.000Z',
    experience_level: 'intermediate',
    is_remote: true,
    is_remote_friendly: true,
    availability: 'weekends',
    is_offering: true,
    is_active: true,
    hourly_equivalent_value: 50,
    users: {
      id: 'user-456',
      full_name: 'Jane Doe',
      profile_image_url: 'https://example.com/avatar.jpg',
      location: 'San Francisco, CA'
    }
  };
  
  it('renders skill information correctly', () => {
    render(<SkillCard skill={mockSkill} />);
    
    // Check that skill title and description are rendered
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Full-stack development with React, Node.js, and PostgreSQL')).toBeInTheDocument();
    
    // Check that category information is rendered
    expect(screen.getByText('Programming > Full-stack')).toBeInTheDocument();
    
    // Check that badges are rendered
    expect(screen.getByText('Offering')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });
  
  it('calls onClick handler when card is clicked', () => {
    const handleClick = jest.fn();
    render(<SkillCard skill={mockSkill} onClick={handleClick} />);
    
    // Click on the card (using the container div with cursor-pointer class)
    const card = screen.getByText('Web Development').closest('div.cursor-pointer');
    if (card) {
      fireEvent.click(card);
      
      // Check that onClick handler was called
      expect(handleClick).toHaveBeenCalled();
    } else {
      // If we can't find the clickable element, try clicking the parent div
      const cardDiv = screen.getByText('Web Development').closest('div');
      fireEvent.click(cardDiv!);
      expect(handleClick).toHaveBeenCalled();
    }
  });
  
  it('shows experience level badge', () => {
    const expertSkill = { ...mockSkill, experience_level: 'expert' };
    render(<SkillCard skill={expertSkill} />);
    
    // Check for experience level badge
    expect(screen.getByText(/Expert/)).toBeInTheDocument();
  });
  
  it('shows owner controls when isOwner is true', () => {
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();
    
    render(
      <SkillCard 
        skill={mockSkill} 
        isOwner={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
    
    // Find edit and delete buttons
    const editButton = screen.getByLabelText('Edit skill');
    const deleteButton = screen.getByLabelText('Delete skill');
    
    // Click on edit button
    fireEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalled();
    
    // Click on delete button
    fireEvent.click(deleteButton);
    expect(handleDelete).toHaveBeenCalled();
  });
  
  it('handles undefined optional fields gracefully', () => {
    const minimalSkill: Partial<Skill> = {
      id: 'skill-123',
      title: 'Web Development',
      category: 'Programming',
      user_id: 'user-456',
      experience_level: 'beginner',
      is_remote: false,
      availability: 'weekdays',
      description: '',
      is_offering: false
    };
    
    render(<SkillCard skill={minimalSkill as any} />);
    
    // Should still render without errors
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('Seeking')).toBeInTheDocument();
    
    // Should not show undefined text anywhere
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });
  
  it('displays correctly in profile view mode', () => {
    const handleClick = jest.fn();
    render(<SkillCard skill={mockSkill} isProfileView={true} onClick={handleClick} />);
    
    // In profile view, clicking the card should not trigger the onClick handler
    const cardDiv = screen.getByText('Web Development').closest('div');
    fireEvent.click(cardDiv!);
    
    // Check that onClick handler was not called
    expect(handleClick).not.toHaveBeenCalled();
    
    // Should still show essential info
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText(/Programming/)).toBeInTheDocument();
  });
});
