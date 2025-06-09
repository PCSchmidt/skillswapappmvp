// tests/services/SkillService.test.ts
import { skillService, SkillService } from '@/services/SkillService'; // BrowsableSkill can be imported if needed for explicit typing in tests, but SkillService methods already use it.
import { supabaseClient } from '@/lib/supabase/client';
import type { SkillBrowseFilters, Skill } from '@/types/index'; // Assuming Skill is needed for BrowsableSkill partial construction
import type { BrowsableSkill } from '@/services/SkillService'; // Import for explicit typing in tests

// Mock the supabase client
// We need to mock the chainable methods.
// Each method in the chain will return `this` (the mock itself) until a call that executes the query.
// The execution can be '.then()' or when the query promise is awaited directly.

// Define mocks at the top level, before jest.mock
const mockEq = jest.fn();
const mockIlike = jest.fn();
const mockOrder = jest.fn();
const mockLimit = jest.fn();
const mockThen = jest.fn(); // This will be configured by mockQueryResponse

jest.mock('@/lib/supabase/client', () => ({
  supabaseClient: {
    from: jest.fn().mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        eq: mockEq.mockReturnThis(), // Ensure chainability
        ilike: mockIlike.mockReturnThis(), // Ensure chainability
        order: mockOrder.mockReturnThis(), // Ensure chainability
        limit: mockLimit.mockReturnThis(), // Ensure chainability
        then: mockThen, // Use the pre-defined mockThen for promise resolution
      })),
    })),
  }
}));

// Helper to set the resolved value for the final part of the Supabase query chain
const mockQueryResponse = (data: any, error: any = null) => {
  // Reset individual mocks for clean assertions per test
  mockEq.mockClear().mockReturnThis();
  mockIlike.mockClear().mockReturnThis();
  mockOrder.mockClear().mockReturnThis();
  mockLimit.mockClear().mockReturnThis();

  // Configure mockThen for the current test case
  // This function will be called by the `await query` in the service
  mockThen.mockImplementationOnce((onFulfilled: (value: { data: any; error: any; }) => void, onRejected?: (reason: any) => void) => {
    if (error && onRejected) {
      // If the service handles errors via catch block on the promise
      // onRejected(error);
      // However, Supabase client typically resolves with an error object
      Promise.resolve({ data: null, error }).then(onFulfilled, onRejected);
    } else if (error) {
      Promise.resolve({ data: null, error }).then(onFulfilled, onRejected);
    }
    else {
      Promise.resolve({ data, error: null }).then(onFulfilled, onRejected);
    }
  });
};

// Cast supabaseClient to its mocked version to satisfy TypeScript for mockClear etc.
const mockedSupabaseClient = supabaseClient as jest.Mocked<typeof supabaseClient>;
const mockedFrom = mockedSupabaseClient.from as jest.Mock;
// We will access deeper mocks (select, eq, etc.) via their direct consts (mockEq, mockIlike)

