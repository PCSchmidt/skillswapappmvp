# Supabase RLS Migration Required

## Issue: Security Advisor Warnings

The Supabase Security Advisor has flagged 4 tables that don't have Row Level Security (RLS) enabled:

1. `public.skill_translations`
2. `public.category_translations` 
3. `public.query_cache`
4. `public.supported_languages`

## Solution: RLS Migration Created

I've created a migration file `005_enable_rls_for_support_tables.sql` that will:

### For `supported_languages` table:
- Enable RLS
- Allow public read access (reference data)
- Restrict modifications to service role only

### For `skill_translations` table:
- Enable RLS
- Allow public read access
- Allow users to modify translations for skills they own
- Allow service role to manage all translations

### For `category_translations` table:
- Enable RLS
- Allow public read access (reference data)
- Restrict modifications to service role only

### For `query_cache` table:
- Enable RLS
- Allow authenticated users to read cache entries
- Allow authenticated users to insert cache entries
- Allow service role to manage all cache entries

## Manual Application Required

Since there's no Supabase CLI configured in this project, the migration needs to be applied manually:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the content from `supabase/migrations/005_enable_rls_for_support_tables.sql`
4. Execute the migration

## Verification

After applying the migration, the Security Advisor should show no RLS errors for these tables.

## Impact Assessment

- **Zero budget impact**: RLS policies are configuration, not usage
- **Zero functionality impact**: These tables are currently unused by the application
- **Security improvement**: Proper access controls now in place
- **Future-proof**: Ready for when internationalization features are implemented

## Files Modified

- `supabase/migrations/005_enable_rls_for_support_tables.sql` (new)

The migration is conservative and follows the principle of least privilege while ensuring the application can function properly.
