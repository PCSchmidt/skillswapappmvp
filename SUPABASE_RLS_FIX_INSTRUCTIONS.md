# Supabase RLS Security Fix Instructions

## Issue Summary
The Supabase Security Advisor is showing 4 RLS (Row Level Security) errors for tables that don't have RLS enabled:

1. `public.supported_languages`
2. `public.skill_translations` 
3. `public.category_translations`
4. `public.query_cache`

## Manual Migration Instructions

Since we don't have Supabase CLI set up for this project, you'll need to apply the RLS policies manually through the Supabase dashboard.

### Step 1: Access SQL Editor
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/mdmydtumpwilynhdrtqp
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query

### Step 2: Apply the Migration
Copy and paste the contents of `supabase/migrations/005_enable_rls_for_support_tables.sql` into the SQL editor and run it.

This comprehensive migration includes proper security policies for each table type.

**Quick Summary of what it does:**
- Enables RLS on all 4 tables
- Allows public read access to translation/reference tables
- Restricts write access appropriately 
- Adds proper documentation comments

### Step 3: Verify the Fix
1. After running the migration, go back to **Advisors** → **Security Advisor**
2. Click **Refresh** to update the security scan
3. The 4 RLS errors should be resolved

## What These Policies Do

### Security Impact
- **No breaking changes**: The policies allow the same access patterns the app currently uses
- **Public read access**: These are reference/translation tables that need to be publicly readable
- **Query cache management**: Only authenticated users can write to the cache table

### Free Tier Impact
- **Zero cost impact**: RLS policies are configuration, not usage
- **No additional bandwidth**: Same data access patterns
- **Security improvement**: Follows Supabase security best practices

## Expected Results
- Security Advisor errors reduced from 23 to ~19
- No impact on app functionality
- Better security posture for production
- Compliance with Supabase security recommendations

## Next Steps
After applying this migration:
1. Monitor the Security Advisor for any remaining issues
2. Check if there are any performance-related issues that need attention
3. Verify the browser console errors are reduced (this should help with some of them)

## Troubleshooting
If you encounter any errors when running the migration:
1. Check that the tables exist: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
2. Verify current RLS status: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
3. If a policy already exists, you may need to drop it first: `DROP POLICY IF EXISTS "policy_name" ON table_name;`
