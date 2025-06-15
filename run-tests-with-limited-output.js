/**
 * Script to run Jest tests with controlled output to prevent terminal/API flooding
 * 
 * This script addresses the issue of overwhelming output from Jest tests
 * by capturing the output and:
 * 1. Limiting verbose console messages
 * 2. Filtering out repetitive messages
 * 3. Focusing on just test results and errors
 * 4. Saving full output to a file
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const MAX_CONSOLE_LINES = 200;  // Maximum number of lines to display in console
const OUTPUT_FILE = 'test_output_full.txt';  // File for full output
const SUMMARY_FILE = 'test_summary.txt';  // File for summary

console.log('Running tests with controlled output...');

// Create a write stream for saving the full output
const outputStream = fs.createWriteStream(path.join(__dirname, OUTPUT_FILE), { encoding: 'utf8' });

// Spawn the test process
const testProcess = spawn('npm', ['test'], { 
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe'] 
});

let fullOutput = '';
let filteredLines = [];
let errorOutput = '';
let seenMessages = new Set();

// Handle stdout data
testProcess.stdout.on('data', (data) => {
  const chunk = data.toString();
  fullOutput += chunk;
  
  // Process the chunk line by line
  const lines = chunk.split('\n');
  lines.forEach(line => {
    // Skip empty lines and duplicated messages
    if (!line.trim() || seenMessages.has(line)) return;
    
    // Store error lines separately
    if (line.includes('FAIL') || line.includes('ERROR') || line.includes('×')) {
      errorOutput += line + '\n';
    }
    
    // Add to filtered lines if it's a meaningful line
    // Skip lines that are just progress indicators or verbose logs
    if (
      !line.match(/^\s*[\.│]/m) && // Skip progress bars and separators
      !line.includes('console.log') && // Skip console.log output
      !line.includes('at Object.') && // Skip stack traces
      !line.includes('at ') && // Skip stack traces
      !line.includes('node_modules') && // Skip node_modules references
      !line.trim().startsWith('Expected') // Skip assertion details
    ) {
      filteredLines.push(line);
      seenMessages.add(line);
    }
  });
});

// Handle stderr data
testProcess.stderr.on('data', (data) => {
  const chunk = data.toString();
  fullOutput += chunk;
  errorOutput += chunk;
  
  // Add error lines to filtered output
  const lines = chunk.split('\n');
  lines.forEach(line => {
    if (line.trim() && !seenMessages.has(line)) {
      filteredLines.push(line);
      seenMessages.add(line);
    }
  });
});

// Handle process completion
testProcess.on('close', (code) => {
  // Write the full output to file
  outputStream.write(fullOutput);
  outputStream.end();
  
  // Generate summary
  const summary = [];
  summary.push('TEST SUMMARY');
  summary.push('============');
  summary.push('');
  
  // Extract test statistics
  const testSuites = fullOutput.match(/Test Suites:.*$/m);
  const tests = fullOutput.match(/Tests:.*$/m);
  const snapshots = fullOutput.match(/Snapshots:.*$/m);
  const time = fullOutput.match(/Time:.*$/m);
  const coverage = fullOutput.match(/All files.*[\s\S]*?%\)/m);
  
  if (testSuites) summary.push(testSuites[0]);
  if (tests) summary.push(tests[0]);
  if (snapshots) summary.push(snapshots[0]);
  if (time) summary.push(time[0]);
  
  summary.push('');
  summary.push('FAILED TESTS');
  summary.push('============');
  
  if (errorOutput.trim()) {
    summary.push(errorOutput);
  } else {
    summary.push('No failed tests!');
  }
  
  summary.push('');
  summary.push('COVERAGE SUMMARY');
  summary.push('================');
  
  if (coverage) {
    summary.push(coverage[0]);
  }
  
  // Write summary to file
  fs.writeFileSync(path.join(__dirname, SUMMARY_FILE), summary.join('\n'), 'utf8');
  
  // Display limited output to console
  console.log('\n');
  console.log('TEST RESULTS');
  console.log('============');
  
  // If we have a lot of filtered lines, just show the most important ones
  if (filteredLines.length > MAX_CONSOLE_LINES) {
    console.log(`Note: Output was too large. Showing only key results.`);
    console.log(`Full output saved to ${OUTPUT_FILE}`);
    console.log(`Summary saved to ${SUMMARY_FILE}`);
    console.log('\n');
    
    // Show test statistics
    if (testSuites) console.log(testSuites[0]);
    if (tests) console.log(tests[0]);
    
    // Show error output
    if (errorOutput.trim()) {
      console.log('\nFAILURES:');
      console.log(errorOutput);
    } else {
      console.log('\nAll tests passed!');
    }
  } else {
    // If output is small enough, show all filtered lines
    console.log(filteredLines.join('\n'));
  }
  
  console.log('\n');
  console.log(`Test execution completed with code ${code}`);
  console.log(`Full results saved to ${OUTPUT_FILE}`);
  console.log(`Summary saved to ${SUMMARY_FILE}`);
  
  // Exit with the same code as the test process
  process.exit(code);
});
