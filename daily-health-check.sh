#!/bin/bash
# Daily Deployment Health Monitor
# Run this script each morning to verify platform health

echo "🏥 SKILLSWAP DAILY HEALTH CHECK - $(date)"
echo "============================================"

# 1. Production URL Health Check
echo "📡 Testing Production Endpoints..."
node verify-production-security.js

echo ""
echo "🔧 Local Build Health..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Local build: PASSING"
else
    echo "❌ Local build: FAILING"
fi

echo ""
echo "📦 Repository Status..."
git status --porcelain | wc -l | xargs echo "📝 Uncommitted changes:"
git log --oneline -n 3 | head -n 3
echo "🌿 Current branch: $(git branch --show-current)"

echo ""
echo "🎯 Key Monitoring Points:"
echo "- Password security flows active"
echo "- User signup/login working"  
echo "- No critical JavaScript errors"
echo "- Performance under 2 seconds"

echo ""
echo "📊 Next Steps:"
echo "1. Check Vercel dashboard for errors"
echo "2. Review user feedback from testing"
echo "3. Monitor forced password reset usage"
echo ""
