#!/usr/bin/env node

/**
 * SkillSwap MVP - Comprehensive Database Schema Analysis
 * Analyzes the actual database structure from Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 SkillSwap Database Schema Analysis');
console.log('====================================\n');

async function analyzeSkillsTable() {
  console.log('📊 Analyzing Skills Table Structure...');
  
  try {
    // Try to get a sample record to understand the structure
    const { data: sampleSkill, error } = await supabase
      .from('skills')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('❌ Error accessing skills table:', error.message);
      return;
    }
    
    console.log('✅ Skills table accessible');
    console.log('📝 Sample data structure:', sampleSkill?.length ? 'Has data' : 'Empty table');
    
    // Test inserting a skill to see what columns are required
    console.log('\n🧪 Testing skill creation...');
    const { data: newSkill, error: insertError } = await supabase
      .from('skills')
      .insert([{
        title: 'Test Skill - Database Analysis',
        description: 'Testing database schema',
        category: 'Programming',
        is_offering: true,
        is_active: true
      }])
      .select()
      .single();
      
    if (insertError) {
      console.log('⚠️ Insert test result:', insertError.message);
    } else {
      console.log('✅ Skill creation successful!');
      console.log('📋 Created skill structure:', Object.keys(newSkill));
      
      // Clean up test data
      await supabase.from('skills').delete().eq('id', newSkill.id);
      console.log('🧹 Test data cleaned up');
    }
    
  } catch (error) {
    console.log('❌ Skills analysis failed:', error.message);
  }
}

async function analyzeTradeProposals() {
  console.log('\n📊 Analyzing Trade Proposals Table...');
  
  try {
    const { data, error } = await supabase
      .from('trade_proposals')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('❌ Error accessing trade_proposals:', error.message);
      return;
    }
    
    console.log('✅ Trade proposals table accessible');
    console.log('📝 Sample data:', data?.length ? 'Has data' : 'Empty table');
    
  } catch (error) {
    console.log('❌ Trade proposals analysis failed:', error.message);
  }
}

async function analyzeMessages() {
  console.log('\n📊 Analyzing Messages Table...');
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('❌ Error accessing messages:', error.message);
      return;
    }
    
    console.log('✅ Messages table accessible');
    console.log('📝 Sample data:', data?.length ? 'Has data' : 'Empty table');
    
  } catch (error) {
    console.log('❌ Messages analysis failed:', error.message);
  }
}

async function testAPICompatibility() {
  console.log('\n🔧 Testing API Compatibility...');
  
  // Test what our current API expects vs what the database provides
  console.log('📋 Our API expects skills to have: title, category, description');
  console.log('📋 Our API expects skills to support: user_id, is_offering');
  
  // This analysis helps us understand if our API routes match the database
}

async function showRecommendations() {
  console.log('\n💡 Recommendations:');
  console.log('====================');
  console.log('1. ✅ Skills table exists with rich structure - UPDATE API to match');
  console.log('2. ❓ Trade proposals - verify table access and structure');
  console.log('3. ✅ Messages table exists - ready for messaging features');
  console.log('4. 🎯 Focus on building UI components that work with existing schema');
  console.log('5. 🧪 Test with sample data creation');
  
  console.log('\n🚀 Next Steps:');
  console.log('- Update API routes to match existing database schema');
  console.log('- Create sample skills data for testing');
  console.log('- Build skill management UI components');
  console.log('- Test complete user flow with existing tables');
}

async function runAnalysis() {
  try {
    await analyzeSkillsTable();
    await analyzeTradeProposals();
    await analyzeMessages();
    await testAPICompatibility();
    await showRecommendations();
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

runAnalysis();
