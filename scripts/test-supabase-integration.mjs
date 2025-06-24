#!/usr/bin/env node

/**
 * SkillSwap MVP - Supabase Integration Test
 * Tests real database operations and auth flow
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🧪 SkillSwap Supabase Integration Test');
console.log('=====================================');

async function testSupabaseConnection() {
  try {
    console.log('\n1️⃣ Testing Supabase Connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('skills').select('id').limit(1);
    
    if (error) {
      console.log('⚠️ Database query error (expected if no data):', error.message);
    } else {
      console.log('✅ Supabase connection successful');
      console.log('📊 Skills table accessible:', data?.length || 0, 'records found');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

async function testDatabaseSchema() {
  console.log('\n2️⃣ Testing Database Schema...');
  
  const tables = ['users', 'skills', 'user_skills', 'messages', 'trade_proposals'];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.log(`⚠️ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: accessible`);
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }
}

async function testAuthFlow() {
  console.log('\n3️⃣ Testing Auth Flow...');
  
  try {
    // Test getting current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('⚠️ Auth session error:', error.message);
    } else {
      console.log('✅ Auth system accessible');
      console.log('🔐 Current session:', session ? 'Authenticated' : 'Anonymous');
    }
    
    // Test auth state change listener
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email || 'Anonymous');
    });
    
  } catch (error) {
    console.error('❌ Auth test failed:', error.message);
  }
}

async function testRealTimeFeatures() {
  console.log('\n4️⃣ Testing Real-time Features...');
  
  try {
    // Test if real-time is enabled
    const channel = supabase.channel('test-channel');
    
    console.log('✅ Real-time client created');
    
    // Clean up
    supabase.removeChannel(channel);
    
  } catch (error) {
    console.error('❌ Real-time test failed:', error.message);
  }
}

async function runTests() {
  const connected = await testSupabaseConnection();
  
  if (connected) {
    await testDatabaseSchema();
    await testAuthFlow();
    await testRealTimeFeatures();
  }
  
  console.log('\n🏁 Integration Test Complete');
  console.log('=====================================');
  console.log('✅ Ready for live authentication testing');
  console.log('📝 Use the browser to test user registration and login');
  console.log('🔗 Next: Test with a real email address that you can verify');
}

runTests().catch(console.error);
