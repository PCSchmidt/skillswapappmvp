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

// --- Type-safe Supabase Mock Types ---

// Generic result type for Supabase queries
export interface SupabaseQueryResult<T> {
  data: T | null;
  error: { message: string } | null;
  count?: number;
}

// Chainable query builder interface
export interface SupabaseQueryBuilderMock<T = unknown> {
  select: (columns?: string) => Promise<SupabaseQueryResult<T[]>>;
  insert: (values: Partial<T> | Partial<T>[]) => SupabaseQueryBuilderMock<T>;
  update: (values: Partial<T>) => SupabaseQueryBuilderMock<T>;
  delete: () => SupabaseQueryBuilderMock<T>;
  eq: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  neq: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  gt: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  gte: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  lt: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  lte: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  like: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  ilike: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  is: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  in: (column: keyof T | string, values: unknown[]) => SupabaseQueryBuilderMock<T>;
  contains: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  containedBy: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  rangeGt: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  rangeGte: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  rangeLt: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  rangeLte: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  rangeAdjacent: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  overlaps: (column: keyof T | string, value: unknown) => SupabaseQueryBuilderMock<T>;
  textSearch: (column: keyof T | string, query: string) => SupabaseQueryBuilderMock<T>;
  order: (column: keyof T | string, options?: unknown) => SupabaseQueryBuilderMock<T>;
  limit: (count: number) => SupabaseQueryBuilderMock<T>;
  match: (query: Partial<T>) => SupabaseQueryBuilderMock<T>;
  single: () => Promise<SupabaseQueryResult<T>>;
  maybeSingle: () => Promise<SupabaseQueryResult<T>>;
}

// --- Type-safe Supabase Mock Implementation ---

/**
 * Enhanced chainable builder for Supabase mock.
 * Supports per-table mock data and method chaining.
 * Each builder instance is reused per table for consistent call tracking.
 */
