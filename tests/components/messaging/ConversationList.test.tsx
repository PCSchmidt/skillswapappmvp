/**
 * Conversation List Component Tests
 * 
 * Tests for the component that displays a list of user's conversations
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import ConversationList from '@/components/messaging/ConversationList';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock the Supabase context
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: () => ({
    session: {
      user: { id: 'current-user-id' }
    }
  }),
}));

// Mock the Avatar component
jest.mock('@/components/shared/Avatar', () => ({
  __esModule: true,
  default: ({ user, size }: any) => (
    <div data-testid="avatar-mock">
      Avatar for {user?.full_name || 'Unknown'} (size: {size})
    </div>
  ),
}));

// Mock the formatRelativeTime utility
jest.mock('@/lib/utils/formatters', () => ({
  formatRelativeTime: (date: string) => '2 hours ago',
}));

describe('ConversationList', () => {
  const mockConversations = [
    {
      id: 'trade-123',
      trade_title: 'Web Development for Guitar Lessons',
      last_message_at: '2025-05-01T14:10:00.000Z',
      last_message: 'That sounds great! When are you available?',
      unread_count: 2,
      other_user: {
        id: 'user-456',
        full_name: 'Jane Doe',
        profile_image_url: 'https://example.com/avatar1.jpg'
      },
      offered_skill: {
        title: 'Web Development'
      },
      requested_skill: {
        title: 'Guitar Lessons'
      }
    },
    {
      id: 'trade-456',
      trade_title: 'Yoga Sessions for Cooking Classes',
      last_message_at: '2025-04-30T09:15:00.000Z',
      last_message: 'I can teach you how to make pasta from scratch',
      unread_count: 0,
      other_user: {
        id: 'user-789',
        full_name: 'Bob Smith',
        profile_image_url: 'https://example.com/avatar2.jpg'
      },
      offered_skill: {
        title: 'Yoga Sessions'
      },
      requested_skill: {
        title: 'Cooking Classes'
      }
    }
  ];

  it('renders conversations correctly', () => {
    render(<ConversationList conversations={mockConversations} />);
    
    // Check that all conversation items are rendered
    expect(screen.getByText('Web Development for Guitar Lessons')).toBeInTheDocument();
    expect(screen.getByText('Yoga Sessions for Cooking Classes')).toBeInTheDocument();
    
    // Check that avatars are shown
    expect(screen.getAllByTestId('avatar-mock')).toHaveLength(2);
    
    // Check that last messages are displayed
    expect(screen.getByText('That sounds great! When are you available?')).toBeInTheDocument();
    expect(screen.getByText('I can teach you how to make pasta from scratch')).toBeInTheDocument();
    
    // Check that timestamps are shown
    expect(screen.getAllByText('2 hours ago')).toHaveLength(2);
    
    // Check for unread indicators
    const unreadBadge = screen.getByText('2');
    expect(unreadBadge).toBeInTheDocument();
    expect(unreadBadge).toHaveClass('unread-badge');
  });
  
  it('renders empty state when no conversations', () => {
    render(<ConversationList conversations={[]} />);
    
    // Check for empty state message
    expect(screen.getByText(/no conversations yet/i)).toBeInTheDocument();
    expect(screen.getByText(/start trading to begin messaging/i)).toBeInTheDocument();
  });
  
  it('navigates to conversation when clicked', () => {
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<ConversationList conversations={mockConversations} />);
    
    // Click on a conversation
    fireEvent.click(screen.getByText('Web Development for Guitar Lessons'));
    
    // Check that router.push was called with the correct URL
    expect(mockPush).toHaveBeenCalledWith('/messages/trade-123');
  });
  
  it('highlights active conversation', () => {
    render(<ConversationList conversations={mockConversations} activeTradeId="trade-123" />);
    
    // The active conversation should have a special class
    const conversationItems = screen.getAllByTestId(/conversation-item-/);
    const activeItem = screen.getByTestId('conversation-item-trade-123');
    
    expect(activeItem).toHaveClass('active');
    
    // The other conversation should not be active
    const inactiveItem = screen.getByTestId('conversation-item-trade-456');
    expect(inactiveItem).not.toHaveClass('active');
  });
  
  it('shows loading skeleton during loading state', () => {
    render(<ConversationList isLoading={true} />);
    
    // Check for loading indicators
    const skeletons = screen.getAllByTestId(/skeleton-/);
    expect(skeletons.length).toBeGreaterThan(0);
    
    // No conversation content should be visible
    expect(screen.queryByText('Web Development for Guitar Lessons')).not.toBeInTheDocument();
  });
  
  it('sorts conversations by last message time', () => {
    // Create reversed order conversations to test sorting
    const reversedConversations = [...mockConversations].reverse();
    
    render(<ConversationList conversations={reversedConversations} />);
    
    // Get all conversation items
    const conversationItems = screen.getAllByTestId(/conversation-item-/);
    
    // The first item should be the most recent one (trade-123)
    expect(conversationItems[0]).toHaveAttribute('data-testid', 'conversation-item-trade-123');
    
    // The second item should be the older one (trade-456)
    expect(conversationItems[1]).toHaveAttribute('data-testid', 'conversation-item-trade-456');
  });
  
  it('calls onConversationSelect when conversation is clicked', () => {
    const handleSelect = jest.fn();
    
    render(
      <ConversationList 
        conversations={mockConversations} 
        onConversationSelect={handleSelect} 
      />
    );
    
    // Click on a conversation
    fireEvent.click(screen.getByText('Web Development for Guitar Lessons'));
    
    // Check that the handler was called with the correct conversation
    expect(handleSelect).toHaveBeenCalledWith(mockConversations[0]);
  });
});
