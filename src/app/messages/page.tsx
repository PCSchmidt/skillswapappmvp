/**
 * Messages Listing Page
 * 
 * This page displays all conversations the user is participating in,
 * organized by trade.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';

type ConversationSummary = {
  tradeId: string;
  otherUserId: string;
  otherUserName: string | null;
  otherUserImage: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
  status: string;
  skillOfferedTitle: string | null;
  skillRequestedTitle: string | null;
  isUserProposer: boolean;
};

export default function MessagesPage() {
  const router = useRouter();
  const { supabase, user, isLoading } = useSupabase();
  
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        // Step 1: Get all trades the user is involved in
        const { data: trades, error: tradesError } = await supabase
          .from('trades')
          .select(`
            id,
            status,
            proposer_id,
            receiver_id,
            skill_offered:skill_offered_id(id, title),
            skill_requested:skill_requested_id(id, title),
            proposer:proposer_id(id, full_name, profile_image_url),
            receiver:receiver_id(id, full_name, profile_image_url)
          `)
          .or(`proposer_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });
        
        if (tradesError) throw tradesError;
        
        if (!trades || trades.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }
        
        // Step 2: For each trade, get the last message and unread count
        const conversationPromises = trades.map(async (trade) => {
          const isUserProposer = trade.proposer_id === user.id;
          const otherUserId = isUserProposer ? trade.receiver_id : trade.proposer_id;
          const otherUser = isUserProposer ? trade.receiver : trade.proposer;
          
          try {
            // Get the last message
            const { data: lastMessageData } = await supabase
              .from('messages')
              .select('*')
              .eq('trade_id', trade.id)
              .order('created_at', { ascending: false })
              .limit(1);
            
            const lastMessage = lastMessageData && lastMessageData.length > 0 ? lastMessageData[0] : null;
            
            // Get unread count
            const { count: unreadCount } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('trade_id', trade.id)
              .eq('receiver_id', user.id)
              .eq('is_read', false);
            
            return {
              tradeId: trade.id,
              otherUserId,
              otherUserName: otherUser ? (otherUser.full_name || 'User') : 'User',
              otherUserImage: otherUser ? otherUser.profile_image_url : null,
              lastMessage: lastMessage ? lastMessage.content : null,
              lastMessageTime: lastMessage ? lastMessage.created_at : null,
              unreadCount: unreadCount || 0,
              status: trade.status || 'unknown',
              skillOfferedTitle: trade.skill_offered ? trade.skill_offered.title : null,
              skillRequestedTitle: trade.skill_requested ? trade.skill_requested.title : null,
              isUserProposer
            };
          } catch (err) {
            console.error(`Error processing trade ${trade.id}:`, err);
            // Return a minimal object if we encounter an error for this trade
            return {
              tradeId: trade.id,
              otherUserId: otherUserId || '',
              otherUserName: 'User',
              otherUserImage: null,
              lastMessage: null,
              lastMessageTime: null,
              unreadCount: 0,
              status: trade.status || 'unknown',
              skillOfferedTitle: 'Unknown skill',
              skillRequestedTitle: 'Unknown skill',
              isUserProposer
            };
          }
        });
        
        const results = await Promise.all(conversationPromises);
        setConversations(results);
        
      } catch (err: any) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchConversations();
    }
  }, [supabase, user]);
  
  // Format timestamp
  const formatTimeAgo = (dateString: string | null): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    // Less than a minute
    if (diffSec < 60) return 'just now';
    
    // Less than an hour
    if (diffSec < 3600) {
      const mins = Math.floor(diffSec / 60);
      return `${mins} min${mins !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diffSec < 86400) {
      const hours = Math.floor(diffSec / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    if (diffSec < 604800) {
      const days = Math.floor(diffSec / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'proposed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'declined':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading your messages...</p>
        </div>
      </div>
    );
  }
  
  // Show unauthorized state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-error-600 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            Please login to view your messages.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Messages</h1>
          <p className="mt-2 text-sm text-gray-500">
            Conversations for your skill exchanges
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-md">
            {error}
          </div>
        )}
        
        {/* Conversations list */}
        {conversations.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-500 mb-6">
              Start a trade to begin messaging with other users.
            </p>
            <Link href="/skills/browse" className="btn btn-primary">
              Browse Skills
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {conversations.map((convo) => (
                <li key={convo.tradeId}>
                  <Link href={`/messages/${convo.tradeId}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        {/* User avatar */}
                        <div className="flex-shrink-0 relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                          {convo.otherUserImage ? (
                            <Image
                              src={convo.otherUserImage}
                              alt={convo.otherUserName || 'User'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-semibold">
                              {(convo.otherUserName || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          
                          {/* Unread indicator */}
                          {convo.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                              {convo.unreadCount > 9 ? '9+' : convo.unreadCount}
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-primary-600 truncate">
                              {convo.otherUserName}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(convo.status)}`}>
                                {convo.status.charAt(0).toUpperCase() + convo.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <p className="truncate">
                                <span className="font-medium">Trade: </span>
                                {convo.isUserProposer ? 
                                  `${convo.skillOfferedTitle} ↔ ${convo.skillRequestedTitle}` : 
                                  `${convo.skillRequestedTitle} ↔ ${convo.skillOfferedTitle}`}
                              </p>
                            </div>
                            <p className="text-xs text-gray-400">
                              {formatTimeAgo(convo.lastMessageTime)}
                            </p>
                          </div>
                          
                          {/* Last message preview */}
                          {convo.lastMessage && (
                            <p className="mt-1 text-sm text-gray-600 truncate">
                              {convo.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
