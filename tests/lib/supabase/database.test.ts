import { supabaseClient } from '@/lib/supabase/client';

// Mock the client module - it will use the __mocks__ folder automatically
jest.mock('@/lib/supabase/client');

// Get the mocked client
const mockedSupabaseClient = supabaseClient as jest.Mocked<typeof supabaseClient>;

/**
 * Database Interaction Tests
 * 
 * Tests for the database operations through Supabase
 */

describe('Database Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Skills Table Operations', () => {
    const mockSkill = {
      id: 'skill-123',
      name: 'JavaScript',
      category: 'Technology',
      description: 'Programming in JavaScript'
    };

    test('should fetch skills successfully', async () => {
      // The mock should automatically return skills data from the default mock data
      const { data, error } = await supabaseClient
        .from('skills')
        .select('*');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      // Test that we can access the from method
      expect(mockedSupabaseClient.from).toHaveBeenCalledWith('skills');
    });

    test('should handle basic CRUD operations', async () => {
      // Test insert
      const { data: insertData, error: insertError } = await supabaseClient
        .from('skills')
        .insert(mockSkill)
        .select();

      expect(insertError).toBeNull();
      expect(insertData).toBeDefined();

      // Test update  
      const updates = { name: 'JavaScript ES6' };
      const { data: updateData, error: updateError } = await supabaseClient
        .from('skills')
        .update(updates)
        .eq('id', 'skill-123')
        .select();

      expect(updateError).toBeNull();
      expect(updateData).toBeDefined();

      // Test delete
      const { error: deleteError } = await supabaseClient
        .from('skills')
        .delete()
        .eq('id', 'skill-123');

      expect(deleteError).toBeNull();
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

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(mockedSupabaseClient.from).toHaveBeenCalledWith('profiles');
    });

    test('should update a user profile successfully', async () => {
      const updates = { bio: 'Senior software developer' };
      
      const { data, error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', 'user-123')
        .select();

      expect(error).toBeNull();
      expect(mockedSupabaseClient.from).toHaveBeenCalledWith('profiles');
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

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(mockedSupabaseClient.from).toHaveBeenCalledWith('user_skills');
    });

    test('should insert a user skill successfully', async () => {
      const { data, error } = await supabaseClient
        .from('user_skills')
        .insert(mockUserSkill)
        .select();

      expect(error).toBeNull();
      expect(mockedSupabaseClient.from).toHaveBeenCalledWith('user_skills');
    });

    test('should update a user skill successfully', async () => {
      const updates = { proficiency_level: 'intermediate' };
      
      const { data, error } = await supabaseClient
        .from('user_skills')
        .update(updates)
        .eq('id', 'user-skill-123')
        .select();

      expect(error).toBeNull();
      expect(mockedSupabaseClient.from).toHaveBeenCalledWith('user_skills');
    });

    test('should delete a user skill successfully', async () => {
      const { error } = await supabaseClient
        .from('user_skills')
        .delete()
        .eq('id', 'user-skill-123');

      expect(error).toBeNull();
      expect(mockedSupabaseClient.from).toHaveBeenCalledWith('user_skills');
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

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(mockedSupabaseClient.rpc).toHaveBeenCalledWith('create_skill_exchange', rpcParams);
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

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(mockedSupabaseClient.from).toHaveBeenCalledWith('skills');    });
  });
});