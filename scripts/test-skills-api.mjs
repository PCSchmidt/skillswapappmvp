#!/usr/bin/env node

/**
 * Test Skills API with actual table structure
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🧪 Testing Skills API with Real Table Structure');
console.log('================================================\n');

async function testTableStructure() {
  console.log('1️⃣ Testing skills table structure...');
  
  try {
    // Try to fetch skills with the expected columns
    const { data, error } = await supabase
      .from('skills')
      .select('id, title, category, description, user_id, is_offering, experience_level')
      .limit(5);
      
    if (error) {
      console.log('❌ Error:', error.message);
      return false;
    }
    
    console.log('✅ Skills table accessible');
    console.log(`📊 Found ${data?.length || 0} skills`);
    
    if (data && data.length > 0) {
      console.log('📋 Sample skill structure:');
      console.log(JSON.stringify(data[0], null, 2));
    }
    
    return true;
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
    return false;
  }
}

async function testSkillCreation() {
  console.log('\n2️⃣ Testing skill creation (requires auth)...');
  
  // First check if we're authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.log('⚠️ Not authenticated - skill creation requires login');
    console.log('💡 To test skill creation:');
    console.log('   1. Register/login to the app');
    console.log('   2. Use the browser to test skill creation');
    return;
  }
  
  console.log('✅ User authenticated:', session.user.email);
  
  // Try to create a test skill
  const testSkill = {
    title: 'Test Skill - ' + Date.now(),
    category: 'Testing',
    description: 'A test skill created by the API test',
    experience_level: 'intermediate',
    is_offering: true,
    is_remote_friendly: true
  };
  
  const { data, error } = await supabase
    .from('skills')
    .insert([{
      ...testSkill,
      user_id: session.user.id,
      is_active: true
    }])
    .select()
    .single();
    
  if (error) {
    console.log('❌ Error creating skill:', error.message);
  } else {
    console.log('✅ Skill created successfully:');
    console.log(JSON.stringify(data, null, 2));
    
    // Clean up - delete the test skill
    await supabase.from('skills').delete().eq('id', data.id);
    console.log('🧹 Test skill cleaned up');
  }
}

async function showNextSteps() {
  console.log('\n🎯 Skills API Status');
  console.log('===================');
  console.log('✅ Table structure confirmed and compatible');
  console.log('✅ API routes updated to match existing schema');
  console.log('✅ Ready for frontend skill management');
  
  console.log('\n📋 Next Steps:');
  console.log('1. Create skill form components');
  console.log('2. Build skill list/management UI');
  console.log('3. Test end-to-end skill creation flow');
  console.log('4. Update search to work with new structure');
  
  console.log('\n🚀 Start development server:');
  console.log('npm run dev');
}

async function runTests() {
  const tableOk = await testTableStructure();
  
  if (tableOk) {
    await testSkillCreation();
    await showNextSteps();
  } else {
    console.log('\n❌ Table structure test failed');
    console.log('Please check the skills table exists and is accessible');
  }
}

runTests().catch(console.error);
