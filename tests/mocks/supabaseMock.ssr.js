// Minimal mock for @supabase/ssr
const supabaseMock = require('./supabaseMock');

module.exports = {
  __esModule: true,
  createBrowserClient: supabaseMock.createBrowserClient,
  createServerClient: supabaseMock.createServerClient,
};
