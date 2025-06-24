// Mock for @supabase/supabase-js

// Import the client mock from our internal client mock
const { supabaseClient } = require('../@/lib/supabase/client');

// Mock createClient function
const createClient = jest.fn(() => supabaseClient);

module.exports = {
  createClient,
  default: {
    createClient,
  },
};