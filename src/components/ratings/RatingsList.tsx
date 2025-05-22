/**
 * RatingsList Component
 * 
 * This component displays a list of ratings for a user or skill.
 */

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Database } from '@/types/supabase';
import StarRating from './StarRating';

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
  trade?: {
    id: string;
    completed_at: string | null;
  } | null;
};

interface RatingsListProps {
  ratings: RatingWithDetails[];
  emptyMessage?: string;
  showRater?: boolean; // If false, shows ratee instead
  compact?: boolean;
  linkToTrade?: boolean;
}

export default function RatingsList({
  ratings,
  emptyMessage = 'No ratings yet',
  showRater = true,
  compact = false,
  linkToTrade = true
}: RatingsListProps) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {ratings.map((rating) => (
        <div 
          key={rating.id} 
          className={`${compact ? 'py-3' : 'py-5'} ${linkToTrade && rating.trade_id ? 'hover:bg-gray-50' : ''}`}
        >
          {linkToTrade && rating.trade_id ? (
            <Link href={`/trades/${rating.trade_id}`} className="block">
              <RatingItem 
                rating={rating} 
                showRater={showRater}
                compact={compact}
              />
            </Link>
          ) : (
            <RatingItem 
              rating={rating} 
              showRater={showRater}
              compact={compact}
            />
          )}
        </div>
      ))}
    </div>
  );
}

interface RatingItemProps {
  rating: RatingWithDetails;
  showRater: boolean;
  compact: boolean;
}

function RatingItem({ rating, showRater, compact }: RatingItemProps) {
  // Format date if available
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
    if (diffSec < 2592000) return `${Math.floor(diffSec / 604800)} weeks ago`;
    
    // Format as a date for older ratings
    return date.toLocaleDateString();
  };
  
  const formattedDate = rating.created_at ? formatTimeAgo(rating.created_at) : '';
  
  // Determine if we're showing the rater or ratee
  const person = showRater ? rating.rater : { id: rating.rater_id, full_name: 'Anonymous', profile_image_url: null };
  
  return (
    <div>
      <div className="flex items-start">
        {/* User avatar */}
        {!compact && (
          <div className="flex-shrink-0 mr-4">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
              {person?.profile_image_url ? (
                <Image
                  src={person.profile_image_url}
                  alt={person?.full_name || 'User'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-semibold">
                  {(person?.full_name || 'A').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Rating content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {!compact && (
                <p className="text-sm font-medium text-gray-900 mr-2 truncate">
                  {person?.full_name || 'Anonymous User'}
                </p>
              )}
              <StarRating rating={rating.rating_score} size={compact ? 'sm' : 'md'} />
              <span className="ml-2 text-sm text-gray-500">
                {formattedDate}
              </span>
            </div>
            
            {rating.skill && (
              <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full truncate max-w-[120px]">
                {rating.skill.title}
              </div>
            )}
          </div>
          
          {rating.review_text && (
            <p className={`${compact ? 'text-sm mt-1' : 'mt-2'} text-gray-700 whitespace-pre-line line-clamp-3`}>
              {rating.review_text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
