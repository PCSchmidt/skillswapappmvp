/* eslint-disable @typescript-eslint/no-unused-vars */
import { jest } from '@jest/globals';

// Define the shape of the object that single() or maybeSingle() will resolve to
interface SupabaseQueryResult {
  data: unknown;
  error: unknown;
  count?: number | null;
}

// Create a proper chainable builder that supports all query methods
const createChainableBuilder = (defaultData: unknown[] = []): ChainableBuilder => {
  const builder: ChainableBuilder = {
    // Query methods that return chainable builders
    eq: jest.fn((_column: string, _value: unknown) => builder),
    neq: jest.fn((_column: string, _value: unknown) => builder),
    gt: jest.fn((_column: string, _value: unknown) => builder),
    gte: jest.fn((_column: string, _value: unknown) => builder),
    lt: jest.fn((_column: string, _value: unknown) => builder),
    lte: jest.fn((_column: string, _value: unknown) => builder),
    like: jest.fn((_column: string, _value: unknown) => builder),
    ilike: jest.fn((_column: string, _value: unknown) => builder),
    is: jest.fn((_column: string, _value: unknown) => builder),
    in: jest.fn((_column: string, _values: unknown[]) => builder),
    order: jest.fn((_column: string, _options?: { ascending?: boolean; nullsFirst?: boolean }) => builder),
    limit: jest.fn((_count: number) => builder),
    range: jest.fn((_from: number, _to: number) => builder),
    textSearch: jest.fn((_column: string, _query: string, _options?: { config?: string; type?: 'plain' | 'phrase' | 'websearch' }) => builder),
    or: jest.fn((_filter: string) => builder),
    match: jest.fn((_query: unknown) => builder),
    
    // Mutation methods
    select: jest.fn((_columns?: string) => builder),
    insert: jest.fn((_values: unknown | unknown[]) => builder),
    update: jest.fn((_values: unknown) => builder),
    delete: jest.fn(() => builder),
    upsert: jest.fn((_values: unknown, _options?: unknown) => builder),
    
    // Terminal methods that return promises
    single: jest.fn(() => Promise.resolve({ data: defaultData.length > 0 ? defaultData[0] : null, error: null })),
    maybeSingle: jest.fn(() => Promise.resolve({ data: defaultData.length > 0 ? defaultData[0] : null, error: null })),
    
    // Promise-like behavior for direct await
    then: jest.fn((resolve: (value: SupabaseQueryResult) => unknown) => {
      const result = { data: defaultData, error: null, count: defaultData.length };
      return Promise.resolve(result).then(resolve);
    }),    // Mock utility methods
    mockResolvedValue: jest.fn((value: SupabaseQueryResult) => {
      // Update the then method to resolve with the mocked value
      (builder.then as jest.Mock).mockImplementation(() => Promise.resolve(value));
      return builder;
    }),
  };
  return builder;
};

// Define a unified interface that supports all Supabase query methods
interface ChainableBuilder {
  // Query filter methods
  eq: jest.Mock<(column: string, value: unknown) => ChainableBuilder>;
  neq: jest.Mock<(column: string, value: unknown) => ChainableBuilder>;
  gt: jest.Mock<(column: string, value: unknown) => ChainableBuilder>;
  gte: jest.Mock<(column: string, value: unknown) => ChainableBuilder>;
  lt: jest.Mock<(column: string, value: unknown) => ChainableBuilder>;
  lte: jest.Mock<(column: string, value: unknown) => ChainableBuilder>;
  like: jest.Mock<(column: string, value: unknown) => ChainableBuilder>;
  ilike: jest.Mock<(column: string, value: unknown) => ChainableBuilder>;
  is: jest.Mock<(column: string, value: unknown) => ChainableBuilder>;
  in: jest.Mock<(column: string, values: unknown[]) => ChainableBuilder>;
  order: jest.Mock<(column: string, options?: { ascending?: boolean; nullsFirst?: boolean }) => ChainableBuilder>;
  limit: jest.Mock<(count: number) => ChainableBuilder>;
  range: jest.Mock<(from: number, to: number) => ChainableBuilder>;
  textSearch: jest.Mock<(column: string, query: string, options?: { config?: string; type?: 'plain' | 'phrase' | 'websearch' }) => ChainableBuilder>;
  or: jest.Mock<(filter: string) => ChainableBuilder>;
  match: jest.Mock<(query: unknown) => ChainableBuilder>;
  
  // Mutation methods
  select: jest.Mock<(columns?: string) => ChainableBuilder>;
  insert: jest.Mock<(values: unknown | unknown[]) => ChainableBuilder>;
  update: jest.Mock<(values: unknown) => ChainableBuilder>;
  delete: jest.Mock<() => ChainableBuilder>;
  upsert: jest.Mock<(values: unknown, options?: unknown) => ChainableBuilder>;
  
  // Terminal methods
  single: jest.Mock<() => Promise<SupabaseQueryResult>>;
  maybeSingle: jest.Mock<() => Promise<SupabaseQueryResult>>;
  then: jest.Mock<(resolve: (value: SupabaseQueryResult) => unknown) => Promise<unknown>>;
  
  // Mock utility methods
  mockResolvedValue: jest.Mock<(value: SupabaseQueryResult) => ChainableBuilder>;
}

// Mock the Supabase client and its methods
console.log('MOCKED SUPABASE USED');

const supabaseMock = {
  auth: {
    onAuthStateChange: jest.fn((callback: (event: string, session: { user: unknown; session: unknown }) => void) => {
      const subscription = { unsubscribe: jest.fn() };
      setTimeout(() => {
        callback('SIGNED_IN', { user: { id: 'current-user-id', email: 'current@example.com' }, session: { access_token: 'mock-token' } });
      }, 0);
      return { data: { subscription } };
    }),
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
    invoke: jest.fn((_functionName: string, _options?: unknown) => Promise.resolve({ 
      data: {},
      error: null,
    })),
  },
  rpc: jest.fn((_functionName: string, _params?: unknown) => createChainableBuilder([])),
  from: jest.fn((_tableName: string) => createChainableBuilder([])),
};

export default supabaseMock;
export { supabaseMock };
