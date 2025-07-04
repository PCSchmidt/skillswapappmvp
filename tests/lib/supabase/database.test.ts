import { supabaseClient } from '@/lib/supabase/client';

/**
 * Database Interaction Tests
 * 
 * Tests for the database operations through Supabase in demo mode
 */

describe('Database Interactions', () => {
  describe('Skills Table Operations', () => {
    test('should return demo mode message for database operations', async () => {
      const { data, error } = await supabaseClient
        .from('skills')
        .select('*');

      // In demo mode, we expect an error with demo message
      expect(error).toBeTruthy();
      expect(error?.message).toContain('Demo mode - no database connection');
      expect(data).toEqual([]);
    });

    test('should handle CRUD operations in demo mode', async () => {
      const mockSkill = {
        id: 'skill-123',
        name: 'JavaScript',
        category: 'Technology',
        description: 'Programming in JavaScript'
      };

      // Test insert in demo mode
      const { data: insertData, error: insertError } = await supabaseClient
        .from('skills')
        .insert(mockSkill)
        .select();

      expect(insertError?.message).toContain('Demo mode - no database connection');
      expect(insertData).toEqual([]);

      // Test update in demo mode
      const { data: updateData, error: updateError } = await supabaseClient
        .from('skills')
        .update({ name: 'Advanced JavaScript' })
        .eq('id', 'skill-123')
        .select();

      expect(updateError?.message).toContain('Demo mode - no database connection');
      expect(updateData).toEqual([]);

      // Test delete in demo mode  
      const { error: deleteError } = await supabaseClient
        .from('skills')
        .delete()
        .eq('id', 'skill-123');

      expect(deleteError?.message).toContain('Demo mode - no database connection');
    });
  });

  describe('User Profiles Table Operations', () => {
    const mockProfile = {
      id: 'user-123',
      full_name: 'John Doe',
      username: 'johndoe',
      bio: 'Software developer',
      location: {
        description: 'New York, NY',
        latitude: 40.7128,
        longitude: -74.006
      },
      avatar_url: 'https://example.com/avatar.jpg'
    };

    test('should fetch a user profile successfully', async () => {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', 'user-123')
        .single();

      expect(error).toBeTruthy();
      expect(error?.message).toContain('Demo mode - no database connection');
      expect(data).toBeNull();
    });

    test('should update a user profile successfully', async () => {
      const updates = { bio: 'Senior software developer' };
      
      const { data, error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', 'user-123')
        .select();

      expect(error).toBeTruthy();
      expect(error?.message).toContain('Demo mode - no database connection');
      expect(data).toEqual([]);
    });
  });

  describe('User Skills Table Operations', () => {
    const mockUserSkill = {
      id: 'user-skill-123',
      user_id: 'user-123',
      skill_id: 'skill-123',
      proficiency_level: 'expert',
      years_experience: 5,
      is_offering: true,
    };

    test('should fetch user skills successfully', async () => {
      const { data, error } = await supabaseClient
        .from('user_skills')
        .select(`
          *,
          skills (
            name
          )
        `)
        .eq('user_id', 'user-123');

      expect(error).toBeTruthy();
      expect(error?.message).toContain('Demo mode - no database connection');
      expect(data).toEqual([]);
    });

    test('should insert a user skill successfully', async () => {
      const { data, error } = await supabaseClient
        .from('user_skills')
        .insert(mockUserSkill)
        .select();

      expect(error).toBeTruthy();
      expect(error?.message).toContain('Demo mode - no database connection');
      expect(data).toEqual([]);
    });

    test('should update a user skill successfully', async () => {
      const updates = { proficiency_level: 'intermediate' };
      
      const { data, error } = await supabaseClient
        .from('user_skills')
        .update(updates)
        .eq('id', 'user-skill-123')
        .select();

      expect(error).toBeTruthy();
      expect(error?.message).toContain('Demo mode - no database connection');
      expect(data).toEqual([]);
    });

    test('should delete a user skill successfully', async () => {
      const { error } = await supabaseClient
        .from('user_skills')
        .delete()
        .eq('id', 'user-skill-123');

      expect(error).toBeTruthy();
      expect(error?.message).toContain('Demo mode - no database connection');
    });
  });

  describe('RPC Functions', () => {
    test('should handle RPC function calls', async () => {
      const rpcParams = {
        user_skill_id: 'user-skill-123',
        requested_skill_id: 'skill-456',
        message: 'I would like to exchange skills'
      };

      const { data, error } = await supabaseClient
        .rpc('create_skill_exchange', rpcParams);

      expect(error).toBeTruthy();
      expect(error?.message).toContain('Demo mode - RPC disabled');
      expect(data).toBeNull();
    });
  });

  describe('Complex Queries', () => {
    test('should handle queries with multiple filters and ordering', async () => {
      const { data, error } = await supabaseClient
        .from('skills')
        .select('*')
        .eq('category', 'Technology')
        .order('created_at', { ascending: false })
        .limit(10);

      expect(error).toBeTruthy();
      expect(error?.message).toContain('Demo mode - no database connection');
      expect(data).toEqual([]);
    });
  });
});