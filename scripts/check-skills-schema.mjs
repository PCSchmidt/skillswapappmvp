#!/usr/bin/env node

/**
 * Check Skills Table Schema via Information Schema
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Checking Skills Table Schema');
console.log('===============================');

async function checkSchema() {
  try {
    // Try a simple select to see what columns exist
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
      console.log('📋 Error details:', error);
      
      // Try with specific columns that might exist
      const commonColumns = ['id', 'name', 'title', 'description', 'category', 'created_at'];
      
      for (const col of commonColumns) {
        try {
          const { data: testData, error: testError } = await supabase
            .from('skills')
            .select(col)
            .limit(1);
          
          if (!testError) {
            console.log(`✅ Column '${col}' exists`);
          } else {
            console.log(`❌ Column '${col}' does not exist: ${testError.message}`);
          }
        } catch (e) {
          console.log(`❌ Column '${col}' test failed: ${e.message}`);
        }
      }
    } else {
      console.log('✅ Skills table accessible');
      console.log('📊 Sample data structure:', data);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkSchema();
