#!/usr/bin/env node

/**
 * Manual Skills Creation Script
 * Creates skills directly in the database using Supabase client
 */

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

console.log('🌱 Creating Skills Catalog for Testing');
console.log('=====================================\n');

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const skills = [
  { title: 'JavaScript Programming', category: 'Technology', description: 'Frontend and backend JavaScript development including React, Node.js' },
  { title: 'Python Programming', category: 'Technology', description: 'Python development for web apps, data science, and automation' },
  { title: 'Guitar Playing', category: 'Music', description: 'Acoustic and electric guitar lessons for all levels' },
  { title: 'Spanish Conversation', category: 'Language', description: 'Conversational Spanish practice and grammar help' },
  { title: 'Home Cooking', category: 'Lifestyle', description: 'Basic cooking techniques and healthy meal preparation' },
  { title: 'Digital Photography', category: 'Creative', description: 'Digital photography and basic photo editing' },
  { title: 'Yoga Instruction', category: 'Fitness', description: 'Beginner-friendly yoga sessions and mindfulness' },
  { title: 'Web Design', category: 'Technology', description: 'UI/UX design and responsive web development' }
];

async function createSkills() {
  try {
    console.log('📊 Checking existing skills...');
    const { data: existing, error: checkError } = await supabase
      .from('skills')
      .select('*');
    
    if (checkError) {
      console.error('❌ Error checking existing skills:', checkError.message);
      return;
    }

    console.log(`Found ${existing?.length || 0} existing skills`);

    if (existing && existing.length > 0) {
      console.log('✅ Skills already exist:');
      existing.forEach(skill => {
        console.log(`  - ${skill.title} (${skill.category})`);
      });
      console.log('\n🎉 Skills catalog ready for testing!');
      return;
    }

    console.log('🌱 Creating new skills...');
    
    for (const skill of skills) {
      console.log(`Creating: ${skill.title}...`);
      
      const { data, error } = await supabase
        .from('skills')
        .insert([skill])
        .select()
        .single();

      if (error) {
        console.error(`❌ Failed to create ${skill.title}:`, error.message);
      } else {
        console.log(`✅ Created: ${skill.title} (ID: ${data.id})`);
      }
    }

    console.log('\n🔍 Final verification...');
    const { data: final, error: finalError } = await supabase
      .from('skills')
      .select('*');

    if (finalError) {
      console.error('❌ Final verification failed:', finalError.message);
    } else {
      console.log(`🎉 Successfully created ${final?.length || 0} skills!`);
      console.log('\n📋 Skills Catalog:');
      final?.forEach(skill => {
        console.log(`  - ${skill.title} (${skill.category})`);
      });
    }

  } catch (error) {
    console.error('❌ Skills creation failed:', error.message);
  }
}

createSkills();
