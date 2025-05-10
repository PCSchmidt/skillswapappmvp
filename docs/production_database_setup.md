# SkillSwap MVP Production Database Setup

This document provides detailed instructions for setting up and configuring the production Supabase database for the SkillSwap MVP application.

## Prerequisites

Before setting up the production database, ensure you have:

- A Supabase account with appropriate access permissions
- The Supabase CLI installed locally
- Access to your GitHub repository for setting environment variables
- Access to your Vercel project for configuring environment variables

## Creating a Production Supabase Project

1. Log in to the [Supabase dashboard](https://app.supabase.io)

2. Create a new project:
   - Click "New Project"
   - Select the organization (create one if needed)
   - Enter a name for the project (e.g., "skillswap-production")
   - Set a secure database password (store this safely in a password manager)
   - Select the region closest to your target users for optimal performance
   - Choose the pricing plan based on your needs (Pro is recommended for production)
   - Click "Create New Project"

3. Wait for the project to be created (usually takes 1-2 minutes)

4. Save your project reference ID and API keys:
   - Go to Project Settings > API
   - Note the following values:
     - Project URL
     - Project API keys (anon key and service_role key)
     - Project Reference ID (found in the URL, e.g., `abcdefghijklm`)

## Configuring Database Schema and Migrations

### Option 1: Using the Supabase CLI (Recommended)

1. Install the Supabase CLI if not already installed:
   ```bash
   npm install -g supabase
   # Or for a specific version:
   npm install supabase@2.22.12
   ```

2. Login to the Supabase CLI:
   ```bash
   npx supabase login
   ```

3. Link your local project to the production Supabase instance:
   ```bash
   cd skillswap_mvp
   npx supabase link --project-ref your-production-project-ref
   ```

4. Reset and apply migrations to production (use with caution - this will reset all data):
   ```bash
   npx supabase db reset --linked
   ```
   
   Or alternatively, just push migrations without resetting (for incremental updates):
   ```bash
   npx supabase db push
   ```

### Implemented Migration Strategy

We have successfully applied the following migration strategy for our production database (May 2025):

1. **Migration Sequencing**:
   - Created numbered migrations (001, 002, etc.) for core schema
   - Used timestamp-based migrations (YYYYMMDDHHMMSS) for incremental features
   - Example: `20250506000000_create_email_preferences_table.sql`

2. **Migration Dependencies**:
   - Ensured proper sequencing of interdependent tables and indexes
   - Added conditional logic for operations that depend on table existence:
   ```sql
   DO $$
   BEGIN
     IF EXISTS (
       SELECT FROM pg_tables
       WHERE schemaname = 'public' AND tablename = 'table_name'
     ) THEN
       EXECUTE 'CREATE INDEX IF NOT EXISTS idx_name ON table_name(column)';
     END IF;
   END $$;
   ```

3. **Applied Migrations**:
   - 001_initial_schema.sql: Core tables (users, skills, trades, messages)
   - 002_add_ratings_table.sql: Rating system implementation
   - 003_add_notifications_table.sql: Notification system
   - 004_performance_optimization.sql: Indexes, materialized views, caching
   - 20250506000000_create_email_preferences_table.sql: Email preferences

4. **Migration Verification**:
   After applying migrations, verify they were successfully applied:
   ```bash
   npx supabase migration list
   ```
   This will show which migrations have been applied to both local and remote databases.

### Option 2: Manual SQL Execution

If you prefer to manually apply migrations:

1. Go to the Supabase dashboard > SQL Editor
2. Navigate to your local project's `supabase/migrations` directory
3. For each migration file, in numerical order:
   - Open the file in a text editor
   - Copy the SQL content
   - Paste into the SQL Editor in Supabase dashboard
   - Run the query

## Configuring Row Level Security (RLS)

Verify and test RLS policies for all tables:

1. Go to Supabase dashboard > Authentication > Policies
2. For each table, ensure appropriate RLS policies are set:
   - Users table: Users can read public profiles, but only edit their own
   - Skills table: Users can read all skills, but only modify their own
   - Trades table: Users can only access trades they're part of
   - Messages table: Users can only access messages they've sent or received

Example policy test queries:

```sql
-- As anonymous user
SELECT * FROM users;

-- As authenticated user (replace user_id with actual test user)
SELECT * FROM skills WHERE user_id = 'auth.uid()';
```

## Configuring Database Backups

1. Go to Project Settings > Database
2. Under "Backups", configure:
   - Daily backups (enabled by default)
   - Point-in-time recovery (PITR) for continuous backup
   - Backup retention period (30 days recommended)

## Setting Up Database Webhooks (Optional)

For event-driven functionality:

1. Go to Database > Webhooks
2. Create webhooks for critical events:
   - New user registration
   - New trade creation
   - Trade status changes
   - Configure webhook endpoints to your application API

## Scaling and Performance

Configure database resources based on expected load:

1. Go to Project Settings > Database
2. Adjust compute add-ons if needed:
   - Starting recommendation: 2 CPU, 1GB RAM
   - Scale based on user growth and performance monitoring
3. Consider enabling Connection Pooling for improved performance

## Security Configuration

1. Configure IP restrictions (Project Settings > API):
   - Restrict API access to your application servers only
   - Add Vercel IP ranges if needed

2. Set up database passwords:
   - Database password (already set during creation)
   - Additional database users if needed

3. JWT settings:
   - Go to Authentication > Settings
   - Configure JWT expiry time (default: 3600 seconds)
   - Note the JWT secret or generate a new one

## Monitoring and Alerts

1. Set up database health monitoring:
   - Go to Database > Monitoring
   - Review CPU, memory, and disk usage

2. Configure email alerts for:
   - High database CPU usage
   - Storage approaching capacity
   - Connection limit warnings

## Connecting to Production Database

### From Vercel

Add these environment variables to your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

### From Local Development

To connect to the production database from your local environment (for administrative tasks only):

1. Create a `.env.production.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Use environment-specific commands:
   ```bash
   npm run with-env --env=production "supabase db execute"
   ```

## Data Migration Strategies

If migrating from an existing database:

1. Export data from source database:
   ```bash
   supabase db dump -f data-dump.sql
   ```

2. Sanitize sensitive data if needed

3. Import to production:
   ```bash
   supabase db execute --file=data-dump.sql
   ```

## Troubleshooting Common Issues

### Connection Issues

If unable to connect to the database:
- Verify network access (IP restrictions)
- Check environment variables are correctly set
- Ensure service is not in maintenance mode

### Migration Failures

If migrations fail:
- Check for syntax errors in migration files
- Verify dependencies between migrations
- Look for conflicts with existing schema
- Review the migration logs in Supabase dashboard

### Performance Issues

If experiencing slow queries:
- Review database indexes
- Check query optimizer with EXPLAIN
- Monitor connection counts
- Scale compute resources if needed

## Next Steps

After configuring the production database:

1. Test all critical database operations
2. Verify authentication flows work with the production database
3. Monitor initial performance and adjust resources as needed
4. Set up regular database maintenance procedures
5. Document database backup and restore procedures
