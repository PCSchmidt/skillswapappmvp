#!/usr/bin/env node

/**
 * Simple Navigation Test using Fetch API
 * Tests all critical navigation paths without browser dependencies
 */

const baseUrl = 'https://skillswapappmvp-git-dev-chris-schmidts-projects.vercel.app';

const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl,
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  }
};

// Critical pages to test
const pagesToTest = [
  { path: '/', name: 'Landing Page', critical: true },
  { path: '/signup', name: 'Signup Page', critical: true },
  { path: '/login', name: 'Login Page', critical: true },
  { path: '/auth/forgot-password', name: 'Forgot Password', critical: true },
  { path: '/auth/reset-password', name: 'Reset Password', critical: true },
  { path: '/skills/browse', name: 'Browse Skills', critical: false },
  { path: '/about', name: 'About Page', critical: false },
  { path: '/contact', name: 'Contact Page', critical: false },
  { path: '/privacy', name: 'Privacy Policy', critical: false },
  { path: '/terms', name: 'Terms of Service', critical: false },
  { path: '/how-it-works', name: 'How It Works', critical: false },
  { path: '/dashboard', name: 'Dashboard (auth required)', critical: false }
];

async function testPage(page) {
  const url = `${baseUrl}${page.path}`;
  const startTime = Date.now();
  
  try {
    console.log(`Testing: ${page.name} (${url})`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'SkillSwap Navigation Test Bot',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    const responseTime = Date.now() - startTime;
    const contentType = response.headers.get('content-type') || '';
    const isHtml = contentType.includes('text/html');
    
    const result = {
      name: page.name,
      path: page.path,
      url,
      status: response.status,
      statusText: response.statusText,
      responseTime: `${responseTime}ms`,
      contentType,
      isHtml,
      critical: page.critical,
      passed: response.status >= 200 && response.status < 400,
      timestamp: new Date().toISOString()
    };
    
    // Check for specific error conditions
    if (response.status === 404) {
      result.error = 'Page not found - broken link';
    } else if (response.status >= 500) {
      result.error = 'Server error - application issue';
    } else if (!isHtml && page.critical) {
      result.error = 'Expected HTML page but got different content type';
      result.passed = false;
    }
    
    // Log result
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    const critical = result.critical ? '[CRITICAL]' : '[OPTIONAL]';
    console.log(`  ${status} ${critical} ${result.status} ${result.statusText} (${result.responseTime})`);
    
    if (result.error) {
      console.log(`  ⚠️  Error: ${result.error}`);
    }
    
    return result;
    
  } catch (error) {
    const result = {
      name: page.name,
      path: page.path,
      url,
      status: 'ERROR',
      error: error.message,
      critical: page.critical,
      passed: false,
      timestamp: new Date().toISOString()
    };
    
    console.log(`  ❌ FAIL [${page.critical ? 'CRITICAL' : 'OPTIONAL'}] ERROR: ${error.message}`);
    return result;
  }
}

async function runNavigationTests() {
  console.log('🚀 SKILLSWAP NAVIGATION TEST STARTING');
  console.log('=' .repeat(60));
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Test Time: ${new Date().toLocaleString()}`);
  console.log(`Total Pages: ${pagesToTest.length}`);
  console.log('');
  
  // Test all pages
  for (const page of pagesToTest) {
    const result = await testPage(page);
    testResults.tests.push(result);
    testResults.summary.total++;
    
    if (result.passed) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
      if (result.critical) {
        testResults.summary.errors.push(`CRITICAL: ${result.name} - ${result.error || result.status}`);
      }
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Print summary
  console.log('');
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`Success Rate: ${Math.round((testResults.summary.passed / testResults.summary.total) * 100)}%`);
  
  if (testResults.summary.errors.length > 0) {
    console.log('');
    console.log('🚨 CRITICAL ERRORS:');
    testResults.summary.errors.forEach(error => {
      console.log(`  • ${error}`);
    });
  }
  
  // Check for specific issues mentioned by user
  console.log('');
  console.log('🔍 SPECIFIC ISSUE CHECKS:');
  
  const signupTest = testResults.tests.find(t => t.path === '/signup');
  if (signupTest) {
    if (signupTest.passed) {
      console.log('  ✅ "Get Started Free" button target (/signup) - Page loads correctly');
    } else {
      console.log(`  ❌ "Get Started Free" button target (/signup) - ${signupTest.error || signupTest.status}`);
    }
  }
  
  const resetTest = testResults.tests.find(t => t.path === '/auth/reset-password');
  if (resetTest) {
    if (resetTest.passed) {
      console.log('  ✅ Password reset page (/auth/reset-password) - Page loads correctly');
    } else {
      console.log(`  ❌ Password reset page (/auth/reset-password) - ${resetTest.error || resetTest.status}`);
    }
  }
  
  console.log('');
  console.log('📝 NEXT STEPS:');
  if (testResults.summary.failed === 0) {
    console.log('  🎉 All navigation tests passed! Check browser console for JavaScript errors.');
  } else {
    console.log('  🔧 Fix failed navigation links before testing authentication flows.');
  }
  
  console.log('  🧪 Manual testing needed: Password validation UI, form submissions, email flows.');
  console.log('');
  
  return testResults;
}

// Export for use in other scripts
if (require.main === module) {
  runNavigationTests().catch(console.error);
}

module.exports = { runNavigationTests, testResults };
