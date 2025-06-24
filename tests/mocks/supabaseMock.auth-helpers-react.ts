// Minimal mock for @supabase/auth-helpers-react
export const useUser = jest.fn(() => ({ user: null }));
export const useSession = jest.fn(() => ({ session: null }));
const authHelpersReactMock = {};
export default authHelpersReactMock;
