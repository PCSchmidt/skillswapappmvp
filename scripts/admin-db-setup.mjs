#!/usr/bin/env node

/**
 * SkillSwap MVP - Admin Database Operations
 * Uses service role key for full database access
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.log('\n🔧 To fix this:');
  console.log('1. Go to Supabase Dashboard > Settings > API');
  console.log('2. Copy the "service_role" key (not anon key)');
  console.log('3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_service_key');
  process.exit(1);
}

// Create admin client with service role
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🔑 SkillSwap Admin Database Operations');
console.log('=====================================\n');

async function listAllTables() {
  console.log('📋 Checking all tables with admin access...');
  
  try {
    // Query information_schema with admin privileges
    const { data, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (error) {
      console.log('⚠️ Could not query information_schema, trying direct approach...');
      
      // Try direct table access
      const tables = ['users', 'skills', 'messages', 'trade_proposals', 'user_skills'];
      
      for (const table of tables) {
        try {
          const { data: tableData, error: tableError } = await supabaseAdmin
            .from(table)
            .select('*')
            .limit(1);
            
          if (tableError) {
            console.log(`❌ ${table}: ${tableError.message}`);
          } else {
            console.log(`✅ ${table}: accessible (${tableData?.length || 0} sample rows)`);
          }
        } catch (err) {
          console.log(`❌ ${table}: ${err.message}`);
        }
      }
    } else {
      console.log('✅ Found tables in public schema:');
      data.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }
  } catch (err) {
    console.error('❌ Error listing tables:', err.message);
  }
}

async function createMissingTables() {
  console.log('\n🛠️ Creating missing tables with admin privileges...');
  
  const tables = [
    {
      name: 'user_skills',
      sql: `
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
      `
    },
    {
      name: 'trade_proposals',
      sql: `
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
      `
    }
  ];
  
  for (const table of tables) {
    try {
      console.log(`📝 Creating ${table.name}...`);
      
      // Execute SQL using rpc function
      const { error } = await supabaseAdmin.rpc('exec', {
        sql: table.sql
      });
      
      if (error) {
        console.log(`⚠️ ${table.name}: ${error.message}`);
        console.log('Trying alternative approach...');
        
        // Try using the SQL directly via a query
        // This is a workaround since exec might not be available
        const { error: altError } = await supabaseAdmin
          .from(table.name)
          .select('id')
          .limit(1);
          
        if (altError && altError.message.includes('does not exist')) {
          console.log(`❌ ${table.name}: Table doesn't exist and couldn't be created automatically`);
          console.log(`📋 Manual SQL for ${table.name}:`);
          console.log(table.sql);
          console.log('');
        } else {
          console.log(`✅ ${table.name}: Already exists or accessible`);
        }
      } else {
        console.log(`✅ ${table.name}: Created successfully`);
      }
    } catch (err) {
      console.log(`❌ ${table.name}: ${err.message}`);
    }
  }
}

async function insertSampleSkills() {
  console.log('\n🎯 Adding sample skills with admin privileges...');
  
  try {
    // Check current skills
    const { data: existingSkills, error: checkError } = await supabaseAdmin
      .from('skills')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.log('⚠️ Cannot access skills table:', checkError.message);
      return;
    }
    
    if (existingSkills && existingSkills.length > 0) {
      console.log('✅ Skills data already exists');
      return;
    }
    
    console.log('📝 Inserting sample skills...');
    
    const sampleSkills = [
      { title: 'JavaScript', category: 'Programming', description: 'Modern JavaScript development and frameworks' },
      { title: 'Python', category: 'Programming', description: 'Python programming for web development and data science' },
      { title: 'React', category: 'Programming', description: 'React.js frontend development' },
      { title: 'Node.js', category: 'Programming', description: 'Backend development with Node.js' },
      { title: 'PostgreSQL', category: 'Database', description: 'Database design and administration' },
      { title: 'UI/UX Design', category: 'Design', description: 'User interface and user experience design' },
      { title: 'Project Management', category: 'Business', description: 'Agile project management and team leadership' },
      { title: 'Digital Marketing', category: 'Marketing', description: 'Online marketing strategies and social media' },
      { title: 'Content Writing', category: 'Writing', description: 'Technical and creative content creation' },
      { title: 'Photography', category: 'Creative', description: 'Digital photography and photo editing' }
    ];
    
    const { data, error } = await supabaseAdmin
      .from('skills')
      .insert(sampleSkills)
      .select();
      
    if (error) {
      console.log('⚠️ Error inserting sample skills:', error.message);
    } else {
      console.log(`✅ Inserted ${data?.length || 0} sample skills`);
    }
  } catch (err) {
    console.log('⚠️ Error with sample skills:', err.message);
  }
}

async function verifySetup() {
  console.log('\n🔍 Final verification with admin access...');
  
  const tables = ['users', 'skills', 'user_skills', 'trade_proposals', 'messages'];
  const results = [];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        results.push(`❌ ${table}: ${error.message}`);
      } else {
        results.push(`✅ ${table}: accessible (${data?.length || 0} sample rows)`);
      }
    } catch (error) {
      results.push(`❌ ${table}: ${error.message}`);
    }
  }
  
  results.forEach(result => console.log(result));
  
  const successCount = results.filter(r => r.startsWith('✅')).length;
  const totalCount = results.length;
  
  console.log(`\n📊 Database Status: ${successCount}/${totalCount} tables accessible with admin privileges`);
  
  if (successCount >= 3) {
    console.log('🎉 Database setup ready for core functionality!');
  } else {
    console.log('⚠️ Some tables still missing - may need manual setup');
  }
}

async function runAdminSetup() {
  console.log('🔑 Using service role key for admin operations...\n');
  
  await listAllTables();
  await createMissingTables();
  await insertSampleSkills();
  await verifySetup();
  
  console.log('\n🚀 Admin setup complete!');
  console.log('Ready to continue with Skills UI development');
}

// Check if service role key is available
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  runAdminSetup().catch(console.error);
} else {
  console.log('ℹ️ Service role key not found in environment');
  console.log('You can find it in Supabase Dashboard > Settings > API');
  console.log('Add it to .env.local as SUPABASE_SERVICE_ROLE_KEY');
}
