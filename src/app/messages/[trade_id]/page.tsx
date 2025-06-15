/**
 * Trade Message Page
 * 
 * This page displays a chat interface for a specific trade,
 * allowing users to send and receive messages.
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ChatWindow from '@/components/messages/ChatWindow';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';

type TradeWithUsers = Database['public']['Tables']['trades']['Row'] & {
  proposer?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
  } | null;
  receiver?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
  } | null;
  skill_offered?: {
    id: string;
    title: string;
  } | null;
  skill_requested?: {
    id: string;
    title: string;
  } | null;
};

export default function TradeMessagePage({ params }: { params: { trade_id: string } }) {
  const router = useRouter();
  const { supabase, user, isLoading } = useSupabase();
  
  const [trade, setTrade] = useState<TradeWithUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Fetch trade data
  useEffect(() => {
    const fetchTrade = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('trades')
          .select(`
            *,
            proposer:proposer_id(id, full_name, profile_image_url),
            receiver:receiver_id(id, full_name, profile_image_url),
            skill_offered:skill_offered_id(id, title),
            skill_requested:skill_requested_id(id, title)
          `)
          .eq('id', params.trade_id)
          .single();
        
        if (error) throw error;
        
        // Check if user is part of this trade
        if (data.proposer_id === user.id || data.receiver_id === user.id) {
          setTrade(data);
        } else {
          setError('You do not have permission to view this conversation');
        }
      } catch (err: any) {
        console.error('Error fetching trade:', err);
        setError('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchTrade();
    }
  }, [params.trade_id, supabase, user]);
  
  // Determine the other user
  const getOtherUser = () => {
    if (!trade || !user) return { id: '', name: '' };
    
    const isUserProposer = trade.proposer_id === user.id;
    
    return {
      id: isUserProposer ? trade.receiver_id : trade.proposer_id,
      name: isUserProposer
        ? trade.receiver?.full_name || 'User'
        : trade.proposer?.full_name || 'User',
    };
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading conversation...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error || !trade) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-error-600 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Conversation Not Available</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This conversation cannot be accessed.'}
          </p>
          <Link href="/trades" className="btn btn-primary">
            Return to Trades
          </Link>
        </div>
      </div>
    );
  }
  
  const otherUser = getOtherUser();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/trades/${trade.id}`}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Trade
            </Link>
          </div>
          <div className="mt-2">
            <h1 className="text-xl font-bold text-gray-900">
              Messages for Trade: {trade.skill_offered?.title} ↔ {trade.skill_requested?.title}
            </h1>
            <p className="text-sm text-gray-500">
              Status: {trade.status ? trade.status.charAt(0).toUpperCase() + trade.status.slice(1) : 'Unknown'}
            </p>
          </div>
        </div>
        
        {/* Chat window */}
        <div className="flex-grow overflow-hidden">
          <ChatWindow 
            tradeId={trade.id}
            otherUserId={otherUser.id || ''}
            otherUserName={otherUser.name}
          />
        </div>
      </div>
    </div>
  );
}
