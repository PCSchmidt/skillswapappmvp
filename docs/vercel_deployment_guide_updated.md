# Vercel Deployment Guide for SkillSwap MVP

## Prerequisites

1. **Fixed Import Resolution Issues**
   - All auth components now use relative imports instead of path aliases
   - Local build completes successfully with no import resolution errors

2. **Vercel CLI**
   - Installed globally: `npm i -g vercel`
   - Authenticated with Vercel account

## Required Environment Variables

For successful deployment, the following environment variables **must** be configured in Vercel:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key for admin operations | Yes |
| `SUPABASE_JWT_SECRET` | JWT secret for authentication | Yes |

## Deployment Steps

1. **Set Up Environment Variables in Vercel**
   
   - Log in to the Vercel dashboard
   - Navigate to your project settings
   - Go to the "Environment Variables" section
   - Add each of the required variables above
   - Ensure variables are added to Production, Preview, and Development environments as needed

2. **Deploy from Local Environment**

   ```bash
   cd skillswap_mvp
   vercel
   ```

   Follow the prompts to link to your Vercel project.

3. **Alternatively, Deploy via GitHub Integration**

   - Connect your GitHub repository to Vercel
   - Configure automatic deployments for specific branches
   - Ensure environment variables are properly set in the Vercel project settings

## Troubleshooting

### Import Path Resolution

If you encounter path resolution issues:

1. Always use relative imports for critical paths
2. For components, prefer `../../component` over alias paths like `@components/component`
3. Check Vercel build logs for specific module resolution errors

### Environment Variables

If you see errors about missing Supabase credentials:

1. Verify all required environment variables are set in Vercel
2. Ensure variable names match exactly (case-sensitive)
3. Check if variables are available to the correct environments (Production/Preview/Development)

### Build Failures

For general build failures:

1. Run a local build first with `npm run build`
2. Address any errors in the local environment
3. Commit and push changes
4. Redeploy to Vercel

## Post-Deployment Verification

After successful deployment:

1. Test all authentication flows
2. Verify database connections
3. Check that image uploads and other Supabase-dependent features work correctly

## Next Steps After Deployment

1. Set up monitoring for the deployed application
2. Configure custom domain if needed
3. Implement CI/CD pipeline for automated testing before deployment
