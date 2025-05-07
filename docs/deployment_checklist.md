# SkillSwap MVP Deployment Checklist

Now that we've fixed the import path issues and configured the necessary environment variables in Vercel, follow this checklist to complete the deployment process.

## Pre-Deployment Verification ✅

1. **Import Paths Fixed** ✓
   - All path aliases `@lib/supabase` converted to relative paths
   - Local build completes without path resolution errors

2. **Environment Variables Configured** ✓
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET`

## Deployment Steps

1. **Final Local Verification**
   ```bash
   cd skillswap_mvp
   npm run prebuild:verify
   ```
   This will run a full build process to ensure everything is ready for deployment.

2. **Deploy to Staging**
   ```bash
   cd skillswap_mvp
   npm run deploy:staging
   ```
   This script will verify the build again and then use Vercel CLI to deploy to production.

3. **Alternative: Manual Deployment via Vercel CLI**
   ```bash
   cd skillswap_mvp
   vercel --prod
   ```
   This will deploy directly using the Vercel CLI with production settings.

4. **Alternative: Deploy via GitHub Integration**
   - Push your changes to the main/staging branch
   - Vercel will automatically deploy if GitHub integration is set up in vercel.json

## Post-Deployment Verification

1. **Verify Authentication Flows**
   - Test user registration
   - Test email verification
   - Test login/logout
   - Test password reset

2. **Verify Supabase Connection**
   - Check database connections
   - Verify data storage/retrieval operations

3. **Test Critical Features**
   - Skill creation and management
   - User profile management
   - Search functionality
   - Any other core features

4. **Run Deployment Verification Script**
   ```bash
   cd skillswap_mvp
   npm run verify-deployment
   ```
   This will run the automated verification checks defined in scripts/verify-deployment.js

## Troubleshooting Common Deployment Issues

1. **Build Failures**
   - Check Vercel build logs for specific errors
   - Verify that all environment variables are correctly set
   - Ensure path resolution is working correctly

2. **Runtime Errors**
   - Check browser console for client-side errors
   - Examine Vercel function logs for server-side errors

3. **Database Connection Issues**
   - Verify Supabase credentials are correct
   - Check that database policies are properly configured
   - Ensure service roles have appropriate permissions

## Next Steps After Successful Deployment

1. **Set Up Monitoring**
   - Configure Sentry for error tracking
   - Set up analytics for user behavior tracking
   - Implement health checks and alerts

2. **Configure Domain**
   - Set up custom domain in Vercel dashboard
   - Configure DNS settings
   - Set up SSL certificates

3. **Implement CI/CD Pipeline**
   - Configure automated testing before deployment
   - Set up staging and production environments
   - Implement feature branch preview deployments

4. **Documentation**
   - Update project documentation with deployment details
   - Create user guides and onboarding materials
   - Document maintenance procedures
