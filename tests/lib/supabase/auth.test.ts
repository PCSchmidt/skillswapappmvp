import { describe, expect, test, jest, beforeEach } from '@jest/globals';

// Use our proven global mock pattern instead of inline mocking
// The global mock is already set up in __mocks__/@/lib/supabase/client.js

import * as authFunctions from '@/lib/supabase/auth';

// Import after the mock to get the mocked version
import { supabaseClient } from '@/lib/supabase/client';

// Get the mocked auth functions - properly typed as jest mocks
const mockAuth = jest.mocked(supabaseClient.auth);

describe('Authentication Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('signIn', () => {
    test('should call supabase.auth.signInWithPassword with correct parameters', async () => {
      await authFunctions.signIn('test@example.com', 'password123');
      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    test('should return the user when sign in is successful', async () => {
      const result = await authFunctions.signIn('test@example.com', 'password123');
      expect(result.user).toBeTruthy();
      expect(result.error).toBeNull();
    });

    test('should return the error when sign in fails', async () => {      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },        error: { 
          message: 'Invalid credentials',
          code: 'invalid_credentials',
          status: 401,
          __isAuthError: true,
          name: 'AuthError'
        } as unknown,
      });

      const result = await authFunctions.signIn('test@example.com', 'wrongpassword');
      expect(result.user).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });  describe('signUp', () => {
    test('should call supabase.auth.signUp with correct parameters', async () => {
      const metadata = { full_name: 'John Doe' };
      await authFunctions.signUp('new@example.com', 'password123', metadata);
      expect(mockAuth.signUp).toHaveBeenCalledWith({
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

    test('should return the error when sign up fails', async () => {      mockAuth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { 
          message: 'Email already exists',
          code: 'email_exists',
          status: 400,
          __isAuthError: true,
          name: 'AuthError'
        } as any,
      });

      const result = await authFunctions.signUp('exists@example.com', 'password123');
      expect(result.user).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });  describe('signOut', () => {    test('should call supabase.auth.signOut', async () => {
      await authFunctions.signOut();
      expect(mockAuth.signOut).toHaveBeenCalled();
    });

    test('should return no error when sign out is successful', async () => {
      const result = await authFunctions.signOut();
      expect(result.error).toBeNull();
    });    test('should return the error when sign out fails', async () => {
      mockAuth.signOut.mockResolvedValueOnce({
        error: { message: 'Sign out failed' },
      });

      const result = await authFunctions.signOut();
      expect(result.error).toBeTruthy();
    });
  });
  describe('resetPassword', () => {    test('should call supabase.auth.resetPasswordForEmail with correct parameters', async () => {
      await authFunctions.resetPassword('test@example.com');
      expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', undefined);
    });

    test('should pass redirectTo when provided', async () => {
      await authFunctions.resetPassword('test@example.com', 'http://localhost:3000/reset');
      expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com', 
        { redirectTo: 'http://localhost:3000/reset' }
      );
    });

    test('should return no error when reset password is successful', async () => {
      const result = await authFunctions.resetPassword('test@example.com');
      expect(result.error).toBeNull();
    });    test('should return the error when reset password fails', async () => {
      mockAuth.resetPasswordForEmail.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Email not found' },
      });

      const result = await authFunctions.resetPassword('notfound@example.com');
      expect(result.error).toBeTruthy();
    });
  });
  describe('verifyOtp', () => {    test('should call supabase.auth.verifyOtp with correct parameters', async () => {
      await authFunctions.verifyOtp('test@example.com', '123456', 'signup');
      expect(mockAuth.verifyOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: '123456',
        type: 'signup',
      });
    });

    test('should return the user when OTP verification is successful', async () => {
      const result = await authFunctions.verifyOtp('test@example.com', '123456', 'signup');
      expect(result.user).toBeTruthy();
      expect(result.error).toBeNull();
    });    test('should return the error when OTP verification fails', async () => {
      mockAuth.verifyOtp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid OTP' },
      });

      const result = await authFunctions.verifyOtp('test@example.com', 'invalid', 'signup');
      expect(result.user).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });
  describe('getCurrentUser', () => {    test('should call supabase.auth.getUser', async () => {
      await authFunctions.getCurrentUser();
      expect(mockAuth.getUser).toHaveBeenCalled();
    });

    test('should return user data when successful', async () => {
      const result = await authFunctions.getCurrentUser();
      expect(result.user).toBeTruthy();
      expect(result.error).toBeNull();
    });    test('should return error when unsuccessful', async () => {
      mockAuth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'User not found' },
      });

      const result = await authFunctions.getCurrentUser();
      expect(result.user).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });
  describe('getSession', () => {    test('should call supabase.auth.getSession', async () => {
      await authFunctions.getSession();
      expect(mockAuth.getSession).toHaveBeenCalled();
    });

    test('should return session when successful', async () => {
      const result = await authFunctions.getSession();
      expect(result.session).toBeTruthy();
      expect(result.error).toBeNull();
    });    test('should return error when unsuccessful', async () => {
      mockAuth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: { message: 'Session not found' },
      });

      const result = await authFunctions.getSession();
      expect(result.session).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });
});
