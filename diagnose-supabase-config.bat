@echo off
REM Supabase CLI Diagnostic Script for Password Reset URL Issue (Windows)
REM This script helps diagnose and fix the localhost URL problem

echo.
echo 🔧 Supabase CLI Diagnostic Script
echo ==================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

echo 📋 Step 1: Check Supabase CLI availability
npx supabase --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Supabase CLI is available via npx
    for /f "tokens=*" %%i in ('npx supabase --version') do echo Version: %%i
) else (
    echo ❌ Supabase CLI not available
    echo Please install Node.js and try: npm install -g supabase@latest
    pause
    exit /b 1
)

echo.
echo 📋 Step 2: Authentication Check
echo You need to login to Supabase first if you haven't already:
echo Run: npx supabase login
echo.

set /p logged_in="Have you logged in to Supabase CLI? (y/n): "
if /i not "%logged_in%"=="y" (
    echo Please run: npx supabase login
    echo Then come back and run this script again
    pause
    exit /b 1
)

echo.
echo 📋 Step 3: Project Linking
echo To link your project, you need your project reference ID
echo You can find it in your Supabase dashboard URL or project settings
echo.

set /p project_ref="Enter your Supabase project reference ID (or press Enter to skip): "

if not "%project_ref%"=="" (
    echo Linking to project: %project_ref%
    npx supabase link --project-ref "%project_ref%"
    
    echo.
    echo 📋 Step 4: Diagnostic Information
    echo Getting current project configuration...
    
    echo.
    echo 🔍 Project List:
    npx supabase projects list
    
    echo.
    echo 🔍 Auth Configuration:
    npx supabase auth config 2>nul || echo Auth config command not available in this CLI version
    
    echo.
    echo 🔍 Dumping current auth configuration to file...
    npx supabase auth dump --file auth-diagnostic.sql 2>nul || echo Auth dump command not available
    
    if exist "auth-diagnostic.sql" (
        echo ✅ Auth configuration exported to auth-diagnostic.sql
        echo 🔍 Checking for localhost references...
        findstr /i "localhost 127.0.0.1" auth-diagnostic.sql >nul 2>&1
        if %errorlevel% equ 0 (
            echo ❌ Found localhost references in auth configuration!
        ) else (
            echo ✅ No obvious localhost references found in auth dump
        )
    )
    
    echo.
    echo 📋 Step 5: Recommended Actions
    echo 1. Check the Supabase dashboard manually:
    echo    - Go to Authentication ^> Email Templates
    echo    - Check 'Reset Password' template for localhost URLs
    echo    - Go to Settings ^> General
    echo    - Verify Site URL is set to: https://skillswapappmvp.vercel.app
    echo.
    echo 2. Update Site URL via CLI (if needed):
    echo    npx supabase projects update --site-url https://skillswapappmvp.vercel.app
    echo.
    echo 3. After making changes, test with a fresh email address
    
) else (
    echo Skipping project-specific diagnostics
    echo.
    echo 📋 Manual Steps:
    echo 1. Login: npx supabase login
    echo 2. Find your project ref ID in Supabase dashboard
    echo 3. Link project: npx supabase link --project-ref YOUR_PROJECT_REF
    echo 4. Run this script again for full diagnostics
)

echo.
echo 🎯 Key Things to Check in Supabase Dashboard:
echo - Authentication ^> Email Templates ^> Reset Password template
echo - Settings ^> General ^> Site URL setting
echo - Look for any hardcoded localhost:3000 URLs
echo.
echo ✅ Expected configuration:
echo - Site URL: https://skillswapappmvp.vercel.app
echo - Email templates using {{ .RedirectTo }} or production URLs
echo.
pause
