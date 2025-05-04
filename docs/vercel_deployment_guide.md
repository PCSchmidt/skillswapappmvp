# Vercel Deployment Guide for SkillSwap

This document provides instructions for completing the Vercel deployment setup for the SkillSwap application.

## Current Status

Based on the Vercel dashboard, the project is set up but has no active production deployment. The following steps will help finalize the deployment configuration and initiate the first production build.

## Domain Configuration

1. **Set Up Custom Domain**
   - Go to the "Domains" tab in the Vercel project dashboard
   - Click "Add" to configure a custom domain
   - Enter your desired domain (e.g., skillswap.app)
   - Follow the verification steps to prove ownership
   - Configure DNS settings according to Vercel's instructions

2. **Configure Domain Settings**
   - Enable HTTPS (should be on by default)
   - Configure any necessary redirects (e.g., www to apex domain)
   - Set up domain verification with security.txt file

## Environment Variables

1. **Configure Production Environment Variables**
   - Go to the "Settings" > "Environment Variables" section of your Vercel project
   - Add all required environment variables from `.env.production`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_SITE_URL`
     - `NEXT_PUBLIC_APP_VERSION`
     - `NEXT_PUBLIC_VERCEL_ENV` (set to "production")
     - Any other required environment variables

2. **Configure Preview Environment Variables**
   - Configure any environment variables needed for preview deployments (dev branch)
   - These should be set to staging values

## Deployment Triggers

1. **Configure GitHub Integration**
   - Ensure the GitHub integration is active (this appears to be already configured)
   - Verify that the correct repository and branches are connected

2. **Deploy from Master Branch**
   - Since the dashboard shows "To update your Production Deployment, push to the master branch," ensure your main branch is set as the production branch
   - You can initiate a manual production deployment by pushing to the master branch, which we've already done with our recent updates

## Analytics and Monitoring

1. **Enable Analytics**
   - In the Analytics section of your Vercel project, click "Enable"
   - This will track visitors and page views for your deployment

2. **Set Up Error Monitoring**
   - Configure Sentry integration (we've already created the Sentry config files)
   - Link your Sentry project in the Vercel integrations

## Performance Optimization

1. **Enable Edge Function Caching**
   - Review Edge Function settings to ensure optimal performance
   - Consider enabling caching for API routes that don't require real-time data

2. **Configure Image Optimization**
   - Review and optimize the Next.js Image component usage
   - Configure any specific image optimization settings in Vercel

## Security Settings

1. **Configure Firewall Settings**
   - Review the Firewall tab in Vercel settings
   - Configure any necessary security rules

2. **Enable Observability Features**
   - In the Observability tab, review Edge Requests, Function Invocations, and Error Rate settings
   - Set up appropriate alerting thresholds

## Testing the Deployment

1. **Initiate Production Deployment**
   - If not already triggered by pushing to master, you can manually deploy from the Vercel dashboard
   - Click on "Deployments" tab and select "Deploy" button

2. **Verify Deployment Success**
   - Once deployed, test all critical paths:
     - Authentication flows
     - Core feature functionality
     - API endpoints
     - Error handling
   - Use the `verify-deployment.js` script we've created:
     ```
     node scripts/verify-deployment.js --url=https://your-production-domain.com
     ```

## Post-Deployment Steps

1. **Set Up Deployment Notifications**
   - Configure Slack or email notifications for deployment status

2. **Set Up Regular Database Backups**
   - Ensure Supabase database backup schedule is implemented

3. **Document Deployment Details**
   - Record the deployment timestamp and version in deployment logs

## Staging Environment

To set up a separate staging environment:

1. Go to "Git Integration" in Vercel project settings
2. Configure Production Branch (master) and Preview Branches (dev)
3. This creates separate environments with different URLs:
   - Production: your custom domain
   - Staging: generated Vercel preview URL

## Troubleshooting Common Issues

### No Production Deployment Showing

If you've pushed to master but no deployment appears:
- Check GitHub integration settings
- Verify GitHub actions aren't blocking the deployment
- Check for any build errors in the logs

### Environment Variable Issues

If the application behaves unexpectedly:
- Verify all required environment variables are set correctly
- Check if any values need to be updated for the production environment

### Domain Configuration Issues

If the domain isn't working properly:
- Verify DNS settings have propagated (can take up to 48 hours)
- Check domain verification status in Vercel
- Verify SSL certificate is properly issued

## Next Steps

After completing this guide, the SkillSwap application should be fully deployed and accessible through your production domain. Continue monitoring performance and user feedback to make any necessary optimizations or improvements.
