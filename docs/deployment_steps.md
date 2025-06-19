# SkillSwap MVP Deployment Steps

This document provides a practical, step-by-step guide for setting up and deploying the SkillSwap MVP to Vercel with GitHub integration. Follow these instructions to get your application deployed to staging and production environments.

## Prerequisites

Before starting, ensure you have:

- A GitHub account with access to the SkillSwap MVP repository
- A Vercel account
- Node.js 18.17.0 or higher installed
- Npm 9.6.7 or higher installed

## Step 1: Install Required Tools

First, install the Vercel CLI and other required tools:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Install dependencies in the project
cd skillswap_mvp
npm install
```

## Step 2: Generate Environment Files

Create environment files for staging and production:

```bash
# Generate environment files from the example file
npm run env:generate

# You can also generate for specific environments
npm run env:generate -- staging
npm run env:generate -- production
```

After generating the files, edit `.env.staging` and `.env.production` to add your actual environment values.

## Step 3: Validate Environment Variables

Ensure your environment variables are properly configured:

```bash
# Validate staging environment variables
npm run env:validate -- staging

# Validate production environment variables
npm run env:validate -- production
```

Fix any issues reported by the validation tool before proceeding.

## Step 4: Log in to Vercel CLI

Log in to Vercel through the CLI:

```bash
vercel login
```

This will open a browser window for authentication.

## Step 5: Create a New Vercel Project

Create a new project in Vercel:

```bash
# Initialize a new Vercel project in the current directory
vercel
```

Follow the interactive prompts:
- Select "Continue with default settings" if asked
- Set up the project name (e.g., "skillswap-mvp")
- Choose to link to an existing project or create a new one
- Set your preferred production branch ("master" recommended)

## Step 6: Connect GitHub Repository

Connect your GitHub repository to Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Select your GitHub account
4. Find and select the skillswap-mvp repository
5. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: ./ (or leave blank)
   - Build Command: npm run build
   - Output Directory: .next
   - Install Command: npm install
6. Click "Deploy"

## Step 7: Configure Project in Vercel Dashboard

After the initial deployment, configure additional settings in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "General"
3. Under "Build & Development Settings", ensure:
   - Framework Preset: Next.js
   - Build Command: npm run build
   - Output Directory: .next
   - Install Command: npm install
   - Development Command: npm run dev

4. Navigate to "Settings" > "Environment Variables"
5. Add all required environment variables from your `.env.production` file
   - You can use the env:export-vercel script to automate this:
     ```bash
     npm run env:export-vercel -- production
     ```

## Step 8: Set Up Custom Domain (Optional)

If you have a custom domain:

1. Go to "Settings" > "Domains" in your Vercel project
2. Add your domain (e.g., skillswap.app)
3. Follow the instructions to configure DNS settings
4. Add a subdomain for staging (e.g., staging.skillswap.app)

## Step 9: Configure GitHub Actions for CI/CD

Set up GitHub Actions secrets for automated deployments:

1. Go to your GitHub repository
2. Navigate to "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel API token (from Vercel account settings)
   - `VERCEL_ORG_ID`: Your Vercel organization ID (run `vercel whoami` to get it)
   - `VERCEL_PROJECT_ID`: Your Vercel project ID (run `vercel projects ls` to get it)
   - `SLACK_WEBHOOK`: (Optional) Webhook URL for Slack notifications
   - `CODECOV_TOKEN`: (Optional) Token for code coverage reporting

## Step 10: Push Database Schema to Production

Set up the production database:

1. Create a new Supabase project for production
2. Push your database schema:
   ```bash
   # Link to your production Supabase project
   supabase link --project-ref your-production-project-ref
   
   # Push migrations to production
   npm run db:push
   ```

## Step 11: Deploy to Staging Environment

Deploy to the staging environment first to verify everything works:

```bash
# Deploy to staging
npm run deploy:staging
```

## Step 12: Verify Staging Deployment

Run the verification script against your staging deployment:

```bash
npm run verify-deployment -- --url=https://staging.skillswap.app
```

Fix any issues that the verification script reports.

## Step 13: Deploy to Production

Once staging is verified, deploy to production:

```bash
# Deploy to production
npm run deploy:production
```

## Step 14: Verify Production Deployment

Verify the production deployment:

```bash
npm run verify-deployment -- --url=https://skillswap.app
```

## Step 15: Set Up Monitoring

Set up monitoring tools as described in the monitoring documentation:

1. Configure Sentry for error tracking
2. Set up Uptime Robot for availability monitoring
3. Enable Vercel Analytics for user metrics

## Automated Deployments

After the initial setup, deployments will happen automatically:

- Pushing to the `dev` branch deploys to staging
- Pushing to the `master` branch deploys to production

You can monitor deployments in the GitHub Actions tab of your repository.

## Manual Deployment (If Needed)

If you need to deploy manually:

```bash
# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

## Rollback Procedure

If you need to roll back a deployment:

1. Go to the Vercel dashboard > Deployments
2. Find the last working deployment
3. Click the three dots (...) > "Promote to Production"

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in Vercel for errors
   - Ensure all environment variables are set correctly
   - Verify your dependencies are properly installed

2. **Database Connection Issues**
   - Check that your Supabase URL and keys are correct
   - Verify that your IP is allowed in Supabase settings
   - Check that your database schema is properly set up

3. **GitHub Actions Failures**
   - Verify all required secrets are set correctly
   - Check the workflow logs for detailed error messages

### Getting Help

If you encounter issues not covered here:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Check the [Supabase documentation](https://supabase.io/docs)
3. Consult with the team for project-specific issues
