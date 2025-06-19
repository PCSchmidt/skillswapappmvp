/**
 * Test mock type definitions
 * 
 * This file contains type definitions specifically created for test mocking purposes.
 * These types should mirror the real application types but may include additional 
 * properties or methods needed for effective testing.
 */

import { SupabaseResponse, UserSettings, Profile, Skill } from '@/types/supabase';

/**
 * Type for mocked Supabase query builder
 */
export interface MockSupabaseQueryBuilder<T> {
  select: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
}

/**
 * Type for mocked Supabase filter query
 */
export interface MockSupabaseFilterQuery<T> {
  single: jest.Mock;
  eq: jest.Mock;
  in: jest.Mock;
}

/**
 * Type for mocked Supabase auth
 */
export interface MockSupabaseAuth {
  signIn: jest.Mock;
  signUp: jest.Mock;
  signOut: jest.Mock;
  session: jest.Mock;
}

/**
 * Type for mocked Supabase client
 */
export interface MockSupabaseClient {
  from: jest.Mock<MockSupabaseQueryBuilder<any>>;
  auth: MockSupabaseAuth;
}

/**
 * Type for mocked session
 */
export interface MockSession {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
  access_token?: string;
  refresh_token?: string;
}

/**
 * Factory function to create a mock Supabase response
 */
export function createMockSupabaseResponse<T>(data: T | null = null, error: any = null): SupabaseResponse<T> {
  return {
    data,
    error
  };
}

/**
 * Factory function to create mock user settings
 */
export function createMockUserSettings(override: Partial<UserSettings> = {}): UserSettings {
  return {
    user_id: 'test-user-id',
    email_notifications: true,
    push_notifications: false,
    marketing_emails: true,
    location_sharing: true,
    profile_visibility: 'public',
    theme_preference: 'system',
    notification_frequency: 'daily',
    ...override
  };
}

/**
 * Factory function to create mock profile
 */
export function createMockProfile(override: Partial<Profile> = {}): Profile {
  return {
    id: 'test-profile-id',
    username: 'testuser',
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    location: 'Test location',
    ...override
  };
}

/**
 * Factory function to create mock skill
 */
export function createMockSkill(override: Partial<Skill> = {}): Skill {
  return {
    id: 'test-skill-id',
    title: 'Test Skill',
    description: 'Test description',
    user_id: 'test-user-id',
    category: 'Technology',
    experience_level: 'Intermediate',
    location: 'Remote',
    is_remote: true,
    availability: 'Weekends',
    tags: ['test', 'skill'],
    ...override
  };
}

/**
 * Factory function to create a mock Supabase client
 */
export function createMockSupabaseClient(): MockSupabaseClient {
  const mockEq = jest.fn().mockReturnThis();
  const mockIn = jest.fn().mockReturnThis();
  const mockSingle = jest.fn().mockResolvedValue(createMockSupabaseResponse(null));
  const mockOrder = jest.fn().mockReturnThis();
  const mockLimit = jest.fn().mockReturnThis();
  
  const mockSelect = jest.fn().mockImplementation(() => ({
    eq: mockEq,
    in: mockIn,
    order: mockOrder,
    limit: mockLimit,
    single: mockSingle
  }));
  
  const mockThen = jest.fn().mockImplementation((callback) => {
    callback(createMockSupabaseResponse(true));
    return { catch: jest.fn() };
  });
  
  const mockEqForUpdate = jest.fn().mockImplementation(() => ({
    then: mockThen
  }));
  
  const mockUpdate = jest.fn().mockImplementation(() => ({
    eq: mockEqForUpdate,
    match: jest.fn().mockImplementation(() => ({
      then: mockThen
    }))
  }));
  
  const mockInsert = jest.fn().mockImplementation(() => ({
    select: jest.fn().mockResolvedValue(createMockSupabaseResponse([]))
  }));
  
  const mockDelete = jest.fn().mockImplementation(() => ({
    eq: mockEqForUpdate,
    match: jest.fn().mockImplementation(() => ({
      then: mockThen
    }))
  }));
  
  const mockFrom = jest.fn().mockImplementation(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete
  }));
  
  const mockAuth = {
    signIn: jest.fn().mockResolvedValue(createMockSupabaseResponse({ user: { id: 'test-user-id' } })),
    signUp: jest.fn().mockResolvedValue(createMockSupabaseResponse({ user: { id: 'test-user-id' } })),
    signOut: jest.fn().mockResolvedValue(createMockSupabaseResponse(null)),
    session: jest.fn().mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' }
    })
  };
  
  return {
    from: mockFrom,
    auth: mockAuth
  };
}

/**
 * Helper function to configure the mock Supabase client for specific test scenarios
 */
export function configureMockSupabaseClient(
  client: MockSupabaseClient, 
  config: {
    selectResponse?: any;
    updateResponse?: any;
    insertResponse?: any;
    deleteResponse?: any;
    authSignInResponse?: any;
    authSignUpResponse?: any;
    authSignOutResponse?: any;
    session?: any;
  } = {}
) {
  // Configure mock responses
  if (config.selectResponse) {
    const mockSingle = jest.fn().mockResolvedValue(createMockSupabaseResponse(config.selectResponse));
    const mockSelect = jest.fn().mockImplementation(() => ({
      eq: jest.fn().mockImplementation(() => ({
        single: mockSingle
      })),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis()
    }));
    client.from.mockImplementation(() => ({
      ...client.from(),
      select: mockSelect
    }));
  }
  
  if (config.updateResponse) {
    const mockThen = jest.fn().mockImplementation((callback) => {
      callback(createMockSupabaseResponse(config.updateResponse));
      return { catch: jest.fn() };
    });
    const mockEq = jest.fn().mockImplementation(() => ({
      then: mockThen
    }));
    const mockUpdate = jest.fn().mockImplementation(() => ({
      eq: mockEq,
      match: jest.fn().mockImplementation(() => ({
        then: mockThen
      }))
    }));
    client.from.mockImplementation(() => ({
      ...client.from(),
      update: mockUpdate
    }));
  }
  
  if (config.insertResponse) {
    const mockInsert = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(createMockSupabaseResponse(config.insertResponse))
    }));
    client.from.mockImplementation(() => ({
      ...client.from(),
      insert: mockInsert
    }));
  }
  
  if (config.deleteResponse) {
    const mockThen = jest.fn().mockImplementation((callback) => {
      callback(createMockSupabaseResponse(config.deleteResponse));
      return { catch: jest.fn() };
    });
    const mockEq = jest.fn().mockImplementation(() => ({
      then: mockThen
    }));
    const mockDelete = jest.fn().mockImplementation(() => ({
      eq: mockEq,
      match: jest.fn().mockImplementation(() => ({
        then: mockThen
      }))
    }));
    client.from.mockImplementation(() => ({
      ...client.from(),
      delete: mockDelete
    }));
  }
  
  // Configure auth responses
  if (config.authSignInResponse) {
    client.auth.signIn.mockResolvedValue(createMockSupabaseResponse(config.authSignInResponse));
  }
  
  if (config.authSignUpResponse) {
    client.auth.signUp.mockResolvedValue(createMockSupabaseResponse(config.authSignUpResponse));
  }
  
  if (config.authSignOutResponse) {
    client.auth.signOut.mockResolvedValue(createMockSupabaseResponse(config.authSignOutResponse));
  }
  
  if (config.session) {
    client.auth.session.mockReturnValue(config.session);
  }
  
  return client;
}
