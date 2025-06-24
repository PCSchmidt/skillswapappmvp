import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationSettingsPage from '@/components/notifications/NotificationSettingsPage';

// Mock the SupabaseContext - keep it simple like working tests
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: jest.fn(),
}));

import { useSupabase } from '@/contexts/SupabaseContext';

const mockUseSupabase = useSupabase as jest.MockedFunction<typeof useSupabase>;

// Set up the mock implementation
beforeEach(() => {
  mockUseSupabase.mockReturnValue({
    user: { id: 'test-user-id' },
    supabase: mockSupabaseClient
  });
});

// Define interfaces for proper typing of data structures
interface NotificationPreference {
  id: string;
  user_id: string;
  notify_trade_proposal: boolean;
  notify_trade_status_accepted: boolean;
  notify_trade_status_declined: boolean;
  notify_trade_status_cancelled: boolean;
  notify_trade_status_completed: boolean;
  notify_new_message: boolean;
  notify_new_rating: boolean;
  daily_digest: boolean;
  weekly_digest: boolean;
}

interface ChannelPreference {
  id: string;
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
}

// Create standardized mock data
const mockEmailPreferences: NotificationPreference = {
  id: 'test-id',
  user_id: 'test-user-id',
  notify_trade_proposal: true,
  notify_trade_status_accepted: true,
  notify_trade_status_declined: false,
  notify_trade_status_cancelled: true,
  notify_trade_status_completed: true,
  notify_new_message: true,
  notify_new_rating: false,
  daily_digest: false,
  weekly_digest: true,
};

const mockChannelPreferences: ChannelPreference = {
  id: 'test-channel-id',
  user_id: 'test-user-id',
  email_enabled: true,
  push_enabled: false,
  in_app_enabled: true,
};

// Mock data for different test scenarios
let mockEmailPrefData: NotificationPreference | null = { ...mockEmailPreferences };
let mockChannelPrefData: ChannelPreference | null = { ...mockChannelPreferences };
let mockEmailPrefError: Error | null = null;
let mockChannelPrefError: Error | null = null;
let mockUpdateError: Error | null = null;

// Mock upsert function that can be tracked
const mockUpsert = jest.fn(() => Promise.resolve({
  error: mockUpdateError
}));

// Mock the useSupabase hook
const mockSupabaseClient = {
  from: jest.fn((table: string) => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => {
          if (table === 'email_preferences') {
            return Promise.resolve({
              data: mockEmailPrefError ? null : mockEmailPrefData,
              error: mockEmailPrefError
            });
          } else if (table === 'notification_channel_preferences') {
            return Promise.resolve({
              data: mockChannelPrefError ? null : mockChannelPrefData,
              error: mockChannelPrefError
            });
          }
          
          return Promise.resolve({ data: null, error: null });
        })
      }))
    })),
    upsert: mockUpsert
  }))
};

// SupabaseContext is already mocked above

// Mock UI components
jest.mock('@/components/ui/Switch', () => {
  return function MockSwitch({ 
    checked, 
    onChange 
  }: { 
    checked: boolean; 
    onChange: () => void 
  }) {
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        data-testid="switch"
      />
    );
  };
});

jest.mock('@/components/ui/Spinner', () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock('@/components/ui/Tabs', () => {
  const MockTab = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tab-content">{children}</div>
  );
  
  const MockTabs = ({ 
    children, 
    activeTab, 
    onChange 
  }: { 
    children: React.ReactNode;
    activeTab: string;
    onChange: (tab: string) => void;
  }) => {
    const tabs = React.Children.toArray(children) as React.ReactElement[];
    const activeTabContent = tabs.find((tab) => tab.props.id === activeTab);
    
    return (
      <div data-testid="tabs">
        <div data-testid="tab-buttons">
          {tabs.map((tab) => (
            <button
              key={tab.props.id}
              onClick={() => onChange(tab.props.id)}
              data-testid={`tab-${tab.props.id}`}
            >
              {tab.props.label}
            </button>
          ))}
        </div>
        {activeTabContent}
      </div>
    );
  };
  
  MockTabs.Tab = MockTab;
    return {
    __esModule: true,
    default: MockTabs,
    Tab: MockTab
  };
});

// Helper function to render components with providers
function renderWithProviders(component: React.ReactElement) {
  return render(component);
}

