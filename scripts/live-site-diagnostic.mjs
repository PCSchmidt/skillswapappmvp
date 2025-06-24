#!/usr/bin/env node

/**
 * Live Site Diagnostic Tool
 * 
 * Identifies issues with the deployed SkillSwap application
 */

console.log('🔍 SkillSwap Live Site Diagnostic');
console.log('==================================\n');

const siteUrl = 'https://skillswapappmvp.vercel.app';

const testCases = [
  {
    name: 'Landing Page',
    url: `${siteUrl}`,
    expectedContent: ['Trade Skills', 'Join SkillSwap', 'How It Works']
  },
  {
    name: 'Signup Page',
    url: `${siteUrl}/signup`,
    expectedContent: ['Create Account', 'Full Name', 'Email', 'Password']
  },
  {
    name: 'Login Page',
    url: `${siteUrl}/login`,
    expectedContent: ['Sign In', 'Email', 'Password']
  },
  {
    name: 'My Skills Page (unauthenticated)',
    url: `${siteUrl}/skills/my-skills`,
    expectedContent: ['Sign In', 'redirect', 'authentication']
  },
  {
    name: 'Skills API Endpoint',
    url: `${siteUrl}/api/skills`,
    expectedContent: ['skills', 'json']
  },
  {
    name: 'User Skills API Endpoint',
    url: `${siteUrl}/api/user-skills`,
    expectedContent: ['error', 'authentication', 'required']
  }
];

const potentialIssues = [
  {
    category: 'Environment Variables',
    issues: [
      'NEXT_PUBLIC_SUPABASE_URL not set correctly',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY not set correctly',
      'SUPABASE_SERVICE_ROLE_KEY missing in Vercel environment',
      'Environment variables not matching between local and production'
    ]
  },
  {
    category: 'Database Access',
    issues: [
      'Supabase database not accessible from Vercel deployment',
      'Row Level Security (RLS) blocking requests',
      'Missing database tables (user_skills, trade_proposals)',
      'API routes failing due to authentication issues'
    ]
  },
  {
    category: 'Build/Deployment Issues',
    issues: [
      'Latest code not deployed to Vercel',
      'Build errors during deployment',
      'Missing dependencies in production',
      'TypeScript compilation errors'
    ]
  },
  {
    category: 'Authentication Issues',
    issues: [
      'Supabase Auth not configured correctly',
      'Callback URLs not matching production domain',
      'Session management failing',
      'Protected routes not working'
    ]
  },
  {
    category: 'API Issues',
    issues: [
      'Skills API returning empty results',
      'User Skills API failing authentication',
      'CORS issues with API calls',
      'Database connection timeouts'
    ]
  }
];

console.log('📋 Common Issues to Check:');
console.log('=========================\n');

potentialIssues.forEach((category, index) => {
  console.log(`${index + 1}. ${category.category}:`);
  category.issues.forEach(issue => {
    console.log(`   ❓ ${issue}`);
  });
  console.log('');
});

console.log('🧪 Manual Testing Steps:');
console.log('========================\n');

testCases.forEach((test, index) => {
  console.log(`${index + 1}. Test ${test.name}:`);
  console.log(`   URL: ${test.url}`);
  console.log(`   Expected: ${test.expectedContent.join(', ')}`);
  console.log('');
});

console.log('🔧 Quick Fixes to Try:');
console.log('======================\n');

const quickFixes = [
  {
    fix: 'Redeploy with Latest Code',
    steps: [
      'Verify git push completed successfully',
      'Check Vercel deployment dashboard',
      'Trigger manual redeploy if needed'
    ]
  },
  {
    fix: 'Environment Variables Check',
    steps: [
      'Go to Vercel project settings',
      'Check Environment Variables section',
      'Ensure all Supabase keys are set correctly',
      'Redeploy after updating env vars'
    ]
  },
  {
    fix: 'Database Connection Test',
    steps: [
      'Test API endpoints directly: /api/skills',
      'Check browser console for errors',
      'Verify Supabase dashboard shows activity'
    ]
  },
  {
    fix: 'Authentication Flow Test',
    steps: [
      'Try to register new account',
      'Check email verification works',
      'Test login with existing account',
      'Verify redirect to My Skills page'
    ]
  }
];

quickFixes.forEach((fix, index) => {
  console.log(`${index + 1}. ${fix.fix}:`);
  fix.steps.forEach(step => {
    console.log(`   • ${step}`);
  });
  console.log('');
});

console.log('📞 Debug Information to Collect:');
console.log('=================================\n');

const debugInfo = [
  'Browser console errors on each page',
  'Network tab showing failed API requests',
  'Vercel deployment logs',
  'Supabase logs showing database activity',
  'Specific error messages when testing functionality'
];

debugInfo.forEach((info, index) => {
  console.log(`${index + 1}. ${info}`);
});

console.log('\n🎯 Priority Testing Order:');
console.log('==========================\n');

const priorities = [
  'Test landing page loads completely',
  'Test signup form functionality',
  'Test login functionality', 
  'Test API endpoints return data',
  'Test My Skills page (after auth)',
  'Test skills CRUD operations'
];

priorities.forEach((priority, index) => {
  console.log(`${index + 1}. ${priority}`);
});

console.log('\n📋 Please share the specific errors you\'re encountering!');
console.log('========================================================\n');

export {};
