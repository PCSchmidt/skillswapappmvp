/**
 * SkillSwap MVP Deployment Script
 * 
 * This script orchestrates the complete deployment process for the SkillSwap MVP application.
 * It handles environment variable setup, dependency validation, build verification, deployment,
 * and post-deployment verification.
 * 
 * Usage:
 *   node deploy.js staging
 *   node deploy.js production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

// Setup readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get environment argument (staging or production)
const environment = process.argv[2];
if (!environment || !['staging', 'production'].includes(environment)) {
  console.error(chalk.red('Please specify an environment: staging or production'));
  console.error(chalk.yellow('Usage: node deploy.js staging'));
  rl.close();
  process.exit(1);
}

// Print header
console.log(chalk.cyan(`
⚡️ SkillSwap MVP Deployment Script - ${environment.toUpperCase()} ⚡️
`));
console.log(chalk.cyan('='.repeat(60)));

// Create deployment log
const timestamp = new Date().toISOString().replace(/[:T]/g, '-').replace(/\..+/, '');
const logFile = path.join(__dirname, `deployment-${environment}-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log helper function
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  let coloredMessage;
  
  switch (type) {
    case 'success':
      coloredMessage = chalk.green(message);
      break;
    case 'error':
      coloredMessage = chalk.red(message);
      break;
    case 'warning':
      coloredMessage = chalk.yellow(message);
      break;
    case 'command':
      coloredMessage = chalk.blue(`$ ${message}`);
      break;
    default:
      coloredMessage = message;
  }
  
  console.log(coloredMessage);
  logStream.write(`[${timestamp}] ${type.toUpperCase()}: ${message}\n`);
}

// Execute command helper function
function executeCommand(command, silent = false) {
  try {
    log(command, 'command');
    
    const options = { stdio: silent ? 'pipe' : 'inherit', cwd: __dirname };
    const output = execSync(command, options);
    
    if (silent) {
      return output.toString().trim();
    }
    return true;
  } catch (error) {
    log(`Command failed: ${command}`, 'error');
    log(error.message, 'error');
    if (error.stdout) {
      log(`Command output: ${error.stdout.toString()}`, 'error');
    }
    return false;
  }
}

// Ask for confirmation
function confirm(question) {
  return new Promise((resolve) => {
    rl.question(chalk.yellow(`${question} (y/N): `), (answer) => {
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

// Check for pending changes
async function checkGitStatus() {
  log('Checking for uncommitted changes...', 'info');
  
  try {
    const status = executeCommand('git status --porcelain', true);
    
    if (status) {
      log('You have uncommitted changes:', 'warning');
      console.log(status);
      
      const shouldProceed = await confirm('Do you want to proceed with uncommitted changes?');
      if (!shouldProceed) {
        log('Deployment aborted due to uncommitted changes', 'error');
        process.exit(1);
      }
      
      log('Proceeding with uncommitted changes', 'warning');
    } else {
      log('Git working directory is clean', 'success');
    }
  } catch (error) {
    log('Git status check failed, continuing anyway', 'warning');
  }
}

// Main deployment process
async function deploy() {
  try {
    // Step 1: Check for pending changes
    await checkGitStatus();
    
    // Ensure dependencies are installed
    log('\nInstalling dependencies...', 'info');
    console.log(chalk.cyan('-'.repeat(60)));
    executeCommand('yarn install --frozen-lockfile');

    // Step 2: Update environment variables
    log(`\nUpdating environment variables for ${environment}...`, 'info');
    console.log(chalk.cyan('-'.repeat(60)));
    
    if (!executeCommand(`npm run update-env:${environment}`)) {
      const shouldContinue = await confirm('Environment variable update had issues. Continue anyway?');
      if (!shouldContinue) {
        log('Deployment aborted after environment variable update', 'error');
        process.exit(1);
      }
    }
    
    // Step 3: Validate dependencies
    log('\nValidating dependencies...', 'info');
    console.log(chalk.cyan('-'.repeat(60)));
    
    if (!executeCommand('npm run validate-deps')) {
      const shouldContinue = await confirm('Dependency validation failed. Continue anyway?');
      if (!shouldContinue) {
        log('Deployment aborted after dependency validation', 'error');
        process.exit(1);
      }
    }
    
    // Step 4: Build verification
    log('\nVerifying build...', 'info');
    console.log(chalk.cyan('-'.repeat(60)));
    
    if (!executeCommand('npm run prebuild:verify')) {
      const shouldContinue = await confirm('Build verification failed. Continue anyway?');
      if (!shouldContinue) {
        log('Deployment aborted after build verification', 'error');
        process.exit(1);
      }
    }
    
    // Step 5: Run tests
    log('\nRunning tests...', 'info');
    console.log(chalk.cyan('-'.repeat(60)));
    
    if (!executeCommand('npm test')) {
      const shouldContinue = await confirm('Tests failed. Continue anyway?');
      if (!shouldContinue) {
        log('Deployment aborted after tests', 'error');
        process.exit(1);
      }
    }
    
    // Step 6: Deploy to Vercel
    log(`\nDeploying to ${environment}...`, 'info');
    console.log(chalk.cyan('-'.repeat(60)));
    
    // Clean up node_modules and package-lock.json before Vercel deployment
    log('Cleaning up node_modules and package-lock.json...', 'info');
    executeCommand('rm -rf node_modules');
    executeCommand('rm -f package-lock.json');
    
    let deployUrl;
    if (executeCommand('npx vercel --prod')) {
      log('Deployment to Vercel successful', 'success');
      
      // Try to extract the deployment URL from the Vercel output
      const output = executeCommand('npx vercel ls --production', true);
      const urlMatch = output.match(/(https:\/\/[a-zA-Z0-9-]+\.vercel\.app)/);
      deployUrl = urlMatch ? urlMatch[1] : null;
      
      if (deployUrl) {
        log(`Deployment URL: ${deployUrl}`, 'success');
      } else {
        deployUrl = await new Promise((resolve) => {
          rl.question(chalk.yellow('Please enter the deployment URL: '), (url) => {
            resolve(url.trim());
          });
        });
      }
    } else {
      log('Deployment to Vercel failed', 'error');
      const shouldContinue = await confirm('Deployment failed. Do you want to continue with verification?');
      if (!shouldContinue) {
        log('Deployment process aborted', 'error');
        process.exit(1);
      }
      
      deployUrl = await new Promise((resolve) => {
        rl.question(chalk.yellow('Please enter the deployment URL for verification: '), (url) => {
          resolve(url.trim());
        });
      });
    }
    
    // Step 7: Verify deployment
    if (deployUrl) {
      log('\nVerifying deployment...', 'info');
      console.log(chalk.cyan('-'.repeat(60)));
      
      executeCommand(`npm run verify-deployment -- ${deployUrl}`);
    } else {
      log('Skipping deployment verification as no URL was provided', 'warning');
    }
    
    // Completion
    log('\nDeployment process completed', 'success');
    log(`Deployment log saved to ${logFile}`, 'info');
    
  } catch (error) {
    log('Deployment process failed with an unexpected error', 'error');
    log(error.message, 'error');
    log(`Deployment log saved to ${logFile}`, 'info');
    process.exit(1);
  } finally {
    rl.close();
    logStream.end();
  }
}

// Start the deployment process
deploy();
