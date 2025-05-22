# SkillSwap MVP Deployment Workflow

This document outlines the complete deployment workflow for the SkillSwap MVP application, including environment setup, validation, deployment, and verification.

## Overview

The SkillSwap MVP deployment process follows these key steps:

1. **Environment Variable Setup** - Configuring necessary secrets and settings
2. **Dependency Validation** - Ensuring all required packages are installed correctly
3. **Build Verification** - Testing the build process before deployment
4. **Deployment** - Pushing the application to the hosting environment
5. **Verification** - Confirming the deployed application works correctly

## Deployment Scripts

We've created several scripts to automate the deployment workflow:

### 1. Full Deployment Script

The `deploy.js` script orchestrates the complete deployment process from start to finish:

```bash
# For staging environment
npm run deploy:full:staging

# For production environment
npm run deploy:full:production
```

This script:
- Checks for uncommitted Git changes
- Updates environment variables for the target environment
- Validates dependencies
- Verifies the build
- Runs tests
- Deploys to Vercel
- Verifies the deployment

### 2. Environment Variables Setup

To update environment variables for a specific environment:

```bash
# For staging
npm run update-env:staging

# For production
npm run update-env:production
```

See [Environment Variables Setup Guide](./environment_variables_setup_guide.md) for detailed information.

### 3. Dependency Validation

This script ensures all required dependencies are correctly installed:

```bash
npm run validate-deps
```

### 4. Deployment Verification

After deployment, verify the application is working correctly:

```bash
# Replace with your deployment URL
npm run verify-deployment -- https://your-deployment-url.vercel.app
```

The verification script:
- Checks if the site is reachable
- Tests critical API endpoints
- Verifies static assets are accessible
- Checks metadata and SEO elements
- Validates security headers
- Optionally runs Lighthouse performance checks
- Checks for client-side console errors

A detailed verification report is generated after completion.

## Manual Deployment Steps

If you need to deploy manually without using the automated scripts:

1. **Prepare environment variables**:
   ```bash
   npm run update-env:production
   ```

2. **Validate dependencies**:
   ```bash
   npm run validate-deps
   ```

3. **Run pre-build verification**:
   ```bash
   npm run prebuild:verify
   ```

4. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

5. **Verify the deployment**:
   ```bash
   npm run verify-deployment -- https://your-deployment-url.vercel.app
   ```

## Deployment Environments

### Staging Environment

The staging environment is used for testing before deploying to production:

- Allows testing with staging database
- Verifies application works in a production-like setting
- Useful for final QA before production deployment

### Production Environment

The production environment is the live application:

- Uses the production database
- Connects to production third-party services
- Accessed by end users

## Troubleshooting

If you encounter issues during deployment:

1. **Environment Variable Issues**:
   - Check [Environment Variables Setup Guide](./environment_variables_setup_guide.md)
   - Verify variables are correctly set in Vercel dashboard

2. **Build Failures**:
   - Review Vercel build logs for specific errors
   - Check Webpack configuration and package dependencies

3. **Verification Failures**:
   - Review verification report for specific issues
   - Check browser console for client-side errors
   - Verify API endpoints are responding correctly

For more detailed troubleshooting, see [Deployment Troubleshooting](./deployment_troubleshooting.md).

## Post-Deployment Tasks

After successful deployment:

1. **Monitor application performance** using Sentry and Vercel Analytics
2. **Verify critical user flows** are working correctly
3. **Check for any console errors** or unexpected behavior
4. **Update deployment documentation** with any new issues or solutions

## Deployment Verification Report

The deployment verification process generates a detailed report with:

- Test results for each verification step
- Warnings and errors that need attention
- Recommended next steps based on verification results

Review this report carefully after each deployment.

## Continuous Integration

For CI/CD setups:

1. **GitHub Actions**:
   - Set up GitHub secrets for environment variables
   - Configure workflow to run tests, verify build, and deploy

2. **Vercel Integration**:
   - Connect GitHub repository to Vercel
   - Configure automatic deployments on push to main/production branches

## Security Considerations

When deploying:

1. **Never commit secrets** to version control
2. **Rotate API keys** and secrets periodically
3. **Enable Vercel protection features** for production builds
4. **Verify security headers** are correctly configured

## References

- [Vercel Deployment Guide](./vercel_deployment_guide_updated.md)
- [Environment Variables Setup](./environment_variables_setup_guide.md)
- [Deployment Checklist](./deployment_checklist.md)
- [Deployment Monitoring](./deployment_monitoring.md)
