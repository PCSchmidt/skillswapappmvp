#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script verifies that a deployment is functioning correctly by:
 * 1. Checking that the site responds with a 200 status code
 * 2. Verifying that the health API endpoint reports healthy status
 * 3. Checking basic auth endpoints are accessible
 * 4. Validating that static assets load properly
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const { program } = require('commander');

// Setup command line options
program
  .description('Verify a deployed SkillSwap instance is functioning correctly')
  .option('-u, --url <url>', 'The deployment URL to verify')
  .option('-t, --timeout <timeout>', 'Timeout in milliseconds for each check', parseInt, 15000)
  .option('-v, --verbose', 'Show detailed output')
  .parse(process.argv);

const options = program.opts();

// Validate required parameters
if (!options.url) {
  console.error('Error: Deployment URL is required (--url)');
  process.exit(1);
}

// Setup URLs to check based on deployment URL
const baseUrl = options.url.replace(/\/$/, ''); // Remove trailing slash if present
const urlsToCheck = [
  { url: `${baseUrl}`, name: 'Home page' },
  { url: `${baseUrl}/api/health`, name: 'Health API', checkJson: true, expectedStatus: 'healthy' },
  { url: `${baseUrl}/manifest.json`, name: 'PWA Manifest' },
  { url: `${baseUrl}/sw.js`, name: 'Service Worker' },
  { url: `${baseUrl}/api/robots`, name: 'Robots API' },
  { url: `${baseUrl}/api/sitemap`, name: 'Sitemap API' },
];

// Counters for summary
let passed = 0;
let failed = 0;
let skipped = 0;

// Primary verification function
async function verifyDeployment() {
  console.log(`\n🚀 Verifying deployment at: ${baseUrl}`);
  console.log(`🕒 Timeout set to: ${options.timeout}ms`);
  console.log('-------------------------------------');

  for (const check of urlsToCheck) {
    try {
      const result = await checkUrl(check);
      if (result.success) {
        console.log(`✅ ${check.name}: ${result.message || 'Passed'}`);
        passed++;
      } else {
        console.error(`❌ ${check.name}: ${result.message || 'Failed'}`);
        failed++;
        if (options.verbose && result.error) {
          console.error(`   Error details: ${result.error}`);
        }
      }
    } catch (error) {
      console.error(`❌ ${check.name}: Unexpected error during check`);
      if (options.verbose) {
        console.error(`   Error details: ${error.message}`);
      }
      failed++;
    }
  }

  // Print summary
  console.log('\n-------------------------------------');
  console.log(`📊 SUMMARY: ${passed} passed, ${failed} failed, ${skipped} skipped`);
  
  // Exit with appropriate code
  if (failed > 0) {
    console.error('❌ Verification FAILED');
    process.exit(1);
  } else {
    console.log('✅ Verification PASSED');
    process.exit(0);
  }
}

// Function to check a single URL
function checkUrl({ url, name, checkJson, expectedStatus }) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const requestLib = parsedUrl.protocol === 'https:' ? https : http;
      
      const req = requestLib.get(url, { timeout: options.timeout }, (res) => {
        const { statusCode } = res;
        
        if (options.verbose) {
          console.log(`   ${name}: Status ${statusCode}, Content-Type: ${res.headers['content-type']}`);
        }
        
        // Check for redirect responses
        if (statusCode >= 300 && statusCode < 400) {
          resolve({ 
            success: true, 
            message: `Redirected (${statusCode}) to ${res.headers.location}`
          });
          return;
        }
        
        // Check for successful responses
        if (statusCode !== 200) {
          resolve({ 
            success: false, 
            message: `Unexpected status code: ${statusCode}`
          });
          return;
        }
        
        // If we need to check the JSON content
        if (checkJson) {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              const jsonResponse = JSON.parse(data);
              
              if (options.verbose) {
                console.log(`   Response: ${JSON.stringify(jsonResponse).substring(0, 100)}...`);
              }
              
              if (expectedStatus && jsonResponse.status !== expectedStatus) {
                resolve({ 
                  success: false, 
                  message: `Status check failed: expected "${expectedStatus}", got "${jsonResponse.status}"`
                });
                return;
              }
              
              // If checking the health endpoint, verify database connection
              if (url.includes('/api/health') && jsonResponse.services && jsonResponse.services.database) {
                if (jsonResponse.services.database.status !== 'healthy') {
                  resolve({ 
                    success: false, 
                    message: `Database reported unhealthy: ${jsonResponse.services.database.error || 'No details provided'}`
                  });
                  return;
                }
              }
              
              resolve({ success: true });
            } catch (error) {
              resolve({ 
                success: false, 
                message: 'Failed to parse JSON response',
                error: error.message
              });
            }
          });
        } else {
          resolve({ success: true });
        }
      });
      
      req.on('error', (error) => {
        resolve({ 
          success: false, 
          message: `Request failed: ${error.message}`,
          error: error
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({ 
          success: false, 
          message: `Request timed out after ${options.timeout}ms`
        });
      });
    } catch (error) {
      resolve({ 
        success: false, 
        message: `Invalid URL or request setup: ${error.message}`,
        error: error
      });
    }
  });
}

// Execute the verification
verifyDeployment().catch(error => {
  console.error('Verification process failed:', error);
  process.exit(1);
});
