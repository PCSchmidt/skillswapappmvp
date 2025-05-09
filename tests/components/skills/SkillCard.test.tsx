/**
 * Skill Card Component Tests
 * 
 * Tests for the component that displays a skill card
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SkillCard from '@/components/skills/SkillCard';

// Mock the Avatar component
jest.mock('@/components/shared/Avatar', () => ({
  __esModule: true,
  default: ({ user, size }: any) => (
    <div data-testid="avatar-mock">
      Avatar for {user?.full_name || 'Unknown'} (size: {size})
    </div>
  ),
}));

// Mock the CategoryBadge component
jest.mock('@/components/skills/CategoryBadge', () => ({
  __esModule: true,
  default: ({ category }: any) => (
    <div data-testid="category-badge">
      {category.name}
    </div>
  ),
}));

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
  const mockSkill = {
    id: 'skill-123',
    title: 'Web Development',
    description: 'Full-stack development with React, Node.js, and PostgreSQL',
    category: {
      id: 'cat-1',
      name: 'Programming',
      icon: 'code'
    },
    user_id: 'user-456',
    created_at: '2024-04-15T12:00:00.000Z',
    updated_at: '2024-04-16T14:00:00.000Z',
    is_featured: false,
    interest_count: 24,
    users: {
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
    
    // Check that category badge is rendered
    expect(screen.getByTestId('category-badge')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    
    // Check that user information is rendered
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-mock')).toBeInTheDocument();
    
    // Check that interest count is rendered
    expect(screen.getByText('24')).toBeInTheDocument();
  });
  
  it('calls onClick handler when card is clicked', () => {
    const handleClick = jest.fn();
    render(<SkillCard skill={mockSkill} onClick={handleClick} />);
    
    // Click on the card
    const card = screen.getByRole('article');
    fireEvent.click(card);
    
    // Check that onClick handler was called with the skill
    expect(handleClick).toHaveBeenCalledWith(mockSkill);
  });
  
  it('shows featured badge for featured skills', () => {
    const featuredSkill = { ...mockSkill, is_featured: true };
    render(<SkillCard skill={featuredSkill} />);
    
    // Check for featured badge
    expect(screen.getByText(/featured/i)).toBeInTheDocument();
  });
  
  it('displays compact layout in compact mode', () => {
    render(<SkillCard skill={mockSkill} compact={true} />);
    
    // In compact mode, description should be truncated or hidden
    // and layout should have a special compact class
    const card = screen.getByRole('article');
    expect(card).toHaveClass('compact');
    
    // Should still show essential info
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });
  
  it('handles undefined optional fields gracefully', () => {
    const minimalSkill = {
      id: 'skill-123',
      title: 'Web Development',
      category: {
        id: 'cat-1',
        name: 'Programming'
      },
      user_id: 'user-456',
      users: {
        full_name: 'Jane Doe'
      }
    };
    
    render(<SkillCard skill={minimalSkill as any} />);
    
    // Should still render without errors
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    
    // Should not show undefined text anywhere
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });
  
  it('renders timestamps in relative format', () => {
    // Mock the date function to return a fixed date
    jest.spyOn(Date, 'now').mockImplementation(() => new Date('2024-04-20T12:00:00.000Z').getTime());
    
    render(<SkillCard skill={mockSkill} showTimestamp={true} />);
    
    // Should show relative time (5 days ago)
    expect(screen.getByText(/5 days ago/i)).toBeInTheDocument();
    
    // Cleanup
    jest.restoreAllMocks();
  });
  
  it('shows trade button when showTradeButton is true', () => {
    render(<SkillCard skill={mockSkill} showTradeButton={true} />);
    
    // Check for trade button
    const tradeButton = screen.getByRole('button', { name: /propose trade/i });
    expect(tradeButton).toBeInTheDocument();
    
    // Click on trade button should not trigger the card's onClick
    const handleClick = jest.fn();
    render(<SkillCard skill={mockSkill} onClick={handleClick} showTradeButton={true} />);
    
    const tradeButtonAgain = screen.getByRole('button', { name: /propose trade/i });
    fireEvent.click(tradeButtonAgain);
    
    // Card click handler should not be called
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('calls onTradeClick when trade button is clicked', () => {
    const handleTradeClick = jest.fn();
    render(
      <SkillCard 
        skill={mockSkill} 
        showTradeButton={true} 
        onTradeClick={handleTradeClick} 
      />
    );
    
    // Click on trade button
    const tradeButton = screen.getByRole('button', { name: /propose trade/i });
    fireEvent.click(tradeButton);
    
    // Check that onTradeClick handler was called with the skill
    expect(handleTradeClick).toHaveBeenCalledWith(mockSkill);
  });
});
