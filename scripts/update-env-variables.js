/**
 * Environment Variables Update Script for SkillSwap MVP
 * 
 * This script helps safely update environment variables in .env.staging and .env.production files.
 * It prompts for actual values, validates them, and updates the files accordingly.
 * 
 * Usage:
 *   node scripts/update-env-variables.js staging
 *   node scripts/update-env-variables.js production
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check command line arguments
const environment = process.argv[2];
if (!environment || !['staging', 'production'].includes(environment)) {
  console.error('Please specify an environment: staging or production');
  console.error('Usage: node scripts/update-env-variables.js staging');
  rl.close();
  process.exit(1);
}

const envFile = path.join(__dirname, '..', `.env.${environment}`);

// Check if the env file exists
if (!fs.existsSync(envFile)) {
  console.error(`Error: .env.${environment} file not found.`);
  console.error(`Create a copy of .env.example as .env.${environment} first.`);
  rl.close();
  process.exit(1);
}

// Read the current env file
console.log(`Reading .env.${environment} file...`);
let envContent = fs.readFileSync(envFile, 'utf8');

// Define required variables and their descriptions
const requiredVariables = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'The URL of your Supabase project (e.g., https://example.supabase.co)',
    validator: (value) => value.startsWith('https://') && value.includes('.supabase.co'),
    error: 'URL must start with https:// and include .supabase.co'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'The anonymous key for your Supabase project (from Project Settings > API)',
    validator: (value) => value.length > 20,
    error: 'Anon key should be a long string (usually >20 characters)'
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'The service role key for your Supabase project (from Project Settings > API)',
    validator: (value) => value.length > 20,
    error: 'Service role key should be a long string (usually >20 characters)'
  },
  {
    key: 'SUPABASE_JWT_SECRET',
    description: 'The JWT secret for your Supabase project (from Project Settings > API > JWT Settings)',
    validator: (value) => value.length > 20,
    error: 'JWT secret should be a long string (usually >20 characters)'
  },
  {
    key: 'AUTH_SECRET',
    description: 'A secure random string for auth (will be auto-generated if you press Enter)',
    validator: (value) => value.length >= 32 || value === '',
    error: 'Auth secret should be at least 32 characters',
    generator: () => crypto.randomBytes(32).toString('hex')
  },
  {
    key: 'JWT_SECRET',
    description: 'A secure random string for JWT (will be auto-generated if you press Enter)',
    validator: (value) => value.length >= 32 || value === '',
    error: 'JWT secret should be at least 32 characters',
    generator: () => crypto.randomBytes(32).toString('hex')
  },
  {
    key: 'RESEND_API_KEY',
    description: 'Your Resend API key for email notifications',
    validator: (value) => value.startsWith('re_') || value === 'skip',
    error: 'Resend API keys usually start with "re_". Enter "skip" to skip this for now.'
  },
  {
    key: 'SENTRY_DSN',
    description: 'Your Sentry DSN for error tracking (optional, enter "skip" to skip)',
    validator: (value) => value.startsWith('https://') || value === 'skip',
    error: 'Sentry DSN should start with https:// or enter "skip" to skip this for now.',
    optional: true
  }
];

// Process each required variable
async function processVariables() {
  const updatedValues = {};
  
  for (const variable of requiredVariables) {
    // Check if variable already has a real value in the env file
    const regex = new RegExp(`${variable.key}=(.+)`);
    const match = envContent.match(regex);
    const currentValue = match ? match[1] : '';
    
    // Skip if value already looks valid and not a placeholder
    if (currentValue && variable.validator(currentValue) && 
        !currentValue.includes('[') && !currentValue.includes('your-')) {
      console.log(`✅ ${variable.key} already has a valid value.`);
      updatedValues[variable.key] = currentValue;
      continue;
    }

    // Prompt for the variable value
    let value = await new Promise(resolve => {
      const promptText = `\n${variable.key}${variable.optional ? ' (optional)' : ''}:
  ${variable.description}
  Enter value${currentValue ? ' (current: ' + currentValue + ')' : ''}: `;
      
      rl.question(promptText, (answer) => {
        resolve(answer.trim());
      });
    });

    // Use generator if available and value is empty
    if (value === '' && variable.generator) {
      value = variable.generator();
      console.log(`Generated value for ${variable.key}: ${value}`);
    }

    // Skip optional variables with 'skip'
    if (value === 'skip' && variable.optional) {
      value = '';
      console.log(`Skipping optional variable ${variable.key}`);
    }

    // Validate the value
    if (!variable.validator(value)) {
      console.error(`❌ Error: ${variable.error}`);
      // For required variables, ask again
      if (!variable.optional) {
        // Recursive call to process this variable again
        const retryVariable = { ...variable };
        await processVariables([retryVariable]);
        continue;
      }
    }

    updatedValues[variable.key] = value;
    console.log(`✅ ${variable.key} updated.`);
  }

  return updatedValues;
}

// Update the environment file with new values
function updateEnvFile(updatedValues) {
  let newContent = envContent;
  
  Object.entries(updatedValues).forEach(([key, value]) => {
    // Only update if we have a value
    if (value) {
      const regex = new RegExp(`(${key}=).*`, 'g');
      if (newContent.match(regex)) {
        // Update existing line
        newContent = newContent.replace(regex, `$1${value}`);
      } else {
        // Add new line if key doesn't exist
        newContent += `\n${key}=${value}`;
      }
    }
  });

  // Write the updated content back to the file
  fs.writeFileSync(envFile, newContent);
}

// Main execution
(async () => {
  console.log(`\n🔑 SkillSwap Environment Variable Setup for ${environment.toUpperCase()}`);
  console.log('='.repeat(60));
  console.log('This script will help you set up the required environment variables.');
  console.log('For security, values will not be displayed after entry.');
  console.log('='.repeat(60));

  try {
    const updatedValues = await processVariables();
    updateEnvFile(updatedValues);
    
    console.log('\n✅ Environment variables updated successfully!');
    console.log(`Updated ${Object.keys(updatedValues).length} variables in .env.${environment}`);
    console.log('\n🚀 Next steps:');
    console.log(`1. Review the .env.${environment} file to ensure all variables are set correctly`);
    console.log(`2. Run deployment command: npm run deploy:${environment}`);
    
  } catch (error) {
    console.error('\n❌ Error updating environment variables:', error);
  } finally {
    rl.close();
  }
})();
