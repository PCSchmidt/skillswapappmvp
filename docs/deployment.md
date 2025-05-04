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
2. Link the GitHub repository
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Set up environment variables in the Vercel dashboard

### GitHub Actions Deployment Pipeline

The application uses GitHub Actions for automated CI/CD:

1. `test.yml`: Runs unit and E2E tests on every push and pull request
2. `deploy.yml`: Automatically deploys to staging when pushed to `dev` branch, and to production when pushed to `master`

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
2. Configure DNS records as instructed by Vercel
3. Verify domain ownership
4. Vercel will automatically provision SSL certificates

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
