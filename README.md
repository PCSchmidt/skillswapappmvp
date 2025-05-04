# SkillSwap MVP

SkillSwap is a platform that enables users to exchange skills and services directly with each other through a barter system, without monetary transactions.

## Project Overview

This repository contains the MVP (Minimum Viable Product) version of SkillSwap, built with:

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Serverless API routes (Next.js)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js (v18.17.0 or later)
- npm (v9.6.7 or later)
- Supabase CLI (for local development)
- Git

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-organization/skillswap-mvp.git
   cd skillswap-mvp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local configuration
   ```

4. **Set up Supabase locally**

   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase

   # Start local Supabase
   supabase start

   # Apply migrations
   supabase db reset
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

### Testing

#### Running Unit Tests

```bash
npm test
```

#### Running E2E Tests

```bash
# Start the application in test mode
npm run dev:test

# In a separate terminal
npm run cypress
```

## Deployment

### Deployment Environments

The application supports three deployment environments:

1. **Development**: Local development environment
2. **Staging**: Pre-production testing environment
3. **Production**: Live production environment

### Deployment Process

We use GitHub Actions for CI/CD. The workflow is as follows:

- Pushes to the `dev` branch automatically deploy to the staging environment
- Pushes to the `master` branch automatically deploy to production
- Pull requests trigger test runs but don't deploy automatically

For detailed deployment instructions, see:
- [Deployment Guide](./docs/deployment.md)
- [Production Database Setup](./docs/production_database_setup.md)
- [Deployment Checklist](./docs/deployment_checklist.md)

### Required Environment Variables

For a complete list of required environment variables, see [.env.example](./.env.example).

## Architecture

### Directory Structure

- `/src`: Source code
  - `/app`: Next.js app directory with routes and API endpoints
  - `/components`: React components
  - `/contexts`: React context providers
  - `/lib`: Utility functions and services
  - `/types`: TypeScript type definitions
- `/public`: Static assets
- `/supabase`: Supabase configuration
  - `/migrations`: Database migrations
  - `/functions`: Supabase Edge Functions
  - `/seed`: Seed data for development
- `/tests`: Test files
- `/docs`: Documentation

### Key Features

- User authentication and profile management
- Skill creation and management
- Search and discovery of skills
- Trade proposal and management system
- Messaging between users
- Ratings and reviews
- Mobile-responsive design
- Progressive Web App (PWA) capabilities

## Documentation

- [Implementation Plan](./implementation_plan.md) - Detailed project roadmap
- [Development Journal](./docs/dev_journal.md) - Progress log and technical notes
- [Monitoring Setup](./docs/monitoring.md) - Error tracking and performance monitoring
- [API Documentation](./docs/api.md) - API endpoint references

## Contributing

1. Create a feature branch from `dev`
2. Make your changes
3. Ensure tests pass
4. Create a pull request to merge back into `dev`
5. Request a code review

## License

This project is proprietary and confidential. Unauthorized copying, transfer, or use is strictly prohibited.
