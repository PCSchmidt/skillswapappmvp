/**
 * Supabase Client Mock
 * 
 * This file provides mock implementations of the Supabase client for testing.
 */

// Mock response data
export const mockUserData = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
  },
};

// Mock error
export const mockAuthError = {
  message: 'Invalid login credentials',
  status: 400,
};

// Create mock Supabase client
export const createMockSupabaseClient = () => {
  // Create a query builder that correctly chains methods
  const createQueryBuilder = () => {
    const queryBuilder: any = {
      select: jest.fn(() => queryBuilder),
      insert: jest.fn(() => queryBuilder),
      update: jest.fn(() => queryBuilder),
      delete: jest.fn(() => queryBuilder),
      eq: jest.fn(() => queryBuilder),
      neq: jest.fn(() => queryBuilder),
      gt: jest.fn(() => queryBuilder),
      gte: jest.fn(() => queryBuilder),
      lt: jest.fn(() => queryBuilder),
      lte: jest.fn(() => queryBuilder),
      like: jest.fn(() => queryBuilder),
      ilike: jest.fn(() => queryBuilder),
      is: jest.fn(() => queryBuilder),
      in: jest.fn(() => queryBuilder),
      contains: jest.fn(() => queryBuilder),
      containedBy: jest.fn(() => queryBuilder),
      rangeGt: jest.fn(() => queryBuilder),
      rangeGte: jest.fn(() => queryBuilder),
      rangeLt: jest.fn(() => queryBuilder),
      rangeLte: jest.fn(() => queryBuilder),
      rangeAdjacent: jest.fn(() => queryBuilder),
      overlaps: jest.fn(() => queryBuilder),
      textSearch: jest.fn(() => queryBuilder),
      order: jest.fn(() => queryBuilder),
      limit: jest.fn(() => queryBuilder),
      match: jest.fn(() => Promise.resolve({
        data: [{ id: 'test-id', status: 'active' }],
        error: null,
      })),
      single: jest.fn(() => Promise.resolve({
        data: { id: 'test-id', status: 'active' },
        error: null,
      })),
      maybeSingle: jest.fn(() => Promise.resolve({
        data: { id: 'test-id', status: 'active' },
        error: null,
      })),
      rpc: jest.fn(() => Promise.resolve({
        data: null,
        error: null,
      })),
      then: jest.fn((callback) => Promise.resolve({
        data: [{ id: 'test-id', status: 'active' }],
        error: null,
      }).then(callback)),
    };
    
    return queryBuilder;
  };

  return {
    auth: {
      signInWithPassword: jest.fn().mockImplementation(({ email }) => {
        if (email === 'exists@example.com') {
          return Promise.resolve({ data: null, error: mockAuthError });
        }
        if (email === 'unverified@example.com') {
          return Promise.resolve({ 
            data: null, 
            error: { 
              message: 'Email not confirmed', 
              status: 400 
            } 
          });
        }
        return Promise.resolve({ data: { user: mockUserData, session: {} }, error: null });
      }),
      signUp: jest.fn().mockImplementation(({ email }) => {
        if (email === 'exists@example.com') {
          return Promise.resolve({ data: null, error: { message: 'User already registered', status: 400 } });
        }
        return Promise.resolve({ data: { user: mockUserData, session: null }, error: null });
      }),
      signOut: jest.fn().mockImplementation(() => {
        return Promise.resolve({ error: null });
      }),
      resetPasswordForEmail: jest.fn().mockImplementation((email, options) => {
        if (email === 'unknown@example.com') {
          return Promise.resolve({ data: null, error: { message: 'User not found', status: 404 } });
        }
        return Promise.resolve({ data: {}, error: null });
      }),
      verifyOtp: jest.fn().mockImplementation(({ email, token, type }) => {
        if (token === 'invalid-token') {
          return Promise.resolve({ data: null, error: { message: 'Invalid token', status: 400 } });
        }
        return Promise.resolve({ data: { user: mockUserData, session: {} }, error: null });
      }),
      getUser: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: { user: mockUserData }, error: null });
      }),
      getSession: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: { session: { user: mockUserData } }, error: null });
      }),
      signInWithOAuth: jest.fn().mockImplementation(({ provider }) => {
        return Promise.resolve({ data: {}, error: null });
      }),
    },
    from: jest.fn().mockImplementation(() => createQueryBuilder()),
  };
};

// Mock for @supabase/ssr
export const createBrowserClient = jest.fn().mockImplementation(() => {
  return createMockSupabaseClient();
});

// Export default mock implementation
export const supabaseMock = createMockSupabaseClient();
