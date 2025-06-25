#!/usr/bin/env node

/**
 * SkillSwap MVP - Simple Skills Insert
 * Basic skills insertion for demo data
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🎯 Simple Skills Data Insert');
console.log('============================');

// Minimal skills for testing
const testSkills = [
  {
    title: 'JavaScript Programming',
    description: 'Learn modern JavaScript development and web applications',
    category: 'Technology'
  },
  {
    title: 'Guitar Playing',
    description: 'Acoustic guitar lessons for beginners',
    category: 'Music'
  },
  {
    title: 'Spanish Conversation',
    description: 'Conversational Spanish practice',
    category: 'Languages'
  }
];

async function testInsert() {
  console.log('\n🧪 Testing single skill insert...');
  
  try {
    // Try inserting just one skill first
    const { data, error } = await supabase
      .from('skills')
      .insert([testSkills[0]])
      .select();
    
    if (error) {
      console.error('❌ Insert error:', error.message);
      console.error('Error details:', error);
      return false;
    }
    
    console.log('✅ Successfully inserted:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Exception:', error.message);
    return false;
  }
}

async function checkExistingData() {
  console.log('\n📊 Checking existing data...');
  
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Query error:', error.message);
      return;
    }
    
    console.log(`Found ${data.length} existing skills:`);
    data.forEach(skill => {
      console.log(`  - ${skill.title} (${skill.category})`);
    });
    
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting simple insert test...\n');
  
  await checkExistingData();
  
  const success = await testInsert();
  
  if (success) {
    console.log('\n✅ Insert test successful!');
    await checkExistingData();
  } else {
    console.log('\n❌ Insert test failed');
  }
}

main().catch(console.error);
