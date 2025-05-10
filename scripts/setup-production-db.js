#!/usr/bin/env node

/**
 * Supabase Production Database Setup Script
 * 
 * This script helps prepare and push database migrations to the production Supabase instance.
 * It provides a guided approach for setting up the production database with proper validation.
 * 
 * Usage: node setup-production-db.js [command]
 * Commands:
 *   - validate: Check if the Supabase CLI and project are properly configured
 *   - link: Link the local project to the production Supabase instance
 *   - push: Push the database migrations to production
 *   - all: Run all steps in sequence (default)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get command from command line args
const args = process.argv.slice(2);
const command = args[0] || 'all';

// Main function to run the appropriate command
async function main() {
  try {
    // Print banner
    console.log(`\n${colors.cyan}${colors.bold}Supabase Production Database Setup${colors.reset}\n`);
    
    switch (command) {
      case 'validate':
        await validateConfiguration();
        break;
      case 'link':
        await linkProductionProject();
        break;
      case 'push':
        await pushMigrations();
        break;
      case 'all':
        await validateConfiguration();
        await linkProductionProject();
        await pushMigrations();
        break;
      default:
        console.error(`${colors.red}Error: Unknown command '${command}'.${colors.reset}`);
        console.error(`Valid commands: validate, link, push, all`);
        process.exit(1);
    }
    
    rl.close();
  } catch (error) {
    console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);
    rl.close();
    process.exit(1);
  }
}

/**
 * Validate Supabase CLI and project configuration
 */
async function validateConfiguration() {
  console.log(`${colors.cyan}Validating Supabase CLI and project configuration...${colors.reset}`);
  
  // Check if Supabase CLI is installed
  try {
    const version = execSync('supabase --version', { encoding: 'utf8' }).trim();
    console.log(`${colors.green}✓ Supabase CLI is installed: ${version}${colors.reset}`);
  } catch (error) {
    throw new Error('Supabase CLI is not installed. Please run: npm install -g supabase');
  }
  
  // Check if Supabase project is configured
  try {
    if (fs.existsSync(path.resolve(process.cwd(), 'supabase'))) {
      console.log(`${colors.green}✓ Supabase project directory exists${colors.reset}`);
    } else {
      throw new Error('Supabase project directory not found');
    }
    
    // Check if migration files exist
    const migrationDir = path.resolve(process.cwd(), 'supabase', 'migrations');
    if (fs.existsSync(migrationDir)) {
      const migrations = fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql'));
      if (migrations.length > 0) {
        console.log(`${colors.green}✓ Found ${migrations.length} migration files${colors.reset}`);
        migrations.forEach(file => {
          console.log(`  ${colors.dim}• ${file}${colors.reset}`);
        });
      } else {
        throw new Error('No SQL migration files found in supabase/migrations');
      }
    } else {
      throw new Error('Migration directory not found');
    }
  } catch (error) {
    throw new Error(`Supabase project validation failed: ${error.message}`);
  }
  
  console.log(`${colors.green}✓ Supabase project is properly configured${colors.reset}\n`);
}

/**
 * Link local project to production Supabase project
 */
async function linkProductionProject() {
  console.log(`${colors.cyan}Linking to production Supabase project...${colors.reset}`);
  
  // Check if project is already linked
  try {
    execSync('supabase status', { stdio: 'ignore' });
    const answer = await askQuestion(`${colors.yellow}The project appears to be already linked to a Supabase project. Do you want to continue? (y/N) ${colors.reset}`);
    if (answer.toLowerCase() !== 'y') {
      console.log(`${colors.yellow}Skipping linking step.${colors.reset}\n`);
      return;
    }
  } catch (error) {
    // Not linked yet, which is what we want
  }
  
  // Get project reference ID from user
  const projectRef = await askQuestion(`${colors.cyan}Enter your production Supabase project reference ID: ${colors.reset}`);
  if (!projectRef) {
    throw new Error('Project reference ID is required');
  }
  
  // Link project
  try {
    console.log(`${colors.cyan}Linking to Supabase project ${projectRef}...${colors.reset}`);
    execSync(`supabase link --project-ref ${projectRef}`, { stdio: 'inherit' });
    console.log(`${colors.green}✓ Successfully linked to Supabase project${colors.reset}\n`);
  } catch (error) {
    throw new Error(`Failed to link to Supabase project: ${error.message}`);
  }
}

/**
 * Push migrations to production database
 */
async function pushMigrations() {
  console.log(`${colors.cyan}Preparing to push migrations to production database...${colors.reset}`);
  
  // Prompt for confirmation
  const answer = await askQuestion(`${colors.yellow}${colors.bold}WARNING: This will apply all migrations to your production database.${colors.reset}\n${colors.yellow}Are you sure you want to continue? (y/N) ${colors.reset}`);
  if (answer.toLowerCase() !== 'y') {
    console.log(`${colors.yellow}Database migration cancelled.${colors.reset}`);
    return;
  }
  
  // Check if project is linked
  try {
    execSync('supabase status', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('Project is not linked to a Supabase project. Run "node setup-production-db.js link" first.');
  }
  
  // Push migrations
  try {
    console.log(`${colors.cyan}Pushing migrations to production database...${colors.reset}`);
    console.log(`${colors.yellow}This may take a while. Please do not interrupt the process.${colors.reset}`);
    execSync('supabase db push', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Successfully pushed migrations to production database${colors.reset}\n`);
    
    // Final instructions
    console.log(`${colors.cyan}${colors.bold}Next Steps:${colors.reset}`);
    console.log(`${colors.cyan}1. Verify that all migrations were applied successfully${colors.reset}`);
    console.log(`${colors.cyan}2. Configure environment variables in Vercel with the production database credentials${colors.reset}`);
    console.log(`${colors.cyan}3. Test database connectivity from your deployed application${colors.reset}\n`);
  } catch (error) {
    throw new Error(`Failed to push migrations: ${error.message}`);
  }
}

/**
 * Prompt user for input with a question
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Run main function
main();
