# 🔧 Supabase Dashboard Checklist for Password Reset URL Fix

## Your Project Information
- **Project ID**: `mdmydtumpwilynhdrtqp`
- **Dashboard URL**: https://supabase.com/dashboard/project/mdmydtumpwilynhdrtqp
- **API Docs**: https://supabase.com/dashboard/project/mdmydtumpwilynhdrtqp/api

## 🎯 Critical Areas to Check

### 1. Site URL Configuration (HIGHEST PRIORITY)
**Location**: Settings → General → Configuration
**Current Setting**: Likely `http://localhost:3000`
**Required Fix**: Change to `https://skillswapappmvp.vercel.app`

**Steps**:
1. Go to: https://supabase.com/dashboard/project/mdmydtumpwilynhdrtqp/settings/general
2. Find "Site URL" in the Configuration section
3. Update from `localhost:3000` to `https://skillswapappmvp.vercel.app`
4. Save changes

### 2. Email Templates (CRITICAL)
**Location**: Authentication → Email Templates
**Template to Check**: "Reset Password"
**Issue**: Likely contains hardcoded localhost URLs

**Steps**:
1. Go to: https://supabase.com/dashboard/project/mdmydtumpwilynhdrtqp/auth/templates
2. Click on "Reset Password" template
3. Look for any references to:
   - `localhost:3000`
   - `127.0.0.1`
   - `http://localhost`
4. Replace with:
   - `https://skillswapappmvp.vercel.app`
   - Or use dynamic variables like `{{ .SiteURL }}` or `{{ .RedirectTo }}`

### 3. Additional Auth Settings
**Location**: Authentication → Settings
**Check**:
- Site URL setting
- Additional redirect URLs
- Any other localhost references

## 🔍 What to Look For

### In Email Templates:
```html
<!-- BAD - Look for these patterns: -->
<a href="http://localhost:3000/auth/reset-password?token={{ .Token }}">
<a href="localhost:3000/auth/reset-password">

<!-- GOOD - Should look like this: -->
<a href="https://skillswapappmvp.vercel.app/auth/reset-password?token={{ .Token }}">
<a href="{{ .SiteURL }}/auth/reset-password?token={{ .Token }}">
```

### In Site URL Configuration:
- **Current (Bad)**: `http://localhost:3000`
- **Required (Good)**: `https://skillswapappmvp.vercel.app`

## 📋 Quick Verification Steps

After making changes:

1. **Test immediately**:
   - Go to: https://skillswapappmvp.vercel.app/auth/forgot-password
   - Use a FRESH email address (not used for reset before)
   - Submit reset request
   - Check email for the reset link

2. **Expected Result**:
   - Email link should be: `https://skillswapappmvp.vercel.app/auth/reset-password?code=...`
   - NO localhost URLs anywhere in the email

## 🚨 Most Likely Root Cause

Based on your error (`http://localhost:3000/?code=...`), the issue is almost certainly:

1. **Site URL** is set to `localhost:3000` in Supabase settings
2. **Email template** is using the Site URL variable or has hardcoded localhost

## 🎯 Priority Order

1. **FIRST**: Fix Site URL in Settings → General
2. **SECOND**: Check email templates in Authentication → Email Templates
3. **THIRD**: Test with fresh email address

## 📞 If You Need Help

Once you check these settings, let me know what you find:
- What is the current Site URL setting?
- What does the Reset Password email template contain?
- Are there any localhost references in the template?

I can then provide specific guidance on exactly what to change.
