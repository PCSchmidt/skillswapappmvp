#!/bin/bash

# Supabase CLI Diagnostic Script for Password Reset URL Issue
# This script helps diagnose and fix the localhost URL problem

echo "🔧 Supabase CLI Diagnostic Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 Step 1: Check Supabase CLI availability"
if npx supabase --version > /dev/null 2>&1; then
    echo "✅ Supabase CLI is available via npx"
    echo "Version: $(npx supabase --version)"
else
    echo "❌ Supabase CLI not available"
    echo "Please install it first: npm install -g supabase@latest"
    exit 1
fi

echo ""
echo "📋 Step 2: Authentication Check"
echo "You need to login to Supabase first if you haven't already:"
echo "Run: npx supabase login"
echo ""

read -p "Have you logged in to Supabase CLI? (y/n): " logged_in
if [ "$logged_in" != "y" ]; then
    echo "Please run: npx supabase login"
    echo "Then come back and run this script again"
    exit 1
fi

echo ""
echo "📋 Step 3: Project Linking"
echo "To link your project, you need your project reference ID"
echo "You can find it in your Supabase dashboard URL or project settings"
echo ""

read -p "Enter your Supabase project reference ID (or press Enter to skip): " project_ref

if [ -n "$project_ref" ]; then
    echo "Linking to project: $project_ref"
    npx supabase link --project-ref "$project_ref"
    
    echo ""
    echo "📋 Step 4: Diagnostic Information"
    echo "Getting current project configuration..."
    
    echo ""
    echo "🔍 Project List:"
    npx supabase projects list
    
    echo ""
    echo "🔍 Auth Configuration:"
    npx supabase auth config 2>/dev/null || echo "Auth config command not available in this CLI version"
    
    echo ""
    echo "🔍 Dumping current auth configuration to file..."
    npx supabase auth dump --file auth-diagnostic.sql 2>/dev/null || echo "Auth dump command not available"
    
    if [ -f "auth-diagnostic.sql" ]; then
        echo "✅ Auth configuration exported to auth-diagnostic.sql"
        echo "🔍 Checking for localhost references..."
        if grep -i "localhost\|127.0.0.1" auth-diagnostic.sql; then
            echo "❌ Found localhost references in auth configuration!"
        else
            echo "✅ No obvious localhost references found in auth dump"
        fi
    fi
    
    echo ""
    echo "📋 Step 5: Recommended Actions"
    echo "1. Check the Supabase dashboard manually:"
    echo "   - Go to Authentication > Email Templates"
    echo "   - Check 'Reset Password' template for localhost URLs"
    echo "   - Go to Settings > General"
    echo "   - Verify Site URL is set to: https://skillswapappmvp.vercel.app"
    echo ""
    echo "2. Update Site URL via CLI (if needed):"
    echo "   npx supabase projects update --site-url https://skillswapappmvp.vercel.app"
    echo ""
    echo "3. After making changes, test with a fresh email address"
    
else
    echo "Skipping project-specific diagnostics"
    echo ""
    echo "📋 Manual Steps:"
    echo "1. Login: npx supabase login"
    echo "2. Find your project ref ID in Supabase dashboard"
    echo "3. Link project: npx supabase link --project-ref YOUR_PROJECT_REF"
    echo "4. Run this script again for full diagnostics"
fi

echo ""
echo "🎯 Key Things to Check in Supabase Dashboard:"
echo "- Authentication > Email Templates > Reset Password template"
echo "- Settings > General > Site URL setting"
echo "- Look for any hardcoded localhost:3000 URLs"
echo ""
echo "✅ Expected configuration:"
echo "- Site URL: https://skillswapappmvp.vercel.app"
echo "- Email templates using {{ .RedirectTo }} or production URLs"
