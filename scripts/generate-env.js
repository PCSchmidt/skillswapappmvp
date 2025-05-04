#!/usr/bin/env node

/**
 * Simple Environment File Generator for SkillSwap MVP
 * 
 * This script generates environment files for different deployment environments
 * based on the .env.example file.
 * 
 * Usage: node generate-env.js [environment]
 * Where environment is one of: development, staging, production (default: all)
 */

const fs = require('fs');
const path = require('path');

// Define environments
const ENVIRONMENTS = ['development', 'staging', 'production'];

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

// Get environment from command line args
const args = process.argv.slice(2);
const targetEnv = args[0] || 'all';
const sourceFile = '.env.example';

// Validate environment
if (targetEnv !== 'all' && !ENVIRONMENTS.includes(targetEnv)) {
  console.error(`${colors.red}Error: Invalid environment '${targetEnv}'.${colors.reset}`);
  console.error(`Valid environments are: ${ENVIRONMENTS.join(', ')}, all`);
  process.exit(1);
}

// Check if source file exists
const sourceFilePath = path.resolve(process.cwd(), sourceFile);
if (!fs.existsSync(sourceFilePath)) {
  console.error(`${colors.red}Error: Source file '${sourceFile}' does not exist.${colors.reset}`);
  process.exit(1);
}

// Read source file
console.log(`${colors.cyan}Reading source file: ${sourceFile}${colors.reset}`);
const sourceContent = fs.readFileSync(sourceFilePath, 'utf8');
const envVars = parseEnvFile(sourceContent);

// Generate environment files
const envsToGenerate = targetEnv === 'all' ? ENVIRONMENTS : [targetEnv];
for (const env of envsToGenerate) {
  generateEnvFile(env, envVars);
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
    console.log(`${colors.yellow}Warning: File '${fileName}' already exists. Overwriting.${colors.reset}`);
  }
  
  // Start with the base environment variables
  const updatedEnvVars = { ...envVars };
  
  // Replace placeholders and set environment-specific variables
  for (const [key, value] of Object.entries(updatedEnvVars)) {
    // Replace placeholders with more meaningful default values
    if (value.includes('your-') || value.includes('placeholder') || value === '') {
      switch (key) {
        case 'AUTH_SECRET':
        case 'JWT_SECRET':
        case 'SUPABASE_JWT_SECRET':
          updatedEnvVars[key] = `${key.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
          break;
        default:
          // Keep as is for now
          break;
      }
    }
  }
  
  // Set environment-specific variables
  switch (env) {
    case 'development':
      updatedEnvVars['NEXT_PUBLIC_VERCEL_ENV'] = 'development';
      updatedEnvVars['NEXT_PUBLIC_SITE_URL'] = 'http://localhost:3000';
      updatedEnvVars['NEXT_PUBLIC_API_URL'] = 'http://localhost:3000/api';
      updatedEnvVars['NEXTAUTH_URL'] = 'http://localhost:3000';
      updatedEnvVars['COOKIE_DOMAIN'] = 'localhost';
      updatedEnvVars['ALLOWED_ORIGINS'] = 'http://localhost:3000';
      updatedEnvVars['NEXT_PUBLIC_APP_VERSION'] = '0.1.0-dev';
      updatedEnvVars['NEXT_PUBLIC_MAINTENANCE_MODE'] = 'false';
      break;
    case 'staging':
      updatedEnvVars['NEXT_PUBLIC_VERCEL_ENV'] = 'preview';
      updatedEnvVars['NEXT_PUBLIC_SITE_URL'] = 'https://staging.skillswap.app';
      updatedEnvVars['NEXT_PUBLIC_API_URL'] = 'https://staging.skillswap.app/api';
      updatedEnvVars['NEXTAUTH_URL'] = 'https://staging.skillswap.app';
      updatedEnvVars['COOKIE_DOMAIN'] = 'staging.skillswap.app';
      updatedEnvVars['ALLOWED_ORIGINS'] = 'https://staging.skillswap.app';
      updatedEnvVars['NEXT_PUBLIC_APP_VERSION'] = '0.1.0-staging';
      updatedEnvVars['NEXT_PUBLIC_MAINTENANCE_MODE'] = 'false';
      break;
    case 'production':
      updatedEnvVars['NEXT_PUBLIC_VERCEL_ENV'] = 'production';
      updatedEnvVars['NEXT_PUBLIC_SITE_URL'] = 'https://skillswap.app';
      updatedEnvVars['NEXT_PUBLIC_API_URL'] = 'https://skillswap.app/api';
      updatedEnvVars['NEXTAUTH_URL'] = 'https://skillswap.app';
      updatedEnvVars['COOKIE_DOMAIN'] = 'skillswap.app';
      updatedEnvVars['ALLOWED_ORIGINS'] = 'https://skillswap.app';
      updatedEnvVars['NEXT_PUBLIC_APP_VERSION'] = '0.1.0';
      updatedEnvVars['NEXT_PUBLIC_MAINTENANCE_MODE'] = 'false';
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
