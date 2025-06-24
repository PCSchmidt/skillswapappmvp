#!/usr/bin/env node

/**
 * SkillSwap MVP - Permission-Aware Database Test
 * Tests what tables and operations are available with current permissions
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Test with anon key (this is what our app will use)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔐 SkillSwap Permission-Aware Database Test');
console.log('===========================================\n');

async function testTableAccess() {
  console.log('📋 Testing table access with current permissions...\n');
  
  const tables = [
    { name: 'users', description: 'User profiles' },
    { name: 'skills', description: 'Skills catalog' },
    { name: 'messages', description: 'Messages between users' },
    { name: 'trade_proposals', description: 'Skill exchange proposals' },
    { name: 'user_skills', description: 'User skill relationships' }
  ];
  
  const results = [];
  
  for (const table of tables) {
    try {
      console.log(`🔍 Testing ${table.name}...`);
      
      // Test READ access
      const { data: readData, error: readError } = await supabase
        .from(table.name)
        .select('*')
        .limit(1);
        
      if (readError) {
        results.push({
          table: table.name,
          read: '❌ ' + readError.message,
          write: '⚠️ Cannot test (read failed)',
          description: table.description
        });
        continue;
      }
      
      // Test WRITE access (try inserting a test record)
      const testData = getTestData(table.name);
      if (testData) {
        const { error: writeError } = await supabase
          .from(table.name)
          .insert(testData)
          .select();
          
        if (writeError) {
          results.push({
            table: table.name,
            read: '✅ Accessible',
            write: '❌ ' + writeError.message,
            description: table.description,
            sampleCount: readData?.length || 0
          });
        } else {
          // Clean up test data
          await supabase
            .from(table.name)
            .delete()
            .match(testData);
            
          results.push({
            table: table.name,
            read: '✅ Accessible',
            write: '✅ Writable',
            description: table.description,
            sampleCount: readData?.length || 0
          });
        }
      } else {
        results.push({
          table: table.name,
          read: '✅ Accessible',
          write: '⚠️ No test data',
          description: table.description,
          sampleCount: readData?.length || 0
        });
      }
      
    } catch (error) {
      results.push({
        table: table.name,
        read: '❌ ' + error.message,
        write: '⚠️ Cannot test',
        description: table.description
      });
    }
  }
  
  return results;
}

function getTestData(tableName) {
  switch (tableName) {
    case 'skills':
      return {
        title: 'Test Skill - DELETE ME',
        category: 'Test',
        description: 'Test skill for permission testing'
      };
    case 'messages':
      return null; // Skip write test for messages (requires user context)
    case 'trade_proposals':
      return null; // Skip write test (requires user context)
    case 'users':
      return null; // Skip write test (auth-managed)
    case 'user_skills':
      return null; // Skip write test (requires valid skill and user IDs)
    default:
      return null;
  }
}

async function testAuthContext() {
  console.log('🔐 Testing authentication context...\n');
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Auth error:', error.message);
      return;
    }
    
    if (session) {
      console.log('✅ Authenticated as:', session.user.email);
      console.log('🆔 User ID:', session.user.id);
      console.log('🔑 Role:', session.user.role || 'authenticated');
    } else {
      console.log('⚠️ No active session (using anon permissions)');
      console.log('🔑 Role: anon');
    }
  } catch (error) {
    console.log('❌ Auth context error:', error.message);
  }
}

async function showRecommendations(results) {
  console.log('\n💡 Recommendations based on test results:\n');
  
  const readable = results.filter(r => r.read.startsWith('✅'));
  const writable = results.filter(r => r.write?.startsWith('✅'));
  
  console.log(`📊 Summary: ${readable.length}/5 tables readable, ${writable.length}/5 tables writable`);
  
  if (readable.length >= 3) {
    console.log('🎉 Good news! Core functionality is possible with current permissions');
    console.log('\n🚀 Immediate next steps:');
    console.log('1. Continue with Skills UI components');
    console.log('2. Test authentication flows');
    console.log('3. Build user dashboard');
    
    if (readable.find(r => r.table === 'skills')) {
      console.log('4. Skills management is ready to implement');
    }
    
    if (readable.find(r => r.table === 'messages')) {
      console.log('5. Messaging system can be built');
    }
  } else {
    console.log('⚠️ Limited table access detected');
    console.log('🔧 Solutions:');
    console.log('1. Check Row Level Security (RLS) policies');
    console.log('2. Verify table permissions in Supabase dashboard');
    console.log('3. Consider using service role key for admin operations');
  }
}

async function runPermissionTest() {
  await testAuthContext();
  const results = await testTableAccess();
  
  console.log('\n📊 Permission Test Results:');
  console.log('============================\n');
  
  results.forEach(result => {
    console.log(`🏷️  ${result.table.toUpperCase()}: ${result.description}`);
    console.log(`   📖 Read: ${result.read}`);
    console.log(`   ✏️  Write: ${result.write}`);
    if (result.sampleCount !== undefined) {
      console.log(`   📦 Sample data: ${result.sampleCount} rows`);
    }
    console.log('');
  });
  
  await showRecommendations(results);
}

runPermissionTest().catch(console.error);
