/**
 * Profile Header Component Tests
 * 
 * Tests for the profile header component that displays user information
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import ProfileHeader from '@/components/profile/ProfileHeader';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockUser = {
  id: 'user-1',
  full_name: 'Jane Doe',
  email: 'jane@example.com',
  bio: 'Passionate about learning and teaching new skills',
  location: 'San Francisco, CA',
  avatar_url: 'https://example.com/avatar.jpg',
  member_since: '2023-01-15',
  is_following: false,
  is_verified: true,
  followers_count: 150,
  following_count: 75,
  social_links: {
    twitter: 'https://twitter.com/janedoe',
    linkedin: 'https://linkedin.com/in/janedoe'
  }
};

const mockCurrentUser = {
  ...mockUser,
  id: 'current-user',
  full_name: 'Current User'
};

describe('ProfileHeader', () => {
  const mockOnFollow = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(
      <ProfileHeader 
        user={mockUser} 
        isCurrentUser={false} 
        onFollow={mockOnFollow} 
      />
    );

    // Check user name is displayed
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    
    // Check email is displayed
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    
    // Check location is displayed
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    
    // Check bio is displayed
    expect(screen.getByText('Passionate about learning and teaching new skills')).toBeInTheDocument();
    
    // Check member since is displayed
    expect(screen.getByText(/Member since/)).toBeInTheDocument();
    
    // Check avatar is rendered
    expect(screen.getByAltText('Jane Doe')).toBeInTheDocument();
  });

  it('shows follow button for non-current user', () => {
    render(
      <ProfileHeader 
        user={mockUser} 
        isCurrentUser={false} 
        onFollow={mockOnFollow} 
      />
    );

    const followButton = screen.getByRole('button', { name: /follow/i });
    expect(followButton).toBeInTheDocument();
    expect(followButton).toHaveTextContent('Follow');
  });

  it('shows edit profile button for current user', () => {
    render(
      <ProfileHeader 
        user={mockCurrentUser} 
        isCurrentUser={true} 
        onFollow={mockOnFollow} 
      />
    );

    const editButton = screen.getByRole('button', { name: /edit profile/i });
    expect(editButton).toBeInTheDocument();
  });

  it('does not show follow button for current user', () => {
    render(
      <ProfileHeader 
        user={mockCurrentUser} 
        isCurrentUser={true} 
        onFollow={mockOnFollow} 
      />
    );

    const followButton = screen.queryByRole('button', { name: /follow/i });
    expect(followButton).not.toBeInTheDocument();
  });

  it('calls onFollow when follow button is clicked', () => {
    render(
      <ProfileHeader 
        user={mockUser} 
        isCurrentUser={false} 
        onFollow={mockOnFollow} 
      />
    );

    const followButton = screen.getByRole('button', { name: /follow/i });
    fireEvent.click(followButton);
    
    expect(mockOnFollow).toHaveBeenCalledWith(true);
  });

  it('shows unfollow when user is already following', () => {
    const followingUser = { ...mockUser, is_following: true };
    
    render(
      <ProfileHeader 
        user={followingUser} 
        isCurrentUser={false} 
        onFollow={mockOnFollow} 
      />
    );

    const unfollowButton = screen.getByRole('button', { name: /unfollow/i });
    expect(unfollowButton).toBeInTheDocument();
    
    fireEvent.click(unfollowButton);
    expect(mockOnFollow).toHaveBeenCalledWith(false);
  });

  it('handles undefined optional user fields gracefully', () => {
    const minimalUser = {
      id: 'user-minimal',
      full_name: 'Minimal User'
    };

    render(
      <ProfileHeader 
        user={minimalUser} 
        isCurrentUser={false} 
        onFollow={mockOnFollow} 
      />
    );

    // Should still render the name
    expect(screen.getByText('Minimal User')).toBeInTheDocument();
    
    // Should show Member since Unknown when no member_since
    expect(screen.getByText('Member since Unknown')).toBeInTheDocument();
  });

  it('displays social links when provided', () => {
    render(
      <ProfileHeader 
        user={mockUser} 
        isCurrentUser={false} 
        onFollow={mockOnFollow} 
      />
    );

    // Check that social links section exists
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Linkedin')).toBeInTheDocument();
  });

  it('does not display social links section when no links provided', () => {
    const userWithoutLinks = { ...mockUser, social_links: undefined };
    
    render(
      <ProfileHeader 
        user={userWithoutLinks} 
        isCurrentUser={false} 
        onFollow={mockOnFollow} 
      />
    );

    expect(screen.queryByText('Links')).not.toBeInTheDocument();
  });

  it('uses fallback avatar when no avatar_url provided', () => {
    const userWithoutAvatar = { 
      ...mockUser, 
      avatar_url: null, 
      profile_image_url: null 
    };
    
    render(
      <ProfileHeader 
        user={userWithoutAvatar} 
        isCurrentUser={false} 
        onFollow={mockOnFollow} 
      />
    );

    const avatar = screen.getByAltText('Jane Doe');
    expect(avatar).toHaveAttribute('src', '/images/default-avatar.png');
  });
});
