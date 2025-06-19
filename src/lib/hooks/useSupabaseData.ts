'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PostgrestError } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { Database } from '@/types/supabase';

export type SupabaseQueryParams = {
  table: string;
  select?: string;
  match?: Record<string, any>;
  order?: { column: string; ascending: boolean };
  limit?: number;
  range?: [number, number];
  filter?: Array<{ column: string; operator: string; value: any }>;
};

export type SupabaseQueryOptions = SWRConfiguration & {
  realtime?: boolean;
};

/**
 * Custom hook for fetching data from Supabase with SWR integration
 *
 * @param queryParams Query parameters for Supabase
 * @param options SWR configuration options with additional realtime option
 * @returns SWR response with additional subscription management
 */
export function useSupabaseData<T>(
  queryParams: SupabaseQueryParams | null,
  options: SupabaseQueryOptions = {}
): SWRResponse<T[], PostgrestError> & { isRealtime: boolean } {
  const supabase = createClientComponentClient<Database>();
  const [isRealtime, setIsRealtime] = useState(!!options.realtime);

  // Create a stable key for SWR - use string format to avoid type issues
  const swrKey = queryParams ? `supabase:${queryParams.table}:${JSON.stringify(queryParams)}` : null;

  // Custom fetcher function for Supabase
  const fetcher = async () => {
    if (!queryParams) return [] as T[]; // Return empty array instead of null to fix type issues

    let query = supabase.from(queryParams.table).select(queryParams.select || '*');

    // Apply match conditions (WHERE clause with exact matches)
    if (queryParams.match) {
      query = query.match(queryParams.match);
    }

    // Apply filters (WHERE clause with various operators)
    if (queryParams.filter && queryParams.filter.length > 0) {
      queryParams.filter.forEach(({ column, operator, value }) => {
        query = query.filter(column, operator, value);
      });
    }

    // Apply ordering
    if (queryParams.order) {
      query = query.order(queryParams.order.column, {
        ascending: queryParams.order.ascending,
      });
    }

    // Apply limit
    if (queryParams.limit) {
      query = query.limit(queryParams.limit);
    }

    // Apply range for pagination
    if (queryParams.range) {
      query = query.range(queryParams.range[0], queryParams.range[1]);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as T[]; // Return empty array if data is null
  };

  // Use SWR for data fetching
  const swr = useSWR<T[], PostgrestError>(swrKey, fetcher, {
    revalidateOnFocus: false,
    ...options,
  });

  // Set up realtime subscription if enabled
  useEffect(() => {
    if (!queryParams || !options.realtime) return;

    const channel = supabase
      .channel(`table-changes-${queryParams.table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: queryParams.table,
        },
        () => {
          // Revalidate data when changes occur
          swr.mutate();
        }
      )
      .subscribe();

    setIsRealtime(true);

    return () => {
      supabase.removeChannel(channel);
      setIsRealtime(false);
    };
  }, [queryParams, options.realtime, supabase, swr]);

  return {
    ...swr,
    isRealtime,
  };
}

/**
 * Hook for fetching a single record from Supabase by ID
 */
export function useSupabaseRecord<T>(
  table: string | null,
  id: string | number | null,
  options: SupabaseQueryOptions = {}
): SWRResponse<T | null, PostgrestError> {
  const supabase = createClientComponentClient<Database>();
  
  // Create a stable key for SWR - use string format to avoid type issues
  const swrKey = table && id ? `supabase-record:${table}:${id}` : null;

  // Custom fetcher function for a single record
  const fetcher = async () => {
    if (!table || !id) return null;

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as T;
  };

  // Use SWR for data fetching
  return useSWR<T | null, PostgrestError>(swrKey, fetcher, {
    revalidateOnFocus: false,
    ...options,
  });
}

/**
 * Hook for real-time data that must be always up to date
 */
export function useRealtimeSupabaseData<T>(
  queryParams: SupabaseQueryParams | null,
  options: Omit<SupabaseQueryOptions, 'realtime'> = {}
) {
  return useSupabaseData<T>(queryParams, {
    ...options,
    realtime: true,
    refreshInterval: 0, // No polling when using realtime
  });
}

/**
 * Hook specifically designed for immutable data that rarely changes
 */
export function useStaticSupabaseData<T>(
  queryParams: SupabaseQueryParams | null,
  options: SupabaseQueryOptions = {}
) {
  return useSupabaseData<T>(queryParams, {
    ...options,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    realtime: false,
    dedupingInterval: 3600000, // 1 hour
  });
}

export default useSupabaseData;
