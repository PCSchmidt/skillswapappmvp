// Mock for Supabase client

// Auth mock functions with default successful responses
const mockSignInWithPassword = jest.fn().mockResolvedValue({
  data: { 
    user: { id: 'test-user-id', email: 'test@example.com' }, 
    session: { access_token: 'test-token' } 
  }, 
  error: null 
});
const mockSignUp = jest.fn().mockResolvedValue({
  data: { 
    user: { id: 'test-user-id', email: 'test@example.com' }, 
    session: { access_token: 'test-token' } 
  }, 
  error: null 
});
const mockSignOut = jest.fn().mockResolvedValue({ error: null });
const mockResetPasswordForEmail = jest.fn().mockResolvedValue({ data: {}, error: null });
const mockVerifyOtp = jest.fn().mockResolvedValue({
  data: { 
    user: { id: 'test-user-id', email: 'test@example.com' }, 
    session: { access_token: 'test-token' } 
  }, 
  error: null 
});
const mockGetUser = jest.fn().mockResolvedValue({
  data: { 
    user: { id: 'test-user-id', email: 'test@example.com' } 
  }, 
  error: null 
});
const mockGetSession = jest.fn().mockResolvedValue({
  data: { 
    session: { access_token: 'test-token', user: { id: 'test-user-id' } } 
  }, 
  error: null 
});
const mockOnAuthStateChange = jest.fn();

// Create a mock query builder that supports chaining and is awaitable
const createAwaitableQueryBuilder = () => {
  const mockData = { data: [], error: null };
  
  const queryBuilder = {
    // Database operations
    select: jest.fn(() => queryBuilder),
    insert: jest.fn(() => queryBuilder),
    update: jest.fn(() => queryBuilder),
    delete: jest.fn(() => queryBuilder),
    upsert: jest.fn(() => queryBuilder),
    
    // Filter operations
    eq: jest.fn(() => queryBuilder),
    gt: jest.fn(() => queryBuilder),
    lt: jest.fn(() => queryBuilder),
    gte: jest.fn(() => queryBuilder),
    lte: jest.fn(() => queryBuilder),
    like: jest.fn(() => queryBuilder),
    ilike: jest.fn(() => queryBuilder),
    is: jest.fn(() => queryBuilder),
    in: jest.fn(() => queryBuilder),
    contains: jest.fn(() => queryBuilder),
    containedBy: jest.fn(() => queryBuilder),
    range: jest.fn(() => queryBuilder),
    
    // Modifier operations
    order: jest.fn(() => queryBuilder),
    limit: jest.fn(() => queryBuilder),
    
    // Terminal operations
    single: jest.fn(() => Promise.resolve({ data: null, error: null })),
    maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
    
    // Make the builder itself awaitable
    then: jest.fn((onResolve) => {
      const result = mockData;
      if (onResolve) onResolve(result);
      return Promise.resolve(result);
    }),
    catch: jest.fn(() => Promise.resolve(mockData)),
  };
  
  return queryBuilder;
};

// Mock from() method that returns a new query builder
const mockFrom = jest.fn().mockImplementation(() => createAwaitableQueryBuilder());

// Mock RPC function
const mockRpcFunction = jest.fn().mockResolvedValue({ data: null, error: null });

// Mock Functions (for Edge Functions)
const mockFunctionsInvoke = jest.fn().mockResolvedValue({ data: { success: true }, error: null });

const supabaseClient = {  auth: {
    signInWithPassword: mockSignInWithPassword,
    signUp: mockSignUp,
    signOut: mockSignOut,
    resetPasswordForEmail: mockResetPasswordForEmail,
    verifyOtp: mockVerifyOtp,
    getUser: mockGetUser,
    getSession: mockGetSession,
    onAuthStateChange: mockOnAuthStateChange,
  },
  from: mockFrom,
  rpc: mockRpcFunction,
  functions: {
    invoke: mockFunctionsInvoke,
  },
};

module.exports = {
  supabaseClient,
  default: supabaseClient,
  // Export mock functions for direct access in tests
  mockAuth: {
    mockSignInWithPassword,
    mockSignUp,
    mockSignOut,
    mockResetPasswordForEmail,
    mockVerifyOtp,
    mockGetUser,
    mockGetSession,
    mockOnAuthStateChange,
  },
  mockDatabase: {
    mockFrom,
    mockRpc: mockRpcFunction,
  },
  mockFunctions: {
    mockFunctionsInvoke,
  },
};
