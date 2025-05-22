# Environment Variables Setup Guide for SkillSwap

This guide explains how to set up environment variables for the SkillSwap MVP project, which is a critical step for deployment.

## Overview

SkillSwap requires several environment variables to function properly, especially for authentication, database access, and external services. These variables need to be properly configured in both staging and production environments.

## Using the Environment Variables Update Script

We've created a helper script to streamline the process of configuring environment variables. This script validates inputs and provides guidance on obtaining the necessary values.

### Running the Script

```bash
# For staging environment
npm run update-env:staging

# For production environment
npm run update-env:production
```

The script will interactively prompt for necessary values and validate them.

## Required Environment Variables

The following variables are required for the application to function properly:

### Supabase Configuration

These variables establish connection to your Supabase project:

- **NEXT_PUBLIC_SUPABASE_URL**: The URL of your Supabase project
  - Example: `https://mdmydtumpwilynhdrtqp.supabase.co`
  - Where to find: Supabase Dashboard > Project Settings > API

- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: The anonymous key for your Supabase project
  - Where to find: Supabase Dashboard > Project Settings > API > Project API keys

- **SUPABASE_SERVICE_ROLE_KEY**: The service role key for your Supabase project
  - Where to find: Supabase Dashboard > Project Settings > API > Project API keys
  - **Warning**: This key has elevated privileges. Keep it secure and never expose it client-side.

- **SUPABASE_JWT_SECRET**: The JWT secret for your Supabase project
  - Where to find: Supabase Dashboard > Project Settings > API > JWT Settings

### Authentication

- **AUTH_SECRET**: A secure random string used for authentication
  - The script can generate this automatically

- **JWT_SECRET**: A secure random string for JWT signing
  - The script can generate this automatically

### Email Configuration

- **RESEND_API_KEY**: API key for email sending via Resend
  - Where to find: Resend Dashboard > API Keys
  - Format: Starts with `re_`

### Monitoring (Optional but Recommended)

- **SENTRY_DSN**: Data Source Name for Sentry error tracking
  - Where to find: Sentry Dashboard > Projects > [Your Project] > Settings > Client Keys (DSN)

## Environment Files

SkillSwap uses different environment files for different deployment stages:

- **.env.local**: Used for local development
- **.env.staging**: Used for the staging environment
- **.env.production**: Used for the production environment

The update script modifies the appropriate file based on your selection.

## Security Considerations

1. **Never commit secrets to version control**
   - Environment files with secrets should be listed in `.gitignore`
   - Use the update script to configure variables securely

2. **Vercel Deployment**
   - For Vercel deployments, you can also set these variables in the Vercel dashboard
   - Go to: Project Settings > Environment Variables

3. **Secrets Rotation**
   - Periodically rotate secrets like API keys and JWT secrets
   - After rotation, update all environments with the new values

## Troubleshooting

If you encounter deployment issues related to environment variables:

1. **Check build logs** for specific error messages about missing variables
2. **Verify variable names** match exactly as expected by the application
3. **Ensure secret values** are properly formatted (no extra spaces, quotes, etc.)
4. **Test connection** to Supabase using the provided credentials

## Next Steps After Configuration

After successfully configuring environment variables:

1. Run pre-deployment validation: `npm run prebuild:verify`
2. Deploy to the intended environment: `npm run deploy:staging` or `npm run deploy:production`
3. Verify deployment using the steps in `docs/deployment_verification_steps.md`

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables Guide](https://vercel.com/docs/environment-variables)
