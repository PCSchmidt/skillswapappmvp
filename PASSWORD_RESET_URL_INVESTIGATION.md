# Password Reset URL Issue Investigation

## Issue Description
Password reset emails are still linking to `http://localhost:3000/?code=...` instead of the production domain `https://skillswapappmvp.vercel.app`.

## Investigation Results

### 1. Code Analysis ✅
- **SupabaseContext.tsx**: Contains hardcoded production URL fix
- **sendPasswordReset function**: Properly configured with `redirectTo: 'https://skillswapappmvp.vercel.app/auth/reset-password'`
- **Latest commit**: Includes the critical fix (commit: 2d0421c)
- **Production deployment**: Latest deployment is live (27 minutes ago)

### 2. Potential Root Causes

#### A. Supabase Email Template Configuration (MOST LIKELY)
- **Issue**: Supabase dashboard may have email templates configured with localhost URLs
- **Location**: Supabase Dashboard > Authentication > Email Templates
- **Solution**: Update email templates to use production domain or dynamic variables

#### B. Supabase Site URL Configuration
- **Issue**: Supabase project settings may have Site URL set to localhost
- **Location**: Supabase Dashboard > Settings > General > Site URL
- **Solution**: Update Site URL to https://skillswapappmvp.vercel.app

#### C. Browser/Email Client Caching
- **Issue**: Email client or browser caching old reset links
- **Solution**: Clear cache, try different email address, or wait for cache expiration

### 3. Immediate Actions Required

#### Action 1: Check Supabase Dashboard Email Templates
1. Log into Supabase Dashboard
2. Go to Authentication > Email Templates
3. Check "Reset Password" template
4. Look for hardcoded localhost URLs
5. Update to use `{{ .SiteURL }}` or `{{ .RedirectTo }}` variables

#### Action 2: Verify Supabase Site URL Configuration
1. Go to Settings > General
2. Check "Site URL" setting
3. Ensure it's set to: `https://skillswapappmvp.vercel.app`

#### Action 3: Test with Fresh Email
1. Use a different email address that hasn't been used for reset before
2. Clear browser cache
3. Try the reset flow again

### 4. Code Verification

The current code is correct:
```typescript
const sendPasswordReset = async (email: string) => {
  const productionUrl = 'https://skillswapappmvp.vercel.app';
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${productionUrl}/auth/reset-password`,
  });
  // ...
};
```

### 5. Next Steps

1. **PRIORITY 1**: Check Supabase email template configuration
2. **PRIORITY 2**: Verify Supabase Site URL setting
3. **PRIORITY 3**: Test with fresh email after configuration changes
4. **PRIORITY 4**: Monitor Supabase logs for any configuration issues

### 6. Expected Resolution

Once the Supabase email templates and Site URL are properly configured:
- Password reset emails should link to: `https://skillswapappmvp.vercel.app/auth/reset-password?code=...`
- No more localhost URLs in reset emails
- Production password reset flow fully functional

---

**Status**: Awaiting Supabase dashboard configuration verification
**Next Action**: Check and update Supabase email templates and Site URL settings
