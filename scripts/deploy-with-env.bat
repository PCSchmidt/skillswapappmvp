@echo off
REM Script to ensure Vercel has the correct environment variables
REM and deploy with proper configuration

echo 🔧 Setting up Vercel environment variables...

REM Check if vercel CLI is available
where vercel >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

echo 🌍 Setting production environment variables...

REM Set the essential Supabase environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo ✅ Environment variables configured!
echo 🚀 Deploying to production...

REM Deploy to production
vercel --prod

echo 🎉 Deployment complete!
echo 🔍 Check console errors at: https://skillswap-mvp.vercel.app
