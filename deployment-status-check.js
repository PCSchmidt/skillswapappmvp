const https = require('https');
const http = require('http');

// Test URLs for the SkillSwap MVP deployment
const baseUrl = process.argv[2] || 'https://skillswapappmvp-chris-schmidts-projects.vercel.app';
const testUrls = [
    baseUrl,
    baseUrl + '/how-it-works',
    baseUrl + '/about',
    baseUrl + '/discovery',
    baseUrl + '/signup',
    baseUrl + '/auth/login',
    baseUrl + '/skills/browse',
    baseUrl + '/dashboard'
];

async function testUrl(url) {
    return new Promise((resolve) => {
        const protocol = url.startsWith('https:') ? https : http;
        
        const req = protocol.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const result = {
                    url: url,
                    status: res.statusCode,
                    headers: res.headers,
                    hasContent: data.length > 0,
                    contentLength: data.length,
                    hasNextJs: data.includes('__NEXT_DATA__'),
                    hasTitle: /<title[^>]*>([^<]+)<\/title>/i.test(data),
                    title: (data.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1],
                    hasErrors: data.includes('error') || data.includes('Error') || data.includes('401') || data.includes('404'),
                    timestamp: new Date().toISOString()
                };
                resolve(result);
            });
        });
        
        req.on('error', (error) => {
            resolve({
                url: url,
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            resolve({
                url: url,
                status: 'TIMEOUT',
                error: 'Request timeout after 10 seconds',
                timestamp: new Date().toISOString()
            });
        });
    });
}

async function runTests() {
    console.log('🔍 Testing SkillSwap MVP Deployment Status...\n');
    console.log('Target URLs:');
    testUrls.forEach(url => console.log(`  - ${url}`));
    console.log('\n' + '='.repeat(80) + '\n');
    
    const results = [];
    
    for (const url of testUrls) {
        console.log(`Testing: ${url}`);
        const result = await testUrl(url);
        results.push(result);
        
        if (result.status === 'ERROR' || result.status === 'TIMEOUT') {
            console.log(`❌ ${result.status}: ${result.error}`);
        } else {
            const statusIcon = result.status === 200 ? '✅' : result.status === 401 ? '🔒' : result.status === 404 ? '❌' : '⚠️';
            console.log(`${statusIcon} Status: ${result.status}`);
            if (result.title) {
                console.log(`   Title: ${result.title}`);
            }
            console.log(`   Content: ${result.contentLength} bytes, Next.js: ${result.hasNextJs ? 'Yes' : 'No'}`);
            if (result.hasErrors) {
                console.log(`   ⚠️  May contain errors in content`);
            }
        }
        console.log('');
    }
    
    // Summary
    console.log('='.repeat(80));
    console.log('📊 DEPLOYMENT STATUS SUMMARY');
    console.log('='.repeat(80));
    
    const successfulRequests = results.filter(r => r.status === 200).length;
    const authErrors = results.filter(r => r.status === 401).length;
    const notFoundErrors = results.filter(r => r.status === 404).length;
    const otherErrors = results.filter(r => r.status !== 200 && r.status !== 401 && r.status !== 404 && r.status !== 'ERROR' && r.status !== 'TIMEOUT').length;
    const networkErrors = results.filter(r => r.status === 'ERROR' || r.status === 'TIMEOUT').length;
    
    console.log(`✅ Successful (200): ${successfulRequests}/${testUrls.length}`);
    console.log(`🔒 Auth errors (401): ${authErrors}/${testUrls.length}`);
    console.log(`❌ Not found (404): ${notFoundErrors}/${testUrls.length}`);
    console.log(`⚠️  Other HTTP errors: ${otherErrors}/${testUrls.length}`);
    console.log(`🚫 Network errors: ${networkErrors}/${testUrls.length}`);
    
    const deploymentHealthy = successfulRequests >= testUrls.length * 0.6; // 60% success rate
    console.log(`\n🏥 Deployment Health: ${deploymentHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
    
    if (authErrors > 0) {
        console.log('\n🔐 AUTH ISSUE DETECTED:');
        console.log('   This suggests environment variables or Supabase configuration may be missing.');
        console.log('   Check Vercel environment variables and Supabase keys.');
    }
    
    if (notFoundErrors > 0) {
        console.log('\n🗂️  ROUTING ISSUE DETECTED:');
        console.log('   Some pages may not be properly configured or built.');
    }
    
    return results;
}

runTests().then((results) => {
    console.log('\n✨ Test completed at:', new Date().toISOString());
}).catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
