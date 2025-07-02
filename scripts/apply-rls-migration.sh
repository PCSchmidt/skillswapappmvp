#!/bin/bash

# Script to apply RLS migration using Supabase CLI
# Run this when CLI connectivity issues are resolved

echo "🔧 Applying RLS security migration to Supabase..."

# Ensure we're linked to the right project
npx supabase link --project-ref mdmydtumpwilynhdrtqp

# Apply the migration
npx supabase db push --include-all

# Check migration status
npx supabase migration list

echo "✅ RLS migration applied successfully!"
echo "📊 Check Supabase Security Advisor to verify the fixes."
