#!/usr/bin/env node

/**
 * SkillSwap MVP - Add Clean Sample Data
 * Adds comprehensive sample data for demo testing
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🎯 Adding Clean Sample Data to SkillSwap');
console.log('========================================');

// Comprehensive skills using the actual table structure
const sampleSkills = [
  // Technology Skills - High Value
  {
    title: 'JavaScript Programming',
    description: 'Modern JavaScript development including React, Node.js, ES6+, and full-stack web applications',
    category: 'Technology',
    subcategory: 'Web Development',
    experience_level: 'intermediate',
    hourly_equivalent_value: 45.0,
    availability: { "weekdays": true, "evenings": true, "weekends": false },
    is_offering: true,
    is_remote_friendly: true,
    is_active: true
  },
  {
    title: 'Python Development',
    description: 'Python programming for web development, data science, automation, and machine learning',
    category: 'Technology',
    subcategory: 'Programming',
    experience_level: 'advanced',
    hourly_equivalent_value: 50.0,
    availability: { "weekdays": true, "evenings": false, "weekends": false },
    is_offering: true,
    is_remote_friendly: true,
    is_active: true
  },
  {
    title: 'Digital Marketing',
    description: 'SEO optimization, social media marketing, content strategy, and online advertising campaigns',
    category: 'Business',
    subcategory: 'Marketing',
    experience_level: 'expert',
    hourly_equivalent_value: 60.0,
    availability: { "weekdays": true, "evenings": false, "weekends": false },
    is_offering: true,
    is_remote_friendly: true,
    is_active: true
  },
  {
    title: 'Data Analysis',
    description: 'Excel mastery, data visualization, business intelligence, and statistical analysis',
    category: 'Technology',
    subcategory: 'Data Science',
    experience_level: 'advanced',
    hourly_equivalent_value: 55.0,
    availability: { "weekdays": true, "evenings": true, "weekends": false },
    is_offering: true,
    is_remote_friendly: true,
    is_active: true
  },

  // Creative Arts
  {
    title: 'Photography',
    description: 'Portrait, landscape, and event photography with professional editing techniques',
    category: 'Creative Arts',
    subcategory: 'Visual Arts',
    experience_level: 'intermediate',
    hourly_equivalent_value: 40.0,
    availability: { "weekdays": false, "evenings": false, "weekends": true },
    is_offering: true,
    is_remote_friendly: false,
    is_active: true
  },
  {
    title: 'Graphic Design',
    description: 'Logo design, branding, print materials, and digital design using Adobe Creative Suite',
    category: 'Creative Arts',
    subcategory: 'Design',
    experience_level: 'intermediate',
    hourly_equivalent_value: 35.0,
    availability: { "weekdays": true, "evenings": false, "weekends": true },
    is_offering: true,
    is_remote_friendly: true,
    is_active: true
  },
  {
    title: 'Video Editing',
    description: 'Professional video editing with Adobe Premiere, DaVinci Resolve, and motion graphics',
    category: 'Creative Arts',
    subcategory: 'Digital Media',
    experience_level: 'advanced',
    hourly_equivalent_value: 45.0,
    availability: { "weekdays": true, "evenings": true, "weekends": false },
    is_offering: true,
    is_remote_friendly: true,
    is_active: true
  },

  // Languages
  {
    title: 'Spanish Conversation',
    description: 'Conversational Spanish for travel, business, and cultural communication',
    category: 'Languages',
    subcategory: 'Romance Languages',
    experience_level: 'expert',
    hourly_equivalent_value: 25.0,
    availability: { "weekdays": true, "evenings": true, "weekends": false },
    is_offering: true,
    is_remote_friendly: true,
    is_active: true
  },
  {
    title: 'French Language',
    description: 'French grammar, vocabulary, pronunciation, and cultural context',
    category: 'Languages',
    subcategory: 'Romance Languages',
    experience_level: 'intermediate',
    hourly_equivalent_value: 30.0,
    availability: { "weekdays": false, "evenings": true, "weekends": true },
    is_offering: true,
    is_remote_friendly: true,
    is_active: true
  },

  // Music
  {
    title: 'Guitar Playing',
    description: 'Acoustic and electric guitar lessons covering various styles from beginner to intermediate',
    category: 'Music',
    subcategory: 'String Instruments',
    experience_level: 'advanced',
    hourly_equivalent_value: 30.0,
    availability: { "weekdays": false, "evenings": true, "weekends": true },
    is_offering: true,
    is_remote_friendly: false,
    is_active: true
  },

  // Health & Fitness
  {
    title: 'Yoga Instruction',
    description: 'Hatha and Vinyasa yoga classes for stress relief, flexibility, and mindfulness',
    category: 'Health & Fitness',
    subcategory: 'Mind-Body',
    experience_level: 'advanced',
    hourly_equivalent_value: 40.0,
    availability: { "weekdays": true, "evenings": true, "weekends": true },
    is_offering: true,
    is_remote_friendly: false,
    is_active: true
  },
  {
    title: 'Personal Training',
    description: 'Customized fitness coaching, strength training, and workout planning',
    category: 'Health & Fitness',
    subcategory: 'Physical Training',
    experience_level: 'expert',
    hourly_equivalent_value: 50.0,
    availability: { "weekdays": true, "evenings": false, "weekends": true },
    is_offering: true,
    is_remote_friendly: false,
    is_active: true
  },

  // Practical Skills
  {
    title: 'Home Organization',
    description: 'Decluttering techniques, storage solutions, and creating organized living spaces',
    category: 'Lifestyle',
    subcategory: 'Home Improvement',
    experience_level: 'intermediate',
    hourly_equivalent_value: 25.0,
    availability: { "weekdays": true, "evenings": false, "weekends": true },
    is_offering: true,
    is_remote_friendly: false,
    is_active: true
  },
  {
    title: 'Garden Design',
    description: 'Landscape planning, plant selection, sustainable gardening, and seasonal maintenance',
    category: 'Home & Garden',
    subcategory: 'Landscaping',
    experience_level: 'intermediate',
    hourly_equivalent_value: 35.0,
    availability: { "weekdays": false, "evenings": false, "weekends": true },
    is_offering: true,
    is_remote_friendly: false,
    is_active: true
  },

  // Culinary
  {
    title: 'Italian Cooking',
    description: 'Traditional Italian cooking techniques, pasta making, and authentic regional recipes',
    category: 'Culinary',
    subcategory: 'International Cuisine',
    experience_level: 'intermediate',
    hourly_equivalent_value: 35.0,
    availability: { "weekdays": false, "evenings": true, "weekends": true },
    is_offering: true,
    is_remote_friendly: false,
    is_active: true
  },

  // Skills People Want to Learn (is_offering: false)
  {
    title: 'Piano Lessons',
    description: 'Classical and contemporary piano instruction for skill development',
    category: 'Music',
    subcategory: 'Keyboard Instruments',
    experience_level: 'beginner',
    hourly_equivalent_value: 0.0,
    availability: { "weekdays": false, "evenings": true, "weekends": true },
    is_offering: false,
    is_remote_friendly: false,
    is_active: true
  },
  {
    title: 'French Cooking',
    description: 'Classic French culinary techniques and pastry making',
    category: 'Culinary',
    subcategory: 'International Cuisine',
    experience_level: 'beginner',
    hourly_equivalent_value: 0.0,
    availability: { "weekdays": false, "evenings": true, "weekends": true },
    is_offering: false,
    is_remote_friendly: false,
    is_active: true
  },
  {
    title: 'Mandarin Chinese',
    description: 'Basic Mandarin conversation and writing for business communication',
    category: 'Languages',
    subcategory: 'East Asian Languages',
    experience_level: 'beginner',
    hourly_equivalent_value: 0.0,
    availability: { "weekdays": true, "evenings": true, "weekends": false },
    is_offering: false,
    is_remote_friendly: true,
    is_active: true
  },
  {
    title: 'Advanced Excel',
    description: 'Macros, VBA programming, and advanced data analysis techniques',
    category: 'Technology',
    subcategory: 'Business Software',
    experience_level: 'beginner',
    hourly_equivalent_value: 0.0,
    availability: { "weekdays": true, "evenings": false, "weekends": false },
    is_offering: false,
    is_remote_friendly: true,
    is_active: true
  }
];

async function addSampleSkills() {
  console.log('\n📚 Adding sample skills to catalog...');
  
  try {
    // Check if skills already exist
    const { data: existingSkills, error: checkError } = await supabase
      .from('skills')
      .select('title')
      .limit(5);
    
    if (checkError) {
      console.error('❌ Error checking existing skills:', checkError.message);
      return false;
    }
    
    if (existingSkills && existingSkills.length > 0) {
      console.log('⚠️ Skills already exist in database. Skipping skill insertion.');
      console.log(`📊 Found ${existingSkills.length} existing skills`);
      return true;
    }
    
    // Insert skills in batches
    const batchSize = 5;
    let successCount = 0;
    
    for (let i = 0; i < sampleSkills.length; i += batchSize) {
      const batch = sampleSkills.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('skills')
        .insert(batch)
        .select('title');
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error.message);
        continue;
      }
      
      successCount += data.length;
      console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}: ${data.length} skills`);
    }
    
    console.log(`🎉 Successfully added ${successCount} skills to catalog`);
    return true;
    
  } catch (error) {
    console.error('❌ Error adding sample skills:', error.message);
    return false;
  }
}

async function verifySampleData() {
  console.log('\n🔍 Verifying sample data...');
  
  try {
    // Check skills count
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('id, title, category, is_offering, experience_level')
      .order('category', { ascending: true });
    
    if (skillsError) {
      console.error('❌ Error fetching skills:', skillsError.message);
      return false;
    }
    
    console.log(`📊 Total skills in database: ${skills.length}`);
    
    // Group by category
    const skillsByCategory = {};
    const offeringSkills = skills.filter(s => s.is_offering).length;
    const wantedSkills = skills.filter(s => !s.is_offering).length;
    
    skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = 0;
      }
      skillsByCategory[skill.category]++;
    });
    
    console.log('\n📋 Skills by Category:');
    Object.entries(skillsByCategory).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} skills`);
    });
    
    console.log(`\n💼 Skills being offered: ${offeringSkills}`);
    console.log(`🎯 Skills being sought: ${wantedSkills}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error verifying data:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting sample data insertion...\n');
  
  const skillsAdded = await addSampleSkills();
  
  if (skillsAdded) {
    await verifySampleData();
    console.log('\n✅ Sample data setup complete!');
    console.log('🎉 Your SkillSwap demo is now ready with realistic sample data');
  } else {
    console.log('\n❌ Sample data setup failed');
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
