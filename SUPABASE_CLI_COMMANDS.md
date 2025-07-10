# Supabase CLI Commands for Password Reset URL Fix

## Authentication and Project Setup

First, you need to authenticate with Supabase and link your project:

```bash
# Login to Supabase (this will open a browser for authentication)
npx supabase login

# Link to your existing Supabase project
# You'll need your project reference ID from the Supabase dashboard
npx supabase link --project-ref YOUR_PROJECT_REF
```

## Inspect Current Configuration

### 1. Check Auth Settings
```bash
# Get current auth configuration
npx supabase config

# Check auth settings specifically
npx supabase auth config
```

### 2. View Current Email Templates
```bash
# This will show you the current email templates
npx supabase auth dump --file auth-config.sql
```

### 3. Check Site URL Configuration
```bash
# Check project settings
npx supabase projects list
npx supabase projects get-config YOUR_PROJECT_REF
```

## Fix Email Templates

### Option 1: Update via CLI (if supported)
```bash
# Update site URL
npx supabase projects update --site-url https://skillswapappmvp.vercel.app

# Update auth configuration
npx supabase auth update --site-url https://skillswapappmvp.vercel.app
```

### Option 2: Export, Edit, and Apply Templates
```bash
# Export current auth configuration
npx supabase auth dump --file current-auth-config.sql

# Edit the file to fix localhost URLs
# Then apply the changes
npx supabase auth load --file updated-auth-config.sql
```

## Verify Changes

```bash
# Check if changes were applied
npx supabase auth config

# Test email sending (if CLI supports it)
npx supabase auth send-reset-email YOUR_EMAIL
```

## Quick Diagnostic Commands

```bash
# Check project info
npx supabase projects list

# Check current auth settings
npx supabase auth config

# View project settings
npx supabase projects get-config YOUR_PROJECT_REF
```

## Important Notes

1. **Project Reference ID**: You can find this in your Supabase dashboard URL or project settings
2. **Authentication**: You'll need to authenticate with the same account that owns the Supabase project
3. **Permissions**: Make sure you have admin access to the Supabase project

## Alternative: Manual Dashboard Update

If CLI commands don't work or aren't available for email templates:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Authentication > Email Templates
4. Update the "Reset Password" template
5. Replace any `localhost:3000` with `https://skillswapappmvp.vercel.app`
6. Go to Settings > General
7. Update Site URL to `https://skillswapappmvp.vercel.app`

## Testing After Changes

```bash
# Test the fix
npm run verify-password-reset-fix.bat
```

Or manually test by:
1. Going to https://skillswapappmvp.vercel.app/auth/forgot-password
2. Requesting a password reset with a fresh email
3. Checking that the email link uses the production domain
