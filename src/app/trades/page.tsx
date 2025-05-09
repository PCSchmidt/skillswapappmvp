/**
 * Trades Listing Page
 * 
 * This page displays all trades the user is involved in, either as proposer or receiver.
 * Users can filter by trade status and navigate to individual trade details.
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';

type Trade = Database['public']['Tables']['trades']['Row'] & {
  skill_offered?: {
    id: string;
    title: string;
    category: string;
    subcategory: string | null;
  } | null;
  skill_requested?: {
    id: string;
    title: string;
    category: string;
    subcategory: string | null;
  } | null;
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
};

export default function TradesPage() {
  const router = useRouter();
  const { supabase, user, isLoading } = useSupabase();
  
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'proposed' | 'accepted' | 'completed' | 'declined'>('all');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Fetch trades data
  useEffect(() => {
    const fetchTrades = async () => {
      if (!user) return;
      
      try {
        // Build the query - we need to get trades where the user is either the proposer or receiver
        let query = supabase
          .from('trades')
          .select(`
            *,
            skill_offered:skill_offered_id(id, title, category, subcategory),
            skill_requested:skill_requested_id(id, title, category, subcategory),
            proposer:proposer_id(id, full_name, profile_image_url),
            receiver:receiver_id(id, full_name, profile_image_url)
          `)
          .or(`proposer_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });
        
        // Apply status filter if not on 'all' tab
        if (activeTab !== 'all') {
          query = query.eq('status', activeTab);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setTrades(data || []);
      } catch (err: any) {
        console.error('Error fetching trades:', err);
        setError('Failed to load trades');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchTrades();
    }
  }, [user, supabase, activeTab]);
  
  // Format date for display - handle null values
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Format time for display - handle null values
  const formatTime = (dateString: string | null): string => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Determine if user is the proposer
  const isProposer = (trade: Trade) => {
    return trade.proposer_id === user?.id;
  };
  
  // Get trade status badge color
  const getStatusBadgeColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'proposed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get formatted status text
  const getStatusText = (status: string | null) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading your trades...</p>
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
            Please login to view your trades.
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Trades</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage and track your skill exchange proposals
          </p>
        </div>
        
        {/* Filter tabs */}
        <div className="bg-white shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button 
                onClick={() => setActiveTab('all')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm 
                  ${activeTab === 'all' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                All Trades
              </button>
              <button 
                onClick={() => setActiveTab('proposed')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm 
                  ${activeTab === 'proposed' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Proposed
              </button>
              <button 
                onClick={() => setActiveTab('accepted')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm 
                  ${activeTab === 'accepted' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Accepted
              </button>
              <button 
                onClick={() => setActiveTab('completed')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm 
                  ${activeTab === 'completed' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Completed
              </button>
              <button 
                onClick={() => setActiveTab('declined')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm 
                  ${activeTab === 'declined' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Declined
              </button>
            </nav>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-md">
            {error}
          </div>
        )}
        
        {/* Trades list */}
        {trades.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trades found</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'all'
                ? "You don't have any trades yet. Browse skills to propose a trade."
                : `You don't have any ${activeTab} trades at the moment.`}
            </p>
            <Link href="/skills/browse" className="btn btn-primary">
              Browse Skills
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {trades.map((trade) => (
                <li key={trade.id} className="relative">
                  <Link href={`/trades/${trade.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-primary-600 truncate">
                            {isProposer(trade)
                              ? `You requested: ${trade.skill_requested?.title || 'Untitled skill'}`
                              : `${trade.proposer?.full_name || 'Someone'} requested: ${trade.skill_offered?.title || 'Untitled skill'}`}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(trade.status)}`}>
                            {getStatusText(trade.status)}
                          </span>
                        </div>
                        <div className="flex-shrink-0 flex">
                          <span className="inline-flex items-center text-sm text-gray-500">
                            <svg className="mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {formatDate(trade.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-700">
                            {isProposer(trade)
                              ? `You offered: ${trade.skill_offered?.title || 'Untitled skill'}`
                              : `In exchange for: ${trade.skill_requested?.title || 'Untitled skill'}`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {trade.proposed_hours} hour{trade.proposed_hours !== 1 ? 's' : ''} 
                          {trade.location_type && ` • ${trade.location_type}`}
                        </p>
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
