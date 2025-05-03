/**
 * RatingForm Component
 * 
 * This component provides a form for users to rate and review
 * another user after completing a trade.
 */

import React, { useState } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import StarRating from './StarRating';

interface RatingFormProps {
  tradeId: string;
  skillId: string;
  rateeId: string; // The ID of the user being rated
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RatingForm({
  tradeId,
  skillId,
  rateeId,
  onSuccess,
  onCancel
}: RatingFormProps) {
  const { supabase, user } = useSupabase();
  
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle rating change
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setError(null);
  };
  
  // Handle review text change
  const handleReviewTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
    setError(null);
  };
  
  // Handle privacy toggle
  const handlePrivacyToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublic(e.target.checked);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to submit a rating');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // First check if the user has already rated this trade
      const { data: existingRatings, error: checkError } = await supabase
        .from('ratings')
        .select('id')
        .eq('trade_id', tradeId)
        .eq('rater_id', user.id)
        .eq('ratee_id', rateeId);
      
      if (checkError) throw checkError;
      
      if (existingRatings && existingRatings.length > 0) {
        setError('You have already submitted a rating for this trade');
        setIsSubmitting(false);
        return;
      }
      
      // Verify that the trade is completed
      const { data: trade, error: tradeError } = await supabase
        .from('trades')
        .select('status')
        .eq('id', tradeId)
        .single();
      
      if (tradeError) throw tradeError;
      
      if (!trade || trade.status !== 'completed') {
        setError('You can only rate completed trades');
        setIsSubmitting(false);
        return;
      }
      
      // Submit the rating
      const { error: insertError } = await supabase
        .from('ratings')
        .insert({
          trade_id: tradeId,
          rater_id: user.id,
          ratee_id: rateeId,
          skill_id: skillId,
          rating_score: rating,
          review_text: reviewText.trim() || null,
          is_public: isPublic
        });
      
      if (insertError) throw insertError;
      
      // Success
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (err: any) {
      console.error('Error submitting rating:', err);
      setError(err.message || 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Rate Your Experience
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How would you rate this skill exchange?
          </label>
          <div className="flex items-center space-x-2">
            <StarRating
              rating={rating}
              maxRating={5}
              size="lg"
              interactive={true}
              onChange={handleRatingChange}
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-500 ml-2">
              {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
            </span>
          </div>
        </div>
        
        {/* Review Text */}
        <div className="mb-6">
          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
            Write your review (optional)
          </label>
          <textarea
            id="review-text"
            rows={4}
            placeholder="Tell others about your experience..."
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={reviewText}
            onChange={handleReviewTextChange}
            disabled={isSubmitting}
          />
        </div>
        
        {/* Privacy Toggle */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="is-public"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={isPublic}
            onChange={handlePrivacyToggle}
            disabled={isSubmitting}
          />
          <label htmlFor="is-public" className="ml-2 block text-sm text-gray-700">
            Make this review public
          </label>
          <div className="ml-2 text-xs text-gray-500">
            {isPublic 
              ? 'Your review will be visible to all users'
              : 'Your review will only be visible to you and the person you rated'}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </form>
    </div>
  );
}
