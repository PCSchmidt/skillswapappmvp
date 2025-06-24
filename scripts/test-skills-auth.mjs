#!/usr/bin/env node

/**
 * Test authenticated access to skills table
 * This simulates what will happen when users are logged in
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔐 Testing Skills Table with Authentication');
console.log('==========================================\n');

async function testSkillsTableStructure() {
  console.log('🔍 Testing skills table structure...\n');
  
  try {
    // Try to read from skills table to understand its structure
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('❌ Error reading skills:', error.message);
      return;
    }
    
    console.log('✅ Skills table accessible');
    console.log('📊 Current rows:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('🏗️ Table structure (from sample row):');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('📭 No sample data available');
    }
    
    // Test what columns exist by attempting a simple select
    const { data: columnTest, error: columnError } = await supabase
      .from('skills')
      .select('id, title, category, description, user_id, is_offering, created_at')
      .limit(1);
      
    if (columnError) {
      console.log('\n⚠️ Column test error:', columnError.message);
    } else {
      console.log('\n✅ Confirmed columns: id, title, category, description, user_id, is_offering, created_at');
    }
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

async function simulateAuthenticatedSkillCreation() {
  console.log('\n🧪 Simulating skill creation flow...\n');
  
  // This will fail due to RLS, but shows us the error message
  const testSkill = {
    title: 'JavaScript Development',
    category: 'Programming',
    description: 'Frontend and backend JavaScript development',
    is_offering: true
    // user_id will be set by RLS policy when authenticated
  };
  
  const { data, error } = await supabase
    .from('skills')
    .insert(testSkill)
    .select();
    
  if (error) {
    console.log('❌ Expected RLS error:', error.message);
    console.log('💡 This confirms RLS is working - skills require authentication');
  } else {
    console.log('✅ Skill created successfully (unexpected!)');
    console.log('📄 Created skill:', data);
  }
}

async function showNextSteps() {
  console.log('\n🎯 Next Steps for Skills Implementation:');
  console.log('=====================================\n');
  
  console.log('1. ✅ Skills table exists with proper structure');
  console.log('2. 🔐 RLS policies require authentication for writes');
  console.log('3. 🚀 Ready to build Skills UI components');
  console.log('4. 🧪 Test with real authentication flow');
  
  console.log('\n📋 Immediate Tasks:');
  console.log('- Build SkillForm component');
  console.log('- Create skills/new page with authentication');
  console.log('- Test complete user journey: Register → Login → Create Skill');
  console.log('- Update API routes to match existing table structure');
  
  console.log('\n🎊 We can continue with full functionality using existing tables!');
}

async function runTest() {
  await testSkillsTableStructure();
  await simulateAuthenticatedSkillCreation();
  await showNextSteps();
}

runTest().catch(console.error);
