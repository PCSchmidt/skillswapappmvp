import { jest } from '@jest/globals';

// Define the shape of the object that single() or maybeSingle() will resolve to
interface SupabaseQueryResult {
  data: unknown;
  error: unknown;
  count: number | null;
}

// This represents the final stage of a query chain, where single/maybeSingle are called
interface FinalQueryMock {
  single: jest.Mock<() => Promise<SupabaseQueryResult>>;
  maybeSingle: jest.Mock<() => Promise<SupabaseQueryResult>>;
  mockResolvedValue: jest.Mock<(value: SupabaseQueryResult) => FinalQueryMock>;
  mockRejectedValue: jest.Mock<(error: unknown) => FinalQueryMock>;
}

// Helper to create a mock for the final query stage
const createFinalQueryMock = (): FinalQueryMock => {
  let resolvedValue: SupabaseQueryResult = { data: null, error: null, count: null };

  const mock: FinalQueryMock = {
    single: jest.fn(() => Promise.resolve(resolvedValue)),
    maybeSingle: jest.fn(() => Promise.resolve(resolvedValue)),
    mockResolvedValue: jest.fn((value: SupabaseQueryResult) => {
      resolvedValue = value;
      return mock;
    }),
    mockRejectedValue: jest.fn((error: unknown) => {
      resolvedValue = { data: null, error: error, count: null };
      return mock;
    }),
  };
  return mock;
};

// This represents the result of insert/update/delete, which can then be chained with .eq() and .select()
interface ChainedMutationMock {
  eq: jest.Mock<() => ChainedMutationMock>; // Changed to () =>
  select: jest.Mock<(...args: any[]) => FinalQueryMock>; // select after mutation returns a FinalQueryMock
  mockResolvedValue: jest.Mock<(value: SupabaseQueryResult) => ChainedMutationMock>;
  mockRejectedValue: jest.Mock<(error: unknown) => ChainedMutationMock>;
}

// Helper to create a mock for chained mutations
const createChainedMutationMock = (): ChainedMutationMock => {
  let resolvedValue: SupabaseQueryResult = { data: null, error: null, count: null };

  const mock: ChainedMutationMock = {
    eq: jest.fn(function(this: ChainedMutationMock) { return this; }), // Explicitly return 'this'
    select: jest.fn(() => createFinalQueryMock()), // select after mutation returns a FinalQueryMock
    mockResolvedValue: jest.fn((value: SupabaseQueryResult) => {
      resolvedValue = value;
      return mock;
    }),
    mockRejectedValue: jest.fn((error: unknown) => {
      resolvedValue = { data: null, error: error, count: null };
      return mock;
    }),
  };
  return mock;
};

// This represents the intermediate stage of a query chain (e.g., after .from())
interface SupabaseQueryBuilderMock {
  eq: jest.Mock<() => SupabaseQueryBuilderMock>; // Changed to () =>
  order: jest.Mock<() => SupabaseQueryBuilderMock>; // Changed to () =>
  limit: jest.Mock<() => SupabaseQueryBuilderMock>; // Changed to () =>
  range: jest.Mock<() => SupabaseQueryBuilderMock>; // Changed to () =>
  in: jest.Mock<() => SupabaseQueryBuilderMock>; // Changed to () =>
  textSearch: jest.Mock<() => SupabaseQueryBuilderMock>; // Changed to () =>
  // These methods now return a FinalQueryMock or ChainedMutationMock
  select: jest.Mock<(...args: any[]) => FinalQueryMock>; // select directly on from() returns FinalQueryMock
  insert: jest.Mock<(...args: any[]) => ChainedMutationMock>; // insert returns ChainedMutationMock
  update: jest.Mock<(...args: any[]) => ChainedMutationMock>; // update returns ChainedMutationMock
  delete: jest.Mock<(...args: any[]) => ChainedMutationMock>; // delete returns ChainedMutationMock
}

// Helper to create a chainable query builder mock
const createSupabaseQueryBuilderMock = (): SupabaseQueryBuilderMock => {
  const mock: SupabaseQueryBuilderMock = {
    eq: jest.fn(function(this: SupabaseQueryBuilderMock) { return this; }),
    order: jest.fn(function(this: SupabaseQueryBuilderMock) { return this; }),
    limit: jest.fn(function(this: SupabaseQueryBuilderMock) { return this; }),
    range: jest.fn(function(this: SupabaseQueryBuilderMock) { return this; }),
    in: jest.fn(function(this: SupabaseQueryBuilderMock) { return this; }),
    textSearch: jest.fn(function(this: SupabaseQueryBuilderMock) { return this; }),
    select: jest.fn(() => createFinalQueryMock()), // select directly on from() returns FinalQueryMock
    insert: jest.fn(() => createChainedMutationMock()), // insert returns ChainedMutationMock
    update: jest.fn(() => createChainedMutationMock()), // update returns ChainedMutationMock
    delete: jest.fn(() => createChainedMutationMock()), // delete returns ChainedMutationMock
  };
  return mock;
};

// Mock the Supabase client and its methods
export const supabaseMock = {
  from: jest.fn((_tableName: string) => {
    return createSupabaseQueryBuilderMock();
  }),
  rpc: jest.fn(() => createFinalQueryMock()), // rpc directly returns a FinalQueryMock
  auth: {
    signInWithPassword: jest.fn((_credentials: any) => {
      if (_credentials.email === 'test@example.com' && _credentials.password === 'password') {
        return {
          data: { user: { id: 'test-user-id', email: 'test@example.com' }, session: { access_token: 'mock-token' } },
          error: null,
        };
      }
      return { data: { user: null, session: null }, error: { message: 'Invalid credentials' } };
    }),
    signUp: jest.fn((_credentials: any) => {
      if (_credentials.email === 'new@example.com') {
        return {
          data: { user: { id: 'new-user-id', email: 'new@example.com' }, session: { access_token: 'mock-token' } },
          error: null,
        };
      }
      return { data: { user: null, session: null }, error: { message: 'Signup failed' } };
    }),
    signOut: jest.fn(() => ({
      error: null,
    })),
    resetPasswordForEmail: jest.fn(() => ({
      error: null,
    })),
    verifyOtp: jest.fn((_params: any) => {
      if (_params.token === 'valid-token') {
        return {
          data: { user: { id: 'verified-user-id', email: 'verified@example.com' } },
          error: null,
        };
      }
      return { data: { user: null }, error: { message: 'Invalid OTP' } };
    }),
    getUser: jest.fn((_uid?: string) => {
      if (_uid === 'current-user-id' || !_uid) { // Mock for both specific user and current user
        return {
          data: { user: { id: 'current-user-id', email: 'current@example.com' } },
          error: null,
        };
      }
      return { data: { user: null }, error: { message: 'User not found' } };
    }),
    getSession: jest.fn(() => ({
      data: { session: { access_token: 'mock-token' } },
      error: null,
    })),
  },
  functions: {
    invoke: jest.fn(() => ({
      data: {},
      error: null,
    })),
  },
};

// Mock the createBrowserClient from @supabase/ssr
export const createBrowserClientMock = jest.fn(() => supabaseMock);
