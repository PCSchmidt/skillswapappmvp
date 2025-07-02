#!/bin/bash

# Script to ensure Vercel has the correct environment variables
# and deploy with proper configuration

echo "🔧 Setting up Vercel environment variables..."

# Check if vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🌍 Setting production environment variables..."

# Set the essential Supabase environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "✅ Environment variables configured!"
echo "🚀 Deploying to production..."

# Deploy to production
vercel --prod

echo "🎉 Deployment complete!"
echo "🔍 Check console errors at: https://skillswap-mvp.vercel.app"
