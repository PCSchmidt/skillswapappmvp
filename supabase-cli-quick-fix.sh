#!/bin/bash

# Quick Supabase CLI Fix for Password Reset URL Issue
# This script provides the exact commands to diagnose and fix the localhost URL problem

echo "🔧 Supabase CLI Quick Fix Guide"
echo "==============================="
echo ""

echo "✅ Prerequisites:"
echo "1. You need your Supabase project reference ID"
echo "2. You need admin access to the Supabase project"
echo "3. Supabase CLI is available (✅ confirmed via npx)"
echo ""

echo "📋 Step-by-Step Commands:"
echo ""

echo "1️⃣ Login to Supabase (if not already logged in):"
echo "   npx supabase login"
echo ""

echo "2️⃣ Find your project reference ID:"
echo "   npx supabase projects list"
echo "   (Look for your project in the list and note the ID)"
echo ""

echo "3️⃣ Link to your project:"
echo "   npx supabase link --project-ref YOUR_PROJECT_REF_ID"
echo ""

echo "4️⃣ Check current project configuration:"
echo "   npx supabase projects list"
echo ""

echo "5️⃣ The CLI may not have direct auth template management, so use the dashboard:"
echo "   🌐 Manual Dashboard Steps (Most Reliable):"
echo "   a) Go to https://supabase.com/dashboard"
echo "   b) Select your project"
echo "   c) Go to Authentication > Email Templates"
echo "   d) Click on 'Reset Password' template"
echo "   e) Look for any localhost:3000 URLs and replace with:"
echo "      https://skillswapappmvp.vercel.app"
echo "   f) Go to Settings > General"
echo "   g) Update 'Site URL' to: https://skillswapappmvp.vercel.app"
echo ""

echo "6️⃣ Verify the fix:"
echo "   a) Test password reset with a fresh email"
echo "   b) Check that email links use production domain"
echo ""

echo "🎯 Key Configuration Checks:"
echo ""
echo "In Supabase Dashboard:"
echo "✅ Site URL: https://skillswapappmvp.vercel.app"
echo "✅ Email templates use production URLs or {{ .RedirectTo }} variables"
echo "✅ No localhost:3000 references anywhere"
echo ""

echo "🔍 Common Issues:"
echo "- Email templates hardcoded with localhost during development"
echo "- Site URL still set to localhost:3000"
echo "- Browser/email cache showing old URLs"
echo ""

echo "📞 Need Help?"
echo "Run the full diagnostic: ./diagnose-supabase-config.bat"
echo "Or check: PASSWORD_RESET_URL_INVESTIGATION.md"
