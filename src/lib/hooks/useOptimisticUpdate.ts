'use client';

import { useState } from 'react';
import { KeyedMutator } from 'swr';
import { useErrorHandler } from './useErrorHandler';

/**
 * Type definitions for optimistic update
 */
interface OptimisticUpdateOptions<T> {
  // Optional loading state toggle
  setLoading?: (isLoading: boolean) => void;
  // Optional error state setter
  setError?: (error: Error | null) => void;
  // Optional success callback
  onSuccess?: (result: T) => void;
  // Optional error callback
  onError?: (error: Error) => void;
  // Whether to rollback the optimistic update on error
  rollbackOnError?: boolean;
}

/**
 * Hook for handling optimistic UI updates with automatic error handling
 * 
 * This hook allows components to update their UI optimistically before the server confirms the change,
 * improving perceived performance and responsiveness.
 * 
 * @param mutate The SWR mutate function to update local cache
 * @param options Configuration options
 * @returns Optimistic update function
 */
export function useOptimisticUpdate<T, P = unknown>(
  mutate: KeyedMutator<T>,
  options: OptimisticUpdateOptions<T> = {}
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { handleError } = useErrorHandler();
  
  const {
    setLoading,
    setError,
    onSuccess,
    onError,
    rollbackOnError = true
  } = options;

  /**
   * Perform an optimistic update
   * 
   * @param updateFn Function that returns how the data should be updated optimistically
   * @param apiCall API call to perform (e.g., POST, PUT, DELETE)
   * @param rollbackData Optional data to use for rollback if API call fails
   */
  const optimisticUpdate = async (
    updateFn: (currentData: T | undefined) => T,
    apiCall: (params?: P) => Promise<unknown>,
    params?: P,
  ) => {
    // Store the current data for potential rollback
    let previousData: T | undefined;
    
    // Set loading state
    setIsUpdating(true);
    if (setLoading) setLoading(true);
    if (setError) setError(null);

    try {
      // Get current data and update it optimistically
      previousData = await mutate(
        (currentData) => {
          return updateFn(currentData);
        },
        // Don't revalidate yet, wait for API call
        { revalidate: false }
      );

      // Perform the actual API call
      const result = await apiCall(params);

      // On success, revalidate to ensure our optimistic update matches server state
      await mutate();
        // Call success callback
      if (onSuccess) onSuccess(result as T);
      
      return result;
    } catch (error) {
      // Handle errors gracefully
      const typedError = error instanceof Error ? error : new Error(String(error));
      
      // Log the error
      handleError(typedError, {
        context: { source: 'Optimistic update', operation: apiCall.name }
      });
      
      // If requested, roll back to the previous data state
      if (rollbackOnError) {
        await mutate(previousData, false);
      }
      
      // Set error state
      if (setError) setError(typedError);
      
      // Call error callback
      if (onError) onError(typedError);
      
      throw typedError;
    } finally {
      // Reset loading state
      setIsUpdating(false);
      if (setLoading) setLoading(false);
    }
  };

  return {
    optimisticUpdate,
    isUpdating
  };
}

export default useOptimisticUpdate;
