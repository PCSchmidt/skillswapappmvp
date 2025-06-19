# SkillSwap MVP Deployment Guide

This document outlines the deployment process and configuration for the SkillSwap MVP application.

## Deployment Environments

The application is configured to support three deployment environments:

1. **Development**: Local development environment
2. **Staging**: Pre-production testing environment
3. **Production**: Live production environment

## Vercel Deployment

The application is deployed using Vercel for hosting the Next.js frontend.

### Initial Vercel Setup

1. Create a new project in the Vercel dashboard
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Select the GitHub organization and repository
   - If the repository is not visible, configure GitHub permissions:
     - Go to GitHub > Settings > Applications > Vercel > Configure
     - Grant access to the repository

2. Link the GitHub repository
   - On the Vercel import page, select the skillswap_mvp repository
   - Keep the default project name or customize it
   - Set the Framework Preset to "Next.js"

3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Development Command: `npm run dev`
   - Root Directory: `./` (or leave blank)

4. Set up environment variables in the Vercel dashboard
   - Use the variables specified in the Environment Variables section below
   - Create separate environment variable sets for:
     - Preview (staging) deployments
     - Production deployments
   - Mark sensitive variables as "Sensitive" to prevent exposure in logs

5. Deploy the project
   - Click "Deploy" to initiate the first deployment
   - Vercel will automatically build and deploy the application

### Production Database Configuration

Before deploying to production, configure the Supabase production database:

