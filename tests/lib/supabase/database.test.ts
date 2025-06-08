/**
 * Database Interaction Tests
 *
 * Tests for the database operations through Supabase
 */

import { supabaseClient } from '@/lib/supabase/client';
import { supabaseMock } from '../../mocks/supabaseMock';

// Mock the supabaseClient import
jest.mock('@/lib/supabase/client', () => {
  // Require supabaseMock inside the factory to avoid hoisting issues
  const { supabaseMock: requiredSupabaseMock } = require('../../mocks/supabaseMock');
  return {
    supabaseClient: requiredSupabaseMock
  };
});

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
      const thenMockFn = jest.fn().mockResolvedValueOnce({ data: [mockSkill], error: null });
      const selectMockFn = jest.fn().mockReturnValue({
        // The select call in this test is just supabaseClient.from('skills').select('*')
        // which is awaited, so it needs a 'then' method.
        // Other methods like eq, order, etc., are not called in this specific test's execution path.
        then: thenMockFn
      });

      supabaseMock.from.mockImplementationOnce((tableName) => { // Use mockImplementationOnce
        if (tableName === 'skills') {
          return {
            select: selectMockFn,
            // Provide minimal fallbacks for other QueryBuilder methods not used in this test
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          } as any;
        }
        // Fallback for any other table name (should not be hit in this specific test)
        return {
          select: jest.fn().mockReturnValue({ then: jest.fn() }), // Ensure fallback select is also thenable
          insert: jest.fn(), update: jest.fn(), delete: jest.fn()
        } as any;
      });

      const { data, error } = await supabaseClient.from('skills').select('*');

      expect(error).toBeNull();
      expect(data).toEqual([mockSkill]);
      expect(supabaseMock.from).toHaveBeenCalledWith('skills');
      expect(selectMockFn).toHaveBeenCalledWith('*');
      expect(thenMockFn).toHaveBeenCalled(); // Ensure the mock promise was awaited
    });

    test('should handle error when fetching skills', async () => {
      const thenMockFn = jest.fn().mockResolvedValueOnce({ data: null, error: { message: 'Error fetching skills' } });
      const selectMockFn = jest.fn().mockReturnValue({ then: thenMockFn }); // select() returns obj with .then

      supabaseMock.from.mockImplementationOnce((tableName) => { // Use mockImplementationOnce
        if (tableName === 'skills') {
          return {
            select: selectMockFn,
            insert: jest.fn(), update: jest.fn(), delete: jest.fn()
          } as any;
        }
        return {
          select: jest.fn().mockReturnValue({ then: jest.fn() }),
          insert: jest.fn(), update: jest.fn(), delete: jest.fn()
        } as any;
      });

      const { data, error } = await supabaseClient.from('skills').select('*');

      expect(error).toEqual({ message: 'Error fetching skills' });
      expect(data).toBeNull();
      expect(supabaseMock.from).toHaveBeenCalledWith('skills'); // Added assertion for from
      expect(selectMockFn).toHaveBeenCalledWith('*'); // Added assertion for select
      expect(thenMockFn).toHaveBeenCalled(); // Added assertion for then
    });

    test('should insert a skill successfully', async () => {
      const thenMockFn = jest.fn().mockResolvedValueOnce({ data: [mockSkill], error: null });
      const selectMockFn = jest.fn().mockReturnValue({ then: thenMockFn });
      const insertMockFn = jest.fn().mockReturnValue({ select: selectMockFn });

      supabaseMock.from.mockImplementationOnce((tableName) => { // Use mockImplementationOnce
        if (tableName === 'skills') {
          return {
            insert: insertMockFn,
            // Fallbacks
            select: jest.fn().mockReturnValue({ then: jest.fn() }),
            update: jest.fn(),
            delete: jest.fn()
          } as any;
        }
        return {
          insert: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ then: jest.fn() }) }),
          select: jest.fn().mockReturnValue({ then: jest.fn() }),
          update: jest.fn(),
          delete: jest.fn()
        } as any;
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

      // Setup mock response for update(...).eq(...).select().then()
      const thenMockFn = jest.fn().mockResolvedValueOnce({ data: [{ ...mockSkill, ...updates }], error: null });
      const selectMockFn = jest.fn().mockReturnValue({ then: thenMockFn });
      const eqMockFn = jest.fn().mockReturnValue({ select: selectMockFn });
      const updateMockFn = jest.fn().mockReturnValue({ eq: eqMockFn });

      supabaseMock.from.mockImplementationOnce((tableName) => { // Use mockImplementationOnce
        if (tableName === 'skills') {
          return {
            update: updateMockFn,
            // Fallbacks
            select: jest.fn().mockReturnValue({ then: jest.fn() }),
            insert: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ then: jest.fn() }) }),
            delete: jest.fn()
          } as any;
        }
        return {
          update: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ then: jest.fn() }) }) }),
          select: jest.fn().mockReturnValue({ then: jest.fn() }),
          insert: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ then: jest.fn() }) }),
          delete: jest.fn()
        } as any;
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
      // Setup mock response for delete(...).eq(...).then()
      const thenMockFn = jest.fn().mockResolvedValueOnce({ data: { id: 'skill-123' }, error: null });
      const eqMockFn = jest.fn().mockReturnValue({ then: thenMockFn }); // eq() after delete should be thenable
      const deleteMockFn = jest.fn().mockReturnValue({ eq: eqMockFn });

      supabaseMock.from.mockImplementationOnce((tableName) => { // Use mockImplementationOnce
        if (tableName === 'skills') {
          return {
            delete: deleteMockFn,
            // Fallbacks
            select: jest.fn().mockReturnValue({ then: jest.fn() }),
            insert: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ then: jest.fn() }) }),
            update: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ then: jest.fn() }) }) })
          } as any;
        }
        return {
          delete: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ then: jest.fn() }) }),
          select: jest.fn().mockReturnValue({ then: jest.fn() }),
          insert: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ then: jest.fn() }) }),
          update: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ then: jest.fn() }) }) })
        } as any;
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
      const singleMockFn = jest.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
      // Define the chainable object that eq should return
      const eqReturnMock: any = { single: singleMockFn };
      // Add other methods if eq can be further chained before single
      // For example, if order could be called: eqReturnMock.order = jest.fn(() => eqReturnMock);
      const eqMockFn = jest.fn().mockReturnValue(eqReturnMock);

      const selectMockFn = jest.fn().mockReturnValue({
        eq: eqMockFn,
        // Add other methods like order, limit, etc., if they can be called directly after select
        single: singleMockFn // If select().single() is a path
      });

      supabaseMock.from.mockImplementation((tableName) => {
        if (tableName === 'profiles') {
          return {
            select: selectMockFn,
            insert: jest.fn(), update: jest.fn(), delete: jest.fn()
          } as any;
        }
        return { select: jest.fn(), insert: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
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

      // Setup mock response for update().eq().then()
      const thenMockFn = jest.fn().mockResolvedValueOnce({ data: { ...mockProfile, ...updates }, error: null });
      // eq() on update returns an object with .then (and .select according to supabaseMock.ts)
      const eqReturnMock = {
        then: thenMockFn,
        select: jest.fn(() => ({ single: jest.fn(), then: jest.fn() }))
      };
      const updateMockFn = jest.fn().mockReturnValue({ eq: jest.fn(() => eqReturnMock) });

      supabaseMock.from.mockImplementation((tableName) => {
        if (tableName === 'profiles') {
          return {
            update: updateMockFn,
            select: jest.fn(), insert: jest.fn(), delete: jest.fn()
          } as any;
        }
        return { select: jest.fn(), insert: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
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
      // Setup mock response for select().eq().then()
      const thenMockFn = jest.fn().mockResolvedValueOnce({
        data: [{
          ...mockUserSkill,
          skills: {
            name: 'JavaScript',
            category: 'Technology'
          }
        }],
        error: null
      });
      const eqReturnMock = { then: thenMockFn }; // eq returns object with then
      // Add other methods to eqReturnMock if they can be chained after eq before then
      const selectMockFn = jest.fn().mockReturnValue({ eq: jest.fn(() => eqReturnMock) });

      supabaseMock.from.mockImplementation((tableName) => {
        if (tableName === 'user_skills') {
          return {
            select: selectMockFn,
            insert: jest.fn(), update: jest.fn(), delete: jest.fn()
          } as any;
        }
        return { select: jest.fn(), insert: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
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
      // Setup mock response for insert().select().then()
      const thenMockFn = jest.fn().mockResolvedValueOnce({ data: [mockUserSkill], error: null });
      const selectReturnMock = { then: thenMockFn, single: jest.fn() };
      const insertMockFn = jest.fn().mockReturnValue({ select: jest.fn(() => selectReturnMock) });

      supabaseMock.from.mockImplementation((tableName) => {
        if (tableName === 'user_skills') {
          return {
            insert: insertMockFn,
            select: jest.fn(), update: jest.fn(), delete: jest.fn()
          } as any;
        }
        return { select: jest.fn(), insert: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
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

      // Setup mock response for update().eq().select().then()
      const thenMockFn = jest.fn().mockResolvedValueOnce({ data: [{ ...mockUserSkill, ...updates }], error: null });
      const selectReturnMock = { then: thenMockFn, single: jest.fn() };
      const eqReturnMock = { select: jest.fn(() => selectReturnMock), then: jest.fn() };
      const updateMockFn = jest.fn().mockReturnValue({ eq: jest.fn(() => eqReturnMock) });

      supabaseMock.from.mockImplementation((tableName) => {
        if (tableName === 'user_skills') {
          return {
            update: updateMockFn,
            select: jest.fn(), insert: jest.fn(), delete: jest.fn()
          } as any;
        }
        return { select: jest.fn(), insert: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
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
      // Setup mock response for delete().eq().then()
      const thenMockFn = jest.fn().mockResolvedValueOnce({ data: { id: 'user-skill-123' }, error: null });
      const eqReturnMock = { then: thenMockFn, select: jest.fn(() => ({ single: jest.fn(), then: jest.fn() })) };
      const deleteMockFn = jest.fn().mockReturnValue({ eq: jest.fn(() => eqReturnMock) });

      supabaseMock.from.mockImplementation((tableName) => {
        if (tableName === 'user_skills') {
          return {
            delete: deleteMockFn,
            select: jest.fn(), insert: jest.fn(), update: jest.fn()
          } as any;
        }
        return { select: jest.fn(), insert: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
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
      const mockData = [{ id: 'result-1' }, { id: 'result-2' }];
      // Setup mock response for select().eq().eq().in().order().limit().then()

      const queryChainMock: any = {};
      const thenMockFn = jest.fn().mockResolvedValueOnce({ data: mockData, error: null });
      // Each method in the chain needs to return the object that has the *next* method,
      // and ultimately the object that `limit` returns must have `then`.
      // For simplicity, we make all chainable methods return the same `queryChainMock` which has all of them.
      const rangeMockFn = jest.fn(() => queryChainMock); // Not used in this query, but part of full select mock
      const limitMockFn = jest.fn(() => queryChainMock);
      const orderMockFn = jest.fn(() => queryChainMock);
      const inMockFn = jest.fn(() => queryChainMock);
      const eqMockFn = jest.fn(() => queryChainMock); // This will handle both .eq calls

      Object.assign(queryChainMock, {
        eq: eqMockFn,
        in: inMockFn,
        order: orderMockFn,
        limit: limitMockFn,
        range: rangeMockFn, // Not strictly needed for this test's chain but good for completeness
        then: thenMockFn
      });

      const selectMockFn = jest.fn().mockReturnValue(queryChainMock);

      supabaseMock.from.mockImplementation((tableName) => {
        if (tableName === 'skills') {
          return {
            select: selectMockFn,
            insert: jest.fn(), update: jest.fn(), delete: jest.fn()
          } as any;
        }
        return { select: jest.fn(), insert: jest.fn(), update: jest.fn(), delete: jest.fn() } as any;
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
