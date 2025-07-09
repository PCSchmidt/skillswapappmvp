/**
 * Simple Component Diagnosis Script
 * Tests problematic pages using basic HTTP requests and analyzes response content
 */

const https = require('https');
const http = require('http');

const DEPLOYMENT_URL = 'https://skillswapappmvp-chris-schmidts-projects.vercel.app';

const PROBLEM_PAGES = [
  { name: 'Signup Form', path: '/signup', issue: 'Application Error' },
  { name: 'Profile Edit', path: '/profile/edit', issue: 'Page Shaking' },
  { name: 'My Skills', path: '/skills/my-skills', issue: 'Page Shaking' },
  { name: 'Discovery', path: '/discovery', issue: 'Non-functional buttons' },
  { name: 'Home Page', path: '/', issue: 'Missing navigation' },
  { name: 'Email Verification', path: '/auth/resend-verification', issue: 'Not sending emails' }
];

async function diagnoseComponent(page) {
  const url = `${DEPLOYMENT_URL}${page.path}`;
  
  return new Promise((resolve) => {
    console.log(`\n🔍 Diagnosing: ${page.name}`);
    console.log(`   URL: ${url}`);
    console.log(`   Expected Issue: ${page.issue}`);
    
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Analyze response content for specific issues
        const analysis = analyzePageContent(data, page);
        
        const result = {
          name: page.name,
          path: page.path,
          url: url,
          status: res.statusCode,
          contentLength: data.length,
          analysis: analysis,
          isHealthy: res.statusCode === 200 && !analysis.hasErrors,
          timestamp: new Date().toISOString()
        };
        
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Content Length: ${data.length} bytes`);
        console.log(`   Analysis: ${analysis.summary}`);
        
        resolve(result);
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`);
      resolve({
        name: page.name,
        path: page.path,
        url: url,
        error: error.message,
        isHealthy: false,
        timestamp: new Date().toISOString()
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        name: page.name,
        path: page.path,
        url: url,
        error: 'Request timeout',
        isHealthy: false,
        timestamp: new Date().toISOString()
      });
    });
  });
}

function analyzePageContent(html, page) {
  const analysis = {
    hasNextJs: html.includes('__NEXT_DATA__'),
    hasTitle: /<title[^>]*>([^<]+)<\/title>/i.test(html),
    title: (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1],
    hasErrors: false,
    errorIndicators: [],
    hasContent: html.length > 1000,
    summary: ''
  };
  
  // Check for application errors
  if (html.includes('Application error') || 
      html.includes('client-side exception') ||
      html.includes('Internal Server Error') ||
      html.includes('500') ||
      html.includes('Runtime Error')) {
    analysis.hasErrors = true;
    analysis.errorIndicators.push('Application Error Detected');
  }
  
  // Check for authentication issues
  if (html.includes('Authentication Required') || 
      html.includes('401') ||
      html.includes('Unauthorized')) {
    analysis.hasErrors = true;
    analysis.errorIndicators.push('Authentication Error');
  }
  
  // Check for missing content (potential hydration issues)
  if (html.length < 1000 && page.path !== '/') {
    analysis.hasErrors = true;
    analysis.errorIndicators.push('Minimal Content - Possible Hydration Issue');
  }
  
  // Page-specific checks
  if (page.name === 'Signup Form') {
    if (!html.includes('Sign') && !html.includes('Register') && !html.includes('Create Account')) {
      analysis.errorIndicators.push('Missing Signup Form Content');
    }
  }
  
  if (page.name === 'Profile Edit') {
    if (!html.includes('profile') && !html.includes('Profile') && !html.includes('edit')) {
      analysis.errorIndicators.push('Missing Profile Edit Content');
    }
  }
  
  if (page.name === 'My Skills') {
    if (!html.includes('skill') && !html.includes('Skill')) {
      analysis.errorIndicators.push('Missing Skills Content');
    }
  }
  
  if (page.name === 'Discovery') {
    if (!html.includes('Create Free Account') || !html.includes('Join Waitlist')) {
      analysis.errorIndicators.push('Missing Expected Buttons');
    }
  }
  
  // Generate summary
  if (analysis.errorIndicators.length === 0) {
    analysis.summary = analysis.hasNextJs ? 
      '✅ Appears healthy with Next.js hydration' : 
      '⚠️ Static content, may lack interactivity';
  } else {
    analysis.summary = `❌ Issues: ${analysis.errorIndicators.join(', ')}`;
    analysis.hasErrors = true;
  }
  
  return analysis;
}

async function runSimpleDiagnosis() {
  console.log('🔍 SIMPLE COMPONENT DIAGNOSIS STARTING...\n');
  console.log('Analyzing problematic pages for specific issues...\n');
  
  const results = [];
  
  for (const page of PROBLEM_PAGES) {
    const result = await diagnoseComponent(page);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 SIMPLE DIAGNOSIS SUMMARY');
  console.log('='.repeat(80));
  
  let healthyPages = 0;
  let errorPages = 0;
  let accessiblePages = 0;
  
  results.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.name}: Network Error - ${result.error}`);
    } else {
      accessiblePages++;
      if (result.isHealthy) {
        console.log(`✅ ${result.name}: ${result.analysis.summary}`);
        healthyPages++;
      } else {
        console.log(`⚠️ ${result.name}: ${result.analysis.summary}`);
        errorPages++;
      }
    }
  });
  
  console.log(`\n📈 Diagnosis Results:`);
  console.log(`   📡 Accessible: ${accessiblePages}/${results.length}`);
  console.log(`   ✅ Healthy: ${healthyPages}/${results.length}`);
  console.log(`   ⚠️ Issues: ${errorPages}/${results.length}`);
  console.log(`   ❌ Network Errors: ${results.length - accessiblePages}/${results.length}`);
  
  // Identify patterns
  console.log(`\n🔍 Pattern Analysis:`);
  const authErrors = results.filter(r => r.analysis?.errorIndicators?.includes('Authentication Error')).length;
  const contentErrors = results.filter(r => r.analysis?.errorIndicators?.includes('Missing Expected Content')).length;
  const hydrationErrors = results.filter(r => r.analysis?.errorIndicators?.includes('Minimal Content - Possible Hydration Issue')).length;
  
  if (authErrors > 0) console.log(`   🔒 Authentication issues: ${authErrors} pages`);
  if (contentErrors > 0) console.log(`   📄 Content missing: ${contentErrors} pages`);
  if (hydrationErrors > 0) console.log(`   ⚡ Hydration issues: ${hydrationErrors} pages`);
  
  return results;
}

// Export for use in testing
if (require.main === module) {
  runSimpleDiagnosis()
    .then((results) => {
      console.log('\n✨ Simple diagnosis completed');
      
      // Save results for further analysis
      const fs = require('fs');
      fs.writeFileSync('diagnosis-results.json', JSON.stringify(results, null, 2));
      console.log('📄 Results saved to diagnosis-results.json');
      
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Simple diagnosis failed:', error);
      process.exit(1);
    });
}

module.exports = { runSimpleDiagnosis };
