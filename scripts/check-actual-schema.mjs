import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Create service role client (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 SkillSwap Database Schema Analysis');
console.log('=====================================\n');

async function checkSchema() {
  const expectedTables = ['users', 'skills', 'messages', 'trade_proposals', 'user_skills'];
  
  console.log('📋 Checking Expected Tables:');
  console.log('============================');

  for (const tableName of expectedTables) {
    try {
      // Try to get table structure by querying with limit 0
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: Exists (${count || 0} rows)`);
        
        // Try to get one sample row to see structure
        const { data: sample, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
          
        if (!sampleError && sample && sample.length > 0) {
          console.log(`   📝 Sample structure:`, Object.keys(sample[0]).join(', '));
        } else if (!sampleError) {
          console.log(`   📝 Table is empty but accessible`);
        }
      }
    } catch (err) {
      console.log(`❌ ${tableName}: ${err.message}`);
    }
  }

  console.log('\n🔒 Testing Authentication & RLS:');
  console.log('=================================');
  
  // Test with anon client
  const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  try {
    const { data: skillsAnon, error: skillsAnonError } = await anonClient
      .from('skills')
      .select('*')
      .limit(1);
      
    if (skillsAnonError) {
      console.log('❌ Anon access to skills:', skillsAnonError.message);
    } else {
      console.log('✅ Anon can read skills table');
    }
  } catch (err) {
    console.log('❌ Anon skills test failed:', err.message);
  }
}

await checkSchema();
