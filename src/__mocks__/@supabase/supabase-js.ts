// src/__mocks__/@supabase/supabase-js.ts

// --- Exported Jest Mock Functions ---
export const mockFrom = jest.fn();
export const mockSelect = jest.fn();
export const mockInsert = jest.fn();
export const mockUpdate = jest.fn();
export const mockDelete = jest.fn();
export const mockEq = jest.fn();
export const mockNeq = jest.fn();
export const mockGt = jest.fn();
export const mockGte = jest.fn();
export const mockLt = jest.fn();
export const mockLte = jest.fn();
export const mockOr = jest.fn();
export const mockIlike = jest.fn();
export const mockIn = jest.fn();
export const mockSingle = jest.fn();
export const mockMaybeSingle = jest.fn();
export const mockRange = jest.fn();
export const mockOrder = jest.fn();
export const mockLimit = jest.fn();
export const mockRpc = jest.fn();
export const mockChainThen = jest.fn(); // Exported for tests to control terminal resolution of chains

// Auth related mocks
export const mockAuthGetUser = jest.fn();
export const mockAuthGetSession = jest.fn();
export const mockAuthSignUp = jest.fn();
export const mockAuthSignInWithPassword = jest.fn();
export const mockAuthSignOut = jest.fn();

// --- Main Exported Supabase Client Mock ---
export const createClient = jest.fn(() => ({
  from: mockFrom,
  rpc: mockRpc,
  auth: {
    getUser: mockAuthGetUser,
    getSession: mockAuthGetSession,
    signUp: mockAuthSignUp,
    signInWithPassword: mockAuthSignInWithPassword,
    signOut: mockAuthSignOut,
  },
}));

// --- Helper to Reset All Exported Mocks & Setup Default Chaining ---
export const resetAllSharedMocks = () => {
  const allMocks = [
    mockFrom, mockSelect, mockInsert, mockUpdate, mockDelete, mockEq, mockNeq,
    mockGt, mockGte, mockLt, mockLte, mockOr, mockIlike, mockIn,
    mockSingle, mockMaybeSingle, mockRange, mockOrder, mockLimit, mockRpc,
    mockChainThen, // Added to reset
    mockAuthGetUser, mockAuthGetSession, mockAuthSignUp,
    mockAuthSignInWithPassword, mockAuthSignOut
  ];
  allMocks.forEach(mockFn => {
    if (mockFn && jest.isMockFunction(mockFn)) {
      mockFn.mockReset();
    }
  });

  // Define the default chainable builder object
  const defaultBuilder: any = {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    neq: mockNeq,
    gt: mockGt,
    gte: mockGte,
    lt: mockLt,
    lte: mockLte,
    or: mockOr,
    ilike: mockIlike,
    in: mockIn,
    order: mockOrder,
    limit: mockLimit,
    range: mockRange,
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
    then: mockChainThen, // Use the exported mock for .then()
  };

  // Configure mocks that start or continue a chain to return the defaultBuilder
  mockFrom.mockReturnValue(defaultBuilder);
  mockSelect.mockReturnValue(defaultBuilder);
  mockEq.mockReturnValue(defaultBuilder);
  mockNeq.mockReturnValue(defaultBuilder);
  mockGt.mockReturnValue(defaultBuilder);
  mockGte.mockReturnValue(defaultBuilder);
  mockLt.mockReturnValue(defaultBuilder);
  mockLte.mockReturnValue(defaultBuilder);
  mockOr.mockReturnValue(defaultBuilder);
  mockIlike.mockReturnValue(defaultBuilder);
  mockIn.mockReturnValue(defaultBuilder);
  mockOrder.mockReturnValue(defaultBuilder); // order() itself returns the builder
  mockLimit.mockReturnValue(defaultBuilder); // limit() itself returns the builder
  mockRange.mockReturnValue(defaultBuilder); // range() itself returns the builder (if not terminal)

  // Specific setups for insert/update/delete if their direct return is different
  // or if they don't fit the "return defaultBuilder" pattern for some methods.
  // For now, assume they also largely return defaultBuilder for chaining like .select()
  mockInsert.mockReturnValue(defaultBuilder);
  mockUpdate.mockReturnValue(defaultBuilder);
  mockDelete.mockReturnValue(defaultBuilder);

  // Default resolutions for actual terminal methods (tests will use mockResolvedValueOnce on these)
  mockSingle.mockResolvedValue({ data: null, error: null });
  mockMaybeSingle.mockResolvedValue({ data: null, error: null });
  // mockRange's default resolution is handled by defaultBuilder.then if range is terminal
  // mockChainThen will provide the default resolution for chains ending on filters, select, order, limit, range.
  mockChainThen.mockImplementation((onfulfilled: (value: { data: any[]; error: null; }) => any) =>
    Promise.resolve(onfulfilled({ data: [], error: null }))
  );

  mockRpc.mockResolvedValue({ data: null, error: null });

  // Auth defaults
  mockAuthGetUser.mockResolvedValue({ data: { user: null }, error: null });
  mockAuthGetSession.mockResolvedValue({ data: { session: null }, error: null });
  mockAuthSignUp.mockResolvedValue({ data: { user: null, session: null }, error: null });
  mockAuthSignInWithPassword.mockResolvedValue({ data: { user: null, session: null }, error: null });
  mockAuthSignOut.mockResolvedValue({ error: null });
};

resetAllSharedMocks(); // Initialize mocks with default behavior.