function createChainableBuilder<T = any>(initialData: T[] = [{ id: 'test-id', status: 'active' } as T], tableName?: string) {
  let data = [...initialData]; // Mutable copy for insert/update/delete
  let filters: Array<(row: T) => boolean> = [];
  let pendingUpdate: Partial<T> | null = null;
  let pendingInsert: Partial<T>[] = [];
  let isDelete = false;
  let forceError: string | null = null;

  // Use Record<string, jest.Mock> for builder type
  const builder: Record<string, any> = {};
  const chainMethods = [
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'is', 'in', 'contains',
    'containedBy', 'rangeGt', 'rangeGte', 'rangeLt', 'rangeLte', 'rangeAdjacent', 'overlaps', 'textSearch', 'order', 'limit', 'match',
    'insert', 'update', 'delete'
  ];

  // Filtering methods (all chainable)
  builder.eq = jest.fn((col, val) => { filters.push((row: T) => row[col] === val); return builder; });
  builder.neq = jest.fn((col, val) => { filters.push((row: T) => row[col] !== val); return builder; });
  builder.gt = jest.fn((col, val) => { filters.push((row: T) => row[col] > val); return builder; });
  builder.gte = jest.fn((col, val) => { filters.push((row: T) => row[col] >= val); return builder; });
  builder.lt = jest.fn((col, val) => { filters.push((row: T) => row[col] < val); return builder; });
  builder.lte = jest.fn((col, val) => { filters.push((row: T) => row[col] <= val); return builder; });
  builder.like = jest.fn((col, val) => { filters.push((row: T) => (row[col] || '').includes(val)); return builder; });
  builder.ilike = jest.fn((col, val) => { filters.push((row: T) => (row[col] || '').toLowerCase().includes((val || '').toLowerCase())); return builder; });
  builder.is = jest.fn((col, val) => { filters.push((row: T) => row[col] === val); return builder; });
  builder.in = jest.fn((col, vals) => { filters.push((row: T) => vals.includes(row[col])); return builder; });
  builder.contains = jest.fn((col, val) => { filters.push((row: T) => Array.isArray(row[col]) && row[col].includes(val)); return builder; });
  builder.containedBy = jest.fn((col, val) => { filters.push((row: T) => Array.isArray(val) && val.includes(row[col])); return builder; });
  builder.rangeGt = jest.fn((col, val) => { filters.push((row: T) => row[col] > val); return builder; });
  builder.rangeGte = jest.fn((col, val) => { filters.push((row: T) => row[col] >= val); return builder; });
  builder.rangeLt = jest.fn((col, val) => { filters.push((row: T) => row[col] < val); return builder; });
  builder.rangeLte = jest.fn((col, val) => { filters.push((row: T) => row[col] <= val); return builder; });
  builder.rangeAdjacent = jest.fn((_col, _val) => { return builder; });
  builder.overlaps = jest.fn((_col, _val) => { return builder; });
  builder.textSearch = jest.fn((_col, _query) => { return builder; });
  builder.order = jest.fn((_col, _options) => { return builder; });
  builder.limit = jest.fn((count) => { builder._limit = count; return builder; });
  builder.range = jest.fn((from, to) => { builder._range = [from, to]; return builder; });
  builder.match = jest.fn((query) => { filters.push((row: T) => Object.entries(query).every(([k, v]) => row[k] === v)); return builder; });

  // Mutating methods (chainable, update internal state)
  builder.insert = jest.fn((values) => {
    if (tableName === 'notifications') {
      // Allow explicit error simulation via a special method or property
      if (Array.isArray(values) ? values.some(v => v && v.forceError) : values && values.forceError) {
        forceError = 'Failed to create notification';
      } else {
        forceError = null;
      }
    }
    if (Array.isArray(values)) {
      pendingInsert.push(...values);
    } else {
      pendingInsert.push(values);
    }
    return builder;
  });
  builder.update = jest.fn((values) => {
    if (tableName === 'notifications') {
      if (values && (typeof values === 'object' && 'forceError' in values)) {
        forceError = 'Failed to update notification';
      } else {
        forceError = null;
      }
    }
    pendingUpdate = values;
    return builder;
  });
  builder.delete = jest.fn(() => {
    if (tableName === 'notifications') {
      // Simulate error if delete is called with a filter for id 'fail-id'
      const hasFailId = filters.some(fn => {
        try {
          // Only simulate error if T is compatible with { id: string }
          // Use a plain object for test purposes; safe in test context
          const testObj = { id: 'fail-id' };
          return fn(testObj as unknown as T);
        } catch { return false; }
      });
      if (hasFailId) {
        forceError = 'Failed to delete notification';
      } else {
        forceError = null;
      }
    }
    isDelete = true;
    return builder;
  });

  // Helper to apply filters and mutations
  function getResultData(): T[] {
    let result = [...data];
    if (filters.length) {
      result = result.filter(row => filters.every(fn => fn(row)));
    }
    if (pendingInsert.length) {
      // For test mocks, cast Partial<T> to T (safe for controlled test data)
      const inserted = pendingInsert.map(obj => obj as T);
      result = [...result, ...inserted];
      data = [...data, ...inserted];
      pendingInsert = [];
    }
    if (pendingUpdate) {
      result = result.map(row => ({ ...row, ...pendingUpdate }));
      data = data.map(row => (filters.every(fn => fn(row)) ? { ...row, ...pendingUpdate } : row));
      pendingUpdate = null;
    }
    if (isDelete) {
      data = data.filter(row => !filters.every(fn => fn(row)));
      result = [];
      isDelete = false;
    }
    // Apply range if set
    if (builder._range) {
      const [from, to] = builder._range;
      result = result.slice(from, to + 1);
    }
    // Apply limit if set
    if (builder._limit !== undefined) {
      result = result.slice(0, builder._limit);
    }
    return result;
  }

  // Terminal methods: single, maybeSingle
  builder.single = jest.fn(() => {
    if (tableName === 'notifications' && forceError) {
      const err = forceError;
      forceError = null; // Reset error after use
      return Promise.resolve({ data: null, error: { message: err } });
    }
    const result = getResultData();
    return Promise.resolve({ data: result[0] || null, error: null });
  });
  builder.maybeSingle = jest.fn(() => {
    if (tableName === 'notifications' && forceError) {
      const err = forceError;
      forceError = null; // Reset error after use
      return Promise.resolve({ data: null, error: { message: err } });
    }
    const result = getResultData();
    return Promise.resolve({ data: result[0] || null, error: null });
  });
  // .select() returns a promise with the data
  builder.select = jest.fn(() => {
    if (tableName === 'notifications' && forceError) {
      const err = forceError;
      forceError = null; // Reset error after use
      return Promise.resolve({ data: null, error: { message: err } });
    }
    return Promise.resolve({ data: getResultData(), error: null });
  });

  // .then support for promise-like chaining (for await and .then)
  builder.then = (onFulfilled, onRejected) => {
    if (tableName === 'notifications' && forceError) {
      return Promise.resolve({ data: null, error: { message: forceError } }).then(onFulfilled, onRejected);
    }
    return Promise.resolve({ data: getResultData(), error: null }).then(onFulfilled, onRejected);
  };

  // Utility to reset all mocks on this builder
  builder._resetAllMocks = () => {
    [...chainMethods, 'select', 'single', 'maybeSingle', 'range'].forEach((method) => {
      if (builder[method] && builder[method].mockClear) builder[method].mockClear();
    });
    filters = [];
    pendingUpdate = null;
    pendingInsert = [];
    isDelete = false;
    data = [...initialData];
    builder._limit = undefined;
    builder._range = undefined;
    forceError = null;
  };
  return builder;
}

