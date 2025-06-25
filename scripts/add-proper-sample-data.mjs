#!/usr/bin/env node

/**
 * SkillSwap MVP - Add Proper Sample Data
 * Inserts sample skills with proper UUID format
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🎯 SkillSwap Sample Data Setup');
console.log('==============================');

const sampleSkills = [
  {
    name: 'JavaScript Programming',
    category: 'Programming',
    description: 'Learn modern JavaScript development including ES6+, async/await, and frameworks'
  },
  {
    name: 'Guitar Lessons',
    category: 'Music',
    description: 'Acoustic and electric guitar instruction for beginners to intermediate players'
  },
  {
    name: 'Spanish Language',
    category: 'Languages',
    description: 'Conversational Spanish lessons focusing on practical communication skills'
  },
  {
    name: 'Photography',
    category: 'Creative',
    description: 'Digital photography techniques, composition, and basic photo editing'
  },
  {
    name: 'Cooking',
    category: 'Culinary',
    description: 'Basic cooking skills, meal planning, and healthy recipe development'
  },
  {
    name: 'Yoga',
    category: 'Fitness',
    description: 'Beginner-friendly yoga poses, breathing techniques, and meditation'
  },
  {
    name: 'Graphic Design',
    category: 'Creative',
    description: 'Design principles, Adobe Creative Suite, and logo/brand development'
  },
  {
    name: 'Data Analysis',
    category: 'Analytics',
    description: 'Excel, basic statistics, and data visualization using spreadsheets'
  },
  {
    name: 'Gardening',
    category: 'Hobbies',
    description: 'Vegetable gardening, plant care, and sustainable growing practices'
  },
  {
    name: 'Public Speaking',
    category: 'Communication',
    description: 'Confidence building, presentation skills, and effective communication'
  }
];

async function addSampleSkills() {
  try {
    console.log('\n📊 Checking current skills...');
    const { data: existingSkills, error: checkError } = await supabase
      .from('skills')
      .select('id, name')
      .limit(10);

    if (checkError) {
      console.error('❌ Error checking existing skills:', checkError.message);
      return false;
    }

    console.log(`📋 Found ${existingSkills?.length || 0} existing skills`);

    if (existingSkills && existingSkills.length > 0) {
      console.log('✅ Skills already exist. Sample data not needed.');
      console.log('Existing skills:', existingSkills.map(s => s.name).join(', '));
      return true;
    }

    console.log('\n🎯 Adding sample skills...');
    
    // Insert skills one by one to handle any individual failures
    let successCount = 0;
    let failureCount = 0;

    for (const skill of sampleSkills) {
      try {
        const { data, error } = await supabase
          .from('skills')
          .insert([skill])
          .select();

        if (error) {
          console.log(`⚠️  Failed to add "${skill.name}":`, error.message);
          failureCount++;
        } else {
          console.log(`✅ Added: ${skill.name}`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Error adding "${skill.name}":`, err.message);
        failureCount++;
      }
    }

    console.log(`\n📈 Results: ${successCount} added, ${failureCount} failed`);

    // Final verification
    const { data: finalSkills, error: finalError } = await supabase
      .from('skills')
      .select('id, name, category')
      .order('name');

    if (finalError) {
      console.error('❌ Error in final verification:', finalError.message);
      return false;
    }

    console.log(`\n✅ Final count: ${finalSkills?.length || 0} skills in database`);
    if (finalSkills && finalSkills.length > 0) {
      console.log('📋 Skills available:');
      finalSkills.forEach(skill => {
        console.log(`   • ${skill.name} (${skill.category})`);
      });
    }

    return successCount > 0;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

async function main() {
  const success = await addSampleSkills();
  
  if (success) {
    console.log('\n🎉 Sample data setup complete!');
    console.log('🚀 Ready for user testing and skill browsing');
  } else {
    console.log('\n⚠️  Sample data setup encountered issues');
    console.log('💡 You can manually add skills through the app interface');
  }
}

main().catch(console.error);
