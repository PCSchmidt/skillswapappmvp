'use client';

import React, { useState } from 'react';
import { useData, API_ENDPOINTS, useOptimisticUpdate } from '@/lib/data';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';

// This is a sample component that demonstrates how to use the optimistic UI update pattern
// with the data fetching hooks. This improves the perceived performance and responsiveness
// of the application by immediately updating the UI before the server response is received.

interface Review {
  id: string;
  text: string;
  rating: number;
  userId: string;
  skillId: string;
  createdAt: string;
}

interface ReviewFormData {
  text: string;
  rating: number;
  skillId: string;
}

export default function OptimisticUpdateExample({ userId }: { userId: string }) {
  const [formData, setFormData] = useState<ReviewFormData>({
    text: '',
    rating: 5,
    skillId: 'skill-123',
  });
  
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Fetch the user's reviews
  const { data: reviews, error: fetchError, mutate } = useData<Review[]>(
    userId ? API_ENDPOINTS.REVIEWS.USER(userId) : null
  );
  
  // Set up optimistic updates
  const { optimisticUpdate, isUpdating } = useOptimisticUpdate(mutate, {
    setLoading,
    setError,
    onSuccess: () => {
      // Clear form after successful submission
      setFormData({
        text: '',
        rating: 5,
        skillId: 'skill-123',
      });
    },
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Execute the optimistic update
    try {
      await optimisticUpdate(
        // 1. Update function - how the data should optimistically change
        (currentReviews) => {
          // Create a temporary optimistic review
          const optimisticReview: Review = {
            id: `temp-${Date.now()}`, // Temporary ID
            text: formData.text,
            rating: formData.rating,
            userId,
            skillId: formData.skillId,
            createdAt: new Date().toISOString(),
          };
          
          // Add the new review to the current reviews
          return [...(currentReviews || []), optimisticReview];
        },
        
        // 2. API call to actually perform the update
        async () => {
          // In a real app, this would be an API call
          const response = await fetch(API_ENDPOINTS.REVIEWS.CREATE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...formData,
              userId,
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to create review');
          }
          
          return await response.json();
        }
      );
    } catch (err) {
      // Error handling is already done by the hook
      console.error('Submission failed:', err);
    }
  };
  
  // Render loading state while fetching initial data
  if (!reviews && !fetchError) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }
  
  // Render error state
  if (fetchError) {
    return (
      <Alert type="error">
        Failed to load reviews: {fetchError.message}
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Reviews</h2>
      
      {/* Display reviews */}
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className={review.id.startsWith('temp-') ? 'opacity-70' : ''}>
              <div className="flex justify-between">
                <div>
                  <div className="text-lg font-medium">{review.text}</div>
                  <div className="text-sm text-gray-500">
                    Rating: {review.rating}/5 • 
                    {review.id.startsWith('temp-') ? (
                      <span className="text-amber-600 ml-1">Saving...</span>
                    ) : (
                      <span className="ml-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet. Add your first review below.</p>
        )}
      </div>
      
      {/* Add review form */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Add a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert type="error">
              {error.message}
            </Alert>
          )}
          
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-1">
              Review Text
            </label>
            <textarea
              id="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              rows={3}
              required
              disabled={isUpdating}
            />
          </div>
          
          <div>
            <label htmlFor="rating" className="block text-sm font-medium mb-1">
              Rating
            </label>
            <select
              id="rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-md"
              required
              disabled={isUpdating}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Star' : 'Stars'}
                </option>
              ))}
            </select>
          </div>
          
          <Button
            type="submit"
            disabled={isUpdating || loading || !formData.text}
            className="w-full"
          >
            {isUpdating || loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </form>
      </div>
      
      {/* Implementation Notes */}
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-bold mb-2">Implementation Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>This component demonstrates optimistic UI updates using the <code>useOptimisticUpdate</code> hook.</li>
          <li>When a user submits a review, the UI updates immediately with a temporary version.</li>
          <li>If the API call succeeds, the temporary review is replaced with the real one.</li>
          <li>If it fails, the UI automatically rolls back to its previous state.</li>
          <li>This pattern significantly improves perceived performance and user experience.</li>
        </ul>
      </div>
    </div>
  );
}
