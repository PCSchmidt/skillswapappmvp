/**
 * Skills API Route - CRUD operations for skills
 * Handles creating, reading, updating, and deleting skills
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Force dynamic route to prevent build-time static generation issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/skills - Get all skills with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    let query = supabase
      .from('skills')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('title');

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: skills, error } = await query;

    if (error) {
      console.error('Error fetching skills:', error);
      return NextResponse.json(
        { error: 'Failed to fetch skills' },
        { status: 500 }
      );
    }

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Unexpected error in GET /api/skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/skills - Create a new skill
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }    const body = await request.json();
    const { title, category, description, subcategory, experience_level, hourly_equivalent_value, is_offering, is_remote_friendly } = body;

    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    // Check if skill already exists for this user
    const { data: existingSkill } = await supabase
      .from('skills')
      .select('id')
      .eq('title', title)
      .eq('user_id', session.user.id)
      .single();

    if (existingSkill) {
      return NextResponse.json(
        { error: 'You already have a skill with this title' },
        { status: 409 }
      );
    }

    // Create the skill
    const { data: skill, error } = await supabase
      .from('skills')
      .insert([
        {
          user_id: session.user.id,
          title: title.trim(),
          category: category.trim(),
          description: description?.trim() || null,
          subcategory: subcategory?.trim() || null,
          experience_level: experience_level || 'intermediate',
          hourly_equivalent_value: hourly_equivalent_value || null,
          is_offering: is_offering || true,
          is_remote_friendly: is_remote_friendly || false,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating skill:', error);
      return NextResponse.json(
        { error: 'Failed to create skill' },
        { status: 500 }
      );
    }

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/skills - Update an existing skill
export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }    const body = await request.json();
    const { id, title, category, description, subcategory, experience_level, hourly_equivalent_value, is_offering, is_remote_friendly } = body;

    // Validate required fields
    if (!id || !title || !category) {
      return NextResponse.json(
        { error: 'ID, title, and category are required' },
        { status: 400 }
      );
    }

    // Check if skill exists and user has permission to edit
    const { data: existingSkill } = await supabase
      .from('skills')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existingSkill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Only allow creator to edit
    if (existingSkill.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Update the skill
    const { data: skill, error } = await supabase
      .from('skills')
      .update({
        title: title.trim(),
        category: category.trim(),
        description: description?.trim() || null,
        subcategory: subcategory?.trim() || null,
        experience_level: experience_level,
        hourly_equivalent_value: hourly_equivalent_value,
        is_offering: is_offering,
        is_remote_friendly: is_remote_friendly,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating skill:', error);
      return NextResponse.json(
        { error: 'Failed to update skill' },
        { status: 500 }
      );
    }

    return NextResponse.json({ skill });
  } catch (error) {
    console.error('Unexpected error in PUT /api/skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/skills - Delete a skill
export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }    // Check if skill exists and user has permission to delete
    const { data: existingSkill } = await supabase
      .from('skills')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existingSkill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Only allow creator to delete
    if (existingSkill.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Delete the skill
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting skill:', error);
      return NextResponse.json(
        { error: 'Failed to delete skill' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
