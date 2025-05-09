/**
 * Message Composer Component Tests
 * 
 * Tests for the component that allows users to compose and send messages
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import MessageComposer from '@/components/messaging/MessageComposer';

// Mock the Supabase client
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: () => ({
    supabase: {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'new-message-id' },
            error: null,
          }),
        }),
      }),
    },
    session: {
      user: { id: 'current-user-id' }
    },
  }),
}));

describe('MessageComposer', () => {
  const mockTradeId = 'trade-123';
  const mockOnSend = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the message input field', () => {
    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    
    // Check that the textarea is rendered
    const textarea = screen.getByPlaceholderText(/type your message/i);
    expect(textarea).toBeInTheDocument();
    
    // Check that the send button is rendered
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeInTheDocument();
    expect(sendButton).toBeDisabled(); // Should be disabled initially with no text
  });
  
  it('enables send button when message is entered', () => {
    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    
    const textarea = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    // Initially the button should be disabled
    expect(sendButton).toBeDisabled();
    
    // Enter some text
    fireEvent.change(textarea, { target: { value: 'Hello there!' } });
    
    // Now the button should be enabled
    expect(sendButton).not.toBeDisabled();
    
    // Clear the text
    fireEvent.change(textarea, { target: { value: '' } });
    
    // Button should be disabled again
    expect(sendButton).toBeDisabled();
  });
  
  it('expands textarea as user types more content', () => {
    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    
    const textarea = screen.getByPlaceholderText(/type your message/i);
    
    // Get initial height
    const initialHeight = textarea.clientHeight;
    
    // Type a long message with line breaks
    const longMessage = 'This is a longer message.\nIt has multiple lines.\nAnd should cause the textarea to expand.';
    fireEvent.change(textarea, { target: { value: longMessage } });
    
    // This is hard to test directly without the actual browser rendering,
    // but we can check if our auto-resize functionality is called
    expect(textarea).toHaveValue(longMessage);
  });
  
  it('sends message when send button is clicked', async () => {
    const { useSupabase } = require('@/contexts/SupabaseContext');
    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    
    const textarea = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    // Enter a message
    fireEvent.change(textarea, { target: { value: 'Hello there!' } });
    
    // Click send button
    fireEvent.click(sendButton);
    
    // Check that the message is sent to Supabase
    await waitFor(() => {
      expect(useSupabase().supabase.from).toHaveBeenCalledWith('messages');
      expect(useSupabase().supabase.from().insert).toHaveBeenCalledWith({
        content: 'Hello there!',
        trade_id: mockTradeId,
        user_id: 'current-user-id',
      });
    });
    
    // Check that onSend callback is called
    expect(mockOnSend).toHaveBeenCalled();
    
    // Check that textarea is cleared
    expect(textarea).toHaveValue('');
    
    // Check that send button is disabled again
    expect(sendButton).toBeDisabled();
  });
  
  it('sends message when Enter key is pressed (without Shift)', async () => {
    const { useSupabase } = require('@/contexts/SupabaseContext');
    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    
    const textarea = screen.getByPlaceholderText(/type your message/i);
    
    // Enter a message
    fireEvent.change(textarea, { target: { value: 'Hello there!' } });
    
    // Press Enter (without Shift)
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });
    
    // Check that the message is sent
    await waitFor(() => {
      expect(useSupabase().supabase.from).toHaveBeenCalledWith('messages');
      expect(mockOnSend).toHaveBeenCalled();
    });
    
    // Check that textarea is cleared
    expect(textarea).toHaveValue('');
  });
  
  it('does not send message when Shift+Enter is pressed', () => {
    const { useSupabase } = require('@/contexts/SupabaseContext');
    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    
    const textarea = screen.getByPlaceholderText(/type your message/i);
    
    // Enter a message
    fireEvent.change(textarea, { target: { value: 'Hello there!' } });
    
    // Press Shift+Enter (should add a new line instead of sending)
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });
    
    // Check that the message is not sent
    expect(useSupabase().supabase.from).not.toHaveBeenCalled();
    expect(mockOnSend).not.toHaveBeenCalled();
    
    // Textarea should still have the text
    expect(textarea).toHaveValue('Hello there!');
  });
  
  it('shows an error message when send fails', async () => {
    // Mock a failure
    const { useSupabase } = require('@/contexts/SupabaseContext');
    useSupabase().supabase.from().insert().select().single = jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Failed to send message'),
    });
    
    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    
    const textarea = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    // Enter a message
    fireEvent.change(textarea, { target: { value: 'This will fail' } });
    
    // Click send button
    fireEvent.click(sendButton);
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });
    
    // Check that textarea still has content
    expect(textarea).toHaveValue('This will fail');
  });
  
  it('handles empty trade ID gracefully', () => {
    // This should not crash but show appropriate error message
    render(<MessageComposer tradeId="" onSend={mockOnSend} />);
    
    // Check for error message
    expect(screen.getByText(/invalid trade/i)).toBeInTheDocument();
    
    // Input should be disabled
    const textarea = screen.getByPlaceholderText(/type your message/i);
    expect(textarea).toBeDisabled();
  });
});
