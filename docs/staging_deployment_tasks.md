# SkillSwap MVP: Staging Environment Setup and Deployment Tasks

This document outlines the specific tasks and steps required to set up and deploy the SkillSwap MVP to the staging environment, following our production database setup.

## 1. Complete Staging Environment Setup

### Environment Variables Configuration
- [ ] Run the environment variable generation script:
  ```bash
  cd skillswap_mvp
  npm run env:generate -- staging
  ```
- [ ] Review and validate all generated environment variables in `.env.staging`
- [ ] Ensure database connection strings point to production Supabase instance
- [ ] Set appropriate feature flags for staging environment
- [ ] Validate environment configuration:
  ```bash
  npm run env:validate -- staging
  ```
- [ ] Export environment variables to Vercel:
  ```bash
  npm run env:export-vercel -- staging
  ```

### Vercel Project Configuration
- [ ] Log in to Vercel through CLI:
  ```bash
  npx vercel login
  ```
- [ ] Initialize the Vercel staging project:
  ```bash
  npx vercel
  ```
- [ ] In Vercel dashboard, configure build settings:
  - Framework preset: Next.js
  - Build command: `npm run build`
  - Output directory: `.next`
  - Install command: `npm install`
  - Node.js version: 18.x

### Domain Configuration
- [ ] Set up staging subdomain in Vercel dashboard: `staging.skillswap.app`
- [ ] Verify DNS configuration is correct
- [ ] Ensure SSL certificate is provisioned automatically
- [ ] Test subdomain accessibility after configuration

## 2. Perform Initial Staging Deployment

### Pre-Deployment Verification
- [ ] Ensure all code is committed to the `dev` branch
- [ ] Verify GitHub Actions workflows are properly configured
- [ ] Check that Supabase production database is accessible
- [ ] Review the deployment checklist for any pre-deployment requirements

### Deploy to Staging
- [ ] Execute the staging deployment:
  ```bash
  npm run deploy:staging
  ```
- [ ] Monitor deployment progress in GitHub Actions tab
- [ ] Check for any build errors or warnings
- [ ] Verify deployment was successful in Vercel dashboard

### Post-Deployment Verification
- [ ] Run the verification script:
  ```bash
  npm run verify-deployment -- --url=https://staging.skillswap.app
  ```
- [ ] Manually verify core functionality:
  - User authentication
  - Skills management
  - Trade proposals
  - Messaging system
  - Notifications
  - Profile management
  - Search functionality
- [ ] Test responsiveness on mobile devices
- [ ] Check browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Verify API endpoints are functioning correctly
- [ ] Ensure database connections are working as expected

### Documentation and Reporting
- [ ] Document any issues encountered during deployment
- [ ] Update `dev_journal.md` with deployment outcomes
- [ ] Create tickets for any issues that need to be addressed
- [ ] Prepare a deployment report for the team
- [ ] Update the deployment checklist with completed items

## 3. Planning for Production Deployment

- [ ] Review staging deployment results with the team
- [ ] Finalize the production deployment timeline
- [ ] Update the deployment checklist for production
- [ ] Ensure all documentation is current and accurate
- [ ] Prepare communication plan for the production release

## Notes and Observations

Use this section to document any specific observations, issues or learnings during the staging deployment:

-
-
-

---

**Last Updated:** May 7, 2025  
**Maintainer:** [Your Name]  
**Status:** In Progress
