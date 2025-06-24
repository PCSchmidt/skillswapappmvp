/**
 * Jest Manual Mock for src/lib/supabase/client.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

const createMockSupabaseClient = () => {
  // Create a chainable builder that returns promises or itself based on method
  const createChainableBuilder = () => {
    const builder: any = {};
    
    // Promise-returning methods
    builder.select = jest.fn().mockResolvedValue({ data: [], error: null });
    builder.single = jest.fn().mockResolvedValue({ data: null, error: null });
    builder.maybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });
    
    // Chain-returning methods
    builder.insert = jest.fn().mockReturnValue(builder);
    builder.update = jest.fn().mockReturnValue(builder);
    builder.delete = jest.fn().mockReturnValue(builder);
    builder.eq = jest.fn().mockReturnValue(builder);
    builder.neq = jest.fn().mockReturnValue(builder);
    builder.gt = jest.fn().mockReturnValue(builder);
    builder.gte = jest.fn().mockReturnValue(builder);
    builder.lt = jest.fn().mockReturnValue(builder);
    builder.lte = jest.fn().mockReturnValue(builder);
    builder.like = jest.fn().mockReturnValue(builder);
    builder.ilike = jest.fn().mockReturnValue(builder);
    builder.is = jest.fn().mockReturnValue(builder);
    builder.in = jest.fn().mockReturnValue(builder);
    builder.contains = jest.fn().mockReturnValue(builder);
    builder.order = jest.fn().mockReturnValue(builder);
    builder.limit = jest.fn().mockReturnValue(builder);
    builder.range = jest.fn().mockReturnValue(builder);
    builder.match = jest.fn().mockReturnValue(builder);
    
    return builder;
  };

  return {
    from: jest.fn(() => createChainableBuilder()),
    rpc: jest.fn().mockResolvedValue({ data: { success: true }, error: null }),    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ 
        data: { 
          user: { id: 'test-user-id', email: 'test@example.com' }, 
          session: { access_token: 'test-token' } 
        }, 
        error: null 
      }),
      signUp: jest.fn().mockResolvedValue({ 
        data: { 
          user: { id: 'test-user-id', email: 'test@example.com' }, 
          session: { access_token: 'test-token' } 
        }, 
        error: null 
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: jest.fn().mockResolvedValue({ data: {}, error: null }),
      verifyOtp: jest.fn().mockResolvedValue({ 
        data: { 
          user: { id: 'test-user-id', email: 'test@example.com' }, 
          session: { access_token: 'test-token' } 
        }, 
        error: null 
      }),
      getUser: jest.fn().mockResolvedValue({ 
        data: { 
          user: { id: 'test-user-id', email: 'test@example.com' } 
        }, 
        error: null 
      }),
      getSession: jest.fn().mockResolvedValue({ 
        data: { 
          session: { access_token: 'test-token', user: { id: 'test-user-id' } } 
        }, 
        error: null 
      }),
      onAuthStateChange: jest.fn(),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
      })),
    },
  };
};

// Export the mock client
export const supabaseClient = createMockSupabaseClient();

// Export a default client for compatibility  
export default supabaseClient;