describe('SkillService', () => {
  let serviceInstance: SkillService;

  beforeEach(() => {
    // Reset all parts of the mock chain before each test
    mockedFrom.mockClear();
    // The chainable mocks (mockEq, etc.) are cleared in mockQueryResponse
    // mockThen is also reset in mockQueryResponse before being configured

    serviceInstance = new SkillService(); // Using the singleton is also fine: skillService
  });

  it('should call supabase.from("skills") and select with default query structure', async () => {
    mockQueryResponse([], null); // Setup mock response
    await serviceInstance.browseSkills({});

    expect(mockedFrom).toHaveBeenCalledWith('skills');
    // Assuming the mock for `from('skills').select(...)` was set up correctly to return the object with `eq`, `order`, `limit`
    // The select call itself is part of the chain setup in jest.mock
    // We can check the chained calls:
    expect(mockEq).toHaveBeenCalledWith('is_active', true);
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(mockLimit).toHaveBeenCalledWith(100);
  });

  it('should apply search filter correctly', async () => {
    mockQueryResponse([], null);
    const filters: SkillBrowseFilters = { search: 'developer' };
    await serviceInstance.browseSkills(filters);
    expect(mockIlike).toHaveBeenCalledWith('title', `%${filters.search}%`);
  });

  it('should apply category filter correctly', async () => {
    mockQueryResponse([], null);
    const filters: SkillBrowseFilters = { category: 'Technology' };
    await serviceInstance.browseSkills(filters);
    expect(mockEq).toHaveBeenCalledWith('category', filters.category);
  });

  it('should apply offering filter for "offering"', async () => {
    mockQueryResponse([], null);
    const filters: SkillBrowseFilters = { offering: 'offering' };
    await serviceInstance.browseSkills(filters);
    expect(mockEq).toHaveBeenCalledWith('is_offering', true);
  });

  it('should apply offering filter for "seeking"', async () => {
    mockQueryResponse([], null);
    const filters: SkillBrowseFilters = { offering: 'seeking' };
    await serviceInstance.browseSkills(filters);
    expect(mockEq).toHaveBeenCalledWith('is_offering', false);
  });

  it('should not apply offering filter for "all"', async () => {
    mockQueryResponse([], null);
    const filters: SkillBrowseFilters = { offering: 'all' };
    await serviceInstance.browseSkills(filters);

    // Check that eq was not called for 'is_offering' beyond the initial 'is_active'
    const offeringCall = mockEq.mock.calls.find(call => call[0] === 'is_offering');
    expect(offeringCall).toBeUndefined();
  });

  it('should apply experience filter correctly', async () => {
    mockQueryResponse([], null);
    const filters: SkillBrowseFilters = { experience: 'expert' };
    await serviceInstance.browseSkills(filters);
    expect(mockEq).toHaveBeenCalledWith('experience_level', filters.experience);
  });

  it('should not apply experience filter for "all"', async () => {
    mockQueryResponse([], null);
    const filters: SkillBrowseFilters = { experience: 'all' };
    await serviceInstance.browseSkills(filters);
    const experienceCall = mockEq.mock.calls.find(call => call[0] === 'experience_level');
    expect(experienceCall).toBeUndefined();
  });

  it('should apply remote filter correctly', async () => {
    mockQueryResponse([], null);
    const filters: SkillBrowseFilters = { remote: true };
    await serviceInstance.browseSkills(filters);
    expect(mockEq).toHaveBeenCalledWith('is_remote_friendly', true);
  });

  it('should apply a combination of filters', async () => {
    mockQueryResponse([], null);
    const filters: SkillBrowseFilters = {
      search: 'react',
      category: 'Technology',
      offering: 'offering',
      experience: 'intermediate',
      remote: true,
    };
    await serviceInstance.browseSkills(filters);
    expect(mockIlike).toHaveBeenCalledWith('title', '%react%');
    // Multiple .eq calls, check each one specifically
    expect(mockEq).toHaveBeenCalledWith('category', 'Technology');
    expect(mockEq).toHaveBeenCalledWith('is_offering', true);
    expect(mockEq).toHaveBeenCalledWith('experience_level', 'intermediate');
    expect(mockEq).toHaveBeenCalledWith('is_remote_friendly', true);
  });

  it('should return data on successful fetch', async () => {
    const mockSkillsData: BrowsableSkill[] = [
      {
        id: '1', title: 'Test Skill 1', users: null, category: 'Test',
        created_at: '2023-01-01T00:00:00Z', description: 'Desc 1',
        experience_level: 'beginner', is_active: true, is_offering: true,
        is_remote_friendly: false, user_id: 'u1'
      },
      // Add more mock skills if needed for thorough testing
    ];
    mockQueryResponse(mockSkillsData, null);
    const { data, error } = await serviceInstance.browseSkills({});
    expect(error).toBeNull();
    expect(data).toEqual(mockSkillsData);
  });

  it('should return error when supabase fetch fails', async () => {
    const mockApiError = { message: 'Supabase error', code: 'PGRST000', details: '', hint: '' };
    mockQueryResponse(null, mockApiError); // Simulate Supabase error

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { data, error } = await serviceInstance.browseSkills({});

    expect(data).toEqual([]); // Service should return empty array for data on error
    expect(error).toEqual(mockApiError); // Service should return the error object from Supabase
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching skills in SkillService:', mockApiError);

    consoleErrorSpy.mockRestore();
  });

  it('should return error when a non-supabase exception occurs during query building', async () => {
    const unexpectedError = new Error('Something broke in the query builder');

    // Make the 'from' call itself throw an error for this test case
    // This ensures that when the service calls supabaseClient.from(...), it throws.
    (supabaseClient.from as jest.Mock).mockImplementationOnce(() => {
      throw unexpectedError;
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { data, error } = await serviceInstance.browseSkills({}); // Call the service
    expect(data).toEqual([]);
    expect(error).toBe(unexpectedError);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Exception in SkillService.browseSkills:', unexpectedError);

    consoleErrorSpy.mockRestore();
  });
});
