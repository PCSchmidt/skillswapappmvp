t/**
 * Database Interaction Tests
 * 
 * Tests for the database operations through Supabase
 */

import { supabaseClient } from '@/lib/supabase/client';
import { supabaseMock } from '../../mocks/supabaseMock';

// Mock the supabaseClient import
jest.mock('@/lib/supabase/client', () => ({
  supabaseClient: supabaseMock
}));

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
      // Setup mock response
      supabaseMock.from().select().mockResolvedValue({
        data: [mockSkill],
        error: null
      });

      // Execute the query
      const { data, error } = await supabaseClient
        .from('skills')
        .select('*');

      // Assertions
      expect(error).toBeNull();
      expect(data).toEqual([mockSkill]);
      expect(supabaseMock.from).toHaveBeenCalledWith('skills');
      expect(supabaseMock.from().select).toHaveBeenCalledWith('*');
    });

    test('should handle error when fetching skills', async () => {
      // Setup mock error response
      supabaseMock.from().select().mockResolvedValue({
        data: null,
        error: { message: 'Error fetching skills' }
      });

      // Execute the query
      const { data, error } = await supabaseClient
        .from('skills')
        .select('*');

      // Assertions
      expect(error).toBeTruthy();
      expect(data).toBeNull();
    });

    test('should insert a skill successfully', async () => {
      // Setup mock response
      supabaseMock.from().insert().select().mockResolvedValue({
        data: [mockSkill],
        error: null
      });

      // Execute the query
      const { data, error } = await supabaseClient
        .from('skills')
        .insert(mockSkill)
        .select();

      // Assertions
      expect(error).toBeNull();
      expect(data).toEqual([mockSkill]);
      expect(supabaseMock.from).toHaveBeenCalledWith('skills');
      expect(supabaseMock.from().insert).toHaveBeenCalledWith(mockSkill);
    });

    test('should update a skill successfully', async () => {
      const updates = { name: 'JavaScript ES6' };
      
      // Setup mock response
      supabaseMock.from().update().eq().select().mockResolvedValue({
        data: [{ ...mockSkill, ...updates }],
        error: null
      });

      // Execute the query
      const { data, error } = await supabaseClient
        .from('skills')
        .update(updates)
        .eq('id', 'skill-123')
        .select();

      // Assertions
      expect(error).toBeNull();
      expect(data).toEqual([{ ...mockSkill, ...updates }]);
      expect(supabaseMock.from).toHaveBeenCalledWith('skills');
      expect(supabaseMock.from().update).toHaveBeenCalledWith(updates);
      expect(supabaseMock.from().update().eq).toHaveBeenCalledWith('id', 'skill-123');
    });

    test('should delete a skill successfully', async () => {
      // Setup mock response
      supabaseMock.from().delete().eq().mockResolvedValue({
        data: { id: 'skill-123' },
        error: null
      });

      // Execute the query
      const { data, error } = await supabaseClient
        .from('skills')
        .delete()
        .eq('id', 'skill-123');

      // Assertions
      expect(error).toBeNull();
      expect(data).toEqual({ id: 'skill-123' });
      expect(supabaseMock.from).toHaveBeenCalledWith('skills');
      expect(supabaseMock.from().delete).toHaveBeenCalled();
      expect(supabaseMock.from().delete().eq).toHaveBeenCalledWith('id', 'skill-123');
    });
  });

  describe('User Profiles Table Operations', () => {
    const mockProfile = {
      id: 'user-123',
      username: 'johndoe',
      full_name: 'John Doe',
      bio: 'Software developer',
      avatar_url: 'https://example.com/avatar.jpg',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        description: 'New York, NY'
      }
    };

    test('should fetch a user profile successfully', async () => {
      // Setup mock response
      supabaseMock.from().select().eq().single().mockResolvedValue({
        data: mockProfile,
        error: null
      });

      // Execute the query
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', 'user-123')
        .single();

      // Assertions
      expect(error).toBeNull();
      expect(data).toEqual(mockProfile);
      expect(supabaseMock.from).toHaveBeenCalledWith('profiles');
      expect(supabaseMock.from().select).toHaveBeenCalledWith('*');
      expect(supabaseMock.from().select().eq).toHaveBeenCalledWith('id', 'user-123');
    });

    test('should update a user profile successfully', async () => {
      const updates = { bio: 'Senior software developer' };
      
      // Setup mock response
      supabaseMock.from().update().eq().mockResolvedValue({
        data: { ...mockProfile, ...updates },
        error: null
      });

      // Execute the query
      const { data, error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', 'user-123');

      // Assertions
      expect(error).toBeNull();
      expect(data).toEqual({ ...mockProfile, ...updates });
      expect(supabaseMock.from).toHaveBeenCalledWith('profiles');
      expect(supabaseMock.from().update).toHaveBeenCalledWith(updates);
      expect(supabaseMock.from().update().eq).toHaveBeenCalledWith('id', 'user-123');
    });
  });

  describe('User Skills Table Operations', () => {
    const mockUserSkill = {
      id: 'user-skill-123',
      user_id: 'user-123',
      skill_id: 'skill-123',
      proficiency_level: 'expert',
      is_offering: true,
      years_experience: 5
    };

    test('should fetch user skills successfully', async () => {
      // Setup mock response for joined query
      supabaseMock.from().select().eq().mockResolvedValue({
        data: [{
          ...mockUserSkill,
          skills: {
            name: 'JavaScript',
            category: 'Technology'
          }
        }],
        error: null
      });

      // Execute the query with joins
      const { data, error } = await supabaseClient
        .from('user_skills')
        .select(`
          *,
          skills (
            name,
            category
          )
        `)
        .eq('user_id', 'user-123');

      // Assertions
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data && data[0].skills.name).toBe('JavaScript');
      expect(supabaseMock.from).toHaveBeenCalledWith('user_skills');
      expect(supabaseMock.from().select).toHaveBeenCalledWith(`
          *,
          skills (
            name,
            category
          )
        `);
      expect(supabaseMock.from().select().eq).toHaveBeenCalledWith('user_id', 'user-123');
    });

    test('should insert a user skill successfully', async () => {
      // Setup mock response
      supabaseMock.from().insert().select().mockResolvedValue({
        data: [mockUserSkill],
        error: null
      });

      // Execute the query
      const { data, error } = await supabaseClient
        .from('user_skills')
        .insert(mockUserSkill)
        .select();

      // Assertions
      expect(error).toBeNull();
      expect(data).toEqual([mockUserSkill]);
      expect(supabaseMock.from).toHaveBeenCalledWith('user_skills');
      expect(supabaseMock.from().insert).toHaveBeenCalledWith(mockUserSkill);
    });

    test('should update a user skill successfully', async () => {
      const updates = { proficiency_level: 'intermediate' };
      
      // Setup mock response
      supabaseMock.from().update().eq().select().mockResolvedValue({
        data: [{ ...mockUserSkill, ...updates }],
        error: null
      });

      // Execute the query
      const { data, error } = await supabaseClient
        .from('user_skills')
        .update(updates)
        .eq('id', 'user-skill-123')
        .select();

      // Assertions
      expect(error).toBeNull();
      expect(data).toEqual([{ ...mockUserSkill, ...updates }]);
      expect(supabaseMock.from).toHaveBeenCalledWith('user_skills');
      expect(supabaseMock.from().update).toHaveBeenCalledWith(updates);
      expect(supabaseMock.from().update().eq).toHaveBeenCalledWith('id', 'user-skill-123');
    });

    test('should delete a user skill successfully', async () => {
      // Setup mock response
      supabaseMock.from().delete().eq().mockResolvedValue({
        data: { id: 'user-skill-123' },
        error: null
      });

      // Execute the query
      const { data, error } = await supabaseClient
        .from('user_skills')
        .delete()
        .eq('id', 'user-skill-123');

      // Assertions
      expect(error).toBeNull();
      expect(data).toEqual({ id: 'user-skill-123' });
      expect(supabaseMock.from).toHaveBeenCalledWith('user_skills');
      expect(supabaseMock.from().delete).toHaveBeenCalled();
      expect(supabaseMock.from().delete().eq).toHaveBeenCalledWith('id', 'user-skill-123');
    });
  });

  describe('Transactions and Complex Queries', () => {
    test('should handle a transaction with multiple operations', async () => {
      // Mock the Supabase transaction methods
      const mockFn = jest.fn().mockImplementation((name, params) => {
        return Promise.resolve({
          data: { success: true },
          error: null
        });
      });
      
      // Add rpc method to mock for this test
      jest.spyOn(supabaseClient, 'rpc').mockImplementation(mockFn);

      // Execute the transaction
      const { data, error } = await supabaseClient
        .rpc('create_skill_exchange', {
          user1_id: 'user-123',
          user2_id: 'user-456',
          skill1_id: 'skill-123',
          skill2_id: 'skill-456'
        });

      // Assertions
      expect(error).toBeNull();
      expect(data).toEqual({ success: true });
      expect(supabaseClient.rpc).toHaveBeenCalledWith('create_skill_exchange', {
        user1_id: 'user-123',
        user2_id: 'user-456',
        skill1_id: 'skill-123',
        skill2_id: 'skill-456'
      });
    });

    test('should handle a complex query with multiple filters and ordering', async () => {
      // Setup mock response
      supabaseMock.from().select().eq().eq().in().order().limit().mockResolvedValue({
        data: [{ id: 'result-1' }, { id: 'result-2' }],
        error: null
      });

      // Execute a complex query
      const { data, error } = await supabaseClient
        .from('skills')
        .select('*')
        .eq('category', 'Technology')
        .eq('is_active', true)
        .in('proficiency_level', ['beginner', 'intermediate'])
        .order('name', { ascending: true })
        .limit(10);

      // Assertions
      expect(error).toBeNull();
      expect(data).toHaveLength(2);
      expect(supabaseMock.from).toHaveBeenCalledWith('skills');
      expect(supabaseMock.from().select).toHaveBeenCalledWith('*');
      expect(supabaseMock.from().select().eq).toHaveBeenCalledWith('category', 'Technology');
      expect(supabaseMock.from().select().eq().eq).toHaveBeenCalledWith('is_active', true);
      expect(supabaseMock.from().select().eq().eq().in).toHaveBeenCalledWith('proficiency_level', ['beginner', 'intermediate']);
      expect(supabaseMock.from().select().eq().eq().in().order).toHaveBeenCalledWith('name', { ascending: true });
      expect(supabaseMock.from().select().eq().eq().in().order().limit).toHaveBeenCalledWith(10);
    });
  });
});
