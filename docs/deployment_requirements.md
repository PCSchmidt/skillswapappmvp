# Deployment Requirements for SkillSwap MVP

This document outlines the essential requirements and prerequisites for deploying the SkillSwap MVP application to a staging or production environment.

## Environment Variables

The application requires several environment variables to function correctly. These must be properly configured in the Vercel deployment settings or through environment files.

### Critical Variables

The following environment variables are **required** for a successful deployment:

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
```

> **Important**: The current deployment is failing because these Supabase configuration variables either contain placeholder values or are missing entirely. You must replace the placeholders with actual values from your Supabase project.

#### Authentication
```
AUTH_SECRET=your-auth-secret
JWT_SECRET=your-jwt-secret
NEXTAUTH_URL=https://your-app-url.com
```

### How to Obtain Supabase Credentials

1. **Supabase URL and Anon Key**:
   - Log in to your Supabase dashboard
   - Select your project
   - Go to Project Settings > API
   - Copy the URL and anon/public key

2. **Service Role Key**:
   - In the same API section of Project Settings
   - Copy the service_role key (keep this secure!)

3. **JWT Secret**:
   - In Project Settings > API > JWT Settings
   - Copy the JWT secret

### Deployment Options

#### Option 1: Vercel Environment Variables

1. Go to your Vercel project settings
2. Navigate to the "Environment Variables" section
3. Add each required variable and its value
4. Redeploy the application

#### Option 2: Update .env.staging File

1. Edit the `.env.staging` file
2. Replace all placeholder values with actual credentials
3. Ensure this file is included in your deployment

```bash
# Update these values in .env.staging
NEXT_PUBLIC_SUPABASE_URL=https://mdmydtumpwilynhdrtqp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=actual-service-role-key-here
SUPABASE_JWT_SECRET=actual-jwt-secret-here
```

## Debugging Deployment Failures

If you encounter deployment failures related to environment variables:

1. Check the build logs for messages like:
   ```
   Supabase URL or anonymous key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.
   ```

2. Verify that all required environment variables are set and contain valid values

3. For Supabase connection issues, ensure:
   - The project is active and online
   - The database is accessible
   - The API keys have not been revoked or rotated

## Next Steps After Fixing Environment Variables

Once you've properly configured the environment variables:

1. Commit your changes (if using the .env.staging file approach)
2. Trigger a new deployment with the correct environment configuration
3. Monitor the build logs to confirm successful connection to Supabase
4. Test the deployed application thoroughly to ensure all functionality works as expected
