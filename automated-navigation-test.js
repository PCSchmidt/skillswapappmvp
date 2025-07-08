/**
 * Comprehensive Navigation Link Testing Script
 * Tests all navigation links from landing page through tertiary levels
 * Includes form functionality testing and error detection
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

// Configuration
const config = {
  baseUrl: 'https://skillswapappmvp-git-dev-chris-schmidts-projects.vercel.app',
  timeout: 30000,
  viewport: { width: 1280, height: 720 },
  userAgent: 'SkillSwap-Testing-Bot/1.0'
};

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: config.baseUrl,
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  },
  tests: [],
  criticalIssues: [],
  navigationMap: {}
};

// Navigation structure to test
const navigationTests = [
  // Landing Page Primary Navigation
  {
    page: '/',
    name: 'Landing Page',
    primaryLinks: [
      { selector: 'a[href="/signup"]', name: 'Get Started Free / Join SkillSwap', expectedUrl: '/signup' },
      { selector: 'a[href="/skills/browse"]', name: 'Browse Skills', expectedUrl: '/skills/browse' },
      { selector: 'a[href="/skills/discover"]', name: 'Discover Skills', expectedUrl: '/skills/discover' },
      { selector: 'a[href="/login"]', name: 'Sign In / Login', expectedUrl: '/login' },
      { selector: 'a[href="/how-it-works"]', name: 'How It Works', expectedUrl: '/how-it-works' },
      { selector: 'a[href="/about"]', name: 'About', expectedUrl: '/about' },
      { selector: 'a[href="/contact"]', name: 'Contact', expectedUrl: '/contact' },
      { selector: 'a[href="/privacy"]', name: 'Privacy Policy', expectedUrl: '/privacy' },
      { selector: 'a[href="/terms"]', name: 'Terms of Service', expectedUrl: '/terms' },
      { selector: 'a[href="/accessibility"]', name: 'Accessibility', expectedUrl: '/accessibility' }
    ]
  },
  // Signup Page Secondary Navigation
  {
    page: '/signup',
    name: 'Signup Page',
    primaryLinks: [
      { selector: 'a[href="/login"]', name: 'Sign In Link', expectedUrl: '/login' },
      { selector: 'a[href="/privacy"]', name: 'Privacy Policy Link', expectedUrl: '/privacy' },
      { selector: 'a[href="/terms"]', name: 'Terms of Service Link', expectedUrl: '/terms' }
    ],
    formTests: [
      {
        name: 'Password Validation Test',
        actions: [
          { type: 'fill', selector: 'input[data-testid="password-input"]', value: 'weak' },
          { type: 'blur', selector: 'input[data-testid="password-input"]' }
        ],
        expectations: [
          { type: 'visible', selector: '[data-testid="password-error"]', description: 'Password error should appear' }
        ]
      },
      {
        name: 'Strong Password Test',
        actions: [
          { type: 'fill', selector: 'input[data-testid="password-input"]', value: 'StrongPass123!@#' },
          { type: 'blur', selector: 'input[data-testid="password-input"]' }
        ],
        expectations: [
          { type: 'not-visible', selector: '[data-testid="password-error"]', description: 'Password error should not appear for strong password' }
        ]
      }
    ]
  },
  // Login Page Secondary Navigation
  {
    page: '/login',
    name: 'Login Page',
    primaryLinks: [
      { selector: 'a[href="/signup"]', name: 'Sign Up Link', expectedUrl: '/signup' },
      { selector: 'a[href="/auth/forgot-password"]', name: 'Forgot Password', expectedUrl: '/auth/forgot-password' },
      { selector: 'a[href="/"]', name: 'Back to Home', expectedUrl: '/' }
    ]
  },
  // Forgot Password Page
  {
    page: '/auth/forgot-password',
    name: 'Forgot Password Page',
    primaryLinks: [
      { selector: 'a[href="/login"]', name: 'Back to Login', expectedUrl: '/login' },
      { selector: 'a[href="/signup"]', name: 'Sign Up Link', expectedUrl: '/signup' }
    ],
    formTests: [
      {
        name: 'Email Validation Test',
        actions: [
          { type: 'fill', selector: 'input[type="email"]', value: 'invalid-email' },
          { type: 'submit', selector: 'form[data-testid="reset-form"]' }
        ],
        expectations: [
          { type: 'visible', selector: '[data-testid="auth-error"]', description: 'Should show email validation error' }
        ]
      }
    ]
  },
  // Reset Password Page (test with mock token)
  {
    page: '/auth/reset-password?token=test-token',
    name: 'Reset Password Page',
    formTests: [
      {
        name: 'Password Requirements Test',
        actions: [
          { type: 'fill', selector: 'input[type="password"]:first-of-type', value: 'weak' },
          { type: 'submit', selector: 'form' }
        ],
        expectations: [
          { type: 'visible', selector: '.error, [class*="error"]', description: 'Should enforce 12+ character requirement' }
        ]
      }
    ]
  }
];

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const logTest = (test, passed, details = '') => {
  testResults.summary.totalTests++;
  if (passed) {
    testResults.summary.passed++;
  } else {
    testResults.summary.failed++;
  }
  
  const result = {
    test,
    passed,
    details,
    timestamp: new Date().toISOString()
  };
  
  testResults.tests.push(result);
  console.log(`${passed ? '✅' : '❌'} ${test} ${details ? `- ${details}` : ''}`);
  
  if (!passed) {
    testResults.criticalIssues.push(result);
  }
};

const logWarning = (test, message) => {
  testResults.summary.warnings++;
  console.log(`⚠️  ${test} - ${message}`);
  testResults.tests.push({
    test,
    passed: true,
    warning: true,
    details: message,
    timestamp: new Date().toISOString()
  });
};

// Main testing functions
async function testPage(browser, pageConfig) {
  const page = await browser.newPage();
  
  try {
    console.log(`\n🔍 Testing: ${pageConfig.name} (${pageConfig.page})`);
    
    // Navigate to page
    const response = await page.goto(`${config.baseUrl}${pageConfig.page}`, {
      waitUntil: 'networkidle0',
      timeout: config.timeout
    });
    
    if (!response.ok()) {
      logTest(`${pageConfig.name} - Page Load`, false, `HTTP ${response.status()}`);
      return;
    }
    
    logTest(`${pageConfig.name} - Page Load`, true, `HTTP ${response.status()}`);
    
    // Test navigation links
    if (pageConfig.primaryLinks) {
      for (const link of pageConfig.primaryLinks) {
        await testNavigationLink(page, pageConfig.name, link);
        await delay(500); // Prevent rate limiting
      }
    }
    
    // Test forms
    if (pageConfig.formTests) {
      for (const formTest of pageConfig.formTests) {
        await testFormFunctionality(page, pageConfig.name, formTest);
        await delay(1000);
      }
    }
    
    // Check for JavaScript errors
    const errors = await page.evaluate(() => {
      return window.__testErrors || [];
    });
    
    if (errors.length > 0) {
      logWarning(`${pageConfig.name} - JavaScript Errors`, `Found ${errors.length} JS errors`);
    }
    
  } catch (error) {
    logTest(`${pageConfig.name} - General Test`, false, error.message);
  } finally {
    await page.close();
  }
}

async function testNavigationLink(page, pageName, linkConfig) {
  try {
    const linkExists = await page.$(linkConfig.selector) !== null;
    
    if (!linkExists) {
      logTest(`${pageName} - ${linkConfig.name}`, false, 'Link not found');
      return;
    }
    
    // Check if link has correct href
    const href = await page.$eval(linkConfig.selector, el => el.getAttribute('href'));
    
    if (href !== linkConfig.expectedUrl) {
      logTest(`${pageName} - ${linkConfig.name}`, false, `Expected ${linkConfig.expectedUrl}, found ${href}`);
      return;
    }
    
    // Test link click (in new page to avoid navigation issues)
    const newPagePromise = page.context().newPage();
    await page.click(linkConfig.selector);
    
    const newPage = await newPagePromise;
    await newPage.waitForLoadState('networkidle');
    
    const currentUrl = new URL(newPage.url()).pathname;
    const expectedPath = linkConfig.expectedUrl;
    
    if (currentUrl === expectedPath || currentUrl.startsWith(expectedPath)) {
      logTest(`${pageName} - ${linkConfig.name}`, true, `Navigated to ${currentUrl}`);
    } else {
      logTest(`${pageName} - ${linkConfig.name}`, false, `Expected ${expectedPath}, got ${currentUrl}`);
    }
    
    await newPage.close();
    
  } catch (error) {
    logTest(`${pageName} - ${linkConfig.name}`, false, error.message);
  }
}

async function testFormFunctionality(page, pageName, formTest) {
  try {
    console.log(`  🧪 Testing form: ${formTest.name}`);
    
    // Execute form actions
    for (const action of formTest.actions) {
      switch (action.type) {
        case 'fill':
          await page.fill(action.selector, action.value);
          break;
        case 'click':
          await page.click(action.selector);
          break;
        case 'blur':
          await page.evaluate((selector) => {
            document.querySelector(selector)?.blur();
          }, action.selector);
          break;
        case 'submit':
          await page.click(action.selector + ' button[type="submit"], ' + action.selector + ' input[type="submit"]');
          break;
      }
      await delay(500);
    }
    
    // Wait a moment for any async validation
    await delay(1500);
    
    // Check expectations
    for (const expectation of formTest.expectations) {
      const element = await page.$(expectation.selector);
      const isVisible = element !== null && await element.isVisible();
      
      let passed = false;
      if (expectation.type === 'visible') {
        passed = isVisible;
      } else if (expectation.type === 'not-visible') {
        passed = !isVisible;
      }
      
      logTest(`${pageName} - ${formTest.name}`, passed, expectation.description);
    }
    
  } catch (error) {
    logTest(`${pageName} - ${formTest.name}`, false, error.message);
  }
}

async function checkConsoleErrors(page) {
  return new Promise((resolve) => {
    const errors = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push({
          text: msg.text(),
          url: msg.location().url,
          lineNumber: msg.location().lineNumber
        });
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push({
        text: error.message,
        stack: error.stack
      });
    });
    
    // Inject error capture
    page.addInitScript(() => {
      window.__testErrors = [];
      const originalConsoleError = console.error;
      console.error = (...args) => {
        window.__testErrors.push(args.join(' '));
        originalConsoleError.apply(console, args);
      };
    });
    
    setTimeout(() => resolve(errors), 5000);
  });
}

// Main execution
async function runComprehensiveTest() {
  console.log('🚀 Starting Comprehensive Navigation & Functionality Test');
  console.log(`📍 Base URL: ${config.baseUrl}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Test each page configuration
    for (const pageConfig of navigationTests) {
      await testPage(browser, pageConfig);
    }
    
    // Generate report
    const reportPath = `./navigation-test-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
    
    console.log('\n📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${testResults.summary.totalTests}`);
    console.log(`✅ Passed: ${testResults.summary.passed}`);
    console.log(`❌ Failed: ${testResults.summary.failed}`);
    console.log(`⚠️  Warnings: ${testResults.summary.warnings}`);
    console.log(`📄 Report saved: ${reportPath}`);
    
    if (testResults.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      testResults.criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.test}: ${issue.details}`);
      });
    }
    
  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    await browser.close();
  }
}

// Execute if run directly
if (require.main === module) {
  runComprehensiveTest().catch(console.error);
}

module.exports = { runComprehensiveTest, testResults };
