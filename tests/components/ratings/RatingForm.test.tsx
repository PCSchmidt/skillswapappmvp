/**
 * Rating Form Component Tests
 * 
 * Tests for the rating form component that allows users to submit ratings for completed trades
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import RatingForm from '@/components/ratings/RatingForm';

// Mock the Supabase client
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: () => ({
    supabase: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'rating-123' },
            error: null,
          })
        })
      }),
    },
    session: {
      user: { id: 'current-user-id' }
    },
  }),
}));

// Mock the StarRating component
jest.mock('@/components/ratings/StarRating', () => ({
  __esModule: true,
  default: ({ rating, onChange, interactive, disabled }: any) => (
    <div data-testid="star-rating-mock">
      <span>Rating: {rating}</span>
      <button 
        onClick={() => onChange && onChange(5)} 
        disabled={disabled}
        data-testid="star-rating-change-button"
      >
        Change Rating
      </button>
    </div>
  ),
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
}));

describe('RatingForm', () => {
  const mockTrade = {
    id: 'trade-123',
    status: 'completed',
    offered_skill: {
      title: 'Web Development',
      user_id: 'user-456',
      users: {
        full_name: 'Jane Doe',
      }
    },
    requested_skill: {
      title: 'Guitar Lessons',
      user_id: 'current-user-id',
      users: {
        full_name: 'John Smith',
      }
    }
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with correct user information', () => {
    render(<RatingForm trade={mockTrade as any} ratedUserId="user-456" />);
    
    // Should show the user's name
    expect(screen.getByText(/Rating for Jane Doe/i)).toBeInTheDocument();
    
    // Should show the skill title
    expect(screen.getByText(/Web Development/i)).toBeInTheDocument();
    
    // Should have the star rating component
    expect(screen.getByTestId('star-rating-mock')).toBeInTheDocument();
    
    // Should have submit button
    expect(screen.getByRole('button', { name: /submit rating/i })).toBeInTheDocument();
  });
  
  it('should update rating when star rating changes', () => {
    render(<RatingForm trade={mockTrade as any} ratedUserId="user-456" />);
    
    // The initial rating should be 0
    expect(screen.getByText('Rating: 0')).toBeInTheDocument();
    
    // Change the rating
    fireEvent.click(screen.getByTestId('star-rating-change-button'));
    
    // The rating should now be 5
    expect(screen.getByText('Rating: 5')).toBeInTheDocument();
  });
  
  it('should submit the rating successfully', async () => {
    const { useSupabase } = require('@/contexts/SupabaseContext');
    const { useRouter } = require('next/navigation');
    
    render(<RatingForm trade={mockTrade as any} ratedUserId="user-456" />);
    
    // Change the rating
    fireEvent.click(screen.getByTestId('star-rating-change-button'));
    
    // Fill in the review text
    const reviewInput = screen.getByPlaceholderText(/share your experience/i);
    fireEvent.change(reviewInput, { target: { value: 'Great experience! Learned a lot.' } });
    
    // Set it to public
    const publicCheckbox = screen.getByLabelText(/make this review public/i);
    fireEvent.click(publicCheckbox);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit rating/i });
    fireEvent.click(submitButton);
    
    // Check that the rating was submitted with correct data
    await waitFor(() => {
      expect(useSupabase().supabase.from).toHaveBeenCalledWith('ratings');
      expect(useSupabase().supabase.from().insert).toHaveBeenCalledWith({
        trade_id: 'trade-123',
        rated_user_id: 'user-456',
        rater_user_id: 'current-user-id',
        rating: 5,
        review_text: 'Great experience! Learned a lot.',
        is_public: true,
      });
    });
    
    // Should navigate back after submission
    expect(useRouter().back).toHaveBeenCalled();
  });
  
  it('should show an error message if rating is zero', async () => {
    render(<RatingForm trade={mockTrade as any} ratedUserId="user-456" />);
    
    // Submit without changing rating from zero
    const submitButton = screen.getByRole('button', { name: /submit rating/i });
    fireEvent.click(submitButton);
    
    // Should show error message
    expect(screen.getByText(/please select a rating before submitting/i)).toBeInTheDocument();
  });
  
  it('should handle submission errors gracefully', async () => {
    // Mock the insert to fail
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: new Error('Failed to submit rating'),
          })
        })
      }),
    };
    
    jest.mock('@/contexts/SupabaseContext', () => ({
      useSupabase: () => ({
        supabase: mockSupabase,
        session: {
          user: { id: 'current-user-id' }
        },
      }),
    }));
    
    render(<RatingForm trade={mockTrade as any} ratedUserId="user-456" />);
    
    // Change the rating
    fireEvent.click(screen.getByTestId('star-rating-change-button'));
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit rating/i });
    fireEvent.click(submitButton);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/error submitting rating/i)).toBeInTheDocument();
    });
  });
  
  it('should disable form if user already rated this trade', () => {
    const { useSupabase } = require('@/contexts/SupabaseContext');
    
    // Mock that user already rated
    useSupabase().supabase.from().select().eq().eq = jest.fn().mockReturnValue({
      single: jest.fn().mockResolvedValue({
        data: { id: 'existing-rating-123' },
        error: null,
      }),
    });
    
    render(<RatingForm trade={mockTrade as any} ratedUserId="user-456" existingRating={4} />);
    
    // Form should be in read-only mode
    expect(screen.getByTestId('star-rating-change-button')).toBeDisabled();
    expect(screen.getByPlaceholderText(/share your experience/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /submit rating/i })).toBeDisabled();
    
    // Should show a message that rating already exists
    expect(screen.getByText(/you have already rated this trade/i)).toBeInTheDocument();
  });
});
