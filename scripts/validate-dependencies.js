#!/usr/bin/env node

/**
 * Dependency Validation Script
 * 
 * This script validates the project's dependencies to ensure compatibility
 * before deployment. It checks for ESLint and TypeScript dependencies to
 * prevent the specific issue we encountered with @eslint/config-array.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk') || { red: (text) => `\x1b[31m${text}\x1b[0m`, green: (text) => `\x1b[32m${text}\x1b[0m`, yellow: (text) => `\x1b[33m${text}\x1b[0m`, blue: (text) => `\x1b[34m${text}\x1b[0m` };

// Critical package combinations that must be compatible
const CRITICAL_DEPENDENCIES = [
  'eslint',
  'eslint-config-next',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'typescript'
];

// Known compatible versions
const COMPATIBLE_VERSIONS = {
  'eslint': '8.57.0',
  'eslint-config-next': '14.0.4',
  '@typescript-eslint/eslint-plugin': '6.19.1',
  '@typescript-eslint/parser': '6.19.1',
  'typescript': '5.0.4'
};

// Read package.json
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error(chalk.red('Error reading package.json:'), error.message);
  process.exit(1);
}

// Combine devDependencies and dependencies
const allDependencies = {
  ...packageJson.dependencies || {},
  ...packageJson.devDependencies || {}
};

console.log(chalk.blue('Validating critical dependencies...'));

// Check if all critical dependencies are present
const missingDependencies = CRITICAL_DEPENDENCIES.filter(dep => !allDependencies[dep]);
if (missingDependencies.length > 0) {
  console.error(chalk.red('Missing critical dependencies:'), missingDependencies.join(', '));
  console.log(chalk.yellow('Please add these dependencies to your package.json.'));
  process.exit(1);
}

// Check versions
let hasVersionMismatch = false;
CRITICAL_DEPENDENCIES.forEach(dep => {
  const currentVersion = allDependencies[dep].replace(/^\^|~/, '');
  const recommendedVersion = COMPATIBLE_VERSIONS[dep];
  
  console.log(`${dep}: current=${currentVersion}, recommended=${recommendedVersion}`);
  
  if (currentVersion !== recommendedVersion) {
    console.warn(chalk.yellow(`Warning: ${dep} version mismatch. Using ${currentVersion}, but ${recommendedVersion} is recommended.`));
    hasVersionMismatch = true;
  } else {
    console.log(chalk.green(`✓ ${dep} version is correct.`));
  }
});

if (hasVersionMismatch) {
  console.log('\n');
  console.warn(chalk.yellow('Some dependencies have version mismatches from the recommended configuration.'));
  console.warn(chalk.yellow('This might cause build issues in the deployment environment.'));
  console.log('\n');
  console.log(chalk.blue('Recommended action:'));
  console.log('Update your package.json with these exact versions for deployment stability:');
  console.log(JSON.stringify({
    "dependencies": {},
    "devDependencies": COMPATIBLE_VERSIONS
  }, null, 2));
  
  // Prompt for continuation
  console.log('\n');
  console.log(chalk.yellow('Continue with deployment anyway? (y/N)'));
  
  // This is a simple synchronous input in Node.js
  // In a real script, you might want to use a proper prompt library
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log(chalk.red('Deployment aborted.'));
      process.exit(1);
    }
    rl.close();
    console.log(chalk.green('Continuing with deployment despite version mismatches.'));
  });
} else {
  console.log(chalk.green('\nAll critical dependencies have correct versions.'));
  console.log(chalk.green('Dependency validation passed. Safe to deploy.'));
}

// Additional verification - try to install dependencies
console.log(chalk.blue('\nVerifying dependency installation...'));

try {
  // Execute installation in a temporary directory
  const tempDir = path.resolve(process.cwd(), '.dependency-check-temp');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Create a minimal package.json for verification
  const verificationPackageJson = {
    "name": "dependency-verification",
    "version": "1.0.0",
    "private": true,
    "devDependencies": {}
  };
  
  // Add only the critical dependencies
  CRITICAL_DEPENDENCIES.forEach(dep => {
    verificationPackageJson.devDependencies[dep] = allDependencies[dep];
  });
  
  // Write the verification package.json
  fs.writeFileSync(
    path.resolve(tempDir, 'package.json'),
    JSON.stringify(verificationPackageJson, null, 2)
  );
  
  // Try to install dependencies
  console.log('Installing dependencies for verification...');
  execSync('npm install --no-package-lock', { cwd: tempDir, stdio: 'inherit' });
  
  console.log(chalk.green('Dependency installation verification passed!'));
  
  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
  
} catch (error) {
  console.error(chalk.red('Dependency installation verification failed:'), error.message);
  console.log(chalk.yellow('This suggests there might be issues when deploying.'));
  console.log(chalk.yellow('Consider updating to the recommended versions before proceeding.'));
  process.exit(1);
}

console.log(chalk.green('\nAll dependency checks passed. Ready for deployment!'));
