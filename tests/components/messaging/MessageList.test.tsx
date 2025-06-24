/**
 * Message List Component Tests
 * 
 * Tests for the component that displays a list of messages in a conversation
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import MessageList from '@/components/messaging/MessageList';

// Mock scrollIntoView since it's not available in JSDOM
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

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
  default: ({ user, size }: { user?: { full_name?: string }; size?: string }) => (
    <div data-testid="avatar-mock">
      Avatar for {user?.full_name || 'Unknown'} (size: {size})
    </div>
  ),
}));

// Mock the formatRelativeTime utility
jest.mock('@/lib/utils/formatters', () => ({
  formatRelativeTime: () => '2 hours ago',
}));

describe('MessageList', () => {
  const mockMessages = [
    {
      id: 'msg-1',
      content: 'Hello, I\'m interested in your web development skills',
      created_at: '2025-05-01T14:00:00.000Z',
      user_id: 'other-user-id',
      trade_id: 'trade-123',
      is_read: true,
      users: {
        id: 'other-user-id',
        full_name: 'Jane Doe',
        profile_image_url: 'https://example.com/avatar1.jpg'
      }
    },
    {
      id: 'msg-2',
      content: 'I can teach you React and Next.js',
      created_at: '2025-05-01T14:05:00.000Z',
      user_id: 'current-user-id',
      trade_id: 'trade-123',
      is_read: true,
      users: {
        id: 'current-user-id',
        full_name: 'John Smith',
        profile_image_url: 'https://example.com/avatar2.jpg'
      }
    },
    {
      id: 'msg-3',
      content: 'That sounds great! When are you available?',
      created_at: '2025-05-01T14:10:00.000Z',
      user_id: 'other-user-id',
      trade_id: 'trade-123',
      is_read: false,
      users: {
        id: 'other-user-id',
        full_name: 'Jane Doe',
        profile_image_url: 'https://example.com/avatar1.jpg'
      }
    }
  ];

  it('renders messages correctly', () => {
    render(<MessageList messages={mockMessages} tradeId="trade-123" />);
    
    // Check that all messages are rendered
    expect(screen.getByText('Hello, I\'m interested in your web development skills')).toBeInTheDocument();
    expect(screen.getByText('I can teach you React and Next.js')).toBeInTheDocument();
    expect(screen.getByText('That sounds great! When are you available?')).toBeInTheDocument();    // Check that all avatars are rendered as images
    const avatarImages = screen.getAllByRole('img');
    expect(avatarImages).toHaveLength(3);
      // Check that timestamps are rendered (actual time format)
    const timestamps = screen.getAllByText(/\d{1,2}:\d{2}:\d{2}\s(AM|PM)/);
    expect(timestamps).toHaveLength(3);    // Verify message containers exist and check message rendering
    screen.getAllByTestId(/message-content-/); // Verify all message containers exist
    const senderMessage = screen.getByTestId('message-content-msg-2');
    expect(senderMessage).toBeInTheDocument();
      // Verify receiver's messages are rendered
    const receiverMessage1 = screen.getByTestId('message-content-msg-1');
    const receiverMessage2 = screen.getByTestId('message-content-msg-3');
    expect(receiverMessage1).toBeInTheDocument();
    expect(receiverMessage2).toBeInTheDocument();
  });
  
  it('renders empty state when no messages', () => {
    render(<MessageList messages={[]} tradeId="trade-123" />);
    
    // Check that empty state message is displayed
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
    expect(screen.getByText(/start the conversation/i)).toBeInTheDocument();
  });
  
  it('renders loading state correctly', () => {
    render(<MessageList messages={mockMessages} tradeId="trade-123" isLoading={true} />);
    
    // Check for loading indicators
    const skeletons = screen.getAllByTestId(/loading-skeleton/);
    expect(skeletons.length).toBeGreaterThan(0);
    
    // Messages should not be visible during loading
    expect(screen.queryByText('Hello, I\'m interested in your web development skills')).not.toBeInTheDocument();
  });
  
  it('scrolls to bottom on new message', () => {
    // Mock scrollIntoView
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    
    // First render with 2 messages
    const { rerender } = render(
      <MessageList 
        messages={mockMessages.slice(0, 2)} 
        tradeId="trade-123" 
      />
    );
    
    // Verify scrollIntoView was called once
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    
    // Reset the mock
    scrollIntoViewMock.mockReset();
    
    // Rerender with 3 messages (added a new one)
    rerender(
      <MessageList 
        messages={mockMessages} 
        tradeId="trade-123" 
      />
    );
    
    // Verify scrollIntoView was called again    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    
    // Cleanup by removing the mock
    (Element.prototype.scrollIntoView as jest.Mock).mockRestore?.();
  });
  
  it('handles message click events', () => {
    const handleMessageClick = jest.fn();
    
    render(
      <MessageList 
        messages={mockMessages} 
        tradeId="trade-123" 
        onMessageClick={handleMessageClick} 
      />
    );
    
    // Click on a message
    fireEvent.click(screen.getByText('Hello, I\'m interested in your web development skills'));
    
    // Verify the click handler was called with the correct message
    expect(handleMessageClick).toHaveBeenCalledWith(mockMessages[0]);
  });
  
  it('shows unread status for messages', () => {
    render(<MessageList messages={mockMessages} tradeId="trade-123" />);
    
    // The third message is unread and should have an indicator
    const unreadMessage = screen.getByTestId('message-content-msg-3');
    expect(unreadMessage).toHaveClass('unread');
    
    // The first two messages are read and should not have an indicator
    const readMessage1 = screen.getByTestId('message-content-msg-1');
    const readMessage2 = screen.getByTestId('message-content-msg-2');
    expect(readMessage1).not.toHaveClass('unread');
    expect(readMessage2).not.toHaveClass('unread');
  });
});
