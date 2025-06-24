import React, { useEffect, useRef } from 'react';

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  trade_id: string;
  is_read: boolean;
  users: { id: string; full_name: string; profile_image_url: string };
}

interface MessageListProps {
  messages?: Message[];
  tradeId?: string;
  isLoading?: boolean;
  onMessageClick?: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages = [], isLoading = false, onMessageClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} data-testid="loading-skeleton" className="animate-pulse">
            <div className="flex space-x-3">
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-lg font-medium">No messages yet</div>
        <div className="text-sm">Start the conversation</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => (
        <div 
          key={message.id}
          data-testid={`message-content-${message.id}`}
          className={`flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded ${
            !message.is_read ? 'unread bg-blue-50' : ''
          }`}
          onClick={() => onMessageClick?.(message)}
        >
          <div className="flex-shrink-0">
            {message.users.profile_image_url ? (
              <img 
                src={message.users.profile_image_url} 
                alt={message.users.full_name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                {message.users.full_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {message.users.full_name}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(message.created_at).toLocaleTimeString()}
              </p>
            </div>
            <p className="text-sm text-gray-700 mt-1">{message.content}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
