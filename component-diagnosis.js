/**
 * Component Diagnosis Script
 * Tests individual problematic components for console errors and re-render issues
 */

const puppeteer = require('puppeteer');

const DEPLOYMENT_URL = 'https://skillswapappmvp-chris-schmidts-projects.vercel.app';

const PROBLEM_PAGES = [
  { name: 'Signup Form', url: `${DEPLOYMENT_URL}/signup`, issue: 'Application Error' },
  { name: 'Profile Edit', url: `${DEPLOYMENT_URL}/profile/edit`, issue: 'Page Shaking' },
  { name: 'My Skills', url: `${DEPLOYMENT_URL}/skills/my-skills`, issue: 'Page Shaking' },
  { name: 'Discovery', url: `${DEPLOYMENT_URL}/discovery`, issue: 'Non-functional buttons' },
  { name: 'Home Page', url: `${DEPLOYMENT_URL}/`, issue: 'Missing navigation' }
];

async function diagnoseComponent(page, testCase) {
  console.log(`\n🔍 Diagnosing: ${testCase.name}`);
  console.log(`   URL: ${testCase.url}`);
  console.log(`   Expected Issue: ${testCase.issue}`);
  
  const errors = [];
  const warnings = [];
  const rerenders = [];
  
  // Capture console messages
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      errors.push(text);
    } else if (type === 'warning') {
      warnings.push(text);
    } else if (text.includes('re-rendered') || text.includes('useEffect')) {
      rerenders.push(text);
    }
  });
  
  // Capture page errors
  page.on('pageerror', (error) => {
    errors.push(`Page Error: ${error.message}`);
  });
  
  try {
    const response = await page.goto(testCase.url, { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    console.log(`   Status: ${response.status()}`);
    
    // Wait for potential hydration issues
    await page.waitForTimeout(3000);
    
    // Check for specific error indicators
    const hasApplicationError = await page.$eval('body', (body) => {
      return body.textContent.includes('Application error') || 
             body.textContent.includes('client-side exception');
    }).catch(() => false);
    
    // Check for rapid DOM changes (shaking indicator)
    let domChangeCount = 0;
    const observer = await page.evaluateHandle(() => {
      let changeCount = 0;
      const observer = new MutationObserver((mutations) => {
        changeCount += mutations.length;
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
      
      // Count changes for 2 seconds
      setTimeout(() => {
        window.changeCount = changeCount;
      }, 2000);
      
      return observer;
    });
    
    await page.waitForTimeout(2500);
    domChangeCount = await page.evaluate(() => window.changeCount || 0);
    
    console.log(`   DOM Changes (2s): ${domChangeCount}`);
    console.log(`   Has Application Error: ${hasApplicationError}`);
    console.log(`   Console Errors: ${errors.length}`);
    console.log(`   Console Warnings: ${warnings.length}`);
    
    if (errors.length > 0) {
      console.log(`   🚨 Errors Found:`);
      errors.forEach(error => console.log(`      - ${error}`));
    }
    
    if (domChangeCount > 50) {
      console.log(`   🔄 High DOM Change Rate - Likely Re-render Loop`);
    }
    
    return {
      url: testCase.url,
      name: testCase.name,
      status: response.status(),
      hasApplicationError,
      domChangeCount,
      errors,
      warnings,
      isShaking: domChangeCount > 50,
      isHealthy: response.status() === 200 && !hasApplicationError && domChangeCount < 50
    };
    
  } catch (error) {
    console.log(`   ❌ Navigation Error: ${error.message}`);
    return {
      url: testCase.url,
      name: testCase.name,
      error: error.message,
      isHealthy: false
    };
  }
}

async function runComponentDiagnosis() {
  console.log('🔍 COMPONENT DIAGNOSIS STARTING...\n');
  console.log('Analyzing problematic components for specific issues...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    const results = [];
    
    for (const testCase of PROBLEM_PAGES) {
      const result = await diagnoseComponent(page, testCase);
      results.push(result);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPONENT DIAGNOSIS SUMMARY');
    console.log('='.repeat(80));
    
    let healthyComponents = 0;
    let shakingComponents = 0;
    let errorComponents = 0;
    
    results.forEach(result => {
      if (result.isHealthy) {
        console.log(`✅ ${result.name}: HEALTHY`);
        healthyComponents++;
      } else if (result.isShaking) {
        console.log(`🔄 ${result.name}: SHAKING (${result.domChangeCount} DOM changes)`);
        shakingComponents++;
      } else if (result.hasApplicationError || result.errors?.length > 0) {
        console.log(`❌ ${result.name}: ERROR`);
        errorComponents++;
      } else {
        console.log(`⚠️ ${result.name}: UNKNOWN ISSUE`);
      }
    });
    
    console.log(`\n📈 Health Status:`);
    console.log(`   ✅ Healthy: ${healthyComponents}/${results.length}`);
    console.log(`   🔄 Shaking: ${shakingComponents}/${results.length}`);
    console.log(`   ❌ Errors: ${errorComponents}/${results.length}`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Export for use in testing
if (require.main === module) {
  runComponentDiagnosis()
    .then((results) => {
      console.log('\n✨ Component diagnosis completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Component diagnosis failed:', error);
      process.exit(1);
    });
}

module.exports = { runComponentDiagnosis };
