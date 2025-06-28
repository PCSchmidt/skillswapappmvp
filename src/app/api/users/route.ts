import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { Database } from '@/types/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }
    
    // Build the query with proper filtering
    let dbQuery = supabase
      .from('users')
      .select(`
        id,
        full_name,
        display_name,
        profile_image_url,
        location,
        bio,
        created_at
      `)
      .range(offset, offset + limit - 1);
    
    // Search by full_name, display_name, or email (partial match)
    const searchTerm = `%${query}%`;
    dbQuery = dbQuery.or(`full_name.ilike.${searchTerm},display_name.ilike.${searchTerm},email.ilike.${searchTerm}`);
    
    const { data: users, error } = await dbQuery;
    
    if (error) {
      console.error('Error searching users:', error);
      return NextResponse.json(
        { error: 'Failed to search users' },
        { status: 500 }
      );
    }
    
    // Get the total count for pagination
    const { count, error: countError } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .or(`full_name.ilike.${searchTerm},display_name.ilike.${searchTerm},email.ilike.${searchTerm}`);
    
    if (countError) {
      console.error('Error counting users:', countError);
    }
    
    return NextResponse.json({
      users: users || [],
      total: count || 0,
      limit,
      offset
    });
    
  } catch (error) {
    console.error('Unexpected error in users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
