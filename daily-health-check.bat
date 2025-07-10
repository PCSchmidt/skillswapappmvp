@echo off
REM Daily Deployment Health Monitor for Windows
REM Run this script each morning to verify platform health

echo 🏥 SKILLSWAP DAILY HEALTH CHECK - %date% %time%
echo ============================================

REM 1. Production URL Health Check
echo 📡 Testing Production Endpoints...
node verify-production-security.js

echo.
echo 🔧 Local Build Health...
npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Local build: PASSING
) else (
    echo ❌ Local build: FAILING
)

echo.
echo 📦 Repository Status...
for /f %%i in ('git status --porcelain ^| find /c /v ""') do echo 📝 Uncommitted changes: %%i
echo 🔄 Recent commits:
git log --oneline -n 3
echo 🌿 Current branch:
git branch --show-current

echo.
echo 🎯 Key Monitoring Points:
echo - Password security flows active
echo - User signup/login working  
echo - No critical JavaScript errors
echo - Performance under 2 seconds

echo.
echo 📊 Next Steps:
echo 1. Check Vercel dashboard for errors
echo 2. Review user feedback from testing
echo 3. Monitor forced password reset usage
echo.
