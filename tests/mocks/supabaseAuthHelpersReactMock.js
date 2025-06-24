// Minimal mock for @supabase/auth-helpers-react to avoid recursion issues
module.exports = {
  __esModule: true,
  useUser: () => ({ user: { id: 'test-user-id', email: 'test@example.com' } }),
  useSession: () => ({ session: { user: { id: 'test-user-id' } } }),
};
