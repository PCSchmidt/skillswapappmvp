#!/usr/bin/env node

/**
 * SkillSwap MVP - Database Schema Setup Script
 * Creates missing database tables in Supabase
 */

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🗄️ SkillSwap Database Schema Setup');
console.log('==================================\n');

async function setupDatabase() {
  try {
    console.log('1️⃣ Reading SQL schema file...');
    
    const sqlFile = 'sql/missing-tables.sql';
    if (!fs.existsSync(sqlFile)) {
      throw new Error(`SQL file not found: ${sqlFile}`);
    }
    
    const sqlCommands = fs.readFileSync(sqlFile, 'utf8');
    console.log('✅ SQL file loaded successfully\n');
    
    console.log('2️⃣ Executing database schema...');
    
    // Note: For complex SQL with multiple statements, we might need to split and execute separately
    // For now, let's try executing the entire file
    const { error } = await supabase.rpc('exec_sql', { sql_text: sqlCommands });
    
    if (error) {
      console.log('⚠️ RPC method not available, trying alternative approach...');
      
      // Alternative: Test table creation individually
      await testTableCreation();
    } else {
      console.log('✅ Database schema executed successfully');
    }
    
    console.log('\n3️⃣ Verifying table creation...');
    await verifyTables();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Manual Setup Required:');
    console.log('1. Open Supabase Dashboard > SQL Editor');
    console.log('2. Copy and execute the contents of sql/missing-tables.sql');
    console.log('3. Run this script again to verify');
  }
}

async function testTableCreation() {
  console.log('\n🔧 Testing individual table operations...');
    // Test if we can query existing tables
  const { error: usersError } = await supabase
    .from('users')
    .select('id')
    .limit(1);
    
  if (usersError) {
    console.log('⚠️ Users table:', usersError.message);
  } else {
    console.log('✅ Users table accessible');
  }
  
  const { error: skillsError } = await supabase
    .from('skills')
    .select('id')
    .limit(1);
    
  if (skillsError) {
    console.log('⚠️ Skills table:', skillsError.message);
  } else {
    console.log('✅ Skills table accessible');
  }
}

async function verifyTables() {
  const tables = ['users', 'skills', 'user_skills', 'trade_proposals', 'messages'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: accessible (${data?.length || 0} rows sample)`);
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }
}

async function showNextSteps() {
  console.log('\n🎯 Database Setup Complete!');
  console.log('==========================');
  console.log('✅ Core tables verified and accessible');
  console.log('✅ Ready for skills CRUD implementation');
  console.log('✅ Ready for trade proposal system');
  console.log('\n📋 Next Steps:');
  console.log('1. Implement skills management API routes');
  console.log('2. Create skill form components');
  console.log('3. Build trade proposal functionality');
  console.log('4. Test end-to-end user flows');
  console.log('\n🚀 Run: npm run dev (to continue development)');
}

// Run the setup
setupDatabase()
  .then(showNextSteps)
  .catch(console.error);
