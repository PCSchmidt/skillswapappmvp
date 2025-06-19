import React from 'react';

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
  onMessageClick?: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = () => <div>MessageList placeholder</div>;
export default MessageList;
