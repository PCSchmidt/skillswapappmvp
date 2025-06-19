import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SkillCard, { Skill } from '@/components/skills/SkillCard';

// Mock next/image since it's not available in the test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src || ''} alt={props.alt || ''} />;
  },
}));

// Mock next/link since it's not available in the test environment
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

describe('SkillCard', () => {
  // Using type assertion to avoid strict typing issues in tests
  const mockOfferedSkill: Skill = {
    id: '123',
    title: 'Web Development',
    description: 'I can teach you how to build responsive websites using modern frameworks',
    category: 'Technology',
    subcategory: 'Development',
    experience_level: 'expert',
    hourly_equivalent_value: 50,
    availability: 'weekends',
    is_offering: true,
    is_remote: true,
    is_remote_friendly: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user123',
    users: {
      id: 'user123',
      full_name: 'Jane Doe',
      profile_image_url: null,
      location_city: 'San Francisco',
      location_state: 'CA',
    },
  };

  const mockRequestedSkill: Skill = {
    ...mockOfferedSkill,
    id: '456',
    title: 'Guitar Lessons',
    description: 'Looking for someone to teach me guitar basics',
    category: 'Music',
    subcategory: 'Instruments',
    experience_level: 'beginner',
    is_offering: false,
    is_remote: false,
  }; // Type assertion to avoid strict typing issues in tests

  it('renders offered skill correctly', () => {
    render(<SkillCard skill={mockOfferedSkill} />);
    
    // Check if title, category and description are rendered
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Technology • Development')).toBeInTheDocument();
    expect(screen.getByText(/I can teach you how to build responsive websites/i)).toBeInTheDocument();
    
    // Check if badges are rendered correctly
    expect(screen.getByText('Offering')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
    
    // Check if user info is rendered
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    
    // Check if action button is rendered with correct text
    expect(screen.getByText('Request Skill')).toBeInTheDocument();
  });

  it('renders requested skill correctly', () => {
    render(<SkillCard skill={mockRequestedSkill} />);
    
    // Check if title, category and description are rendered
    expect(screen.getByText('Guitar Lessons')).toBeInTheDocument();
    expect(screen.getByText('Music • Instruments')).toBeInTheDocument();
    expect(screen.getByText(/Looking for someone to teach me guitar basics/i)).toBeInTheDocument();
    
    // Check if badges are rendered correctly
    expect(screen.getByText('Seeking')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    
    // Check if action button is rendered with correct text
    expect(screen.getByText('Offer Help')).toBeInTheDocument();
  });

  it('should not show actions when isOwner is false', () => {
    render(<SkillCard skill={mockOfferedSkill} isOwner={false} />);
    
    // Actions should not be visible
    expect(screen.queryByText('Request Skill')).not.toBeInTheDocument();
    expect(screen.queryByText('View Details')).not.toBeInTheDocument();
  });
});
