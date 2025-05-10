/**
 * MessageSystem.tsx
 * Handles the messaging functionality between users for skill exchanges
 */

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { Message, UserProfile } from '@/types';

interface MessageSystemProps {
  exchangeId: string;
  otherUser: UserProfile;
  currentUserId: string;
}

const MessageSystem: React.FC<MessageSystemProps> = ({
  exchangeId,
  otherUser,
  currentUserId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demonstration - will be replaced with API calls
  const MOCK_MESSAGES = [
    {
      id: 'msg1',
      exchange_id: exchangeId,
      sender_id: otherUser.id,
      recipient_id: currentUserId,
      content: "Hi there! I saw you were interested in learning React. I'd be happy to help!",
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: 'msg2',
      exchange_id: exchangeId,
      sender_id: currentUserId,
      recipient_id: otherUser.id,
      content: "Yes, I'm looking to improve my skills with React hooks and context. When would you be available?",
      is_read: true,
      created_at: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
    },
    {
      id: 'msg3',
      exchange_id: exchangeId,
      sender_id: otherUser.id,
      recipient_id: currentUserId,
      content: 'I could do a video call this weekend, maybe Saturday afternoon? We could go through some practical examples.',
      is_read: true,
      created_at: new Date(Date.now() - 79200000).toISOString(), // 22 hours ago
    },
  ];

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // In a real app, this would be an API call to fetch messages
        // For now, simulate API call with mock data and timeout
    setTimeout(() => {
      setMessages(MOCK_MESSAGES);
      setIsLoading(false);
    }, 1000);
        
        // Mark messages as read (would be an API call in real app)
        // markMessagesAsRead(exchangeId, currentUserId);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [exchangeId, currentUserId]);

  // Scroll to bottom of messages on load and when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, MOCK_MESSAGES]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    
    try {
      // In a real app, this would be an API call to save the message
      // For now, simulate API call with timeout
      const newMsg: Message = {
        id: `msg${Date.now()}`,
        exchange_id: exchangeId,
        sender_id: currentUserId,
        recipient_id: otherUser.id,
        content: newMessage.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error toast or notification
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
             ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full justify-center items-center p-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white rounded-t-lg">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
          {otherUser.avatar_url ? (
            <Image src={otherUser.avatar_url} alt={otherUser.username || 'User'} width={40} height={40} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-600 font-medium">{(otherUser.username || 'User').charAt(0)}</span>
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-medium">{otherUser.username || 'User'}</h3>
          <div className="text-xs text-green-600 flex items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
            Online
          </div>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender_id === currentUserId 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border rounded-bl-none'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div 
                  className={`text-xs mt-1 ${
                    message.sender_id === currentUserId ? 'text-blue-200' : 'text-gray-500'
                  }`}
                >
                  {formatMessageDate(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t rounded-b-lg">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSending}
          />
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors ${
              isSending ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isSending}
          >
            {isSending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending
              </span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageSystem;
