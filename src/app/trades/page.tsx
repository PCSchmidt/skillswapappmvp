/**
 * Trades Listing Page
 * 
 * This page displays all trades the user is involved in, either as proposer or receiver.
 * Users can filter by trade status and navigate to individual trade details.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    if (!status) return 'bg-surface-raised text-text-muted border border-border';
    
    switch (status) {
      case 'proposed':
        return 'bg-blue-900/20 text-blue-400 border border-blue-500/20';
      case 'accepted':
        return 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20';
      case 'completed':
        return 'bg-purple-900/20 text-purple-400 border border-purple-500/20';
      case 'declined':
        return 'bg-red-900/20 text-red-400 border border-red-500/20';
      case 'cancelled':
        return 'bg-surface-raised text-text-muted border border-border';
      default:
        return 'bg-surface-raised text-text-muted border border-border';
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
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-text-secondary">Loading your trades...</p>
        </div>
      </div>
    );
  }
  
  // Show unauthorized state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-error-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Authentication Required</h1>
          <p className="text-text-secondary mb-6">
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
    <div className="min-h-screen bg-canvas py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="eyebrow">Exchange</p>
          <h1 className="text-3xl font-display font-semibold text-text-primary">Your Trades</h1>
          <p className="mt-2 text-sm text-text-muted">
            Manage and track your skill exchange proposals
          </p>
        </div>
        
        {/* Filter tabs */}
        <div className="card mb-6">
          <div className="border-b border-border">
            <nav className="flex -mb-px">
              <button 
                onClick={() => setActiveTab('all')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm 
                  ${activeTab === 'all' 
                    ? 'border-emerald-500 text-emerald-400' 
                    : 'border-transparent text-text-muted hover:text-text-secondary hover:border-border'}`}
              >
                All Trades
              </button>
              <button 
                onClick={() => setActiveTab('proposed')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm 
                  ${activeTab === 'proposed' 
                    ? 'border-emerald-500 text-emerald-400' 
                    : 'border-transparent text-text-muted hover:text-text-secondary hover:border-border'}`}
              >
                Proposed
              </button>
              <button 
                onClick={() => setActiveTab('accepted')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm 
                  ${activeTab === 'accepted' 
                    ? 'border-emerald-500 text-emerald-400' 
                    : 'border-transparent text-text-muted hover:text-text-secondary hover:border-border'}`}
              >
                Accepted
              </button>
              <button 
                onClick={() => setActiveTab('completed')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm 
                  ${activeTab === 'completed' 
                    ? 'border-emerald-500 text-emerald-400' 
                    : 'border-transparent text-text-muted hover:text-text-secondary hover:border-border'}`}
              >
                Completed
              </button>
              <button 
                onClick={() => setActiveTab('declined')}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm 
                  ${activeTab === 'declined' 
                    ? 'border-emerald-500 text-emerald-400' 
                    : 'border-transparent text-text-muted hover:text-text-secondary hover:border-border'}`}
              >
                Declined
              </button>
            </nav>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-error-500/10 border border-error-500/20 text-error-500">
            {error}
          </div>
        )}
        
        {/* Trades list */}
        {trades.length === 0 ? (
          <div className="card p-6 text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No trades found</h3>
            <p className="text-text-muted mb-6">
              {activeTab === 'all'
                ? "You don't have any trades yet. Browse skills to propose a trade."
                : `You don't have any ${activeTab} trades at the moment.`}
            </p>
            <Link href="/skills/browse" className="btn btn-primary">
              Browse Skills
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden card">
            <ul className="divide-y divide-border">
              {trades.map((trade) => (
                <li key={trade.id} className="relative">
                  <Link href={`/trades/${trade.id}`} className="block hover:bg-surface-raised/50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-emerald-400 truncate">
                            {isProposer(trade)
                              ? `You requested: ${trade.skill_requested?.title || 'Untitled skill'}`
                              : `${trade.proposer?.full_name || 'Someone'} requested: ${trade.skill_offered?.title || 'Untitled skill'}`}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(trade.status)}`}>
                            {getStatusText(trade.status)}
                          </span>
                        </div>
                        <div className="flex-shrink-0 flex">
                          <span className="inline-flex items-center text-sm text-text-muted">
                            <svg className="mr-1.5 h-5 w-5 text-text-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {formatDate(trade.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-text-secondary">
                            {isProposer(trade)
                              ? `You offered: ${trade.skill_offered?.title || 'Untitled skill'}`
                              : `In exchange for: ${trade.skill_requested?.title || 'Untitled skill'}`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-text-muted sm:mt-0">
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
