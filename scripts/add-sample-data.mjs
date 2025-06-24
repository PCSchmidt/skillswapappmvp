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

console.log('🌱 SkillSwap Sample Data Setup');
console.log('=============================\n');

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Sample skills data - using common column names
const sampleSkills = [
  { title: 'JavaScript Programming', category: 'Technology', description: 'Frontend and backend JavaScript development including React, Node.js, and modern frameworks' },
  { title: 'Python Programming', category: 'Technology', description: 'Python development for web applications, data science, and automation scripts' },
  { title: 'Guitar Playing', category: 'Music', description: 'Acoustic and electric guitar lessons for beginners to intermediate players' },
  { title: 'Spanish Language', category: 'Language', description: 'Conversational and business Spanish for travel and professional communication' },
  { title: 'Home Cooking', category: 'Lifestyle', description: 'Healthy meal preparation, basic cooking techniques, and meal planning' },
  { title: 'Digital Photography', category: 'Creative', description: 'Digital photography techniques, composition, and basic photo editing' },
  { title: 'Yoga Instruction', category: 'Fitness', description: 'Hatha and Vinyasa yoga for stress relief and flexibility' },
  { title: 'Web Design', category: 'Technology', description: 'UI/UX design principles and responsive web design using modern tools' },
  { title: 'French Language', category: 'Language', description: 'French conversation practice and grammar for intermediate learners' },
  { title: 'Data Analysis', category: 'Technology', description: 'Excel, SQL, and basic data visualization for business insights' },
  { title: 'Gardening', category: 'Lifestyle', description: 'Vegetable gardening, composting, and sustainable growing practices' },
  { title: 'Piano Playing', category: 'Music', description: 'Classical and contemporary piano lessons for all skill levels' }
];

async function addSampleData() {
  try {
    console.log('🔍 Checking current skills...');
    const { data: existingSkills, error: checkError } = await supabase
      .from('skills')
      .select('*');

    if (checkError) {
      console.log('❌ Could not check existing skills:', checkError.message);
      return;
    }

    console.log(`📊 Found ${existingSkills?.length || 0} existing skills`);

    if (existingSkills && existingSkills.length > 0) {
      console.log('✅ Skills already exist, skipping sample data insertion');
      console.log('Existing skills:');
      existingSkills.forEach(skill => {
        console.log(`  - ${skill.title || skill.name} (${skill.category})`);
      });
      return;
    }

    console.log('🌱 Adding sample skills...');
    
    // Try different column variations in case schema differs
    const insertVariations = [
      // Variation 1: title, category, description
      sampleSkills,
      // Variation 2: name instead of title
      sampleSkills.map(skill => ({ 
        name: skill.title, 
        category: skill.category, 
        description: skill.description 
      }))
    ];

    let inserted = false;
    for (let i = 0; i < insertVariations.length && !inserted; i++) {
      console.log(`🔄 Trying insertion variation ${i + 1}...`);
      
      const { data, error } = await supabase
        .from('skills')
        .insert(insertVariations[i])
        .select();

      if (error) {
        console.log(`⚠️  Variation ${i + 1} failed:`, error.message);
      } else {
        console.log(`✅ Successfully inserted ${data.length} skills using variation ${i + 1}`);
        inserted = true;
        
        // Show what was inserted
        console.log('📋 Inserted skills:');
        data.forEach(skill => {
          const name = skill.title || skill.name;
          console.log(`  - ${name} (${skill.category})`);
        });
      }
    }

    if (!inserted) {
      console.log('❌ Could not insert sample skills with any variation');
      console.log('📋 Manual insertion may be needed in Supabase dashboard');
    }

    console.log('\n🔍 Final verification...');
    const { data: finalCheck, error: finalError } = await supabase
      .from('skills')
      .select('*');

    if (finalError) {
      console.log('❌ Final check failed:', finalError.message);
    } else {
      console.log(`✅ Final count: ${finalCheck?.length || 0} skills in database`);
    }

  } catch (error) {
    console.error('❌ Sample data setup failed:', error.message);
  }
}

async function verifyAllTables() {
  console.log('\n🔍 Verifying all tables are accessible...');
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
  
  if (accessibleCount === tables.length) {
    console.log('🎉 All tables ready! Database setup complete.');
    console.log('🚀 Ready to continue with Skills UI development');
  } else {
    console.log('⚠️  Some tables still missing. Please run the SQL in Supabase dashboard first.');
  }
}

// Run the setup
addSampleData().then(() => verifyAllTables());
