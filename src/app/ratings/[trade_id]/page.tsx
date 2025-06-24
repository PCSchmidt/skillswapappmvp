/**
 * Trade Rating Page
 * 
 * This page allows users to rate and review a trade partner
 * after a trade has been completed.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import RatingForm from '@/components/ratings/RatingForm';
import RatingsList from '@/components/ratings/RatingsList';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Database } from '@/types/supabase';

type TradeWithDetails = Database['public']['Tables']['trades']['Row'] & {
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
    category: string | null;
  } | null;
  skill_requested?: {
    id: string;
    title: string;
    category: string | null;
  } | null;
};

type RatingWithDetails = Database['public']['Tables']['ratings']['Row'] & {
  rater?: {
    id: string;
    full_name: string | null;
    profile_image_url: string | null;
  } | null;
  skill?: {
    id: string;
    title: string;
    category: string | null;
  } | null;
};

export default function TradeRatingPage({ params }: { params: { trade_id: string } }) {
  const router = useRouter();
  const { supabase, user, isLoading } = useSupabase();
  
  const [trade, setTrade] = useState<TradeWithDetails | null>(null);
  const [existingRating, setExistingRating] = useState<RatingWithDetails | null>(null);
  const [otherUserRating, setOtherUserRating] = useState<RatingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Fetch trade data and existing ratings
  useEffect(() => {
    const fetchTradeAndRatings = async () => {
      if (!user) return;
      
      try {
        // Step 1: Fetch trade details
        const { data: tradeData, error: tradeError } = await supabase
          .from('trades')
          .select(`
            *,
            proposer:proposer_id(id, full_name, profile_image_url),
            receiver:receiver_id(id, full_name, profile_image_url),
            skill_offered:skill_offered_id(id, title, category),
            skill_requested:skill_requested_id(id, title, category)
          `)
          .eq('id', params.trade_id)
          .single();
        
        if (tradeError) throw tradeError;
        
        // Check if user is part of this trade
        if (tradeData.proposer_id !== user.id && tradeData.receiver_id !== user.id) {
          setError('You do not have permission to view this trade');
          setLoading(false);
          return;
        }
        
        // Verify that the trade is completed
        if (tradeData.status !== 'completed') {
          setError('You can only rate completed trades');
          setLoading(false);
          return;
        }
        
        setTrade(tradeData);
        
        // Step 2: Check for existing ratings from current user
        const { data: userRating, error: userRatingError } = await supabase
          .from('ratings')
          .select(`
            *,
            rater:rater_id(id, full_name, profile_image_url),
            skill:skill_id(id, title, category)
          `)
          .eq('trade_id', params.trade_id)
          .eq('rater_id', user.id)
          .single();
        
        if (!userRatingError && userRating) {
          setExistingRating(userRating);
          setRatingSubmitted(true);
        }
        
        // Step 3: Check for ratings from the other user
        const otherUserId = tradeData.proposer_id === user.id ? tradeData.receiver_id : tradeData.proposer_id;
        
        const { data: otherRating, error: otherRatingError } = await supabase
          .from('ratings')
          .select(`
            *,
            rater:rater_id(id, full_name, profile_image_url),
            skill:skill_id(id, title, category)
          `)
          .eq('trade_id', params.trade_id)
          .eq('rater_id', otherUserId)
          .single();
        
        if (!otherRatingError && otherRating) {
          setOtherUserRating(otherRating);
        }
          } catch (err: unknown) {
        console.error('Error fetching trade and ratings:', err);
        setError('Failed to load trade details');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchTradeAndRatings();
    }
  }, [params.trade_id, supabase, user]);
  
  // Handle rating submission success
  const handleRatingSuccess = () => {
    setRatingSubmitted(true);
    // Refresh the page to show the submitted rating
    window.location.reload();
  };
  
  // Determine whether the user is the proposer or receiver
  const isProposer = () => trade?.proposer_id === user?.id;
  
  // Determine the other user's information
  const getOtherUser = () => {
    if (!trade || !user) return null;
    
    return isProposer() ? trade.receiver : trade.proposer;
  };
  
  // Determine the skill to rate (the one provided by the other user)
  const getSkillToRate = () => {
    if (!trade || !user) return null;
    
    return isProposer() ? trade.skill_requested : trade.skill_offered;
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading trade rating...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Rating Not Available</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This trade cannot be rated at this time.'}
          </p>
          <Link href="/trades" className="btn btn-primary">
            Return to Trades
          </Link>
        </div>
      </div>
    );
  }
  
  const otherUser = getOtherUser();
  const skillToRate = getSkillToRate();
  
  if (!otherUser || !skillToRate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-error-600 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User or Skill Information Missing</h1>
          <p className="text-gray-600 mb-6">
            Unable to find the user or skill information needed to process this rating.
          </p>
          <Link href="/trades" className="btn btn-primary">
            Return to Trades
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
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
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Rate Your Experience
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Share your feedback for this completed skill exchange
            </p>
          </div>
          
          {/* Trade summary */}
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                  {otherUser.profile_image_url ? (
                    <Image
                      src={otherUser.profile_image_url}
                      alt={otherUser.full_name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-semibold">
                      {(otherUser.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {otherUser.full_name || 'User'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isProposer() ? 'Provided you with' : 'Received your'}: <span className="font-medium">{skillToRate.title}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Rating form or existing rating */}
          <div className="px-4 py-5 sm:p-6">
            {ratingSubmitted ? (
              <div>
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        Your rating has been submitted!
                      </p>
                    </div>
                  </div>
                </div>
                
                {existingRating && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Your Rating
                    </h3>
                    <RatingsList
                      ratings={[existingRating]}
                      showRater={false}
                      linkToTrade={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              <RatingForm
                tradeId={trade.id}
                skillId={skillToRate.id}
                rateeId={otherUser.id}
                onSuccess={handleRatingSuccess}
                onCancel={() => router.push(`/trades/${trade.id}`)}
              />
            )}
          </div>
        </div>
        
        {/* Other user's rating (if exists) */}
        {otherUserRating && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {otherUser.full_name || 'Other User'}'s Rating
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                How they rated their experience with you
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <RatingsList
                ratings={[otherUserRating]}
                showRater={true}
                linkToTrade={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
