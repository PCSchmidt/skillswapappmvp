#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

console.log('🚀 SkillSwap Direct SQL Database Setup');
console.log('=====================================\n');

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const createUserSkillsTable = `
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

-- Enable RLS
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all user skills" ON user_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage their own skills" ON user_skills FOR ALL USING (auth.uid() = user_id);
`;

const createTradeProposalsTable = `
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

-- Enable RLS
ALTER TABLE trade_proposals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view trades involving them" ON trade_proposals
  FOR SELECT USING (auth.uid() = proposer_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can create trade proposals" ON trade_proposals
  FOR INSERT WITH CHECK (auth.uid() = proposer_id);
CREATE POLICY "Users can update trades involving them" ON trade_proposals
  FOR UPDATE USING (auth.uid() = proposer_id OR auth.uid() = receiver_id);
`;

// Sample skills data
const sampleSkills = [
  { name: 'JavaScript Programming', category: 'Technology', description: 'Frontend and backend JavaScript development' },
  { name: 'Python Programming', category: 'Technology', description: 'Python development for web, data science, and automation' },
  { name: 'Guitar Playing', category: 'Music', description: 'Acoustic and electric guitar lessons' },
  { name: 'Spanish Language', category: 'Language', description: 'Conversational and business Spanish' },
  { name: 'Cooking', category: 'Lifestyle', description: 'Home cooking and meal preparation' },
  { name: 'Photography', category: 'Creative', description: 'Digital photography and photo editing' },
  { name: 'Yoga', category: 'Fitness', description: 'Hatha and Vinyasa yoga instruction' },
  { name: 'Web Design', category: 'Technology', description: 'UI/UX design and frontend development' }
];

async function setupDatabase() {
  try {
    console.log('📊 Creating user_skills table...');
    const { error: userSkillsError } = await supabase.rpc('exec', { sql: createUserSkillsTable });
    
    if (userSkillsError) {
      console.log('⚠️  RPC exec not available, trying alternative approach...');
      // Try using direct SQL execution if available
      const { error: directError } = await supabase.from('user_skills').select('id').limit(1);
      if (directError && directError.message.includes('does not exist')) {
        console.log('❌ user_skills table creation failed through client');
        console.log('📋 SQL to run manually in Supabase SQL Editor:');
        console.log(createUserSkillsTable);
      } else {
        console.log('✅ user_skills table already exists or was created');
      }
    } else {
      console.log('✅ user_skills table created successfully');
    }

    console.log('\n📊 Creating trade_proposals table...');
    const { error: tradeProposalsError } = await supabase.rpc('exec', { sql: createTradeProposalsTable });
    
    if (tradeProposalsError) {
      console.log('⚠️  RPC exec not available, trying alternative approach...');
      const { error: directError } = await supabase.from('trade_proposals').select('id').limit(1);
      if (directError && directError.message.includes('does not exist')) {
        console.log('❌ trade_proposals table creation failed through client');
        console.log('📋 SQL to run manually in Supabase SQL Editor:');
        console.log(createTradeProposalsTable);
      } else {
        console.log('✅ trade_proposals table already exists or was created');
      }
    } else {
      console.log('✅ trade_proposals table created successfully');
    }

    console.log('\n🌱 Adding sample skills...');
    const { error: skillsError } = await supabase
      .from('skills')
      .upsert(sampleSkills, { onConflict: 'name' });

    if (skillsError) {
      console.log('⚠️  Sample skills insertion failed:', skillsError.message);
    } else {
      console.log('✅ Sample skills added successfully');
    }

    console.log('\n🔍 Final verification...');
    const tables = ['users', 'skills', 'user_skills', 'trade_proposals', 'messages'];
    let accessibleCount = 0;

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: accessible`);
          accessibleCount++;
        }
      } catch (e) {
        console.log(`❌ ${table}: ${e.message}`);
      }
    }

    console.log(`\n📈 Database Status: ${accessibleCount}/${tables.length} tables accessible`);
    
    if (accessibleCount < tables.length) {
      console.log('\n📋 Manual SQL needed for missing tables - please run in Supabase SQL Editor:');
      console.log('\n-- user_skills table:');
      console.log(createUserSkillsTable);
      console.log('\n-- trade_proposals table:');
      console.log(createTradeProposalsTable);
      console.log('\n🔗 Supabase SQL Editor: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0] + '/sql');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('Ready to continue with Skills UI development');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
