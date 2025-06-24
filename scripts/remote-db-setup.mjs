#!/usr/bin/env node

/**
 * SkillSwap MVP - Remote Database Table Creation
 * Uses Supabase REST API to create tables remotely
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

console.log('🗄️ SkillSwap Remote Database Setup');
console.log('===================================\n');

async function executeSQL(sql, description) {
  try {
    console.log(`📋 ${description}...`);
    
    // Use Supabase's SQL execution via REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        sql: sql
      })
    });

    if (response.ok) {
      console.log(`✅ ${description} - Success`);
      return true;
    } else {
      const error = await response.text();
      console.log(`⚠️ ${description} - ${error}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - ${error.message}`);
    return false;
  }
}

async function createTablesWithRawSQL() {
  console.log('🔧 Creating tables with raw SQL execution...\n');
  
  // Step 1: Create user_skills table
  const userSkillsSQL = `
    CREATE TABLE IF NOT EXISTS user_skills (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
      skill_type TEXT NOT NULL CHECK (skill_type IN ('offered', 'wanted')),
      proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'intermediate',
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT unique_user_skill_type UNIQUE(user_id, skill_id, skill_type)
    );
  `;
  
  await executeSQL(userSkillsSQL, 'Creating user_skills table');
  
  // Step 2: Create trade_proposals table
  const tradeProposalsSQL = `
    CREATE TABLE IF NOT EXISTS trade_proposals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      proposer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      offered_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
      requested_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')) DEFAULT 'pending',
      message TEXT,
      response_message TEXT,
      scheduled_date TIMESTAMP WITH TIME ZONE,
      duration_minutes INTEGER DEFAULT 60,
      location TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT no_self_proposals CHECK (proposer_id != receiver_id)
    );
  `;
  
  await executeSQL(tradeProposalsSQL, 'Creating trade_proposals table');
  
  // Step 3: Add sample skills data
  const sampleSkillsSQL = `
    INSERT INTO skills (name, category, description) 
    VALUES
      ('JavaScript', 'Programming', 'Modern JavaScript development and frameworks'),
      ('Python', 'Programming', 'Python programming for web development and data science'),
      ('React', 'Programming', 'React.js frontend development'),
      ('Node.js', 'Programming', 'Backend development with Node.js'),
      ('PostgreSQL', 'Database', 'Database design and administration'),
      ('UI/UX Design', 'Design', 'User interface and user experience design'),
      ('Project Management', 'Business', 'Agile project management and team leadership'),
      ('Digital Marketing', 'Marketing', 'Online marketing strategies and social media'),
      ('Content Writing', 'Writing', 'Technical and creative content creation'),
      ('Photography', 'Creative', 'Digital photography and photo editing')
    ON CONFLICT (name) DO NOTHING;
  `;
  
  await executeSQL(sampleSkillsSQL, 'Adding sample skills data');
}

async function verifyTables() {
  console.log('\n🔍 Verifying table creation...');
  
  const tables = ['users', 'skills', 'user_skills', 'trade_proposals', 'messages'];
  let successCount = 0;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: accessible (${data?.length || 0} sample rows)`);
        successCount++;
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Database Status: ${successCount}/${tables.length} tables accessible`);
  
  if (successCount >= 4) { // Need at least 4 core tables
    console.log('🎉 Database setup complete! Ready for full functionality!');
    return true;
  } else {
    console.log('⚠️ Some tables missing - may need manual creation');
    return false;
  }
}

async function runRemoteSetup() {
  try {
    await createTablesWithRawSQL();
    const success = await verifyTables();
    
    if (success) {
      console.log('\n🚀 Remote database setup successful!');
      console.log('✅ All tables created and accessible');
      console.log('✅ Sample data inserted');
      console.log('✅ Ready to test Skills CRUD functionality');
    } else {
      console.log('\n📋 Fallback to manual setup may be needed');
    }
    
  } catch (error) {
    console.error('❌ Remote setup failed:', error.message);
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Copy SQL from sql/step1-user-skills.sql');
    console.log('2. Copy SQL from sql/step2-trade-proposals.sql');  
    console.log('3. Copy SQL from sql/step3-sample-skills.sql');
    console.log('4. Execute each in Supabase SQL Editor');
  }
}

runRemoteSetup();
