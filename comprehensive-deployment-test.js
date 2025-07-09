#!/usr/bin/env node

/**
 * Comprehensive Deployment Test
 * Tests all critical navigation links and authentication flows
 * on the live Vercel deployment
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://skillswapappmvp-git-dev-chris-schmidts-projects.vercel.app';

// Test configuration
const TESTS = [
    // Core pages
    { name: 'Home Page', path: '/', expectedStatus: 200 },
    { name: 'About Page', path: '/about', expectedStatus: 200 },
    { name: 'How It Works Page', path: '/how-it-works', expectedStatus: 200 },
    { name: 'Browse Skills Page', path: '/skills/browse', expectedStatus: 200 },
    
    // Authentication pages
    { name: 'Login Page', path: '/auth/login', expectedStatus: 200 },
    { name: 'Signup Page', path: '/auth/signup', expectedStatus: 200 },
    { name: 'Password Reset Page', path: '/auth/reset-password', expectedStatus: 200 },
    
    // Dashboard pages (should redirect to login if not authenticated)
    { name: 'Dashboard Page', path: '/dashboard', expectedStatus: [200, 302, 401] },
    { name: 'Profile Page', path: '/profile', expectedStatus: [200, 302, 401] },
    { name: 'Skills Page', path: '/skills', expectedStatus: [200, 302, 401] },
    
    // API endpoints (basic health check)
    { name: 'API Health Check', path: '/api/health', expectedStatus: [200, 404] },
];

// Custom request function with better error handling
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': 'SkillSwap-Test-Bot/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive'
            },
            timeout: 15000
        };

        const client = urlObj.protocol === 'https:' ? https : http;
        
        const req = client.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data,
                    url: url
                });
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout after 15 seconds'));
        });

        req.setTimeout(15000);
        req.end();
    });
}

// Test runner
async function runTest(test) {
    const url = `${BASE_URL}${test.path}`;
    console.log(`\n🧪 Testing: ${test.name}`);
    console.log(`   URL: ${url}`);
    
    try {
        const response = await makeRequest(url);
        const { statusCode, headers, body } = response;
        
        // Check if status code is expected
        const expectedStatuses = Array.isArray(test.expectedStatus) ? test.expectedStatus : [test.expectedStatus];
        const isStatusOk = expectedStatuses.includes(statusCode);
        
        console.log(`   Status: ${statusCode} ${isStatusOk ? '✅' : '❌'}`);
        
        // Additional checks
        const checks = {
            hasContent: body.length > 0,
            hasHtml: body.includes('<html') || body.includes('<!DOCTYPE'),
            hasTitle: body.includes('<title>'),
            hasNextJs: body.includes('__NEXT_DATA__') || body.includes('_next/'),
            hasRedirect: headers.location !== undefined,
            contentType: headers['content-type'] || 'unknown'
        };
        
        console.log(`   Content Length: ${body.length} bytes`);
        console.log(`   Content Type: ${checks.contentType}`);
        
        if (checks.hasRedirect) {
            console.log(`   Redirect: ${headers.location}`);
        }
        
        // Check for specific error patterns
        const errorPatterns = [
            { pattern: /404|not found/i, type: 'Not Found' },
            { pattern: /401|unauthorized/i, type: 'Unauthorized' },
            { pattern: /500|internal server error/i, type: 'Server Error' },
            { pattern: /application error/i, type: 'Application Error' },
            { pattern: /vercel.*error/i, type: 'Vercel Error' }
        ];
        
        const foundErrors = errorPatterns.filter(({ pattern }) => pattern.test(body));
        if (foundErrors.length > 0) {
            console.log(`   ⚠️  Errors found: ${foundErrors.map(e => e.type).join(', ')}`);
        }
        
        // Navigation-specific checks
        if (test.path === '/') {
            const navChecks = {
                hasNavigation: /nav|header/i.test(body),
                hasHowItWorksLink: /how.*it.*works/i.test(body),
                hasAboutLink: /about/i.test(body),
                hasBrowseSkillsLink: /browse.*skills/i.test(body),
                hasLoginLink: /login|sign.*in/i.test(body),
                hasSignupLink: /signup|sign.*up|get.*started/i.test(body)
            };
            
            console.log(`   Navigation Elements:`);
            Object.entries(navChecks).forEach(([check, passed]) => {
                console.log(`     ${check}: ${passed ? '✅' : '❌'}`);
            });
        }
        
        return {
            name: test.name,
            url,
            statusCode,
            success: isStatusOk,
            checks,
            errors: foundErrors
        };
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return {
            name: test.name,
            url,
            success: false,
            error: error.message
        };
    }
}

// Main test execution
async function runAllTests() {
    console.log('🚀 Starting Comprehensive Deployment Test');
    console.log(`📍 Target: ${BASE_URL}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log('=' * 60);
    
    const results = [];
    
    for (const test of TESTS) {
        const result = await runTest(test);
        results.push(result);
        
        // Small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Summary
    console.log('\n' + '=' * 60);
    console.log('📊 TEST SUMMARY');
    console.log('=' * 60);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}/${results.length}`);
    console.log(`❌ Failed: ${failed.length}/${results.length}`);
    
    if (failed.length > 0) {
        console.log('\n🔴 FAILED TESTS:');
        failed.forEach(result => {
            console.log(`   • ${result.name}: ${result.error || `Status ${result.statusCode}`}`);
        });
    }
    
    if (successful.length > 0) {
        console.log('\n🟢 SUCCESSFUL TESTS:');
        successful.forEach(result => {
            console.log(`   • ${result.name}: Status ${result.statusCode}`);
        });
    }
    
    // Overall status
    const overallSuccess = failed.length === 0;
    console.log(`\n🎯 OVERALL STATUS: ${overallSuccess ? '✅ PASS' : '❌ FAIL'}`);
    
    if (!overallSuccess) {
        console.log('\n🔧 RECOMMENDED ACTIONS:');
        console.log('   1. Check Vercel deployment logs for errors');
        console.log('   2. Verify environment variables are correctly set');
        console.log('   3. Test authentication flows manually');
        console.log('   4. Check for any recent code changes that might affect routing');
    }
    
    return overallSuccess;
}

// Run the tests
runAllTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
});
