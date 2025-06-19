/**
 * Database Interaction Tests
 * 
 * Tests for the database operations through Supabase
 */

// Import the actual supabaseClient for use in tests (it will be mocked by Jest)
import { supabaseClient } from '@/lib/supabase/client'; 

// Define a variable for the mock that Jest can hoist and assign to
let importedSupabaseMock: typeof import('@mocks/supabaseMock').supabaseMock;

// Mock the '@/lib/supabase/client' module to use our supabaseMock for its 'supabaseClient' export
jest.mock('@/lib/supabase/client', () => {
  // Assign the actual mock to the hoisted variable inside the factory
  // This ensures it's initialized when the factory is executed.
  importedSupabaseMock = jest.requireActual('@mocks/supabaseMock').supabaseMock;
  return {
    supabaseClient: importedSupabaseMock,
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
      // importedSupabaseMock.from('skills').select() returns FinalQueryMock from the mock file
      // Call its custom mockResolvedValue
      importedSupabaseMock.from('skills').select().mockResolvedValue({
        data: [mockSkill],
        error: null,
        count: 1,
      });

      const { data, error } = await supabaseClient
        .from('skills')
        .select('*');

      expect(error).toBeNull();
      expect(data).toEqual([mockSkill]);
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('skills');
      // importedSupabaseMock.from('skills').select is a jest.fn
      expect(importedSupabaseMock.from('skills').select as jest.Mock).toHaveBeenCalledWith('*');
    });

    test('should handle error when fetching skills', async () => {
      importedSupabaseMock.from('skills').select().mockResolvedValue({
        data: null,
        error: { message: 'Error fetching skills' },
        count: 0,
      });

      const { data, error } = await supabaseClient
        .from('skills')
        .select('*');

      expect(error).toBeTruthy();
      expect(data).toBeNull();
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('skills');
      expect(importedSupabaseMock.from('skills').select as jest.Mock).toHaveBeenCalledWith('*');
    });

    test('should insert a skill successfully', async () => {
      // from().insert() returns ChainedMutationMock
      // ChainedMutationMock.select() returns FinalQueryMock
      importedSupabaseMock.from('skills').insert(mockSkill).select().mockResolvedValue({
        data: [mockSkill],
        error: null,
        count: 1,
      });

      const { data, error } = await supabaseClient
        .from('skills')
        .insert(mockSkill)
        .select();

      expect(error).toBeNull();
      expect(data).toEqual([mockSkill]);
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('skills');
      expect(importedSupabaseMock.from('skills').insert as jest.Mock).toHaveBeenCalledWith(mockSkill);
      expect(importedSupabaseMock.from('skills').insert(mockSkill).select as jest.Mock).toHaveBeenCalled();
    });

    test('should update a skill successfully', async () => {
      const updates = { name: 'JavaScript ES6' };
      // from().update() -> ChainedMutationMock
      // .eq() -> ChainedMutationMock
      // .select() -> FinalQueryMock
      importedSupabaseMock.from('skills').update(updates).eq('id', 'skill-123').select().mockResolvedValue({
        data: [{ ...mockSkill, ...updates }],
        error: null,
        count: 1,
      });

      const { data, error } = await supabaseClient
        .from('skills')
        .update(updates)
        .eq('id', 'skill-123')
        .select();

      expect(error).toBeNull();
      expect(data).toEqual([{ ...mockSkill, ...updates }]);
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('skills');
      expect(importedSupabaseMock.from('skills').update as jest.Mock).toHaveBeenCalledWith(updates);
      expect(importedSupabaseMock.from('skills').update(updates).eq as jest.Mock).toHaveBeenCalledWith('id', 'skill-123');
      expect(importedSupabaseMock.from('skills').update(updates).eq('id', 'skill-123').select as jest.Mock).toHaveBeenCalled();
    });

    test('should delete a skill successfully', async () => {
      // from().delete() -> ChainedMutationMock
      // .eq() -> ChainedMutationMock (which has custom mockResolvedValue)
      importedSupabaseMock.from('skills').delete().eq('id', 'skill-123').mockResolvedValue({
        data: { id: 'skill-123' }, 
        error: null,
        count: 1, 
      });

      const { data, error } = await supabaseClient
        .from('skills')
        .delete()
        .eq('id', 'skill-123');

      expect(error).toBeNull();
      expect(data).toEqual({ id: 'skill-123' });
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('skills');
      expect(importedSupabaseMock.from('skills').delete as jest.Mock).toHaveBeenCalled();
      expect(importedSupabaseMock.from('skills').delete().eq as jest.Mock).toHaveBeenCalledWith('id', 'skill-123');
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
      // Correct chain based on __mocks__/supabaseMock.ts:
      // importedSupabaseMock.from('profiles').eq(...).select() returns FinalQueryMock
      // FinalQueryMock.single is a jest.fn(). We mock its resolved value.
      const finalQueryMockInstance = importedSupabaseMock.from('profiles').eq('id', 'user-123').select();
      (finalQueryMockInstance.single as jest.Mock).mockResolvedValue({
        data: mockProfile,
        error: null,
        // count: 1, // single() in Supabase doesn't typically return count in the same way as a list
      });


      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*') 
        .eq('id', 'user-123')
        .single();

      expect(error).toBeNull();
      expect(data).toEqual(mockProfile);
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('profiles');
      expect(importedSupabaseMock.from('profiles').eq as jest.Mock).toHaveBeenCalledWith('id', 'user-123');
      // The select('*') is called on the QueryBuilder returned by eq()
      expect(importedSupabaseMock.from('profiles').eq('id', 'user-123').select as jest.Mock).toHaveBeenCalledWith('*');
      // The single() is called on the FinalQueryMock returned by select()
      expect(importedSupabaseMock.from('profiles').eq('id', 'user-123').select('*').single as jest.Mock).toHaveBeenCalled();
    });

    test('should update a user profile successfully', async () => {
      const updates = { bio: 'Senior software developer' };
      // from().update() -> ChainedMutationMock, .eq() -> ChainedMutationMock (has custom mockResolvedValue)
      importedSupabaseMock.from('profiles').update(updates).eq('id', 'user-123').mockResolvedValue({
        data: { ...mockProfile, ...updates }, // Supabase update might return the updated record or just a success/count
        error: null,
        count: 1,
      });

      const { data, error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', 'user-123');

      expect(error).toBeNull();
      // Adjust expectation based on what Supabase update (without select) actually returns
      // Often it's just { data: null, error: null, count: 1 } or similar if no data is returned by default
      // For this mock, we've made it return the updated data.
      expect(data).toEqual({ ...mockProfile, ...updates });
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('profiles');
      expect(importedSupabaseMock.from('profiles').update as jest.Mock).toHaveBeenCalledWith(updates);
      expect(importedSupabaseMock.from('profiles').update(updates).eq as jest.Mock).toHaveBeenCalledWith('id', 'user-123');
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
    const joinedSelectQuery = `
          *,
          skills (
            name,
            category
          )
        `;

    test('should fetch user skills successfully', async () => {
      // from -> QB, eq -> QB, select -> FinalQuery
      importedSupabaseMock.from('user_skills').eq('user_id', 'user-123').select().mockResolvedValue({
        data: [{ ...mockUserSkill, skills: { name: 'JavaScript', category: 'Technology' } }],
        error: null,
        count: 1,
      });

      const { data, error } = await supabaseClient
        .from('user_skills')
        .select(joinedSelectQuery)
        .eq('user_id', 'user-123');

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data && data[0].skills.name).toBe('JavaScript');
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('user_skills');
      expect(importedSupabaseMock.from('user_skills').eq as jest.Mock).toHaveBeenCalledWith('user_id', 'user-123');
      expect(importedSupabaseMock.from('user_skills').eq('user_id', 'user-123').select as jest.Mock).toHaveBeenCalledWith(joinedSelectQuery);
    });

    test('should insert a user skill successfully', async () => {
      importedSupabaseMock.from('user_skills').insert(mockUserSkill).select().mockResolvedValue({
        data: [mockUserSkill],
        error: null,
        count: 1,
      });

      const { data, error } = await supabaseClient
        .from('user_skills')
        .insert(mockUserSkill)
        .select();

      expect(error).toBeNull();
      expect(data).toEqual([mockUserSkill]);
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('user_skills');
      expect(importedSupabaseMock.from('user_skills').insert as jest.Mock).toHaveBeenCalledWith(mockUserSkill);
      expect(importedSupabaseMock.from('user_skills').insert(mockUserSkill).select as jest.Mock).toHaveBeenCalled();
    });

    test('should update a user skill successfully', async () => {
      const updates = { proficiency_level: 'intermediate' };
      importedSupabaseMock.from('user_skills').update(updates).eq('id', 'user-skill-123').select().mockResolvedValue({
        data: [{ ...mockUserSkill, ...updates }],
        error: null,
        count: 1,
      });

      const { data, error } = await supabaseClient
        .from('user_skills')
        .update(updates)
        .eq('id', 'user-skill-123')
        .select();

      expect(error).toBeNull();
      expect(data).toEqual([{ ...mockUserSkill, ...updates }]);
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('user_skills');
      expect(importedSupabaseMock.from('user_skills').update as jest.Mock).toHaveBeenCalledWith(updates);
      expect(importedSupabaseMock.from('user_skills').update(updates).eq as jest.Mock).toHaveBeenCalledWith('id', 'user-skill-123');
    });

    test('should delete a user skill successfully', async () => {
      importedSupabaseMock.from('user_skills').delete().eq('id', 'user-skill-123').mockResolvedValue({
        data: { id: 'user-skill-123' }, 
        error: null,
        count: 1,
      });

      const { data, error } = await supabaseClient
        .from('user_skills')
        .delete()
        .eq('id', 'user-skill-123');

      expect(error).toBeNull();
      expect(data).toEqual({ id: 'user-skill-123' });
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('user_skills');
      expect(importedSupabaseMock.from('user_skills').delete as jest.Mock).toHaveBeenCalled();
      expect(importedSupabaseMock.from('user_skills').delete().eq as jest.Mock).toHaveBeenCalledWith('id', 'user-skill-123');
    });
  });

  describe('Transactions and Complex Queries', () => {
    test('should handle a transaction with multiple operations', async () => {
      const rpcParams = {
        user1_id: 'user-123',
        user2_id: 'user-456',
        skill1_id: 'skill-123',
        skill2_id: 'skill-456'
      };
      // importedSupabaseMock.rpc is jest.fn(() => createFinalQueryMock())
      // So, importedSupabaseMock.rpc() returns FinalQueryMock, which has custom mockResolvedValue
      importedSupabaseMock.rpc('create_skill_exchange', rpcParams).mockResolvedValue({
        data: { success: true },
        error: null,
        count: 0, 
      });

      const { data, error } = await supabaseClient
        .rpc('create_skill_exchange', rpcParams);

      expect(error).toBeNull();
      expect(data).toEqual({ success: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      expect(importedSupabaseMock.rpc as jest.Mock).toHaveBeenCalledWith('create_skill_exchange', rpcParams);
    });

    test('should handle a complex query with multiple filters and ordering', async () => {
      // Corrected chain for mock setup based on __mocks__/supabaseMock.ts:
      // from() -> QB. eq() -> QB. eq() -> QB. in() -> QB. order() -> QB. limit() -> QB. select() -> FinalQuery
      importedSupabaseMock.from('skills')
        .eq('category', 'Technology') // Returns QB
        .eq('is_active', true) // Returns QB
        .in('proficiency_level', ['beginner', 'intermediate']) // Returns QB
        .order('name', { ascending: true }) // Returns QB
        .limit(10) // Returns QB
        .select() // Returns FinalQueryMock
        .mockResolvedValue({ // Call custom mockResolvedValue on FinalQueryMock
          data: [{ id: 'result-1' }, { id: 'result-2' }],
          error: null,
          count: 2,
        });

      const { data, error } = await supabaseClient
        .from('skills')
        .select('*') 
        .eq('category', 'Technology')
        .eq('is_active', true)
        .in('proficiency_level', ['beginner', 'intermediate'])
        .order('name', { ascending: true })
        .limit(10);

      expect(error).toBeNull();
      expect(data).toHaveLength(2);
      
      expect(importedSupabaseMock.from).toHaveBeenCalledWith('skills');
      // const queryBuilderInstance = importedSupabaseMock.from('skills'); // This instance is for assertions - removed as unused
      expect(importedSupabaseMock.from('skills').eq as jest.Mock).toHaveBeenCalledWith('category', 'Technology');
      expect(importedSupabaseMock.from('skills').eq as jest.Mock).toHaveBeenCalledWith('is_active', true);
      expect(importedSupabaseMock.from('skills').in as jest.Mock).toHaveBeenCalledWith('proficiency_level', ['beginner', 'intermediate']);
      expect(importedSupabaseMock.from('skills').order as jest.Mock).toHaveBeenCalledWith('name', { ascending: true });
      expect(importedSupabaseMock.from('skills').limit as jest.Mock).toHaveBeenCalledWith(10);
      // The select('*') in the actual call is on the queryBuilderInstance
      expect(importedSupabaseMock.from('skills').select as jest.Mock).toHaveBeenCalledWith('*');
    });
  });
});