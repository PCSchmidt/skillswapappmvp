// tests/lib/supabase/client.test.ts
import {
  getProfile,
  getUserSkills,
  searchSkills,
} from '@/lib/supabase/client';

import {
  resetAllSharedMocks,
  mockFrom,
  mockSelect,
  // mockInsert, // Not directly used in these specific tests' assertions yet
  // mockUpdate,
  // mockDelete,
  mockEq,
  mockNeq,
  mockGt,
  mockGte,
  mockLt,
  mockLte,
  mockOr,
  mockIlike,
  mockIn,
  mockSingle,
  // mockMaybeSingle, // Not used in these specific tests yet
  mockRange,
  mockOrder,
  mockLimit,
  mockRpc,
  // mockAuthGetUser, // Not used in these specific tests yet
  // mockAuthGetSession,
  mockChainThen, // Import the new mock for controlling chain resolution
} from '@supabase/supabase-js';

beforeEach(() => {
  resetAllSharedMocks();
});

describe('Supabase Client Functions', () => {
  describe('getProfile', () => {
    it('should call supabase.from("users").select("*").eq("id", userId).single() and return data', async () => {
      const userId = 'user123';
      const mockProfileData = { id: userId, username: 'testuser' };

      mockSingle.mockResolvedValueOnce({ data: mockProfileData, error: null });

      const result = await getProfile(userId);

      expect(mockFrom).toHaveBeenCalledWith('users');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', userId);
      expect(mockSingle).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ data: mockProfileData, error: null });
    });

    it('should return error if supabase call fails for getProfile', async () => {
      const userId = 'user123';
      const dbError = new Error('DB error');
      mockSingle.mockResolvedValueOnce({ data: null, error: dbError });

      const result = await getProfile(userId);

      expect(mockFrom).toHaveBeenCalledWith('users');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', userId);
      expect(mockSingle).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ data: null, error: dbError });
    });
  });

  describe('getUserSkills', () => {
    const userId = 'testUser';
    const mockUserSkillsData = [{ id: 'skill1', name: 'SkillA', user_id: userId, is_offering: true, is_active: true }];

    it('should query skills for a user, filtering by is_active by default', async () => {
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: mockUserSkillsData, error: null }))
      );

      const result = await getUserSkills(userId);

      expect(mockFrom).toHaveBeenCalledWith('skills');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', userId);
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockOrder).not.toHaveBeenCalled();
      expect(result).toEqual({ data: mockUserSkillsData, error: null });
    });

    it('should additionally filter by isOffering if provided (true)', async () => {
      const offeringSkills = mockUserSkillsData.filter(s => s.is_offering);
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: offeringSkills, error: null }))
      );

      const result = await getUserSkills(userId, true);

      expect(mockFrom).toHaveBeenCalledWith('skills');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', userId);
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockEq).toHaveBeenCalledWith('is_offering', true);
      expect(mockOrder).not.toHaveBeenCalled();
      expect(result.data).toEqual(offeringSkills);
    });

    it('should additionally filter by isOffering if provided (false)', async () => {
      const seekingSkills = mockUserSkillsData.filter(s => s.is_offering === false);
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: seekingSkills, error: null }))
      );

      const result = await getUserSkills(userId, false);

      expect(mockFrom).toHaveBeenCalledWith('skills');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', userId);
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockEq).toHaveBeenCalledWith('is_offering', false);
      expect(mockOrder).not.toHaveBeenCalled();
      expect(result.data).toEqual(seekingSkills);
    });

    it('should return error if supabase call fails for getUserSkills', async () => {
      const dbError = new Error('DB error fetching skills');
      mockChainThen.mockImplementationOnce((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: null, error: dbError }))
      );

      const result = await getUserSkills(userId);

      expect(mockFrom).toHaveBeenCalledWith('skills');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', userId);
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockOrder).not.toHaveBeenCalled();
      expect(result).toEqual({ data: null, error: dbError });
    });
  });

  describe('searchSkills', () => {
    const mockSkillResults = [
      { id: 's1', title: 'Skill 1', description: 'Description 1', category: 'Tech', user_id: 'u1', users: { id:'u1', full_name: 'User1', profile_image_url: '', location_city: 'CityA', location_state: 'StateA' } },
      { id: 's2', title: 'Skill 2', description: 'Description 2', category: 'Art', user_id: 'u2', users: { id:'u2', full_name: 'User2', profile_image_url: '', location_city: 'CityB', location_state: 'StateB'} },
    ];
    const expectedSelectString = '*, users!inner(id, full_name, profile_image_url, location_city, location_state)';

    it('should build a basic query with default limit/offset and is_active filter', async () => {
      mockRange.mockResolvedValueOnce({ data: mockSkillResults, error: null });

      const params = {};
      await searchSkills(params);

      expect(mockFrom).toHaveBeenCalledWith('skills');
      expect(mockSelect).toHaveBeenCalledWith(expectedSelectString);
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockRange).toHaveBeenCalledWith(0, 9);
      expect(mockOrder).not.toHaveBeenCalled();
      expect(mockLimit).not.toHaveBeenCalled();
    });

    it('should apply category filter', async () => {
      mockRange.mockResolvedValueOnce({ data: mockSkillResults.filter(s => s.category === 'Tech'), error: null });
      const params = { category: 'Tech' };
      await searchSkills(params);

      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockEq).toHaveBeenCalledWith('category', 'Tech');
      expect(mockRange).toHaveBeenCalledWith(0, 9);
      expect(mockLimit).not.toHaveBeenCalled();
    });

    it('should apply text query filter using OR for title and description (ilike)', async () => {
      mockRange.mockResolvedValueOnce({ data: [mockSkillResults[0]], error: null });
      const params = { query: 'Skill 1' };
      await searchSkills(params);

      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockOr).toHaveBeenCalledWith(
        `title.ilike.%Skill 1%,description.ilike.%Skill 1%`
      );
    });

    it('should apply isOffering filter', async () => {
      mockRange.mockResolvedValueOnce({ data: mockSkillResults, error: null });
      const paramsTrue = { isOffering: true };
      await searchSkills(paramsTrue);
      expect(mockEq).toHaveBeenCalledWith('is_offering', true);

      mockRange.mockResolvedValueOnce({ data: mockSkillResults, error: null });
      const paramsFalse = { isOffering: false };
      await searchSkills(paramsFalse);
      expect(mockEq).toHaveBeenCalledWith('is_offering', false);
    });

    it('should apply isRemoteFriendly filter', async () => {
      mockRange.mockResolvedValueOnce({ data: mockSkillResults, error: null });
      const params = { isRemoteFriendly: true };
      await searchSkills(params);
      expect(mockEq).toHaveBeenCalledWith('is_remote_friendly', true);
    });

    it('should apply custom limit and offset', async () => {
      mockRange.mockResolvedValueOnce({ data: mockSkillResults, error: null });
      const params = { limit: 5, offset: 10 };
      await searchSkills(params);

      expect(mockRange).toHaveBeenCalledWith(10, 14);
      expect(mockLimit).not.toHaveBeenCalled();
    });

    it('should handle a combination of filters', async () => {
      mockRange.mockResolvedValueOnce({ data: [mockSkillResults[0]], error: null });
      const params = {
        category: 'Tech',
        query: 'Skill',
        isOffering: true,
        isRemoteFriendly: true,
        limit: 3,
        offset: 0
      };
      await searchSkills(params);

      expect(mockFrom).toHaveBeenCalledWith('skills');
      expect(mockSelect).toHaveBeenCalledWith(expectedSelectString);
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockEq).toHaveBeenCalledWith('category', 'Tech');
      expect(mockOr).toHaveBeenCalledWith('title.ilike.%Skill%,description.ilike.%Skill%');
      expect(mockEq).toHaveBeenCalledWith('is_offering', true);
      expect(mockEq).toHaveBeenCalledWith('is_remote_friendly', true);
      expect(mockRange).toHaveBeenCalledWith(0, 2);
      expect(mockLimit).not.toHaveBeenCalled();
    });

     it('should return error if supabase call fails for searchSkills', async () => {
        const dbError = new Error('DB error searching skills');
        mockRange.mockResolvedValueOnce({ data: null, error: dbError });

        const result = await searchSkills({});

        expect(mockFrom).toHaveBeenCalledWith('skills');
        expect(mockSelect).toHaveBeenCalledWith(expectedSelectString);
        expect(mockEq).toHaveBeenCalledWith('is_active', true);
        expect(mockRange).toHaveBeenCalledWith(0, 9);
        expect(mockLimit).not.toHaveBeenCalled();
        expect(result).toEqual({ data: null, error: dbError });
      });
  });
});
