import { describe, expect, test, beforeEach } from '@jest/globals';

// Import auth functions to test
import * as authFunctions from '@/lib/supabase/auth';

describe('Authentication Functions', () => {
  beforeEach(() => {
    // Clear any state if needed
  });

  describe('signIn', () => {
    test('should return demo user when called in demo mode', async () => {
      const result = await authFunctions.signIn('test@example.com', 'password123');
      expect(result.user).toBeTruthy();
      expect(result.user?.email).toBe('demo@skillswap.com');
      expect(result.error).toBeNull();
    });

    test('should handle demo mode consistently', async () => {
      const result = await authFunctions.signIn('any@email.com', 'anypassword');
      expect(result.user).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });

  describe('signUp', () => {
    test('should return demo user when called in demo mode', async () => {
      const metadata = { full_name: 'John Doe' };
      const result = await authFunctions.signUp('new@example.com', 'password123', metadata);
      expect(result.user).toBeTruthy();
      expect(result.user?.email).toBe('demo@skillswap.com');
      expect(result.error).toBeNull();
    });

    test('should handle demo mode consistently', async () => {
      const result = await authFunctions.signUp('new@example.com', 'password123');
      expect(result.user).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });

  describe('signOut', () => {
    test('should return successful result in demo mode', async () => {
      const result = await authFunctions.signOut();
      expect(result.error).toBeNull();
    });
  });

  describe('resetPassword', () => {
    test('should return demo mode message for reset password', async () => {
      const result = await authFunctions.resetPassword('test@example.com');
      expect(result.error).toBeTruthy();
      expect(result.error?.message).toContain('Demo mode - email features disabled');
    });

    test('should handle redirectTo parameter in demo mode', async () => {
      const result = await authFunctions.resetPassword('test@example.com', 'http://localhost:3000/reset');
      expect(result.error).toBeTruthy();
      expect(result.error?.message).toContain('Demo mode - email features disabled');
    });
  });

  describe('verifyOtp', () => {
    test('should return demo user for OTP verification', async () => {
      const result = await authFunctions.verifyOtp('test@example.com', '123456', 'signup');
      expect(result.user).toBeTruthy();
      expect(result.user?.email).toBe('demo@skillswap.com');
      expect(result.error).toBeNull();
    });

    test('should handle different OTP types in demo mode', async () => {
      const signupResult = await authFunctions.verifyOtp('test@example.com', '123456', 'signup');
      const recoveryResult = await authFunctions.verifyOtp('test@example.com', '123456', 'recovery');
      
      expect(signupResult.user).toBeTruthy();
      expect(recoveryResult.user).toBeTruthy();
    });
  });

  describe('getCurrentUser', () => {
    test('should return demo user in demo mode', async () => {
      const result = await authFunctions.getCurrentUser();
      expect(result.user).toBeTruthy();
      expect(result.user?.email).toBe('demo@skillswap.com');
      expect(result.error).toBeNull();
    });
  });

  describe('getSession', () => {
    test('should return demo session in demo mode', async () => {
      const result = await authFunctions.getSession();
      expect(result.session).toBeTruthy();
      expect(result.session?.user?.email).toBe('demo@skillswap.com');
      expect(result.error).toBeNull();
    });
  });
});
