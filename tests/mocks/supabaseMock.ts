import { jest } from '@jest/globals';
import {
  SupabaseClient,
  SupabaseQueryBuilder,
  SupabaseResponse,
  SupabaseError,
  AuthResponse,
  User,
  // Notification, // Not directly used in mock return types, but good for context
  // Profile,    // Not directly used in mock return types
  // Skill,      // Not directly used in mock return types
  SupabaseSelectQuery,
  SupabaseInsertQuery,
  SupabaseUpdateQuery,
  SupabaseDeleteQuery,
  SupabaseFilterQuery,
  SupabaseFilterQueryWithModifier,
  SupabaseSession
} from '../../src/types/supabase';

/**
 * Supabase Client Mock
 *
 * This file provides mock implementations of the Supabase client for testing.
 */

// Mock response data
export const mockUserData: User = { // Added User type
  id: 'test-user-id',
  email: 'test@example.com',
  // user_metadata is not part of User type, so removed for strictness
  // user_metadata: {
  //   full_name: 'Test User',
  // },
};

// Mock error
export const mockAuthError: SupabaseError = { // Added SupabaseError type
  message: 'Invalid login credentials',
  // status: 400, // status is not part of SupabaseError type
};

// Create mock Supabase client
export const createMockSupabaseClient = (): jest.Mocked<SupabaseClient> => {

  function createFilterQueryMock<T extends Record<string, any>>(): jest.Mocked<SupabaseFilterQuery<T>> {
    const singleMockFn = jest.fn<Promise<SupabaseResponse<T>>, []>()
      .mockResolvedValue({ data: {} as T, error: null });

    let self: jest.Mocked<SupabaseFilterQuery<T>>;
    self = {
      eq: jest.fn(() => self),
      in: jest.fn(() => self),
      single: singleMockFn,
      // maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }), // Not in type
      // then: undefined, // Not in SupabaseFilterQuery type
    };
    return self;
  }

  function createSelectQueryMock<T extends Record<string, any>>(): jest.Mocked<SupabaseSelectQuery<T>> {
    const thenMockFn = jest.fn<Promise<SupabaseResponse<T[]>>, any[]>()
      .mockResolvedValue({ data: [] as T[], error: null });
    // select().single() is not directly in SupabaseSelectQuery type, it's usually select().eq().single()
    // However, some Supabase client versions might allow it or it's a common expectation.
    // For strictness with src/types/supabase.ts, direct .single() on SelectQuery is not primary.
    // The .eq() and .in() methods will return a FilterQuery which has .single().

    let self: jest.Mocked<SupabaseSelectQuery<T>>;
    self = {
      eq: jest.fn((column: keyof T, value: T[keyof T]) => createFilterQueryMock<T>()),
      in: jest.fn((column: keyof T, values: Array<T[keyof T]>) => createFilterQueryMock<T>()),
      order: jest.fn(() => self),
      limit: jest.fn(() => self),
      range: jest.fn(() => self),
      // then is not directly on SupabaseSelectQuery in types, but usually on PostgrestFilterBuilder which eq/in/order etc. return
      // For now, to support await client.from().select() or await client.from().select().order(), a then is needed.
      then: thenMockFn,
      // single: jest.fn().mockResolvedValue({ data: {} as T, error: null }), // if select().single() is supported
    };
    return self;
  }

  function createInsertQueryMock<T extends Record<string, any>>(): jest.Mocked<SupabaseInsertQuery<T>> {
    const postInsertSelectThenMock = jest.fn<Promise<SupabaseResponse<T[]>>, any[]>()
      .mockResolvedValue({ data: [] as T[], error: null });
    const postInsertSelectSingleMock = jest.fn<Promise<SupabaseResponse<T>>, []>()
      .mockResolvedValue({ data: {} as T, error: null });

    const insertSelectReturnObject = {
      then: postInsertSelectThenMock,
      single: postInsertSelectSingleMock,
    };

    const insertQueryMock: jest.Mocked<SupabaseInsertQuery<T>> = {
      select: jest.fn().mockReturnValue(insertSelectReturnObject),
      // If insert() itself is directly thenable (e.g. for count without select())
      // then: jest.fn().mockResolvedValue({ data: null, count: 0, error: null }),
    };
    return insertQueryMock;
  }

  function createFilterQueryWithModifierMock<T extends Record<string, any>>(): jest.Mocked<SupabaseFilterQueryWithModifier<T>> {
    const postModifierSelectThenMock = jest.fn<Promise<SupabaseResponse<T[]>>, any[]>()
      .mockResolvedValue({ data: [] as T[], error: null });
    const postModifierSelectSingleMock = jest.fn<Promise<SupabaseResponse<T>>, []>()
      .mockResolvedValue({ data: {} as T, error: null });

    const modifierSelectReturnObject = {
      then: postModifierSelectThenMock,
      single: postModifierSelectSingleMock,
    };

    const modifierThenMock = jest.fn<Promise<SupabaseResponse<T | null>>, any[]>()
      .mockResolvedValue({ data: null, error: null });

    const filterQueryWithModifier: jest.Mocked<SupabaseFilterQueryWithModifier<T>> = {
      select: jest.fn().mockReturnValue(modifierSelectReturnObject),
      then: modifierThenMock,
    };
    return filterQueryWithModifier;
  }

  function createUpdateQueryMock<T extends Record<string, any>>(): jest.Mocked<SupabaseUpdateQuery<T>> {
    return {
      eq: jest.fn((column: keyof T, value: T[keyof T]) => createFilterQueryWithModifierMock<T>()),
      match: jest.fn((query: Partial<T>) => createFilterQueryWithModifierMock<T>()),
    };
  }

  function createDeleteQueryMock<T extends Record<string, any>>(): jest.Mocked<SupabaseDeleteQuery<T>> {
    return {
      eq: jest.fn((column: keyof T, value: T[keyof T]) => createFilterQueryWithModifierMock<T>()),
      match: jest.fn((query: Partial<T>) => createFilterQueryWithModifierMock<T>()),
    };
  }

  function createQueryBuilder<T extends Record<string, any>>(): jest.Mocked<SupabaseQueryBuilder<T>> {
    return {
      select: jest.fn((columns?: string) => createSelectQueryMock<T>()),
      insert: jest.fn((values) => createInsertQueryMock<T>()), // Removed unused 'values' param from signature
      update: jest.fn((values) => createUpdateQueryMock<T>()), // Removed unused 'values' param
      delete: jest.fn(() => createDeleteQueryMock<T>()),
    };
  }

  const client: jest.Mocked<SupabaseClient> = {
    auth: {
      signIn: jest.fn<Promise<SupabaseResponse<AuthResponse>>, [{ email: string; password: string }]> (
        async ({ email, password }) => {
          if (email === 'exists@example.com') {
            return { data: null, error: mockAuthError };
          }
          if (email === 'unverified@example.com') {
            return { data: null, error: { message: 'Email not confirmed' } as SupabaseError };
          }
          const sessionData: SupabaseSession = {
            user: mockUserData,
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
          };
          return { data: { user: mockUserData, session: sessionData }, error: null };
        }
      ),
      signUp: jest.fn<Promise<SupabaseResponse<AuthResponse>>, [{ email: string; password: string }]>(
        async ({ email, password }) => {
          if (email === 'exists@example.com') {
            return { data: null, error: { message: 'User already registered' } as SupabaseError };
          }
          return { data: { user: mockUserData, session: null }, error: null };
        }
      ),
      signOut: jest.fn<Promise<SupabaseResponse<null>>, []>(
        async () => ({ error: null })
      ),
      resetPasswordForEmail: jest.fn<Promise<SupabaseResponse<{}>>, [string, { redirectTo?: string }?]>(
        async (email, options) => {
          if (email === 'unknown@example.com') {
            return { data: null, error: { message: 'User not found' } as SupabaseError };
          }
          return { data: {}, error: null };
        }
      ),
      verifyOtp: jest.fn<Promise<SupabaseResponse<AuthResponse>>, [{ email?: string, phone?: string, token: string, type: string }?]>(
        async ({ email, phone, token, type }) => {
          if (token === 'invalid-token') {
            return { data: null, error: { message: 'Invalid token' } as SupabaseError };
          }
          const sessionData: SupabaseSession = { user: mockUserData, access_token: 'mock-access-token', refresh_token: 'mock-refresh-token' };
          return { data: { user: mockUserData, session: sessionData }, error: null };
        }
      ),
      getUser: jest.fn<Promise<SupabaseResponse<{ user: User | null }>>, []>(
        async () => ({ data: { user: mockUserData }, error: null })
      ),
      session: jest.fn<() => SupabaseSession | null>(() => {
        const sessionData: SupabaseSession = {
          user: mockUserData,
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
        };
        return sessionData;
      }),
      signInWithOAuth: jest.fn<Promise<SupabaseResponse<{ provider: string; url: string }>>, [{ provider: string; options?: { redirectTo?: string; scopes?: string; queryParams?: { [key: string]: string }; } }]>(
        async ({ provider, options }) => ({ data: { provider: provider, url: 'mock-oauth-url' }, error: null })
      ),
    } as unknown as jest.Mocked<SupabaseClient['auth']>,
    from: jest.fn().mockImplementation(<T extends Record<string, any>>(table: string) => createQueryBuilder<T>()),
    rpc: jest.fn(<T = any>(fn: string, params?: Record<string, any>): Promise<SupabaseResponse<T>> =>
      Promise.resolve({ data: null, error: null })
    ) as jest.Mock<Promise<SupabaseResponse<any>>, [string, Record<string, any>?]>,
  };
  return client;
};

export const createClientComponentClient = jest.fn((): jest.Mocked<SupabaseClient> => {
  return createMockSupabaseClient();
});

export const supabaseMock: jest.Mocked<SupabaseClient> = createMockSupabaseClient();
