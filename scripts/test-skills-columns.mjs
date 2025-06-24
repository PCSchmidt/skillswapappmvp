import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('=== Testing Skills Table Column Structure ===');

async function testTableStructure() {
  try {
    // Try to insert with just ID (UUID)
    console.log('\n1. Testing with UUID only...');
    const testId = uuidv4();
    
    const { data: result1, error: error1 } = await supabase
      .from('skills')
      .insert([{ id: testId }])
      .select();

    if (error1) {
      console.log('Error with UUID only:', error1.message);
    } else {
      console.log('Success with UUID only:', result1);
      // Clean up
      await supabase.from('skills').delete().eq('id', testId);
    }

    // Try to insert with expected columns
    console.log('\n2. Testing with expected columns...');
    const testId2 = uuidv4();
    
    const { data: result2, error: error2 } = await supabase
      .from('skills')
      .insert([{ 
        id: testId2,
        name: 'Test Skill',
        category: 'Technology',
        description: 'A test skill'
      }])
      .select();

    if (error2) {
      console.log('Error with expected columns:', error2.message);
      console.log('Full error:', error2);
    } else {
      console.log('Success with expected columns:', result2);
      // Clean up
      await supabase.from('skills').delete().eq('id', testId2);
    }

    // Try with just one column to identify what exists
    console.log('\n3. Testing with different combinations...');
    
    const testCombinations = [
      { id: uuidv4(), skill_name: 'Test' },
      { id: uuidv4(), title: 'Test' },
      { id: uuidv4(), skill: 'Test' },
      { id: uuidv4(), created_at: new Date().toISOString() }
    ];

    for (const combo of testCombinations) {
      const { error } = await supabase
        .from('skills')
        .insert([combo])
        .select();
      
      if (error) {
        console.log(`Failed with ${Object.keys(combo).join(', ')}:`, error.message);
      } else {
        console.log(`Success with ${Object.keys(combo).join(', ')}`);
        // Clean up
        await supabase.from('skills').delete().eq('id', combo.id);
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testTableStructure();
