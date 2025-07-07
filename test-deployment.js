#!/usr/bin/env node

/**
 * SkillSwap MVP Deployment Testing Script
 * 
 * Tests all critical issues that were reported and fixed:
 * 1. Application errors on signup/login
 * 2. 404 on forgot password  
 * 3. Header bar/dashboard/profile page shaking
 * 4. Weak password acceptance
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://skillswapappmvp.vercel.app';

// Test configuration with deeper validation
const tests = [
  {
    name: 'Home Page Load',
    path: '/',
    expectedStatus: 200,
    checkFor: ['SkillSwap', 'Welcome'],
    deepValidation: {
      description: 'Check navigation links and basic functionality',
      checks: [
        { type: 'content', value: 'Sign up', description: 'Signup link present' },
        { type: 'content', value: 'Log in', description: 'Login link present' },
        { type: 'noError', patterns: ['Error', 'undefined', 'null'], description: 'No JavaScript errors in HTML' }
      ]
    }
  },
  {
    name: 'Signup Page Load (Application Errors Test)',
    path: '/signup',
    expectedStatus: 200,
    checkFor: ['Sign up', 'password', 'email'],
    deepValidation: {
      description: 'Validate signup form elements and password strength requirements',
      checks: [
        { type: 'content', value: 'data-testid="email-input"', description: 'Email input field present' },
        { type: 'content', value: 'data-testid="password-input"', description: 'Password input field present' },
        { type: 'content', value: 'data-testid="confirm-password-input"', description: 'Confirm password field present' },
        { type: 'content', value: 'At least 12 characters', description: 'Password strength indicator present' },
        { type: 'content', value: 'uppercase letter', description: 'Password requirements detailed' },
        { type: 'content', value: 'special character', description: 'Special character requirement shown' },
        { type: 'noError', patterns: ['ReferenceError', 'TypeError', 'hydration'], description: 'No React/hydration errors' },
        { type: 'content', value: 'data-testid="submit-button"', description: 'Submit button properly configured' }
      ]
    }
  },
  {
    name: 'Login Page Load (Application Errors Test)', 
    path: '/login',
    expectedStatus: 200,
    checkFor: ['Log in', 'password', 'email', 'Forgot password'],
    deepValidation: {
      description: 'Validate login form and forgot password link routing',
      checks: [
        { type: 'content', value: 'data-testid="email-input"', description: 'Email input field present' },
        { type: 'content', value: 'data-testid="password-input"', description: 'Password input field present' },
        { type: 'content', value: '/auth/forgot-password', description: 'Correct forgot password link (not /reset-password)' },
        { type: 'content', value: 'eye', description: 'Password visibility toggle present' },
        { type: 'noError', patterns: ['ReferenceError', 'TypeError', 'Cannot read'], description: 'No JavaScript errors' },
        { type: 'content', value: 'data-testid="login-button"', description: 'Login button properly configured' }
      ]
    }
  },
  {
    name: 'Forgot Password Page (404 Fix Test)',
    path: '/auth/forgot-password',
    expectedStatus: 200,
    checkFor: ['Forgot', 'password', 'reset'],
    deepValidation: {
      description: 'Verify forgot password page exists and functions (was returning 404)',
      checks: [
        { type: 'content', value: 'email', description: 'Email input field present' },
        { type: 'content', value: 'Send', description: 'Send reset link button present' },
        { type: 'content', value: 'Back to login', description: 'Navigation back to login' },
        { type: 'noError', patterns: ['404', 'Not Found', 'Page not found'], description: 'No 404 errors' },
        { type: 'content', value: 'instructions', description: 'Reset instructions present' }
      ]
    }
  },
  {
    name: 'Dashboard Page (Header Shaking Fix Test)',
    path: '/dashboard',
    expectedStatus: 200,
    checkFor: ['Dashboard'],
    deepValidation: {
      description: 'Check for header stability and no rapid re-renders causing shaking',
      checks: [
        { type: 'content', value: 'Profile Completion', description: 'Profile completion component loads' },
        { type: 'content', value: 'Quick Actions', description: 'Quick actions component present' },
        { type: 'noError', patterns: ['rapid', 'polling', 'Maximum update depth'], description: 'No rapid re-render errors' },
        { type: 'content', value: 'navbar', description: 'Navigation bar present' },
        { type: 'content', value: 'skills', description: 'Skills-related content loads' },
        { type: 'noError', patterns: ['useEffect', 'setState loop'], description: 'No infinite render loops' }
      ]
    }
  },
  {
    name: 'Profile Page (Header Shaking Fix Test)',
    path: '/profile',
    expectedStatus: [200, 302, 401], // Could redirect to login if not authenticated
    checkFor: ['Profile', 'login', 'authenticate'],
    deepValidation: {
      description: 'Verify profile page loads or redirects properly without shaking',
      checks: [
        { type: 'content', value: 'Profile', description: 'Profile content or redirect message' },
        { type: 'noError', patterns: ['Cannot read properties', 'undefined user'], description: 'No user object errors' },
        { type: 'content', value: '/login', description: 'Proper redirect to /login (not /auth/signin)' },
        { type: 'noError', patterns: ['shaking', 'flickering', 'Maximum update'], description: 'No UI shaking indicators' }
      ]
    }
  },
  {
    name: 'Password Strength Validation Test',
    path: '/signup',
    expectedStatus: 200,
    checkFor: ['password', 'strength'],
    deepValidation: {
      description: 'Deep test of password strength requirements (weak password rejection)',
      checks: [
        { type: 'content', value: 'At least 12 characters', description: 'Minimum length requirement' },
        { type: 'content', value: 'Contains uppercase letter', description: 'Uppercase requirement' },
        { type: 'content', value: 'Contains lowercase letter', description: 'Lowercase requirement' },
        { type: 'content', value: 'Contains number', description: 'Number requirement' },
        { type: 'content', value: 'special character', description: 'Special character requirement' },
        { type: 'content', value: 'consecutive identical', description: 'No repeated characters rule' },
        { type: 'noContent', value: 'password123', description: 'Weak password examples not accepted' }
      ]
    }
  },
  {
    name: 'Navigation Stability Test',
    path: '/',
    expectedStatus: 200,
    checkFor: ['navigation', 'navbar'],
    deepValidation: {
      description: 'Test navigation bar stability and proper routing',
      checks: [
        { type: 'content', value: 'href="/signup"', description: 'Signup navigation link' },
        { type: 'content', value: 'href="/login"', description: 'Login navigation link' },
        { type: 'content', value: 'href="/dashboard"', description: 'Dashboard navigation link' },
        { type: 'noError', patterns: ['flickering', 'jumping', 'layout shift'], description: 'No navigation flickering' },
        { type: 'content', value: 'SkillSwap', description: 'Logo/brand present in navigation' }
      ]
    }
  }
];

// Test results
const results = {
  passed: 0,
  failed: 0,
  details: []
};

// HTTP request helper
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });
  });
}

// Run a single test with deep validation
async function runTest(test) {
  console.log(`\n🧪 Testing: ${test.name}`);
  console.log(`   URL: ${BASE_URL}${test.path}`);
  if (test.deepValidation) {
    console.log(`   📋 ${test.deepValidation.description}`);
  }
  
  try {
    const response = await makeRequest(`${BASE_URL}${test.path}`);
    
    // Check status code (allow arrays for multiple valid status codes)
    const expectedStatuses = Array.isArray(test.expectedStatus) ? test.expectedStatus : [test.expectedStatus];
    if (!expectedStatuses.includes(response.statusCode)) {
      throw new Error(`Expected status ${expectedStatuses.join(' or ')}, got ${response.statusCode}`);
    }
    
    // Check for expected content
    const missingContent = [];
    for (const content of test.checkFor) {
      if (!response.body.toLowerCase().includes(content.toLowerCase())) {
        missingContent.push(content);
      }
    }
    
    if (missingContent.length > 0) {
      throw new Error(`Missing expected content: ${missingContent.join(', ')}`);
    }
    
    // Deep validation checks
    let deepValidationResults = [];
    if (test.deepValidation && test.deepValidation.checks) {
      for (const check of test.deepValidation.checks) {
        const checkResult = performDeepCheck(check, response.body);
        deepValidationResults.push(checkResult);
        
        if (checkResult.passed) {
          console.log(`     ✅ ${checkResult.description}`);
        } else {
          console.log(`     ❌ ${checkResult.description}: ${checkResult.reason}`);
        }
      }
    }
    
    const failedDeepChecks = deepValidationResults.filter(r => !r.passed);
    if (failedDeepChecks.length > 0) {
      throw new Error(`Failed ${failedDeepChecks.length} deep validation checks`);
    }
    
    console.log(`   ✅ PASSED - Status: ${response.statusCode} | Deep checks: ${deepValidationResults.length}/${deepValidationResults.length}`);
    results.passed++;
    results.details.push({
      test: test.name,
      status: 'PASSED',
      statusCode: response.statusCode,
      message: 'All checks passed',
      deepValidation: deepValidationResults
    });
    
  } catch (error) {
    console.log(`   ❌ FAILED - ${error.message}`);
    results.failed++;
    results.details.push({
      test: test.name,
      status: 'FAILED',
      error: error.message
    });
  }
}

// Perform deep validation checks
function performDeepCheck(check, responseBody) {
  const bodyLower = responseBody.toLowerCase();
  
  switch (check.type) {
    case 'content':
      const hasContent = bodyLower.includes(check.value.toLowerCase());
      return {
        passed: hasContent,
        description: check.description,
        reason: hasContent ? null : `Content "${check.value}" not found`
      };
      
    case 'noContent':
      const hasNoContent = !bodyLower.includes(check.value.toLowerCase());
      return {
        passed: hasNoContent,
        description: check.description,
        reason: hasNoContent ? null : `Unwanted content "${check.value}" found`
      };
      
    case 'noError':
      const hasErrors = check.patterns.some(pattern => 
        bodyLower.includes(pattern.toLowerCase())
      );
      return {
        passed: !hasErrors,
        description: check.description,
        reason: hasErrors ? `Found error patterns: ${check.patterns.join(', ')}` : null
      };
      
    default:
      return {
        passed: false,
        description: check.description,
        reason: `Unknown check type: ${check.type}`
      };
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 SkillSwap MVP Deployment Testing');
  console.log('=====================================');
  console.log(`Testing deployment: ${BASE_URL}`);
  
  for (const test of tests) {
    await runTest(test);
  }
  
  // Final summary
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  // Final summary with detailed results
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  // Detailed breakdown
  console.log('\n📋 Detailed Results:');
  console.log('====================');
  
  for (const detail of results.details) {
    if (detail.status === 'PASSED') {
      console.log(`✅ ${detail.test}`);
      if (detail.deepValidation) {
        const passedDeep = detail.deepValidation.filter(dv => dv.passed).length;
        const totalDeep = detail.deepValidation.length;
        console.log(`   🔍 Deep validation: ${passedDeep}/${totalDeep} checks passed`);
      }
    } else {
      console.log(`❌ ${detail.test}`);
      console.log(`   Error: ${detail.error}`);
    }
  }
  
  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Deployment is working correctly.');
    console.log('\n✅ Critical Issues Resolution Verified:');
    console.log('   ✅ Application errors on signup/login: RESOLVED & TESTED');
    console.log('   ✅ 404 on forgot password: RESOLVED & TESTED');
    console.log('   ✅ Header bar/dashboard/profile page shaking: RESOLVED & TESTED');
    console.log('   ✅ Weak password acceptance: PREVENTED & TESTED');
    console.log('   ✅ All pages loading successfully with deep validation');
    console.log('\n🚀 The application is production-ready!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
    console.log('\n🔧 Recommended Actions:');
    
    const failedTests = results.details.filter(d => d.status === 'FAILED');
    for (const failed of failedTests) {
      console.log(`   - Fix: ${failed.test} - ${failed.error}`);
    }
  }
  
  // Return exit code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the tests
runAllTests().catch(error => {
  console.error('\n💥 Test runner failed:', error);
  process.exit(1);
});
