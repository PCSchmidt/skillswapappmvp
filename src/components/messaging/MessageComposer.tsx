import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';

interface MessageComposerProps {
  tradeId?: string;
  onSend?: (message: string) => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ tradeId, onSend }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { supabase, user } = useSupabase();

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message, adjustTextareaHeight]);

  // Handle message input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setError(null); // Clear any previous error
  };

  // Send message function
  const sendMessage = useCallback(async () => {
    if (!message.trim() || !tradeId || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          content: message.trim(),
          trade_id: tradeId,
          sender_id: user.id,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Success - clear message and call onSend callback
      setMessage('');
      if (onSend) {
        onSend(message.trim());
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [message, tradeId, user, supabase, onSend]);

  // Handle key press events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle send button click
  const handleSendClick = () => {
    sendMessage();
  };

  // Check if send should be disabled
  const isSendDisabled = !message.trim() || isLoading || !tradeId || !user;

  // Show error if trade ID is invalid
  if (!tradeId) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 border-red-200">
        <p className="text-red-600">Invalid trade ID provided</p>
        <textarea
          placeholder="Type your message..."
          disabled
          className="w-full p-3 border rounded-lg resize-none opacity-50"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex space-x-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 p-3 border rounded-lg resize-none min-h-[40px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
          rows={1}
        />
        
        <button
          onClick={handleSendClick}
          disabled={isSendDisabled}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isSendDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default MessageComposer;
