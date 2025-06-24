import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('=== Checking Skills Table Structure ===');

async function checkTableStructure() {
  try {
    // Try to get any existing data to see column structure
    console.log('\n1. Checking existing data in skills table...');
    const { data: existingData, error: selectError } = await supabase
      .from('skills')
      .select('*')
      .limit(5);
    
    if (selectError) {
      console.error('Error selecting from skills table:', selectError);
    } else {
      console.log('Skills table data:', existingData);
      if (existingData && existingData.length > 0) {
        console.log('Existing columns:', Object.keys(existingData[0]));
      } else {
        console.log('Skills table exists but is empty');
      }
    }

    // Try to describe the table structure using information_schema
    console.log('\n2. Trying to get table schema information...');
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_table_columns', { table_name: 'skills' })
      .select();
    
    if (schemaError) {
      console.log('Could not get schema via RPC (expected):', schemaError.message);
    } else {
      console.log('Schema data:', schemaData);
    }

    // Try a simple insert to see what columns are expected
    console.log('\n3. Testing column structure with minimal insert...');
    const testData = {
      id: 'test-' + Date.now(),
    };

    const { data: insertData, error: insertError } = await supabase
      .from('skills')
      .insert([testData])
      .select();

    if (insertError) {
      console.log('Insert error (reveals expected columns):', insertError.message);
      console.log('Full error details:', insertError);
    } else {
      console.log('Insert successful:', insertData);
      
      // Clean up test data
      await supabase
        .from('skills')
        .delete()
        .eq('id', testData.id);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkTableStructure();
