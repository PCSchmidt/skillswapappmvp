#!/usr/bin/env node

/**
 * SkillSwap Environment Variable Manager
 * 
 * This script helps manage environment variables across different deployment environments.
 * Features:
 * - Generate environment files for different environments
 * - Validate environment variables
 * - Export/Import environment variables to/from Vercel
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const commander = require('commander');
const program = new commander.Command();

// Define environments
const ENVIRONMENTS = ['development', 'staging', 'production'];

// Configure color output for terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

program
  .name('env-manager')
  .description('SkillSwap environment variable management tool')
  .version('1.0.0');

program
  .command('generate [env]')
  .description('Generate environment files for different environments')
  .option('--from <source>', 'Source environment file to copy from', '.env.example')
  .action((env = 'all', options) => {
    const envs = env === 'all' ? ENVIRONMENTS : [env];
    
    // Validate environment
    if (env !== 'all' && !ENVIRONMENTS.includes(env)) {
      console.error(`${colors.red}Error: Invalid environment '${env}'.${colors.reset}`);
      console.error(`Valid environments are: ${ENVIRONMENTS.join(', ')}, all`);
      process.exit(1);
    }
    
    // Check if source file exists
    const sourceFile = path.resolve(process.cwd(), options.from);
    if (!fs.existsSync(sourceFile)) {
      console.error(`${colors.red}Error: Source file '${options.from}' does not exist.${colors.reset}`);
      process.exit(1);
    }
    
    // Read source file
    const sourceContent = fs.readFileSync(sourceFile, 'utf8');
    const envVars = parseEnvFile(sourceContent);
    
    // Generate environment files
    for (const targetEnv of envs) {
      generateEnvFile(targetEnv, envVars);
    }
  });

program
  .command('validate <env>')
  .description('Validate environment variables for a specific environment')
  .option('--file <file>', 'Environment file to validate', (env) => `.env.${env}`)
  .action((env, options) => {
    // Validate environment
    if (!ENVIRONMENTS.includes(env)) {
      console.error(`${colors.red}Error: Invalid environment '${env}'.${colors.reset}`);
      console.error(`Valid environments are: ${ENVIRONMENTS.join(', ')}`);
      process.exit(1);
    }
    
    const fileName = typeof options.file === 'function' ? options.file(env) : options.file;
    const filePath = path.resolve(process.cwd(), fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`${colors.red}Error: Environment file '${fileName}' does not exist.${colors.reset}`);
      process.exit(1);
    }
    
    // Read environment file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const envVars = parseEnvFile(fileContent);
    
    // Validate environment variables
    validateEnvVars(envVars, env);
  });

program
  .command('export-to-vercel <env>')
  .description('Export environment variables to Vercel')
  .option('--file <file>', 'Environment file to export', (env) => `.env.${env}`)
  .action((env, options) => {
    // Only allow exporting to staging or production
    if (env !== 'staging' && env !== 'production') {
      console.error(`${colors.red}Error: Can only export to staging or production environments.${colors.reset}`);
      process.exit(1);
    }
    
    const fileName = typeof options.file === 'function' ? options.file(env) : options.file;
    const filePath = path.resolve(process.cwd(), fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`${colors.red}Error: Environment file '${fileName}' does not exist.${colors.reset}`);
      process.exit(1);
    }
    
    // Read environment file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const envVars = parseEnvFile(fileContent);
    
    // Validate environment variables
    validateEnvVars(envVars, env);
    
    // Export to Vercel
    exportToVercel(envVars, env);
  });

program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

/**
 * Parse environment file content into key-value pairs
 */
function parseEnvFile(content) {
  const envVars = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith('#') || line.trim() === '') {
      continue;
    }
    
    // Parse key-value pairs
    const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      envVars[key] = value;
    }
  }
  
  return envVars;
}

/**
 * Generate environment file for a specific environment
 */
function generateEnvFile(env, envVars) {
  const fileName = `.env.${env}`;
  const filePath = path.resolve(process.cwd(), fileName);
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`${colors.yellow}Warning: File '${fileName}' already exists.${colors.reset}`);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(`Do you want to overwrite it? (y/N) `, (answer) => {
      rl.close();
      if (answer.toLowerCase() !== 'y') {
        console.log(`${colors.yellow}Skipping generation of '${fileName}'.${colors.reset}`);
        return;
      }
      
      // Overwrite file
      writeEnvFile(env, filePath, envVars);
    });
  } else {
    // Create new file
    writeEnvFile(env, filePath, envVars);
  }
}

/**
 * Write environment variables to file
 */
