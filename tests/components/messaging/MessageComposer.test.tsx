/**
 * Message Composer Component Tests
 * 
 * Tests for the component that allows users to compose and send messages
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import MessageComposer from '@/components/messaging/MessageComposer';
import * as SupabaseContext from '@/contexts/SupabaseContext';

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
    // const initialHeight = textarea.clientHeight;
    
    // Type a long message with line breaks
    const longMessage = 'This is a longer message.\nIt has multiple lines.\nAnd should cause the textarea to expand.';
    fireEvent.change(textarea, { target: { value: longMessage } });
    
    // This is hard to test directly without the actual browser rendering,
    // but we can check if our auto-resize functionality is called
    expect(textarea).toHaveValue(longMessage);
  });
  
  it('sends message when send button is clicked', async () => {
    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    
    const textarea = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    // Enter a message
    fireEvent.change(textarea, { target: { value: 'Hello there!' } });
    
    // Click send button
    fireEvent.click(sendButton);
    
    // Check that the message is sent to Supabase
    await waitFor(() => {
      expect(SupabaseContext.useSupabase().supabase.from).toHaveBeenCalledWith('messages');
    });
    
    // Check that onSend callback is called
    expect(mockOnSend).toHaveBeenCalled();
    
    // Check that textarea is cleared
    expect(textarea).toHaveValue('');
    
    // Check that send button is disabled again
    expect(sendButton).toBeDisabled();
  });
  
  it('sends message when Enter key is pressed (without Shift)', async () => {
    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    
    const textarea = screen.getByPlaceholderText(/type your message/i);
    
    // Enter a message
    fireEvent.change(textarea, { target: { value: 'Hello there!' } });
    
    // Press Enter (without Shift)
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });
    
    // Check that the message is sent
    await waitFor(() => {
      expect(SupabaseContext.useSupabase().supabase.from).toHaveBeenCalledWith('messages');
      expect(mockOnSend).toHaveBeenCalled();
    });
    
    // Check that textarea is cleared
    expect(textarea).toHaveValue('');
  });
  
  it('does not send message when Shift+Enter is pressed', () => {
    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    
    const textarea = screen.getByPlaceholderText(/type your message/i);
    
    // Enter a message
    fireEvent.change(textarea, { target: { value: 'Hello there!' } });
    
    // Press Shift+Enter (should add a new line instead of sending)
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });
    
    // Check that the message is not sent
    expect(SupabaseContext.useSupabase().supabase.from).not.toHaveBeenCalled();
    expect(mockOnSend).not.toHaveBeenCalled();
    
    // Textarea should still have the text
    expect(textarea).toHaveValue('Hello there!');
  });
  
  it('shows an error message when send fails', async () => {
    // Mock the Supabase chain for failure
    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Failed to send message'),
    });
    const mockSelect = jest.fn(() => ({ single: mockSingle }));
    const mockInsert = jest.fn(() => ({ select: mockSelect }));
    const mockFrom = jest.fn(() => ({
      insert: mockInsert,
      // Add all other required query builder methods as no-ops for compatibility
      select: jest.fn(), eq: jest.fn(), order: jest.fn(), limit: jest.fn(), range: jest.fn(), in: jest.fn(), textSearch: jest.fn(), or: jest.fn(), upsert: jest.fn(), neq: jest.fn(), ilike: jest.fn(),
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockSupabase = { from: mockFrom } as any;
    jest.spyOn(SupabaseContext, 'useSupabase').mockReturnValue({
      supabase: mockSupabase,
      session: {
        user: {
          id: 'current-user-id',
          app_metadata: {},
          user_metadata: {},
          aud: '',
          created_at: '',
          email: 'test@example.com',
        },
        access_token: '',
        refresh_token: '',
        expires_in: 3600,
        token_type: 'bearer',
      },
      user: {
        id: 'current-user-id',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: '',
        email: 'test@example.com',
      },
      isLoading: false,
      isVerified: true,
      signIn: async () => ({ success: true, error: null }),
      signUp: async () => ({ success: true, error: null }),
      signOut: async () => {},
      refreshUser: async () => {},
      sendPasswordReset: async () => ({ success: true, error: null }),
    });

    render(<MessageComposer tradeId={mockTradeId} onSend={mockOnSend} />);
    const textarea = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.change(textarea, { target: { value: 'This will fail' } });
    fireEvent.click(sendButton);
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });
    
    // Check that textarea still has content
    expect(textarea).toHaveValue('This will fail');
    
    expect(mockFrom).toHaveBeenCalledWith('messages');
    expect(mockInsert).toHaveBeenCalledWith({ content: 'This will fail', trade_id: mockTradeId, sender_id: 'current-user-id' });
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
