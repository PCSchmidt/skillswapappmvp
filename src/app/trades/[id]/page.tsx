/**
 * Trade Detail Page
 * 
 * This page displays detailed information about a trade and provides
 * actions for users to manage it based on their role and the trade status.
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';

type ExtendedTrade = Database['public']['Tables']['trades']['Row'] & {
  skill_offered?: {
    id: string;
    title: string;
    category: string;
    subcategory: string | null;
    description: string | null;
    user_id: string;
  } | null;
  skill_requested?: {
    id: string;
    title: string;
    category: string;
    subcategory: string | null;
    description: string | null;
    user_id: string;
  } | null;
  proposer?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
    location_city: string | null;
    location_state: string | null;
  } | null;
  receiver?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
    location_city: string | null;
    location_state: string | null;
  } | null;
  notes?: string | null;
  scheduled_date?: string | null;
  proposed_schedule?: string | null;
};

export default function TradeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { supabase, user, isLoading } = useSupabase();
  
  const [trade, setTrade] = useState<ExtendedTrade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('');
  const [showCancellationForm, setShowCancellationForm] = useState(false);
  
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
            skill_offered:skill_offered_id(id, title, category, subcategory, description, user_id),
            skill_requested:skill_requested_id(id, title, category, subcategory, description, user_id),
            proposer:proposer_id(id, full_name, profile_image_url, location_city, location_state),
            receiver:receiver_id(id, full_name, profile_image_url, location_city, location_state)
          `)
          .eq('id', params.id)
          .single();
        
        if (error) throw error;
        
        // Check if user is part of this trade
        if (data && (data.proposer_id === user.id || data.receiver_id === user.id)) {
          setTrade(data);
          
          // If the trade is accepted but no date is selected, use the first date
          if (data.status === 'accepted' && !data.scheduled_date && data.proposed_schedule) {
            try {
              const dates = JSON.parse(data.proposed_schedule as string);
              if (dates.length > 0) {
                setSelectedDate(dates[0]);
              }
            } catch (e) {
              console.error('Error parsing proposed dates:', e);
            }
          } else if (data.scheduled_date) {
            setSelectedDate(data.scheduled_date);
          }
        } else {
          setError('You do not have permission to view this trade');
        }      } catch (err: unknown) {
        console.error('Error fetching trade:', err);
        setError('Failed to load trade details');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchTrade();
    }
  }, [params.id, supabase, user]);
  
  // Helper function: Check if user is the proposer
  const isProposer = () => {
    return trade?.proposer_id === user?.id;
  };
  
  // Helper function: Check if user is the receiver
  const isReceiver = () => {
    return trade?.receiver_id === user?.id;
  };
  
  // Helper function: Parse proposed dates
  const parseProposedDates = () => {
    if (!trade?.proposed_schedule) return [];
    
    try {
      return JSON.parse(trade.proposed_schedule as string);
    } catch (e) {
      console.error('Error parsing proposed dates:', e);
      return [];
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
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
  
  // Accept trade
  const handleAcceptTrade = async () => {
    if (!trade || !user || !isReceiver()) return;
    
    setActionLoading(true);
    setActionSuccess(null);
    
    try {
      const { error } = await supabase
        .from('trades')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString(),
          ...(selectedDate && { scheduled_date: selectedDate })
        })
        .eq('id', trade.id)
        .eq('receiver_id', user.id)
        .eq('status', 'proposed');
      
      if (error) throw error;
      
      setTrade({
        ...trade,
        status: 'accepted',
        updated_at: new Date().toISOString(),
        scheduled_date: selectedDate ?? trade.scheduled_date
      });
      
      setActionSuccess('Trade accepted successfully!');    } catch (err: unknown) {
      console.error('Error accepting trade:', err);
      setError('Failed to accept trade');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Decline trade
  const handleDeclineTrade = async () => {
    if (!trade || !user || !isReceiver()) return;
    
    setActionLoading(true);
    setActionSuccess(null);
    
    try {
      const updatedNotes = cancellationReason ? 
        `${trade.notes ? trade.notes + '\n\n' : ''}Declined reason: ${cancellationReason}` : 
        trade.notes;
        
      const { error } = await supabase
        .from('trades')
        .update({
          status: 'declined',
          updated_at: new Date().toISOString(),
          notes: updatedNotes
        })
        .eq('id', trade.id)
        .eq('receiver_id', user.id)
        .eq('status', 'proposed');
      
      if (error) throw error;
      
      setTrade({
        ...trade,
        status: 'declined',
        updated_at: new Date().toISOString(),
        notes: updatedNotes
      });
      
      setShowCancellationForm(false);
      setActionSuccess('Trade declined');    } catch (err: unknown) {
      console.error('Error declining trade:', err);
      setError('Failed to decline trade');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Cancel trade (for proposer)
  const handleCancelTrade = async () => {
    if (!trade || !user || !isProposer()) return;
    
    setActionLoading(true);
    setActionSuccess(null);
    
    try {
      const updatedNotes = cancellationReason ? 
        `${trade.notes ? trade.notes + '\n\n' : ''}Cancellation reason: ${cancellationReason}` : 
        trade.notes;
        
      const { error } = await supabase
        .from('trades')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
          notes: updatedNotes
        })
        .eq('id', trade.id)
        .eq('proposer_id', user.id)
        .in('status', ['proposed', 'accepted']);
      
      if (error) throw error;
      
      setTrade({
        ...trade,
        status: 'cancelled',
        updated_at: new Date().toISOString(),
        notes: updatedNotes
      });
      
      setShowCancellationForm(false);
      setActionSuccess('Trade cancelled');    } catch (err: unknown) {
      console.error('Error cancelling trade:', err);
      setError('Failed to cancel trade');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Complete trade
  const handleCompleteTrade = async () => {
    if (!trade || !user) return;
    
    if (!isProposer() && !isReceiver()) return;
    
    setActionLoading(true);
    setActionSuccess(null);
    
    try {
      const { error } = await supabase
        .from('trades')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .eq('id', trade.id)
        .in('status', ['accepted']);
      
      if (error) throw error;
      
      setTrade({
        ...trade,
        status: 'completed',
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      });
      
      setActionSuccess('Trade marked as completed!');    } catch (err: unknown) {
      console.error('Error completing trade:', err);
      setError('Failed to complete trade');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Update scheduled date
  const handleUpdateScheduledDate = async () => {
    if (!trade || !user || !selectedDate) return;
    
    if (!isProposer() && !isReceiver()) return;
    
    setActionLoading(true);
    setActionSuccess(null);
    
    try {
      const { error } = await supabase
        .from('trades')
        .update({
          scheduled_date: selectedDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', trade.id)
        .eq('status', 'accepted');
      
      if (error) throw error;
      
      setTrade({
        ...trade,
        scheduled_date: selectedDate,
        updated_at: new Date().toISOString()
      });
      
      setActionSuccess('Meeting date updated');    } catch (err: unknown) {
      console.error('Error updating scheduled date:', err);
      setError('Failed to update meeting date');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Render cancellation/decline form
  const renderCancellationForm = () => {
    return (
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {isProposer() ? 'Cancel Trade Proposal' : 'Decline Trade'}
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="cancellation-reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason (optional)
            </label>
            <textarea
              id="cancellation-reason"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder={isProposer() ? "Why are you cancelling this trade?" : "Why are you declining this trade?"}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowCancellationForm(false)}
              className="btn btn-secondary"
              disabled={actionLoading}
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={isProposer() ? handleCancelTrade : handleDeclineTrade}
              className="btn btn-error"
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : (isProposer() ? 'Cancel Trade' : 'Decline Trade')}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading trade details...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trade Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The trade you are looking for does not exist or you may not have permission to view it.'}
          </p>
          <Link href="/trades" className="btn btn-primary">
            Return to Trades
          </Link>
        </div>
      </div>
    );
  }
  
  // Extract proposedDates
  const proposedDates = parseProposedDates();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/trades"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Trades
          </Link>
          
          <Link href={`/messages/${trade.id}`} className="flex items-center text-sm text-primary-600 hover:text-primary-700">
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Messages
          </Link>
        </div>
        
        {/* Success message */}
        {actionSuccess && (
          <div className="mb-6 bg-success-100 border border-success-400 text-success-700 px-4 py-3 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-success-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {actionSuccess}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {isProposer() ? 'Your Trade Proposal' : 'Trade Proposal'}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(trade.status || '')}`}>
                {(trade.status?.charAt(0).toUpperCase() || '') + (trade.status?.slice(1) || '')}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Proposed on {formatDate(trade.created_at)} at {formatTime(trade.created_at)}
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {/* Action Section */}
            {showCancellationForm ? (
              renderCancellationForm()
            ) : (
              <div className="flex justify-end gap-3 mb-6">                {/* Pending state - receiver actions */}
                {trade.status === 'pending' && isReceiver() && (
                  <>
                    <button
                      onClick={() => setShowCancellationForm(true)}
                      className="btn btn-outline-error"
                      disabled={actionLoading}
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleAcceptTrade}
                      className="btn btn-success"
                      disabled={actionLoading || !selectedDate}
                    >
                      {actionLoading ? 'Processing...' : 'Accept Trade'}
                    </button>
                  </>
                )}
                  {/* Pending state - proposer actions */}
                {trade.status === 'pending' && isProposer() && (
                  <button
                    onClick={() => setShowCancellationForm(true)}
                    className="btn btn-outline-error"
                    disabled={actionLoading}
                  >
                    Cancel Proposal
                  </button>
                )}
                
                {/* Accepted state - both parties can complete */}
                {trade.status === 'accepted' && (
                  <button
                    onClick={handleCompleteTrade}
                    className="btn btn-success"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Mark as Completed'}
                  </button>
                )}
                
                {/* Completed state - add rating button */}
                {trade.status === 'completed' && (
                  <Link href={`/ratings/${trade.id}`} className="btn btn-primary">
                    Rate This Trade
                  </Link>
                )}
                
                {/* Accepted state - proposer can cancel */}
                {trade.status === 'accepted' && isProposer() && (
                  <button
                    onClick={() => setShowCancellationForm(true)}
                    className="btn btn-outline-error"
                    disabled={actionLoading}
                  >
                    Cancel Trade
                  </button>
                )}
                
                {/* Accepted state - date update */}
                {trade.status === 'accepted' && selectedDate && selectedDate !== trade.scheduled_date && (
                  <button
                    onClick={handleUpdateScheduledDate}
                    className="btn btn-secondary"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Updating...' : 'Update Meeting Date'}
                  </button>
                )}
              </div>
            )}
            
            {/* Trade details section - simplified for this version */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-full">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Trade Details</h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Skills Exchange</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {isProposer() ? "You're offering" : `${trade.proposer?.full_name || 'User'} is offering`}: <span className="font-medium">{trade.skill_offered?.title}</span>
                        <br />
                        In exchange for: <span className="font-medium">{trade.skill_requested?.title}</span>
                      </dd>
                    </div>
                      <div>
                      <dt className="text-sm font-medium text-gray-500">Duration</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        To be determined
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Meeting Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        To be determined
                      </dd>
                    </div>
                      {/* Date selection for receiver on pending trades */}
                    {trade.status === 'pending' && isReceiver() && proposedDates.length > 0 && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Select a Meeting Date</dt>
                        <dd className="mt-2">
                          <div className="grid grid-cols-1 gap-2">
                            {proposedDates.map((date: string, index: number) => (
                              <div key={index} className="flex items-center">
                                <input
                                  id={`date-${index}`}
                                  name="selected-date"
                                  type="radio"
                                  checked={selectedDate === date}
                                  onChange={() => setSelectedDate(date)}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                />
                                <label htmlFor={`date-${index}`} className="ml-3 text-sm text-gray-700">
                                  {formatDate(date)}
                                </label>
                              </div>
                            ))}
                          </div>
                        </dd>
                      </div>
                    )}
                    
                    {/* Scheduled date for accepted trades */}
                    {trade.status === 'accepted' && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Scheduled Meeting</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {trade.scheduled_date ? formatDate(trade.scheduled_date) : 'Not yet scheduled'}
                        </dd>
                      </div>
                    )}
                    
                    {/* Notes */}
                    {trade.notes && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Additional Notes</dt>
                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                          {trade.notes}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
