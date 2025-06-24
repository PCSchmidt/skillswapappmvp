#!/usr/bin/env node

/**
 * Route Testing Script
 * Tests all application routes to identify 404 errors
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

const routes = [
  '/',
  '/discover',
  '/how-it-works', 
  '/about',
  '/login',
  '/signup',
  '/dashboard',
  '/skills/my-skills',
  '/skills/browse',
  '/skills/new',
  '/skills/manage',
  '/profile',
  '/profile/edit',
  '/messages',
  '/trades',
  '/matches',
  '/notifications',
  '/search',
  '/settings/email-preferences',
  '/auth/verify',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/complete-profile',
  '/auth/resend-verification',
  '/maintenance',
  '/sentry-example-page',
];

const testRoute = async (route) => {
  try {
    console.log(`Testing ${route}...`);
    const response = await fetch(`${BASE_URL}${route}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Route-Tester/1.0'
      }
    });
    
    const status = response.status;
    const statusText = response.statusText;
    
    if (status === 404) {
      console.log(`❌ ${route} - 404 NOT FOUND`);
      return { route, status, success: false };
    } else if (status >= 200 && status < 400) {
      console.log(`✅ ${route} - ${status} ${statusText}`);
      return { route, status, success: true };
    } else {
      console.log(`⚠️  ${route} - ${status} ${statusText}`);
      return { route, status, success: false };
    }
  } catch (error) {
    console.log(`❌ ${route} - ERROR: ${error.message}`);
    return { route, status: 'ERROR', success: false, error: error.message };
  }
};

const main = async () => {
  console.log('🚀 Testing SkillSwap routes...\n');
  
  const results = [];
  
  for (const route of routes) {
    const result = await testRoute(route);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  }
  
  console.log('\n📊 Summary:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${routes.length}`);
  console.log(`❌ Failed: ${failed.length}/${routes.length}`);
  
  if (failed.length > 0) {
    console.log('\n💥 Failed Routes:');
    failed.forEach(r => {
      console.log(`  - ${r.route} (${r.status}${r.error ? ': ' + r.error : ''})`);
    });
  }
  
  console.log('\n✨ Route testing completed!');
};

main().catch(console.error);