describe('NotificationSettingsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Clear the upsert mock specifically
    mockUpsert.mockClear();    // Setup useSupabase mock
    mockUseSupabase.mockReturnValue({
      user: { 
        id: 'test-user-id',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: '',
        email: 'test@example.com'
      },
      supabase: mockSupabaseClient as any,
      session: null,
      isLoading: false,
      isVerified: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn()
    } as any);
    
    // Reset mock data to defaults
    mockEmailPrefData = { ...mockEmailPreferences };
    mockChannelPrefData = { ...mockChannelPreferences };
    mockEmailPrefError = null;
    mockChannelPrefError = null;
    mockUpdateError = null;
  });

  test('renders notification settings page correctly', async () => {
    renderWithProviders(<NotificationSettingsPage />);
    
    // Wait for settings to load
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Check that main sections are present
    expect(screen.getByText('Manage how and when you receive notifications from SkillSwap.')).toBeInTheDocument();
    expect(screen.getByText('General Settings')).toBeInTheDocument();
    expect(screen.getByText('Notification Types')).toBeInTheDocument();
    
    // Check that notification channel settings are present (default tab)
    expect(screen.getByText('Notification Channels')).toBeInTheDocument();
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    expect(screen.getByText('In-App Notifications')).toBeInTheDocument();
  });
  
  test('toggles channel preferences correctly', async () => {
    renderWithProviders(<NotificationSettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Find toggle switches for channel preferences
    const switches = screen.getAllByTestId('switch');
    
    // The first few switches should be for channels (email, push, in-app)
    const emailSwitch = switches[0];
    const pushSwitch = switches[1];
    
    // Check initial states (based on mock data)
    expect(emailSwitch).toBeChecked(); // email_enabled: true
    expect(pushSwitch).not.toBeChecked(); // push_enabled: false
    
    // Toggle switches
    fireEvent.click(emailSwitch);
    fireEvent.click(pushSwitch);
    
    // Check that states have changed
    expect(emailSwitch).not.toBeChecked();
    expect(pushSwitch).toBeChecked();
  });
  
  test('switches to notification types tab', async () => {
    renderWithProviders(<NotificationSettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Click on the "Notification Types" tab
    const notificationTypesTab = screen.getByTestId('tab-types');
    fireEvent.click(notificationTypesTab);
    
    // Check that trade notification settings are visible
    await waitFor(() => {
      expect(screen.getByText('Trade Notifications')).toBeInTheDocument();
      expect(screen.getByText('Trade Proposals')).toBeInTheDocument();
      expect(screen.getByText('Accepted Trades')).toBeInTheDocument();
      expect(screen.getByText('Communication Notifications')).toBeInTheDocument();
      expect(screen.getByText('New Messages')).toBeInTheDocument();
    });
  });
  
  test('saves preferences when save button is clicked', async () => {
    renderWithProviders(<NotificationSettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Toggle a setting
    const switches = screen.getAllByTestId('switch');
    const emailSwitch = switches[0];
    fireEvent.click(emailSwitch);
    
    // Find and click save button
    const saveButton = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(saveButton);
      // Check that upsert was called for both tables
    await waitFor(() => {
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('email_preferences');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('notification_channel_preferences');
      expect(mockUpsert).toHaveBeenCalledTimes(2);
    });
    
    // Check for success message
    expect(screen.getByText('Your notification preferences have been saved!')).toBeInTheDocument();
  });
    test('shows error message when settings fail to save', async () => {
    // Set up error for update
    mockUpdateError = new Error('Failed to save settings');
    
    renderWithProviders(<NotificationSettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Find and click save button
    const saveButton = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(saveButton);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to save your preferences. Please try again.')).toBeInTheDocument();
    });
  });  test('shows loading state initially', () => {
    // Create a new mock that doesn't resolve
    const neverResolvingMock = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => new Promise(() => {})) // Never resolves
          }))
        })),
        upsert: jest.fn(() => Promise.resolve({ error: null }))
      }))
    };
    
    // Temporarily override the mock
    mockUseSupabase.mockReturnValueOnce({
      user: { 
        id: 'test-user-id',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: '',
        email: 'test@example.com'
      },
      supabase: neverResolvingMock as any,
      session: null,
      isLoading: false,
      isVerified: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn()
    } as any);
    
    renderWithProviders(<NotificationSettingsPage />);
    
    // Should show loading spinner (the component uses Spinner, not "Loading..." text)
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
  
  test('handles missing preferences gracefully', async () => {
    // Set up null data responses
    mockEmailPrefData = null;
    mockChannelPrefData = null;
    
    renderWithProviders(<NotificationSettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });
    
    // Should still render with default values
    expect(screen.getByText('Notification Channels')).toBeInTheDocument();
  });
});