/**
 * Allow passing a data map for per-table mock data.
 * Returns the same builder instance per table for consistent call tracking.
 */
const defaultTableData = {
  users: [{ id: 'test-user-id', email: 'test@example.com', status: 'active' }],
  profiles: [{ id: 'test-profile-id', user_id: 'test-user-id', name: 'Test User' }],
  skills: [
    {
      id: '123',
      title: 'Web Development',
      category: 'Technology',
      description: 'Build modern web applications',
      user_id: 'test-user-id',
    },
    {
      id: '456',
      title: 'Guitar Lessons',
      category: 'Music • Instruments',
      description: 'Looking for someone to teach me guitar basics',
      user_id: 'test-user-id',
    },
  ],
  notifications: [
    { id: 'notif-1', user_id: 'user-123', is_read: false, title: 'Notification 1' },
    { id: 'notif-2', user_id: 'user-123', is_read: true, title: 'Notification 2' },
    { id: 'notif-3', user_id: 'user-456', is_read: false, title: 'Notification 3' },
  ],
  // Add more default table data as needed
};

// Remove export from function declaration
const createMockSupabaseClient = (tableData = defaultTableData) => {
  const tableBuilders: Record<string, ReturnType<typeof createChainableBuilder>> = {};
  const mockAuthUser = mockUserData;
  const mockSession = { user: mockUserData };
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
      resetPasswordForEmail: jest.fn().mockImplementation((_email) => {
        if (_email === 'unknown@example.com') {
          return Promise.resolve({ data: null, error: { message: 'User not found', status: 404 } });
        }
        return Promise.resolve({ data: {}, error: null });
      }),
      verifyOtp: jest.fn().mockImplementation(({ token }) => {
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
      signInWithOAuth: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: {}, error: null });
      }),
      user: mockAuthUser,
      session: mockSession,
    },
    from: jest.fn((tableName) => {
      if (!tableBuilders[tableName]) {
        const data = (tableData && tableData[tableName]) || [{ id: 'test-id', status: 'active' }];
        tableBuilders[tableName] = createChainableBuilder(data, tableName);
      }
      return tableBuilders[tableName];
    }),
    rpc: jest.fn(() => Promise.resolve({ data: { success: true }, error: null })),
    storage: { from: jest.fn(() => ({ upload: jest.fn(() => Promise.resolve({ data: {}, error: null })) })) },
    realtime: jest.fn(),
  };
};

// --- Supabase JS v2+ API Mocks ---
// These are needed for modules that import from '@supabase/supabase-js' or '@supabase/auth-helpers-nextjs'

// Export as a CommonJS Jest mock module with __esModule and default if needed
const supabaseMockModule = {
  __esModule: true,
  createClient: jest.fn(() => createMockSupabaseClient()),
  createBrowserClient: jest.fn(() => createMockSupabaseClient()),
  createServerClient: jest.fn(() => createMockSupabaseClient()),
  createClientComponentClient: jest.fn(() => createMockSupabaseClient()),
  supabaseMock: createMockSupabaseClient(),
  default: jest.fn(() => createMockSupabaseClient()), // for default import compatibility
};

// Only export CommonJS for Jest, avoid ESM exports to prevent recursion
module.exports = supabaseMockModule;

// --- ESM-compatible exports for Next.js/Jest ESM environments ---
// Export named and default for ESM consumers
export const createClient = supabaseMockModule.createClient;
export const createBrowserClient = supabaseMockModule.createBrowserClient;
export const createServerClient = supabaseMockModule.createServerClient;
export const createClientComponentClient = supabaseMockModule.createClientComponentClient;
export const supabaseMock = supabaseMockModule.supabaseMock;
export { createMockSupabaseClient };
export default supabaseMockModule.default;
