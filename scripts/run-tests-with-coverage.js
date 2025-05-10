#!/usr/bin/env node

/**
 * Run tests with coverage and display formatted results
 * This script is designed to be used in CI/CD pipelines and local development
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const COVERAGE_THRESHOLD = {
  global: {
    statements: 70,
    branches: 60,
    functions: 70,
    lines: 70
  },
  ui: {
    statements: 80,
    branches: 70,
    functions: 80,
    lines: 80
  },
  utils: {
    statements: 90,
    branches: 80,
    functions: 90,
    lines: 90
  }
};

const TEST_COMMAND = 'jest --ci --coverage';

// Helper functions
function printHeader(text) {
  console.log('\n' + chalk.bgBlue.white.bold(` ${text} `) + '\n');
}

function printSuccess(text) {
  console.log(chalk.green('✓ ') + text);
}

function printFailure(text) {
  console.log(chalk.red('✗ ') + text);
}

function printWarning(text) {
  console.log(chalk.yellow('⚠ ') + text);
}

function printCoverageSummary(summary) {
  const format = (value) => {
    const num = parseFloat(value);
    if (num >= 80) return chalk.green(`${num}%`);
    if (num >= 60) return chalk.yellow(`${num}%`);
    return chalk.red(`${num}%`);
  };

  console.log('\nCoverage Summary:');
  console.log(`  Statements: ${format(summary.statements.pct)}`);
  console.log(`  Branches:   ${format(summary.branches.pct)}`);
  console.log(`  Functions:  ${format(summary.functions.pct)}`);
  console.log(`  Lines:      ${format(summary.lines.pct)}`);
}

function readCoverageSummary() {
  try {
    const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    if (fs.existsSync(coveragePath)) {
      const summary = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      return summary.total;
    }
    return null;
  } catch (error) {
    console.error('Error reading coverage report:', error.message);
    return null;
  }
}

function executeTests() {
  try {
    printHeader('Running tests with coverage');
    console.log(`Executing: ${TEST_COMMAND}\n`);
    execSync(TEST_COMMAND, { stdio: 'inherit' });
    return true;
  } catch (error) {
    printFailure('Tests failed with the following error:');
    console.error(error.message);
    return false;
  }
}

function generateBadges() {
  try {
    printHeader('Generating coverage badges');
    execSync('npm run test:badges', { stdio: 'inherit' });
    printSuccess('Coverage badges generated successfully');
    return true;
  } catch (error) {
    printFailure('Failed to generate coverage badges:');
    console.error(error.message);
    return false;
  }
}

function checkThresholds(summary) {
  printHeader('Checking coverage thresholds');
  
  let allPassed = true;
  const global = COVERAGE_THRESHOLD.global;
  
  // Check global thresholds
  if (summary.statements.pct < global.statements) {
    printFailure(`Statement coverage (${summary.statements.pct}%) below threshold (${global.statements}%)`);
    allPassed = false;
  }
  
  if (summary.branches.pct < global.branches) {
    printFailure(`Branch coverage (${summary.branches.pct}%) below threshold (${global.branches}%)`);
    allPassed = false;
  }
  
  if (summary.functions.pct < global.functions) {
    printFailure(`Function coverage (${summary.functions.pct}%) below threshold (${global.functions}%)`);
    allPassed = false;
  }
  
  if (summary.lines.pct < global.lines) {
    printFailure(`Line coverage (${summary.lines.pct}%) below threshold (${global.lines}%)`);
    allPassed = false;
  }
  
  if (allPassed) {
    printSuccess('All coverage thresholds met');
  } else {
    printWarning('Some coverage thresholds not met. See details above.');
  }
  
  return allPassed;
}

// Main execution
(async function main() {
  const testsPassed = executeTests();
  if (!testsPassed) {
    process.exit(1);
  }
  
  const summary = readCoverageSummary();
  if (summary) {
    printCoverageSummary(summary);
    const thresholdsPassed = checkThresholds(summary);
    generateBadges();
    
    if (!thresholdsPassed) {
      printWarning('Coverage thresholds not met. Please add more tests to improve coverage.');
      // Uncomment the line below to fail CI when thresholds aren't met
      // process.exit(1);
    }
  } else {
    printFailure('Could not read coverage summary');
    process.exit(1);
  }
  
  printHeader('Test run completed');
})();
