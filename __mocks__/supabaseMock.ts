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
  eq: jest.Mock<(_column: string, _value: unknown) => ChainedMutationMock>;
  select: jest.Mock<(_columns?: string) => FinalQueryMock>;
  mockResolvedValue: jest.Mock<(value: SupabaseQueryResult) => ChainedMutationMock>;
  mockRejectedValue: jest.Mock<(error: unknown) => ChainedMutationMock>;
}

// Helper to create a mock for chained mutations
const createChainedMutationMock = (): ChainedMutationMock => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let resolvedValue: SupabaseQueryResult = { data: null, error: null, count: null };

  const mock: ChainedMutationMock = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eq: jest.fn(function(this: ChainedMutationMock, _column: string, _value: unknown) { return this; }), 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    select: jest.fn((_columns?: string) => createFinalQueryMock()), 
    mockResolvedValue: jest.fn(function(this: ChainedMutationMock, value: SupabaseQueryResult) {
      resolvedValue = value; 
      return this;
    }),
    mockRejectedValue: jest.fn(function(this: ChainedMutationMock, error: unknown) {
      resolvedValue = { data: null, error: error, count: null };
      return this;
    }),
  };
  return mock;
};

// This represents the intermediate stage of a query chain (e.g., after .from())
interface SupabaseQueryBuilderMock {
  eq: jest.Mock<(_column: string, _value: unknown) => SupabaseQueryBuilderMock>;
  order: jest.Mock<(_column: string, _options?: { ascending?: boolean; nullsFirst?: boolean }) => SupabaseQueryBuilderMock>;
  limit: jest.Mock<(_count: number) => SupabaseQueryBuilderMock>;
  range: jest.Mock<(_from: number, _to: number) => SupabaseQueryBuilderMock>;
  in: jest.Mock<(_column: string, _values: unknown[]) => SupabaseQueryBuilderMock>;
  textSearch: jest.Mock<(_column: string, _query: string, _options?: { config?: string; type?: 'plain' | 'phrase' | 'websearch'; }) => SupabaseQueryBuilderMock>;
  select: jest.Mock<(_columns?: string) => FinalQueryMock>;
  insert: jest.Mock<(_values: unknown | unknown[]) => ChainedMutationMock>;
  update: jest.Mock<(_values: unknown) => ChainedMutationMock>;
  delete: jest.Mock<() => ChainedMutationMock>;
  or: jest.Mock<(_filter: string) => SupabaseQueryBuilderMock>;
  upsert: jest.Mock<(_values: unknown, _options?: unknown) => SupabaseQueryBuilderMock>;
  neq: jest.Mock<(_column: string, _value: unknown) => SupabaseQueryBuilderMock>;
  ilike: jest.Mock<(_column: string, _pattern: string) => SupabaseQueryBuilderMock>;
}

// Helper to create a chainable query builder mock
const createSupabaseQueryBuilderMock = (): SupabaseQueryBuilderMock => {
  const mock: SupabaseQueryBuilderMock = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eq: jest.fn(function(this: SupabaseQueryBuilderMock, _column: string, _value: unknown) { return this; }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    order: jest.fn(function(this: SupabaseQueryBuilderMock, _column: string, _options?: { ascending?: boolean; nullsFirst?: boolean }) { return this; }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    limit: jest.fn(function(this: SupabaseQueryBuilderMock, _count: number) { return this; }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    range: jest.fn(function(this: SupabaseQueryBuilderMock, _from: number, _to: number) { return this; }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    in: jest.fn(function(this: SupabaseQueryBuilderMock, _column: string, _values: unknown[]) { return this; }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textSearch: jest.fn(function(this: SupabaseQueryBuilderMock, _column: string, _query: string, _options?: { config?: string; type?: 'plain' | 'phrase' | 'websearch'; }) { return this; }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    select: jest.fn((_columns?: string) => createFinalQueryMock()),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    insert: jest.fn((_values: unknown | unknown[]) => createChainedMutationMock()),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update: jest.fn((_values: unknown) => createChainedMutationMock()),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete: jest.fn(() => createChainedMutationMock()),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    or: jest.fn(function(this: SupabaseQueryBuilderMock, _filter: string) { return this; }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    upsert: jest.fn(function(this: SupabaseQueryBuilderMock, _values: unknown, _options?: unknown) { return this; }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    neq: jest.fn(function(this: SupabaseQueryBuilderMock, _column: string, _value: unknown) { return this; }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ilike: jest.fn(function(this: SupabaseQueryBuilderMock, _column: string, _pattern: string) { return this; }),
  };
  return mock;
};

// Mock the Supabase client and its methods
export const supabaseMock = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  from: jest.fn((_tableName: string) => { 
    return createSupabaseQueryBuilderMock();
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rpc: jest.fn((_fn: string, _params?: object) => createFinalQueryMock()), 
  auth: {
    signInWithPassword: jest.fn((credentials: {email?: string; password?: string}) => {
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        return Promise.resolve({ 
          data: { user: { id: 'test-user-id', email: 'test@example.com' } as unknown, session: { access_token: 'mock-token' } as unknown },
          error: null,
        });
      }
      return Promise.resolve({ data: { user: null, session: null }, error: { message: 'Invalid credentials' } as unknown });
    }),
    signUp: jest.fn((credentials: {email?: string; password?: string; options?:unknown}) => {
      if (credentials.email === 'new@example.com') {
        return Promise.resolve({ 
          data: { user: { id: 'new-user-id', email: 'new@example.com' } as unknown, session: { access_token: 'mock-token' } as unknown },
          error: null,
        });
      }
      return Promise.resolve({ data: { user: null, session: null }, error: { message: 'Signup failed' } as unknown });
    }),
    signOut: jest.fn(() => Promise.resolve({ 
      error: null,
    })),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetPasswordForEmail: jest.fn((_email: string, _options?: unknown) => Promise.resolve({ 
      data: { user: null, session: null }, 
      error: null,
    })),
    verifyOtp: jest.fn((params: {token?: string; type?: string; email?:string}) => {
      if (params.token === 'valid-token') {
        return Promise.resolve({ 
          data: { user: { id: 'verified-user-id', email: 'verified@example.com' } as unknown, session: {} as unknown }, 
          error: null,
        });
      }
      return Promise.resolve({ data: { user: null, session: null }, error: { message: 'Invalid OTP' } as unknown });
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUser: jest.fn((_token?: string) => { 
      return Promise.resolve({ 
        data: { user: { id: 'current-user-id', email: 'current@example.com' } as unknown },
        error: null,
      });
    }),
    getSession: jest.fn(() => Promise.resolve({ 
      data: { session: { access_token: 'mock-token' } as unknown },
      error: null,
    })),
  },
  functions: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invoke: jest.fn((_functionName: string, _options?: unknown) => Promise.resolve({ 
      data: {},
      error: null,
    })),
  },
};

// Mock the createClientComponentClient from @supabase/auth-helpers-nextjs
export const createClientComponentClientMock = jest.fn(() => supabaseMock);
