/**
 * Profile Header Component Tests
 * 
 * Tests for the profile header component that displays user information
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import ProfileHeader from '@/components/profile/ProfileHeader';

// Mock the Avatar component
jest.mock('@/components/shared/Avatar', () => ({
  __esModule: true,
  default: ({ user, size, className }: any) => (
    <div data-testid="avatar-mock" className={className}>
      Avatar for {user?.full_name || 'Unknown'} (size: {size})
    </div>
  ),
}));

// Mock the StarRating component
jest.mock('@/components/ratings/StarRating', () => ({
  __esModule: true,
  default: ({ rating }: any) => (
    <div data-testid="star-rating-mock">
      {rating} stars
    </div>
  ),
}));

// Mock the FollowButton component
jest.mock('@/components/profile/FollowButton', () => ({
  __esModule: true,
  default: ({ userId, isFollowing, onFollow }: any) => (
    <button
      data-testid="follow-button-mock"
      data-user-id={userId}
      data-following={isFollowing}
      onClick={() => onFollow && onFollow(!isFollowing)}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  ),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('ProfileHeader', () => {
  const mockUser = {
    id: 'user-123',
    full_name: 'Jane Doe',
    profile_image_url: 'https://example.com/avatar.jpg',
    bio: 'Passionate about learning and teaching new skills',
    location: 'San Francisco, CA',
    skills_count: 5,
    trades_count: 12,
    rating: 4.8,
    ratings_count: 24,
    followers_count: 150,
    following_count: 75,
    is_following: false,
    joined_date: '2024-01-15T12:00:00.000Z',
  };
  
  it('renders user information correctly', () => {
    render(<ProfileHeader user={mockUser} isCurrentUser={false} onFollow={jest.fn()} />);
    
    // Check user name is displayed
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    
    // Check that the avatar is rendered
    expect(screen.getByTestId('avatar-mock')).toBeInTheDocument();
    
    // Check bio is displayed
    expect(screen.getByText('Passionate about learning and teaching new skills')).toBeInTheDocument();
    
    // Check location is displayed
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    
    // Check statistics are displayed
    expect(screen.getByText('5')).toBeInTheDocument(); // Skills count
    expect(screen.getByText('12')).toBeInTheDocument(); // Trades count
    expect(screen.getByText('150')).toBeInTheDocument(); // Followers count
    expect(screen.getByText('75')).toBeInTheDocument(); // Following count
    
    // Check rating is displayed
    expect(screen.getByTestId('star-rating-mock')).toBeInTheDocument();
    expect(screen.getByText('24 ratings')).toBeInTheDocument();
    
    // Check for follow button
    expect(screen.getByTestId('follow-button-mock')).toBeInTheDocument();
  });
  
  it('does not show follow button for current user', () => {
    render(<ProfileHeader user={mockUser} isCurrentUser={true} onFollow={jest.fn()} />);
    
    // Follow button should not be present
    expect(screen.queryByTestId('follow-button-mock')).not.toBeInTheDocument();
    
    // Edit profile button should be present
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
  });
  
  it('calls onFollow when follow button is clicked', () => {
    const mockOnFollow = jest.fn();
    render(<ProfileHeader user={mockUser} isCurrentUser={false} onFollow={mockOnFollow} />);
    
    // Click the follow button
    const followButton = screen.getByTestId('follow-button-mock');
    fireEvent.click(followButton);
    
    // Check that onFollow was called with the correct argument
    expect(mockOnFollow).toHaveBeenCalledWith(true);
  });
  
  it('navigates to edit profile page when edit button is clicked', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<ProfileHeader user={mockUser} isCurrentUser={true} onFollow={jest.fn()} />);
    
    // Click the edit profile button
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(editButton);
    
    // Check navigation to edit profile page
    expect(mockPush).toHaveBeenCalledWith('/settings/profile');
  });
  
  it('shows verified badge for verified users', () => {
    const verifiedUser = { ...mockUser, is_verified: true };
    render(<ProfileHeader user={verifiedUser} isCurrentUser={false} onFollow={jest.fn()} />);
    
    // Check for verified badge
    expect(screen.getByTestId('verified-badge')).toBeInTheDocument();
  });
  
  it('handles undefined optional user fields gracefully', () => {
    const minimalUser = {
      id: 'user-123',
      full_name: 'Jane Doe',
      // Missing optional fields
    };
    
    render(<ProfileHeader user={minimalUser as any} isCurrentUser={false} onFollow={jest.fn()} />);
    
    // Should still render name
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    
    // Optional fields should not cause errors
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });
  
  it('navigates to followers page when followers count is clicked', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<ProfileHeader user={mockUser} isCurrentUser={false} onFollow={jest.fn()} />);
    
    // Click on the followers count
    const followersElement = screen.getByText('150');
    fireEvent.click(followersElement);
    
    // Check navigation
    expect(mockPush).toHaveBeenCalledWith(`/profile/${mockUser.id}/followers`);
  });
  
  it('navigates to following page when following count is clicked', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<ProfileHeader user={mockUser} isCurrentUser={false} onFollow={jest.fn()} />);
    
    // Click on the following count
    const followingElement = screen.getByText('75');
    fireEvent.click(followingElement);
    
    // Check navigation
    expect(mockPush).toHaveBeenCalledWith(`/profile/${mockUser.id}/following`);
  });
});
