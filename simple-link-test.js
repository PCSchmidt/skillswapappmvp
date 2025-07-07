#!/usr/bin/env node

/**
 * Simple Critical Link Test
 */

const https = require('https');

async function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', (error) => resolve({ error: error.message }));
    req.setTimeout(5000, () => {
      req.abort();
      resolve({ error: 'timeout' });
    });
  });
}

async function main() {
  console.log('🔗 Testing Critical Hyperlinks');
  console.log('===============================');
  
  const tests = [
    { name: 'Home', url: 'https://skillswapappmvp.vercel.app/' },
    { name: 'Signup', url: 'https://skillswapappmvp.vercel.app/signup' },
    { name: 'Login', url: 'https://skillswapappmvp.vercel.app/login' },
    { name: 'Forgot Password', url: 'https://skillswapappmvp.vercel.app/auth/forgot-password' },
    { name: 'Dashboard', url: 'https://skillswapappmvp.vercel.app/dashboard' },
    { name: 'Profile', url: 'https://skillswapappmvp.vercel.app/profile' }
  ];
  
  for (const test of tests) {
    console.log(`\n🧪 Testing ${test.name}: ${test.url}`);
    const result = await testUrl(test.url);
    
    if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
    } else {
      console.log(`✅ Status: ${result.status}`);
      
      if (test.name === 'Login' && result.body) {
        const hasForgotPassword = result.body.includes('/auth/forgot-password');
        console.log(`   🔗 Forgot password link: ${hasForgotPassword ? '✅ Found' : '❌ Missing'}`);
        
        const hasSignupLink = result.body.includes('/signup');
        console.log(`   🔗 Signup link: ${hasSignupLink ? '✅ Found' : '❌ Missing'}`);
      }
      
      if (test.name === 'Signup' && result.body) {
        const hasLoginLink = result.body.includes('/login');
        console.log(`   🔗 Login link: ${hasLoginLink ? '✅ Found' : '❌ Missing'}`);
      }
      
      if (test.name === 'Forgot Password' && result.body) {
        const hasBackToLogin = result.body.toLowerCase().includes('back') || result.body.includes('/login');
        console.log(`   🔗 Back to login: ${hasBackToLogin ? '✅ Found' : '❌ Missing'}`);
      }
    }
  }
  
  console.log('\n🎯 Critical Navigation Test Complete');
}

main().catch(console.error);
