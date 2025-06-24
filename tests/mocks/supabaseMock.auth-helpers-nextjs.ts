// Minimal mock for @supabase/auth-helpers-nextjs
export const createServerSupabaseClient = jest.fn();
export const createPagesBrowserClient = jest.fn();
export const createPagesServerClient = jest.fn();
export const getUser = jest.fn();
export const getSession = jest.fn();
const authHelpersNextjsMock = {};
export default authHelpersNextjsMock;
