import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EmailPreferences from '@/components/settings/EmailPreferences';

// Mock the SupabaseContext
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: () => ({
    supabase: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockPreferences,
        error: null,
      }),
      update: jest.fn().mockResolvedValue({
        error: null,
      }),
    },
  }),
}));

// Mock data for testing
const mockPreferences = {
  id: 'pref-123',
  user_id: 'user-123',
  notify_trade_proposal: true,
  notify_trade_status_accepted: true,
  notify_trade_status_declined: false,
  notify_trade_status_cancelled: true,
  notify_trade_status_completed: true,
  notify_new_message: true,
  notify_new_rating: false,
  notify_platform_updates: true,
  daily_digest: false,
  weekly_digest: true,
};

describe('EmailPreferences', () => {
  it('renders email preferences correctly', async () => {
    render(<EmailPreferences userId="user-123" />);
    
    // Check for section headings
    expect(screen.getByText('Email Notification Preferences')).toBeInTheDocument();
    expect(screen.getByText('Trade Notifications')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Digest Emails')).toBeInTheDocument();
    
    // Wait for preferences to load
    await waitFor(() => {
      // Verify specific preference items are displayed
      expect(screen.getByText('New trade proposals')).toBeInTheDocument();
      expect(screen.getByText('Trade proposal accepted')).toBeInTheDocument();
      expect(screen.getByText('New messages')).toBeInTheDocument();
      expect(screen.getByText('New ratings')).toBeInTheDocument();
    });
    
    // Verify the save button is present
    expect(screen.getByText('Save Preferences')).toBeInTheDocument();
  });
  
  it('should toggle preferences when changed', async () => {
    render(<EmailPreferences userId="user-123" />);
    
    // Wait for preferences to load
    await waitFor(() => {
      expect(screen.getByText('New trade proposals')).toBeInTheDocument();
    });
    
    // Get toggle inputs
    const tradeProposalToggle = screen.getByLabelText('New trade proposals');
    const newRatingsToggle = screen.getByLabelText('New ratings');
    
    // Verify initial state based on mock data (trade proposals: true, new ratings: false)
    expect(tradeProposalToggle).toBeChecked();
    expect(newRatingsToggle).not.toBeChecked();
    
    // Toggle the states
    fireEvent.click(tradeProposalToggle);
    fireEvent.click(newRatingsToggle);
    
    // Verify the toggles have changed state
    expect(tradeProposalToggle).not.toBeChecked();
    expect(newRatingsToggle).toBeChecked();
  });
  
  it('should show success message after saving preferences', async () => {
    render(<EmailPreferences userId="user-123" />);
    
    // Wait for preferences to load
    await waitFor(() => {
      expect(screen.getByText('Save Preferences')).toBeInTheDocument();
    });
    
    // Click save button
    const saveButton = screen.getByText('Save Preferences');
    fireEvent.click(saveButton);
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Email preferences saved successfully')).toBeInTheDocument();
    });
  });
  
  it('should handle loading state correctly', () => {
    // Mock implementation that delays response to simulate loading
    jest.mock('@/contexts/SupabaseContext', () => ({
      useSupabase: () => ({
        supabase: {
          from: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ 
            data: mockPreferences, 
            error: null 
          }), 500))),
        },
      }),
    }));
    
    render(<EmailPreferences userId="user-123" />);
    
    // During loading, we should see a skeleton loader
    // This is a bit of a simplification since we can't easily check for the animation
    // but we can check that the regular content is not there yet
    expect(screen.queryByText('Email Notification Preferences')).not.toBeInTheDocument();
  });
  
  it('should handle error state correctly', async () => {
    // Mock implementation that returns an error
    jest.mock('@/contexts/SupabaseContext', () => ({
      useSupabase: () => ({
        supabase: {
          from: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: new Error('Failed to load preferences'),
          }),
        },
      }),
    }));
    
    render(<EmailPreferences userId="user-123" />);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to load email preferences/i)).toBeInTheDocument();
    });
  });
});
