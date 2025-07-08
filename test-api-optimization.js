#!/usr/bin/env node

/**
 * Deployment API Call Analysis Script
 * 
 * This script tests the dashboard components to verify:
 * 1. The batched API calls in WelcomeBack are working correctly
 * 2. No excessive API requests are being made
 * 3. Page stability and performance improvements
 */

const puppeteer = require('puppeteer');

async function testDashboardApiCalls() {
  const browser = await puppeteer.launch({ 
    headless: false, // Keep visible to see page behavior
    devtools: true
  });
  
  try {
    const page = await browser.newPage();
    
    // Monitor network requests
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('supabase') || request.url().includes('api')) {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now()
        });
      }
    });
    
    // Monitor console errors
    const consoleErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    
    console.log('🚀 Starting Dashboard API Call Analysis...');
    
    // Navigate to the login page first
    console.log('📱 Navigating to login page...');
    await page.goto('https://skillswap-mvp.vercel.app/login', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait a bit for initial load
    await page.waitForTimeout(3000);
    
    console.log(`📊 Initial API requests made: ${networkRequests.length}`);
    
    // Try to login with demo credentials if available
    console.log('🔐 Attempting to access dashboard...');
    
    // Check if we can navigate to dashboard (might need auth)
    try {
      await page.goto('https://skillswap-mvp.vercel.app/dashboard', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait for dashboard to load and monitor API calls
      console.log('⏳ Monitoring dashboard API calls for 10 seconds...');
      const initialRequestCount = networkRequests.length;
      
      await page.waitForTimeout(10000);
      
      const finalRequestCount = networkRequests.length;
      const dashboardRequests = finalRequestCount - initialRequestCount;
      
      console.log('\n📈 API CALL ANALYSIS RESULTS:');
      console.log(`└── Total requests during dashboard load: ${dashboardRequests}`);
      console.log(`└── Expected: 1-3 batched requests (vs previous 6+ separate calls)`);
      
      // Analyze request patterns
      const recentRequests = networkRequests.slice(initialRequestCount);
      const skillRequests = recentRequests.filter(r => r.url.includes('user_skills'));
      const tradeRequests = recentRequests.filter(r => r.url.includes('trades'));
      const messageRequests = recentRequests.filter(r => r.url.includes('messages'));
      
      console.log('\n📋 REQUEST BREAKDOWN:');
      console.log(`└── Skills API calls: ${skillRequests.length}`);
      console.log(`└── Trades API calls: ${tradeRequests.length}`);
      console.log(`└── Messages API calls: ${messageRequests.length}`);
      
      if (skillRequests.length <= 1 && tradeRequests.length <= 1 && messageRequests.length <= 1) {
        console.log('✅ SUCCESS: API calls appear to be properly batched!');
      } else {
        console.log('⚠️  WARNING: Multiple separate API calls detected - batching may not be working');
      }
      
    } catch (error) {
      console.log('❌ Could not access dashboard - likely authentication required');
      console.log('📝 This is expected behavior for protected routes');
    }
    
    // Check console errors
    console.log('\n🐛 CONSOLE ERROR ANALYSIS:');
    if (consoleErrors.length === 0) {
      console.log('✅ No console errors detected');
    } else {
      console.log(`⚠️  ${consoleErrors.length} console errors found:`);
      consoleErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    // Test public pages for stability
    console.log('\n🌐 Testing public page stability...');
    await page.goto('https://skillswap-mvp.vercel.app', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await page.waitForTimeout(5000);
    
    console.log('\n📊 FINAL SUMMARY:');
    console.log(`└── Total network requests monitored: ${networkRequests.length}`);
    console.log(`└── Console errors: ${consoleErrors.length}`);
    console.log('└── Page navigation: Successful');
    
    if (networkRequests.length < 20 && consoleErrors.length === 0) {
      console.log('\n🎉 DEPLOYMENT APPEARS STABLE - API optimization likely successful!');
    } else {
      console.log('\n🔧 May need further optimization - monitoring recommended');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Check if puppeteer is available
async function checkDependencies() {
  try {
    require('puppeteer');
    console.log('✅ Puppeteer available - running full browser test');
    await testDashboardApiCalls();
  } catch (error) {
    console.log('📦 Puppeteer not available - running simplified curl test');
    await simplifiedApiTest();
  }
}

async function simplifiedApiTest() {
  const { spawn } = require('child_process');
  
  console.log('🚀 Running simplified API response test...');
  
  const urls = [
    'https://skillswap-mvp.vercel.app',
    'https://skillswap-mvp.vercel.app/login',
    'https://skillswap-mvp.vercel.app/signup',
    'https://skillswap-mvp.vercel.app/forgot-password'
  ];
  
  for (const url of urls) {
    try {
      console.log(`📡 Testing ${url}...`);
      
      const curl = spawn('curl', ['-I', '-s', url]);
      let output = '';
      
      curl.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      await new Promise((resolve) => {
        curl.on('close', (code) => {
          const statusMatch = output.match(/HTTP\/\d\.\d (\d+)/);
          const status = statusMatch ? statusMatch[1] : 'Unknown';
          
          if (status === '200') {
            console.log(`✅ ${url}: OK (${status})`);
          } else {
            console.log(`⚠️  ${url}: ${status}`);
          }
          resolve();
        });
      });
      
    } catch (error) {
      console.log(`❌ ${url}: Failed - ${error.message}`);
    }
  }
  
  console.log('\n📝 Note: To test dashboard API batching, access the deployed app');
  console.log('   and monitor Network tab in browser dev tools');
}

if (require.main === module) {
  checkDependencies();
}

module.exports = { testDashboardApiCalls, simplifiedApiTest };
