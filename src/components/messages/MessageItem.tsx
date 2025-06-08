/**
 * MessageItem Component
 * 
 * This component displays an individual message in a conversation.
 * It handles different message styles for sent vs received messages.
 */

import Image from 'next/image';
import React from 'react';
import { Database } from '@/types/supabase';

type MessageWithUser = Database['public']['Tables']['messages']['Row'] & {
  sender?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
  } | null;
};

interface MessageItemProps {
  message: MessageWithUser;
  isCurrentUser: boolean;
}

export default function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  // Format the timestamp
  const formatTimeAgo = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} days ago`;
    
    // Format as a date for older messages
    return date.toLocaleDateString();
  };
  
  const formattedTime = message.created_at ? formatTimeAgo(message.created_at) : '';
  
  // Determine the sender name
  const senderName = message.sender?.full_name || 'Unknown User';
  
  // Handle attachment display if present
  const hasAttachment = !!message.attachment_url;
  
  return (
    <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for received messages */}
      {!isCurrentUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200">
            {message.sender?.profile_image_url ? (
              <Image
                src={message.sender.profile_image_url}
                alt={senderName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-semibold">
                {senderName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Message bubble */}
      <div className={`flex flex-col max-w-[75%]`}>
        {/* Sender name for received messages */}
        {!isCurrentUser && (
          <span className="text-xs text-gray-500 mb-1">{senderName}</span>
        )}
        
        {/* Message content */}
        <div className={`px-4 py-2 rounded-lg ${isCurrentUser 
          ? 'bg-primary-500 text-white rounded-tr-none' 
          : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
          <p className="text-sm">{message.content}</p>
          
          {/* Attachment if available */}
          {hasAttachment && (
            <div className="mt-2">
              {message.attachment_type?.startsWith('image/') ? (
                <div className="relative h-32 w-full rounded overflow-hidden">
                  <Image
                    src={message.attachment_url || ''}
                    alt="Attachment"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <a
                  href={message.attachment_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 bg-gray-50 rounded border border-gray-200 text-sm text-primary-600 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Attachment
                </a>
              )}
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <span className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
