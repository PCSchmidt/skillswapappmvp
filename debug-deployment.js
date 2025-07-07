#!/usr/bin/env node

/**
 * Debug script to see what content is actually being returned
 */

const https = require('https');

const BASE_URL = 'https://skillswapappmvp.vercel.app';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
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

async function debugPages() {
  const pages = ['/', '/signup', '/login', '/auth/forgot-password', '/dashboard'];
  
  for (const page of pages) {
    console.log(`\n=== Testing ${BASE_URL}${page} ===`);
    
    try {
      const response = await makeRequest(`${BASE_URL}${page}`);
      console.log(`Status: ${response.statusCode}`);
      console.log(`Content-Length: ${response.body.length}`);
      
      // Show first 500 characters to see what we're getting
      console.log('Content preview:');
      console.log(response.body.substring(0, 500));
      
      // Check for common patterns
      const hasHtml = response.body.includes('<html');
      const hasReact = response.body.includes('react');
      const hasNext = response.body.includes('next');
      const hasSkillSwap = response.body.toLowerCase().includes('skillswap');
      
      console.log(`Contains HTML: ${hasHtml}`);
      console.log(`Contains React: ${hasReact}`);
      console.log(`Contains Next: ${hasNext}`);
      console.log(`Contains SkillSwap: ${hasSkillSwap}`);
      
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

debugPages().catch(console.error);
