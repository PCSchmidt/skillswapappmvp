import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { supabaseMock } from '../../mocks/supabaseMock';

// Mock the supabaseClient import prior to importing the auth functions
jest.mock('../../../src/lib/supabase/client', () => ({
  supabaseClient: supabaseMock,
}));

import * as authFunctions from '../../../src/lib/supabase/auth';

describe('Authentication Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    test('should call supabase.auth.signInWithPassword with correct parameters', async () => {
      await authFunctions.signIn('test@example.com', 'password123');
      expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    test('should return the user when sign in is successful', async () => {
      const result = await authFunctions.signIn('test@example.com', 'password123');
      expect(result.user).toBeTruthy();
      expect(result.error).toBeNull();
    });

    test('should return the error when sign in fails', async () => {
      const result = await authFunctions.signIn('exists@example.com', 'password123');
      expect(result.user).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('signUp', () => {
    test('should call supabase.auth.signUp with correct parameters', async () => {
      const metadata = { full_name: 'John Doe' };
      await authFunctions.signUp('new@example.com', 'password123', metadata);
      expect(supabaseMock.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: metadata,
        },
      });
    });

    test('should return the user when sign up is successful', async () => {
      const result = await authFunctions.signUp('new@example.com', 'password123');
      expect(result.user).toBeTruthy();
      expect(result.error).toBeNull();
    });

    test('should return the error when sign up fails', async () => {
      const result = await authFunctions.signUp('exists@example.com', 'password123');
      expect(result.user).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('signOut', () => {
    test('should call supabase.auth.signOut', async () => {
      await authFunctions.signOut();
      expect(supabaseMock.auth.signOut).toHaveBeenCalled();
    });

    test('should return no error when sign out is successful', async () => {
      const result = await authFunctions.signOut();
      expect(result.error).toBeNull();
    });

    test('should return the error when sign out fails', async () => {
      // Force an error for this specific test
      supabaseMock.auth.signOut.mockImplementationOnce(() => {
        return { error: { message: 'Sign out failed' } };
      });
      
      const result = await authFunctions.signOut();
      expect(result.error).toBeTruthy();
    });
  });

  describe('resetPassword', () => {
    test('should call supabase.auth.resetPasswordForEmail with correct parameters', async () => {
      await authFunctions.resetPassword('test@example.com');
      expect(supabaseMock.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', undefined);
    });

    test('should pass redirectTo when provided', async () => {
      await authFunctions.resetPassword('test@example.com', 'https://example.com/reset');
      expect(supabaseMock.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com', 
        { redirectTo: 'https://example.com/reset' }
      );
    });

    test('should return no error when reset password is successful', async () => {
      const result = await authFunctions.resetPassword('test@example.com');
      expect(result.error).toBeNull();
    });

    test('should return the error when reset password fails', async () => {
      const result = await authFunctions.resetPassword('unknown@example.com');
      expect(result.error).toBeTruthy();
    });
  });

  describe('verifyOtp', () => {
    test('should call supabase.auth.verifyOtp with correct parameters', async () => {
      await authFunctions.verifyOtp('test@example.com', 'valid-token', 'signup');
      expect(supabaseMock.auth.verifyOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: 'valid-token',
        type: 'signup',
      });
    });

    test('should return the user when OTP verification is successful', async () => {
      const result = await authFunctions.verifyOtp('test@example.com', 'valid-token', 'signup');
      expect(result.user).toBeTruthy();
      expect(result.error).toBeNull();
    });

    test('should return the error when OTP verification fails', async () => {
      const result = await authFunctions.verifyOtp('test@example.com', 'invalid-token', 'signup');
      expect(result.user).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('getCurrentUser', () => {
    test('should call supabase.auth.getUser', async () => {
      await authFunctions.getCurrentUser();
      expect(supabaseMock.auth.getUser).toHaveBeenCalled();
    });

    test('should return user data when successful', async () => {
      const result = await authFunctions.getCurrentUser();
      expect(result.user).toBeTruthy();
      expect(result.error).toBeNull();
    });

    test('should return error when unsuccessful', async () => {
      // Force an error for this specific test
      supabaseMock.auth.getUser.mockImplementationOnce(() => {
        return { data: { user: null }, error: { message: 'Not authenticated' } };
      });
      
      const result = await authFunctions.getCurrentUser();
      expect(result.user).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('getSession', () => {
    test('should call supabase.auth.getSession', async () => {
      await authFunctions.getSession();
      expect(supabaseMock.auth.getSession).toHaveBeenCalled();
    });

    test('should return session when successful', async () => {
      const result = await authFunctions.getSession();
      expect(result.session).toBeTruthy();
      expect(result.error).toBeNull();
    });

    test('should return error when unsuccessful', async () => {
      // Force an error for this specific test
      supabaseMock.auth.getSession.mockImplementationOnce(() => {
        return { data: { session: null }, error: { message: 'No session' } };
      });
      
      const result = await authFunctions.getSession();
      expect(result.session).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });
});
