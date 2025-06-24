import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { formatRelativeTime } from '@/lib/utils/formatters';
import type { Skill } from '@/types/supabase';

interface Conversation {
  id: string;
  trade_title: string;
  last_message_at: string;
  last_message: string;
  unread_count: number;
  other_user: { id: string; full_name: string; profile_image_url: string };
  offered_skill: Skill;
  requested_skill: Skill;
}

interface ConversationListProps {
  conversations?: Conversation[];
  activeTradeId?: string;
  isLoading?: boolean;
  onConversationSelect?: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations = [], 
  activeTradeId,
  isLoading = false,
  onConversationSelect
}) => {
  const router = useRouter();

  // Sort conversations by last message time (most recent first)
  const sortedConversations = [...conversations].sort((a, b) => 
    new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
  );

  const handleConversationClick = (conversation: Conversation) => {
    // Navigate to the conversation
    router.push(`/messages/${conversation.id}`);
    
    // Call the optional callback
    if (onConversationSelect) {
      onConversationSelect(conversation);
    }
  };

  if (isLoading) {
    return (
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, index) => (
          <div key={index} data-testid={`skeleton-${index}`} className="p-4 animate-pulse">
            <div className="flex space-x-3">
              <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-lg font-medium">No conversations yet</div>
        <div className="text-sm mt-1">Start trading to begin messaging</div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {sortedConversations.map((conversation) => (
        <div
          key={conversation.id}
          data-testid={`conversation-item-${conversation.id}`}
          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
            activeTradeId === conversation.id ? 'active bg-blue-50 border-r-2 border-blue-500' : ''
          }`}
          onClick={() => handleConversationClick(conversation)}
        >
          <div className="flex space-x-3">
            <div className="flex-shrink-0">              {conversation.other_user.profile_image_url ? (
                <Image
                  src={conversation.other_user.profile_image_url}
                  alt={conversation.other_user.full_name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                  {conversation.other_user.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {conversation.trade_title}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(conversation.last_message_at)}
                  </p>                  {conversation.unread_count > 0 && (
                    <span className="unread-badge inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 truncate mt-1">
                <span className="font-medium">{conversation.other_user.full_name}:</span>{' '}
                {conversation.last_message}
              </p>
              
              <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                <span>{conversation.offered_skill.title}</span>
                <span>↔</span>
                <span>{conversation.requested_skill.title}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