function writeEnvFile(env, filePath, envVars) {
  // Update environment variables based on environment
  const updatedEnvVars = { ...envVars };
  
  // Update common environment-specific variables
  updatedEnvVars['NEXT_PUBLIC_VERCEL_ENV'] = env;
  
  switch (env) {
    case 'development':
      updatedEnvVars['NEXT_PUBLIC_SITE_URL'] = 'http://localhost:3000';
      updatedEnvVars['NEXT_PUBLIC_API_URL'] = 'http://localhost:3000/api';
      updatedEnvVars['NEXTAUTH_URL'] = 'http://localhost:3000';
      break;
    case 'staging':
      updatedEnvVars['NEXT_PUBLIC_SITE_URL'] = 'https://staging.skillswap.app';
      updatedEnvVars['NEXT_PUBLIC_API_URL'] = 'https://staging.skillswap.app/api';
      updatedEnvVars['NEXTAUTH_URL'] = 'https://staging.skillswap.app';
      break;
    case 'production':
      updatedEnvVars['NEXT_PUBLIC_SITE_URL'] = 'https://skillswap.app';
      updatedEnvVars['NEXT_PUBLIC_API_URL'] = 'https://skillswap.app/api';
      updatedEnvVars['NEXTAUTH_URL'] = 'https://skillswap.app';
      break;
  }
  
  // Write to file
  let fileContent = `# SkillSwap MVP Environment Variables - ${env.toUpperCase()}\n`;
  fileContent += `# Generated on: ${new Date().toISOString()}\n\n`;
  
  for (const [key, value] of Object.entries(updatedEnvVars)) {
    fileContent += `${key}=${value}\n`;
  }
  
  fs.writeFileSync(filePath, fileContent);
  console.log(`${colors.green}Generated environment file: ${fileName}${colors.reset}`);
}

/**
 * Validate environment variables for a specific environment
 */
function validateEnvVars(envVars, env) {
  console.log(`${colors.cyan}Validating environment variables for ${env}...${colors.reset}`);
  
  // Required variables for all environments
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_JWT_SECRET',
    'AUTH_SECRET',
    'JWT_SECRET'
  ];
  
  // Additional required variables for staging and production
  if (env === 'staging' || env === 'production') {
    requiredVars.push(
      'NEXTAUTH_URL',
      'ALLOWED_ORIGINS',
      'COOKIE_DOMAIN',
      'SENTRY_DSN'
    );
  }
  
  // Check required variables
  let missingVars = [];
  for (const key of requiredVars) {
    if (!envVars[key] || envVars[key].includes('your-') || envVars[key].includes('placeholder')) {
      missingVars.push(key);
    }
  }
  
  // Check environment-specific values
  const envSpecificChecks = {
    'NEXT_PUBLIC_VERCEL_ENV': {
      development: 'development',
      staging: 'preview',
      production: 'production'
    },
    'NEXT_PUBLIC_SITE_URL': {
      development: 'http://localhost:3000',
      staging: 'https://staging.skillswap.app',
      production: 'https://skillswap.app'
    }
  };
  
  for (const [key, values] of Object.entries(envSpecificChecks)) {
    if (envVars[key] !== values[env]) {
      console.log(`${colors.yellow}Warning: ${key} should be '${values[env]}' for ${env} environment.${colors.reset}`);
    }
  }
  
  // Display results
  if (missingVars.length > 0) {
    console.log(`${colors.red}Missing or invalid environment variables:${colors.reset}`);
    for (const key of missingVars) {
      console.log(`  - ${key}`);
    }
    return false;
  } else {
    console.log(`${colors.green}All required environment variables are present.${colors.reset}`);
    return true;
  }
}

/**
 * Export environment variables to Vercel
 */
function exportToVercel(envVars, env) {
  console.log(`${colors.cyan}Exporting environment variables to Vercel for ${env}...${colors.reset}`);
  
  // Map environment to Vercel environment
  const vercelEnv = env === 'production' ? 'production' : 'preview';
  
  try {
    // Check if Vercel CLI is installed
    execSync('vercel --version', { stdio: 'ignore' });
    
    // Export each environment variable
    for (const [key, value] of Object.entries(envVars)) {
      // Skip comments
      if (key.startsWith('#')) continue;
      
      console.log(`Exporting ${key}...`);
      
      // Determine if the variable should be secret
      const isSecret = key.includes('SECRET') || 
                     key.includes('KEY') || 
                     key.includes('PASSWORD') || 
                     key.includes('TOKEN');
      
      const secretFlag = isSecret ? '--sensitive' : '';
      
      // Execute Vercel CLI command
      execSync(`vercel env add ${key} ${secretFlag} ${vercelEnv}`, {
        input: value,
        stdio: ['pipe', 'inherit', 'inherit']
      });
    }
    
    console.log(`${colors.green}Successfully exported environment variables to Vercel.${colors.reset}`);
    console.log(`${colors.yellow}Note: You need to deploy again for the environment variables to take effect.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error exporting environment variables to Vercel:${colors.reset}`);
    console.error(error.message);
    process.exit(1);
  }
}
