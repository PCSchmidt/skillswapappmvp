const mockClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
    upsert: jest.fn(() => Promise.resolve({ error: null }))
  })),
  auth: {
    getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } }))
  }
};

module.exports = {
  createClientComponentClient: jest.fn(() => mockClient),
  createServerComponentClient: jest.fn(() => mockClient),
  createRouteHandlerClient: jest.fn(() => mockClient),
  createMiddlewareClient: jest.fn(() => mockClient),
};
