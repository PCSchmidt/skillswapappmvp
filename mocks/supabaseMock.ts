// mocks/supabaseMock.ts

// --- Basic Interfaces for Mocking ---
// These can be expanded as needed or replaced with actual Supabase types if preferred.
interface MockUser {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface MockSession {
  access_token: string;
  user: MockUser;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Generic Supabase response structure
interface SupabaseResponse<T = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  data: T | null;
  error: Error | null;
}

// Generic Supabase Auth response structure
interface SupabaseAuthData<TUser = MockUser, TSession = MockSession> {
  user: TUser | null;
  session?: TSession | null;
}
interface SupabaseAuthResponse<TUser = MockUser, TSession = MockSession> {
  data: SupabaseAuthData<TUser, TSession> | { session: TSession | null; user?: TUser | null };
  error: Error | null;
}


// --- Exported Jest Mock Functions ---
// These are the actual mock functions tests will import and interact with.
export const mockFrom = jest.fn<(tableName: string) => QueryBuilder, [string]>();
export const mockSelect = jest.fn<() => QueryBuilder, [string?]>();
export const mockInsert = jest.fn<() => QueryBuilder, [Record<string, any> | Record<string, any>[]]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockUpdate = jest.fn<() => QueryBuilder, [Record<string, any>]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockDelete = jest.fn<() => QueryBuilder, []>();
export const mockEq = jest.fn<() => QueryBuilder, [string, any]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockNeq = jest.fn<() => QueryBuilder, [string, any]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockGt = jest.fn<() => QueryBuilder, [string, any]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockGte = jest.fn<() => QueryBuilder, [string, any]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockLt = jest.fn<() => QueryBuilder, [string, any]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockLte = jest.fn<() => QueryBuilder, [string, any]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockOr = jest.fn<() => QueryBuilder, [string]>();
export const mockIlike = jest.fn<() => QueryBuilder, [string, string]>();
export const mockIn = jest.fn<() => QueryBuilder, [string, any[]]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockSingle = jest.fn<() => Promise<SupabaseResponse>, []>();
export const mockMaybeSingle = jest.fn<() => Promise<SupabaseResponse>, []>();
export const mockRange = jest.fn<() => QueryBuilder, [number, number]>();
export const mockOrder = jest.fn<() => QueryBuilder, [string, { ascending?: boolean }?]>();
export const mockRpc = jest.fn<() => Promise<SupabaseResponse>, [string, Record<string, any>?]>(); // eslint-disable-line @typescript-eslint/no-explicit-any

// Auth related mocks
export const mockAuthGetUser = jest.fn<() => Promise<SupabaseAuthResponse<MockUser | null>>, []>();
export const mockAuthGetSession = jest.fn<() => Promise<SupabaseAuthResponse<null, MockSession | null>>, []>();
export const mockAuthSignUp = jest.fn<() => Promise<SupabaseAuthResponse>, [Record<string, any>]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockAuthSignInWithPassword = jest.fn<() => Promise<SupabaseAuthResponse>, [Record<string, any>]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
export const mockAuthSignOut = jest.fn<() => Promise<{ error: Error | null }>, []>();


// --- QueryBuilder Interface (for internal consistency and typing) ---
interface QueryBuilder {
  select: jest.Mock<this, [string?]>;
  insert: jest.Mock<this, [Record<string, any> | Record<string, any>[]]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  update: jest.Mock<this, [Record<string, any>]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  delete: jest.Mock<this, []>;
  eq: jest.Mock<this, [string, any]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  neq: jest.Mock<this, [string, any]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  gt: jest.Mock<this, [string, any]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  gte: jest.Mock<this, [string, any]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  lt: jest.Mock<this, [string, any]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  lte: jest.Mock<this, [string, any]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  or: jest.Mock<this, [string]>;
  ilike: jest.Mock<this, [string, string]>;
  in: jest.Mock<this, [string, any[]]>; // eslint-disable-line @typescript-eslint/no-explicit-any
  order: jest.Mock<this, [string, { ascending?: boolean }?]>;
  range: jest.Mock<this, [number, number]>;
  single: jest.Mock<Promise<SupabaseResponse>, []>;
  maybeSingle: jest.Mock<Promise<SupabaseResponse>, []>;
  then: jest.Mock<Promise<SupabaseResponse>, [(onfulfilled: (value: SupabaseResponse) => any) => void]>; // eslint-disable-line @typescript-eslint/no-explicit-any
}


// --- Helper Function to Create a Chainable Query Builder Mock Instance ---
export const createSupabaseQueryBuilderMock = (
  finalData: any = null, // eslint-disable-line @typescript-eslint/no-explicit-any
  finalError: Error | null = null
): QueryBuilder => {
  const builder = {} as QueryBuilder;

  const thenable = (data = finalData, error = finalError) => ({
    then: jest.fn((onfulfilled) => Promise.resolve(onfulfilled({ data, error }))),
  });

  builder.select = jest.fn().mockReturnValue(builder);
  builder.insert = jest.fn((_dataToInsert) => builder);
  builder.update = jest.fn((_dataToUpdate) => builder);
  builder.delete = jest.fn(() => builder);
  builder.eq = jest.fn((_column, _value) => builder);
  builder.neq = jest.fn((_column, _value) => builder);
  builder.gt = jest.fn((_column, _value) => builder);
  builder.gte = jest.fn((_column, _value) => builder);
  builder.lt = jest.fn((_column, _value) => builder);
  builder.lte = jest.fn((_column, _value) => builder);
  builder.or = jest.fn((_filters) => builder);
  builder.ilike = jest.fn((_column, _pattern) => builder);
  builder.in = jest.fn((_column, _values) => builder);
  builder.order = jest.fn((_column, _options) => builder);
  builder.range = jest.fn((_from, _to) => builder);

  builder.single = jest.fn().mockResolvedValue({ data: finalData, error: finalError });
  builder.maybeSingle = jest.fn().mockResolvedValue({ data: finalData, error: finalError });

  Object.assign(builder, thenable());

  return builder;
};

// --- Main Exported Supabase Client Mock ---
export const supabaseMock = {
  from: mockFrom,
  rpc: mockRpc,
  auth: {
    getUser: mockAuthGetUser,
    getSession: mockAuthGetSession,
    signUp: mockAuthSignUp,
    signInWithPassword: mockAuthSignInWithPassword,
    signOut: mockAuthSignOut,
  },
};

// --- Helper to Reset All Exported Mocks & Setup Default Chaining ---
export const resetSupabaseMock = () => {
  const allExportedMocks = [ // Renamed to avoid conflict with a potential 'allMocks' var if this file grows
    mockFrom, mockSelect, mockInsert, mockUpdate, mockDelete, mockEq, mockNeq,
    mockGt, mockGte, mockLt, mockLte, mockOr, mockIlike, mockIn,
    mockSingle, mockMaybeSingle, mockRange, mockOrder, mockRpc,
    mockAuthGetUser, mockAuthGetSession, mockAuthSignUp, mockAuthSignInWithPassword, mockAuthSignOut
  ];
  allExportedMocks.forEach(mockFn => {
    if (mockFn && jest.isMockFunction(mockFn)) {
      mockFn.mockReset();
    }
  });

  const defaultBuilder = createSupabaseQueryBuilderMock(); // Use the helper for default builder

  // Configure global mocks to use the default builder for chaining
  mockFrom.mockImplementation((_tableName: string) => defaultBuilder);
  mockSelect.mockImplementation(() => defaultBuilder);
  mockEq.mockImplementation(() => defaultBuilder);
  mockNeq.mockImplementation(() => defaultBuilder);
  mockGt.mockImplementation(() => defaultBuilder);
  mockGte.mockImplementation(() => defaultBuilder);
  mockLt.mockImplementation(() => defaultBuilder);
  mockLte.mockImplementation(() => defaultBuilder);
  mockOr.mockImplementation(() => defaultBuilder);
  mockIlike.mockImplementation(() => defaultBuilder);
  mockIn.mockImplementation(() => defaultBuilder);
  mockOrder.mockImplementation(() => defaultBuilder);
  mockRange.mockImplementation(() => defaultBuilder);

  // Terminal methods on the default builder should resolve with generic empty/null data
  defaultBuilder.single.mockResolvedValue({ data: null, error: null });
  defaultBuilder.maybeSingle.mockResolvedValue({ data: null, error: null });
  Object.assign(defaultBuilder, {
    then: jest.fn((onfulfilled: (value: SupabaseResponse<any[]>) => any) => // eslint-disable-line @typescript-eslint/no-explicit-any
      Promise.resolve(onfulfilled({ data: [], error: null }))
    )
  });


  // Specific setups for insert/update/delete if their direct return or sub-chain is different
  mockInsert.mockImplementation(() => defaultBuilder); // insert() returns builder
  mockUpdate.mockImplementation(() => defaultBuilder); // update() returns builder
  mockDelete.mockImplementation(() => defaultBuilder); // delete() returns builder


  // Default resolutions for RPC and Auth
  mockRpc.mockResolvedValue({ data: null, error: null });
  mockAuthGetUser.mockResolvedValue({ data: { user: null }, error: null });
  mockAuthGetSession.mockResolvedValue({ data: { session: null }, error: null });
  mockAuthSignUp.mockResolvedValue({ data: { user: null, session: null }, error: null });
  mockAuthSignInWithPassword.mockResolvedValue({ data: { user: null, session: null }, error: null });
  mockAuthSignOut.mockResolvedValue({ error: null });
};

resetSupabaseMock(); // Initial setup of default behaviors

export default supabaseMock;
