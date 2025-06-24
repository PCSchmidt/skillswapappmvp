#!/usr/bin/env node

/**
 * SkillSwap MVP - Direct SQL Table Creation
 * Uses Supabase client SQL execution
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

console.log('🗄️ SkillSwap Direct SQL Execution');
console.log('==================================\n');

async function createUserSkillsTable() {
  console.log('📋 Creating user_skills table...');
  
  try {
    // Try to create a record to trigger table creation via RLS
    const { data, error } = await supabase
      .schema('public')
      .from('user_skills')
      .insert([
        {
          // This will fail but might create the table structure
          user_id: '00000000-0000-0000-0000-000000000000',
          skill_id: '00000000-0000-0000-0000-000000000000',
          skill_type: 'offered'
        }
      ]);
    
    if (error) {
      console.log(`ℹ️ Expected error (table doesn't exist): ${error.message}`);
      
      // Table doesn't exist, let's try alternative approach
      console.log('🔧 Attempting alternative table creation...');
      
      // Try using sql template tag 
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user_skills (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          skill_id UUID NOT NULL,
          skill_type TEXT NOT NULL CHECK (skill_type IN ('offered', 'wanted')),
          proficiency_level TEXT DEFAULT 'intermediate',
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      // This might work if we have the right permissions
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({ query: createTableQuery })
      });
      
      if (response.ok) {
        console.log('✅ user_skills table created successfully');
        return true;
      } else {
        const errorText = await response.text();
        console.log(`⚠️ Alternative approach failed: ${errorText}`);
        return false;
      }
    } else {
      console.log('✅ user_skills table already exists');
      return true;
    }
  } catch (error) {
    console.log(`❌ Error creating user_skills table: ${error.message}`);
    return false;
  }
}

async function useManualInstructions() {
  console.log('\n📋 MANUAL SETUP REQUIRED');
  console.log('========================\n');
  
  console.log('Please copy and paste this SQL into Supabase Dashboard > SQL Editor:\n');
  
  console.log('-- Step 1: Create user_skills table');
  console.log(`CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  skill_type TEXT NOT NULL CHECK (skill_type IN ('offered', 'wanted')),
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'intermediate',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_skill_type UNIQUE(user_id, skill_id, skill_type)
);`);

  console.log('\n-- Step 2: Create trade_proposals table');
  console.log(`CREATE TABLE IF NOT EXISTS trade_proposals (
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
);`);

  console.log('\n-- Step 3: Add sample skills (if needed)');
  console.log(`INSERT INTO skills (name, category, description) VALUES
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
ON CONFLICT (name) DO NOTHING;`);

  console.log('\n🎯 After running the SQL:');
  console.log('1. Run: node scripts/test-supabase-integration.mjs');
  console.log('2. You should see: ✅ user_skills: accessible');
  console.log('3. You should see: ✅ trade_proposals: accessible');
  console.log('4. Ready to continue with Skills UI development!');
}

async function runDirectSetup() {
  try {
    const success = await createUserSkillsTable();
    
    if (!success) {
      await useManualInstructions();
    }
    
  } catch (error) {
    console.error('❌ Direct setup failed:', error.message);
    await useManualInstructions();
  }
}

runDirectSetup();
