// Minimal mock for @supabase/auth-helpers-nextjs
const supabaseMock = require('./supabaseMock');

module.exports = {
  __esModule: true,
  createClientComponentClient: supabaseMock.createClientComponentClient,
  // Add other exports as needed
};
