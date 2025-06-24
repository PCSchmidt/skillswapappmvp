/**
 * User Skills API Route - Manage user's offered and wanted skills
 * Handles CRUD operations for user_skills table
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET /api/user-skills - Get user's skills (both offered and wanted)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const skillType = searchParams.get('type'); // 'offered' or 'wanted'

    const supabase = createRouteHandlerClient({ cookies });

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Use current user if no userId specified
    const targetUserId = userId || session.user.id;

    let query = supabase
      .from('user_skills')
      .select(`
        id,
        skill_type,
        proficiency_level,
        description,
        created_at,
        skills:skill_id (
          id,
          name,
          category,
          description
        )
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    // Filter by skill type if specified
    if (skillType) {
      query = query.eq('skill_type', skillType);
    }

    const { data: userSkills, error } = await query;

    if (error) {
      console.error('Error fetching user skills:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user skills' },
        { status: 500 }
      );
    }

    return NextResponse.json({ userSkills });
  } catch (error) {
    console.error('Unexpected error in GET /api/user-skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/user-skills - Add a skill to user's profile
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
    }

    const body = await request.json();
    const { skillId, skillType, proficiencyLevel, description } = body;

    // Validate required fields
    if (!skillId || !skillType) {
      return NextResponse.json(
        { error: 'Skill ID and skill type are required' },
        { status: 400 }
      );
    }

    // Validate skill type
    if (!['offered', 'wanted'].includes(skillType)) {
      return NextResponse.json(
        { error: 'Skill type must be "offered" or "wanted"' },
        { status: 400 }
      );
    }

    // Validate proficiency level
    if (proficiencyLevel && !['beginner', 'intermediate', 'advanced', 'expert'].includes(proficiencyLevel)) {
      return NextResponse.json(
        { error: 'Invalid proficiency level' },
        { status: 400 }
      );
    }

    // Check if user already has this skill with the same type
    const { data: existingUserSkill } = await supabase
      .from('user_skills')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('skill_id', skillId)
      .eq('skill_type', skillType)
      .single();

    if (existingUserSkill) {
      return NextResponse.json(
        { error: `You already have this skill marked as ${skillType}` },
        { status: 409 }
      );
    }

    // Verify skill exists
    const { data: skill } = await supabase
      .from('skills')
      .select('id')
      .eq('id', skillId)
      .single();

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Add the user skill
    const { data: userSkill, error } = await supabase
      .from('user_skills')
      .insert([
        {
          user_id: session.user.id,
          skill_id: skillId,
          skill_type: skillType,
          proficiency_level: proficiencyLevel || 'intermediate',
          description: description?.trim() || null
        }
      ])
      .select(`
        id,
        skill_type,
        proficiency_level,
        description,
        created_at,
        skills:skill_id (
          id,
          name,
          category,
          description
        )
      `)
      .single();

    if (error) {
      console.error('Error adding user skill:', error);
      return NextResponse.json(
        { error: 'Failed to add skill to your profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ userSkill }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/user-skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user-skills - Update user's skill
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
    }

    const body = await request.json();
    const { id, proficiencyLevel, description } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'User skill ID is required' },
        { status: 400 }
      );
    }

    // Validate proficiency level if provided
    if (proficiencyLevel && !['beginner', 'intermediate', 'advanced', 'expert'].includes(proficiencyLevel)) {
      return NextResponse.json(
        { error: 'Invalid proficiency level' },
        { status: 400 }
      );
    }

    // Check if user skill exists and belongs to current user
    const { data: existingUserSkill } = await supabase
      .from('user_skills')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existingUserSkill) {
      return NextResponse.json(
        { error: 'User skill not found' },
        { status: 404 }
      );
    }

    if (existingUserSkill.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }    // Update the user skill
    const updateData: {
      updated_at: string;
      proficiency_level?: string;
      description?: string | null;
    } = { updated_at: new Date().toISOString() };
    if (proficiencyLevel) updateData.proficiency_level = proficiencyLevel;
    if (description !== undefined) updateData.description = description?.trim() || null;

    const { data: userSkill, error } = await supabase
      .from('user_skills')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        skill_type,
        proficiency_level,
        description,
        created_at,
        skills:skill_id (
          id,
          name,
          category,
          description
        )
      `)
      .single();

    if (error) {
      console.error('Error updating user skill:', error);
      return NextResponse.json(
        { error: 'Failed to update skill' },
        { status: 500 }
      );
    }

    return NextResponse.json({ userSkill });
  } catch (error) {
    console.error('Unexpected error in PUT /api/user-skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/user-skills - Remove skill from user's profile
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
        { error: 'User skill ID is required' },
        { status: 400 }
      );
    }

    // Check if user skill exists and belongs to current user
    const { data: existingUserSkill } = await supabase
      .from('user_skills')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existingUserSkill) {
      return NextResponse.json(
        { error: 'User skill not found' },
        { status: 404 }
      );
    }

    if (existingUserSkill.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Delete the user skill
    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user skill:', error);
      return NextResponse.json(
        { error: 'Failed to remove skill from your profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Skill removed from your profile successfully' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/user-skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
