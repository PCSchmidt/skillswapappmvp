#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

console.log('🔍 SkillSwap Database Schema Inspection');
console.log('=====================================\n');

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function inspectSchema() {
  try {
    console.log('📊 Checking skills table structure...');
    
    // Try to get some sample data to understand the structure
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log('❌ Error querying skills:', error.message);
    } else {
      console.log('✅ Skills table data:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data && data.length > 0) {
        console.log('\n📋 Skills table columns:');
        Object.keys(data[0]).forEach(key => {
          console.log(`  - ${key}: ${typeof data[0][key]}`);
        });
      } else {
        console.log('📝 Skills table is empty, checking if we can insert...');
        
        // Try a test insert to understand the required columns
        const testSkill = {
          title: 'Test Skill',
          category: 'Test',
          description: 'Test description'
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from('skills')
          .insert([testSkill])
          .select();
        
        if (insertError) {
          console.log('⚠️  Insert failed:', insertError.message);
          console.log('This helps us understand the required schema');
        } else {
          console.log('✅ Test insert successful:');
          console.log(JSON.stringify(insertData, null, 2));
          
          // Clean up test data
          if (insertData && insertData[0]?.id) {
            await supabase.from('skills').delete().eq('id', insertData[0].id);
            console.log('🧹 Test data cleaned up');
          }
        }
      }
    }

    console.log('\n📊 Checking all existing tables...');
    const tables = ['users', 'skills', 'user_skills', 'trade_proposals', 'messages'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: accessible (${data ? data.length : 0} sample records)`);
          if (data && data.length > 0 && table !== 'users') {
            console.log(`   Sample structure: ${Object.keys(data[0]).join(', ')}`);
          }
        }
      } catch (e) {
        console.log(`❌ ${table}: ${e.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Schema inspection failed:', error.message);
  }
}

inspectSchema();
