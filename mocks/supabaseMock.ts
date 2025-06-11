// mocks/supabaseMock.ts

// All individual mock functions are exported
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
export const mockRpc = jest.fn();
export const mockAuthGetUser = jest.fn();
export const mockAuthGetSession = jest.fn();
export const mockAuthSignUp = jest.fn();
export const mockAuthSignInWithPassword = jest.fn();
export const mockAuthSignOut = jest.fn();

// Helper to create a fully chainable query builder mock instance for a specific call
export const createSupabaseQueryBuilderMock = (
  finalData: any = null,
  finalError: any = null
) => {
  const builder: any = {};

  // Helper to make an object thenable
  const thenable = (data = finalData, error = finalError) => ({
    then: jest.fn((onfulfilled) => Promise.resolve(onfulfilled({ data, error }))),
  });

  // Assign all chainable methods to return the builder itself
  builder.select = jest.fn().mockReturnValue(builder);
  builder.insert = jest.fn().mockReturnValue(builder);
  builder.update = jest.fn().mockReturnValue(builder);
  builder.delete = jest.fn().mockReturnValue(builder);
  builder.eq = jest.fn().mockReturnValue(builder);
  builder.neq = jest.fn().mockReturnValue(builder);
  builder.gt = jest.fn().mockReturnValue(builder);
  builder.gte = jest.fn().mockReturnValue(builder);
  builder.lt = jest.fn().mockReturnValue(builder);
  builder.lte = jest.fn().mockReturnValue(builder);
  builder.or = jest.fn().mockReturnValue(builder);
  builder.ilike = jest.fn().mockReturnValue(builder);
  builder.in = jest.fn().mockReturnValue(builder);
  builder.order = jest.fn().mockReturnValue(builder);
  builder.range = jest.fn().mockReturnValue(builder);

  // Terminal methods resolve the promise with the finalData/finalError
  builder.single = jest.fn().mockResolvedValue({ data: finalData, error: finalError });
  builder.maybeSingle = jest.fn().mockResolvedValue({ data: finalData, error: finalError });

  // Make the builder itself thenable for chains ending on filters/select/order/range
  Object.assign(builder, thenable());

  // Specific handling for insert/update/delete if they are directly awaited
  builder.insert.mockImplementation((_dataToInsert: any) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    return builder;
  });
   builder.update.mockImplementation((_dataToUpdate: any) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    return builder;
  });
   builder.delete.mockImplementation(() => {
    return builder;
  });

  return builder;
};


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

export const resetSupabaseMock = () => {
  const allMocks = [
    mockFrom, mockSelect, mockInsert, mockUpdate, mockDelete, mockEq, mockNeq,
    mockGt, mockGte, mockLt, mockLte, mockOr, mockIlike, mockIn,
    mockSingle, mockMaybeSingle, mockRange, mockOrder, mockRpc,
    mockAuthGetUser, mockAuthGetSession, mockAuthSignUp, mockAuthSignInWithPassword, mockAuthSignOut
  ];
  allMocks.forEach(mockFn => {
    if (mockFn && jest.isMockFunction(mockFn)) {
      mockFn.mockReset();
    }
  });

  // Basic default for from, specific tests will use createSupabaseQueryBuilderMock or mockImplementationOnce
  supabaseMock.from.mockImplementation(() => createSupabaseQueryBuilderMock());

  // Default resolutions for RPC and Auth (can be overridden in tests)
  mockRpc.mockResolvedValue({ data: null, error: null });
  mockAuthGetUser.mockResolvedValue({ data: { user: null }, error: null });
  mockAuthGetSession.mockResolvedValue({ data: { session: null }, error: null });
  mockAuthSignUp.mockResolvedValue({ data: { user: null, session: null }, error: null });
  mockAuthSignInWithPassword.mockResolvedValue({ data: { user: null, session: null }, error: null });
  mockAuthSignOut.mockResolvedValue({ error: null });
};

resetSupabaseMock(); // Initial setup

export default supabaseMock;
