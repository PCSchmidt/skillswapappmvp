/**
 * ChatWindow Component
 * 
 * This component provides a complete chat interface for a specific trade,
 * combining the message list and composer.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';
import MessageComposer from './MessageComposer';
import MessageItem from './MessageItem';

type MessageWithUser = Database['public']['Tables']['messages']['Row'] & {
  sender?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
  } | null;
};

interface ChatWindowProps {
  tradeId: string;
  otherUserId: string;
  otherUserName: string;
}

export default function ChatWindow({ tradeId, otherUserId, otherUserName }: ChatWindowProps) {
  const { supabase, user } = useSupabase();
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
    // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, full_name, profile_image_url)
        `)
        .eq('trade_id', tradeId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages((data as MessageWithUser[]) || []);
      
      // Mark messages as read
      const messagesToUpdate = (data as MessageWithUser[])?.filter((msg: MessageWithUser) => 
        msg.receiver_id === user.id && !msg.is_read
      ) || [];      if (messagesToUpdate.length > 0) {
        // Mark each message as read individually to avoid query chaining issues
        for (const message of messagesToUpdate) {
          const { error: updateError } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', message.id);
          
          if (updateError) {
            console.error('Error marking message as read:', updateError);
          }
        }
      }
        } catch (err: unknown) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [user, supabase, tradeId]);
  
  // Initial load
  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('messages_channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `trade_id=eq.${tradeId}`
      }, (payload) => {
        // Fetch the complete message with user data
        const fetchNewMessage = async () => {
          const { data, error } = await supabase
            .from('messages')
            .select(`
              *,
              sender:sender_id(id, full_name, profile_image_url)
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (!error && data) {
            setMessages(prevMessages => [...prevMessages, data]);
            
            // Mark as read if current user is the receiver
            if (data.receiver_id === user?.id && !data.is_read) {
              await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', data.id);
            }
          }
        };
        
        fetchNewMessage();
      })
      .subscribe();
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, tradeId, user, fetchMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle message sent - refresh the list
  const handleMessageSent = () => {
    // The real-time subscription will handle new messages
    // But we can trigger a full refresh if needed
    // fetchMessages();
  };
  
  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50 p-4">
        <div className="spinner mb-4"></div>
        <p className="text-gray-700">Loading messages...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50 p-4">
        <div className="text-error-600 text-5xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load messages</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchMessages();
          }}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Chat with {otherUserName || 'User'}
        </h2>
      </div>
      
      {/* Messages area */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-500">
              Send a message to start the conversation about this trade.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.sender_id === user?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message composer */}
      <MessageComposer 
        tradeId={tradeId}
        receiverId={otherUserId}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}