1. Create a production Supabase project
   - Log in to the [Supabase dashboard](https://app.supabase.io)
   - Create a new project with a name like "skillswap-production"
   - Select a database password and region closest to your users
   - Note the connection details and API keys

2. Apply database migrations to production
   - Install the Supabase CLI if not already installed:
     ```bash
     npm install -g supabase
     ```
   - Link your local project to the production Supabase instance:
     ```bash
     supabase link --project-ref your-production-project-ref
     ```
   - Push migrations to production:
     ```bash
     supabase db push
     ```

3. Configure database policies and settings
   - Verify Row Level Security (RLS) is enabled for all tables
   - Test read/write operations with both anon and authenticated users
   - Configure backup schedules and retention policies

4. Add the Supabase connection details to Vercel environment variables
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (mark as sensitive)
   - `SUPABASE_JWT_SECRET` (mark as sensitive)

### GitHub Actions Deployment Pipeline

The application uses GitHub Actions for automated CI/CD:

1. `test.yml`: Runs unit and E2E tests on every push and pull request
2. `deploy.yml`: Automatically deploys to staging when pushed to `dev` branch, and to production when pushed to `master`

To enable GitHub Actions deployments:

1. Generate a Vercel API token
   - Go to [Vercel account settings](https://vercel.com/account/tokens)
   - Create a new token with a descriptive name like "GitHub Actions Deployment"
   - Copy the token value

2. Find your Vercel project and organization IDs
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel whoami` to get your organization ID
   - Run `vercel projects ls` to get your project ID

3. Add these as secrets in your GitHub repository
   - Go to your repository > Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel API token
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID
     - `SLACK_WEBHOOK`: Webhook URL for Slack deployment notifications
     - `CODECOV_TOKEN`: Token for uploading coverage reports to Codecov

### Required Secrets for GitHub Actions

These secrets need to be added to your GitHub repository:

| Secret Name | Description |
|-------------|-------------|
| `VERCEL_TOKEN` | Vercel API token for deployment |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `SLACK_WEBHOOK` | Webhook URL for Slack deployment notifications |
| `CODECOV_TOKEN` | Token for uploading coverage reports to Codecov |

## Environment Variables

The following environment variables need to be configured in each environment:

### Next.js Environment Variables

| Variable Name | Development | Staging | Production | Description |
|---------------|------------|---------|------------|-------------|
| `NEXT_PUBLIC_VERCEL_ENV` | `development` | `preview` | `production` | Indicates the current deployment environment |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://staging.skillswap.app` | `https://skillswap.app` | The base URL for the application |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | `https://staging.skillswap.app/api` | `https://skillswap.app/api` | The API endpoint URL |

### Supabase Configuration

| Variable Name | Required In | Description |
|---------------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | All environments | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All environments | Supabase anonymous API key |
| `SUPABASE_SERVICE_ROLE_KEY` | All environments | Supabase service role key (secret) |
| `SUPABASE_JWT_SECRET` | All environments | JWT secret for custom auth |

### Authentication & Security

| Variable Name | Required In | Description |
|---------------|-------------|-------------|
| `AUTH_SECRET` | All environments | Secret used for NextAuth.js |
| `JWT_SECRET` | All environments | Secret for JWT encoding/decoding |
| `NEXTAUTH_URL` | Staging, Production | NextAuth.js URL |
| `ALLOWED_ORIGINS` | Staging, Production | Comma-separated list of allowed CORS origins |
| `COOKIE_DOMAIN` | Staging, Production | Cookie domain for cross-subdomain auth |

### Monitoring & Analytics

| Variable Name | Required In | Description |
|---------------|-------------|-------------|
| `NEXT_PUBLIC_ANALYTICS_ID` | Staging, Production | Analytics tracking ID |
| `SENTRY_DSN` | Staging, Production | Sentry DSN for error tracking |
| `SENTRY_AUTH_TOKEN` | CI/CD only | Token for Sentry source map uploads |
| `SENTRY_PROJECT` | CI/CD only | Sentry project name |
| `SENTRY_ORG` | CI/CD only | Sentry organization name |

### Feature Flags

| Variable Name | Required In | Description |
|---------------|-------------|-------------|
| `NEXT_PUBLIC_ENABLE_PWA` | All environments | Enable/disable PWA features |
| `NEXT_PUBLIC_ENABLE_RATINGS` | All environments | Enable/disable ratings system |
| `NEXT_PUBLIC_ENABLE_MESSAGING` | All environments | Enable/disable messaging system |

## Database Migration for Production

Before deploying to production, you need to run database migrations:

```bash
# Apply migrations to production database
npx supabase db push --db-url=$PRODUCTION_DB_URL
```

## Setting Up Custom Domains

1. Add your custom domain in the Vercel dashboard
   - Go to your project > Settings > Domains
   - Enter your domain name (e.g., skillswap.app)
   - Choose from the following options:
     - "I already own this domain" - Requires DNS configuration
     - "Register a new domain" - Purchase through Vercel

2. Configure DNS records as instructed by Vercel
   - If using an external domain registrar, add the required DNS records:
     - For an apex domain (skillswap.app): 
       - Add an A record pointing to 76.76.21.21
     - For a subdomain (www.skillswap.app): 
       - Add a CNAME record pointing to cname.vercel-dns.com

3. Verify domain ownership
   - Wait for DNS propagation (can take up to 48 hours)
   - Vercel will verify the domain automatically

4. Vercel will automatically provision SSL certificates
   - Let's Encrypt certificates are automatically issued
   - Certificates are automatically renewed before expiration

## Monitoring Setup

Follow these steps to set up monitoring for your production deployment:

1. Connect Sentry for error tracking
   - Create a Sentry project at [sentry.io](https://sentry.io)
   - Get your DSN and add it to environment variables
   - Configure source map uploads in the CI/CD pipeline

2. Set up Uptime Robot for availability monitoring
   - Create monitors for critical endpoints
   - Configure alert contacts and notification settings
   - Set appropriate check intervals (1-5 minutes recommended)

3. Enable Vercel Analytics
   - Go to your Vercel project > Analytics
   - Enable Web Vitals monitoring
   - Set up custom events if needed

4. [Optional] Configure additional monitoring tools
   - New Relic for application performance monitoring
   - Datadog for log aggregation and analysis
   - Custom health check endpoints

## Post-Deployment Verification

After deploying to any environment, verify these aspects:

1. Application loads properly at the expected URL
2. Authentication works (signup, login, logout)
3. Database connections are working
4. Critical user flows are functional
5. Error tracking is receiving data
6. Analytics are recording user sessions

## Rollback Procedure

In case of deployment issues:

1. Identify the last working deployment in Vercel dashboard
2. Click "Redeploy" on that deployment
3. Promote it to production if needed
4. Investigate and fix the issues in the problematic code
5. Create a hotfix branch if necessary

## Maintenance Mode

To put the application in maintenance mode:

1. Set the `NEXT_PUBLIC_MAINTENANCE_MODE` environment variable to `true`
2. Redeploy the application
3. The application will show a maintenance page to users

## Deployment Checklist

Use this checklist before each production deployment:

- [ ] All tests are passing in CI/CD pipeline
- [ ] Database migrations have been tested on staging
- [ ] Environment variables are properly configured
- [ ] Feature flags are set correctly
- [ ] Monitoring tools are configured and working
- [ ] Rollback plan is in place
- [ ] Team is notified about the upcoming deployment
- [ ] Post-deployment verification plan is ready
