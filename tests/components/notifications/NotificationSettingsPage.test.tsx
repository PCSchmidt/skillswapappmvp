import { jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import NotificationSettingsPage from '@/components/notifications/NotificationSettingsPage';
import { useSupabase } from '@/contexts/SupabaseContext';

// Define interfaces for proper typing of data structures
interface UserSettings {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  location_sharing: boolean;
  profile_visibility: string;
  theme_preference: string;
  notification_frequency?: string;
}

interface SupabaseResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

// Mock the useSupabase hook
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: jest.fn(),
}));

// Mock FrequencySettings component
jest.mock('@/components/notifications/FrequencySettings', () => {
  return function MockFrequencySettings({ 
    frequency, 
    onFrequencyChange 
  }: { 
    frequency: string; 
    onFrequencyChange: (value: string) => void 
  }) {
    return (
      <div data-testid="frequency-settings">
        <select 
          data-testid="frequency-select" 
          value={frequency}
          onChange={(e) => onFrequencyChange(e.target.value)}
        >
          <option value="immediately">Immediately</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
    );
  };
});

describe('NotificationSettingsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a standardized mock response
    const mockUserSettings: UserSettings = {
      user_id: 'test-user-id',
      email_notifications: true,
      push_notifications: false,
      marketing_emails: true,
      location_sharing: true,
      profile_visibility: 'public',
      theme_preference: 'system'
    };
    
    // Setup the mock implementation for useSupabase
    (useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user-id' } },
      supabase: {
        from: jest.fn().mockImplementation(() => ({
          select: jest.fn().mockImplementation(() => ({
            eq: jest.fn().mockImplementation(() => ({
              single: jest.fn().mockResolvedValue({
                data: mockUserSettings,
                error: null
              })
            }))
          })),
          update: jest.fn().mockImplementation(() => ({
            eq: jest.fn().mockImplementation(() => ({
              then: jest.fn((callback: any) => {
                callback({ data: true, error: null });
                return { catch: jest.fn() };
              })
            }))
          }))
        }))
      }
    });
  });

  test('renders notification settings page correctly', async () => {
    render(<NotificationSettingsPage />);
    
    // Wait for settings to load
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Check that toggle switches are present
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    expect(screen.getByText('Marketing Emails')).toBeInTheDocument();
    expect(screen.getByText('Location Sharing')).toBeInTheDocument();
    
    // Check that profile visibility settings are present
    expect(screen.getByText('Profile Visibility')).toBeInTheDocument();
  });
  
  test('toggles notification preferences correctly', async () => {
    render(<NotificationSettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Find toggle switches
    const emailToggle = screen.getByLabelText('Email Notifications');
    const pushToggle = screen.getByLabelText('Push Notifications');
    
    // Check initial states (based on mock data)
    expect(emailToggle).toBeChecked();
    expect(pushToggle).not.toBeChecked();
    
    // Toggle switches
    fireEvent.click(emailToggle);
    fireEvent.click(pushToggle);
    
    // Check that states have changed
    expect(emailToggle).not.toBeChecked();
    expect(pushToggle).toBeChecked();
  });
  
  test('saves settings when save button is clicked', async () => {
    // Create mocks with proper typing
    const mockUserSettings: UserSettings = {
      user_id: 'test-user-id',
      email_notifications: true,
      push_notifications: false,
      marketing_emails: true,
      location_sharing: true,
      profile_visibility: 'public',
      theme_preference: 'system'
    };
    
    const mockFrom = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockUserSettings,
            error: null
          })
        }))
      })),
      update: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          then: jest.fn((callback: any) => {
            callback({ data: true, error: null });
            return { catch: jest.fn() };
          })
        }))
      }))
    }));
    
    (useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user-id' } },
      supabase: {
        from: mockFrom
      }
    });
    
    render(<NotificationSettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Toggle a setting
    const emailToggle = screen.getByLabelText('Email Notifications');
    fireEvent.click(emailToggle);
    
    // Find and click save button
    const saveButton = screen.getByRole('button', { name: /save settings/i });
    fireEvent.click(saveButton);
    
    // Check that update was called
    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('user_settings');
      expect(mockFrom().update).toHaveBeenCalled();
    });
    
    // Check for success message
    expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();
  });
  
  test('shows error message when settings fail to save', async () => {
    // Create mocks for error case
    const mockUserSettings: UserSettings = {
      user_id: 'test-user-id',
      email_notifications: true,
      push_notifications: false,
      marketing_emails: true,
      location_sharing: true,
      profile_visibility: 'public',
      theme_preference: 'system'
    };
    
    const mockFrom = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockUserSettings,
            error: null
          })
        }))
      })),
      update: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          then: jest.fn((callback: any) => {
            callback({ 
              data: null, 
              error: { message: 'Failed to save settings' } 
            });
            return { catch: jest.fn() };
          })
        }))
      }))
    }));
    
    (useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user-id' } },
      supabase: {
        from: mockFrom
      }
    });
    
    render(<NotificationSettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Find and click save button
    const saveButton = screen.getByRole('button', { name: /save settings/i });
    fireEvent.click(saveButton);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Error saving settings: Failed to save settings')).toBeInTheDocument();
    });
  });
  
  test('changes notification frequency', async () => {
    // Create mock for update with frequency
    const mockUserSettings: UserSettings = {
      user_id: 'test-user-id',
      email_notifications: true,
      push_notifications: false,
      marketing_emails: true,
      location_sharing: true,
      profile_visibility: 'public',
      theme_preference: 'system'
    };
    
    const mockUpdate = jest.fn().mockImplementation(() => ({
      eq: jest.fn().mockImplementation(() => ({
        then: jest.fn((callback: any) => {
          callback({ data: true, error: null });
          return { catch: jest.fn() };
        })
      }))
    }));
    
    const mockFrom = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockUserSettings,
            error: null
          })
        }))
      })),
      update: mockUpdate
    }));
    
    (useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user-id' } },
      supabase: {
        from: mockFrom
      }
    });
    
    render(<NotificationSettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Find frequency select and change it
    const frequencySelect = screen.getByTestId('frequency-select');
    fireEvent.change(frequencySelect, { target: { value: 'weekly' } });
    
    // Find and click save button
    const saveButton = screen.getByRole('button', { name: /save settings/i });
    fireEvent.click(saveButton);
    
    // Check that update was called with the new frequency value
    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('user_settings');
      
      // Check the update parameters without complex type constraints
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          notification_frequency: 'weekly'
        })
      );
    });
  });
});
