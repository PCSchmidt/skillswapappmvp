# Import Path and Dependency Issues - Deployment Fix

Our build is failing in the Vercel deployment environment with two main issues:

## Issue 1: Import Path Resolution
```
Module not found: Can't resolve ''lib/supabase/client''
```

This indicates a path resolution issue with the Supabase client. In `SupabaseContext.tsx`, we found:

```typescript
import { supabase } from '@/lib/supabase/client';
```

But we found that the proper file structure is:
- `src/lib/supabase/client.ts` - The actual client implementation
- `src/lib/supabase/index.ts` - Re-exports from client.ts and cachedClient.ts

### Solution:

1. Update all imports that use `@/lib/supabase/client` to use the proper path:

```typescript
// Change this:
import { supabase } from '@/lib/supabase/client';

// To this:
import { supabase } from '@/lib/supabase';
```

2. Make sure the tsconfig.json has proper path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

3. Check the Next.js config to ensure it's properly handling path resolution.

## Issue 2: Missing @supabase/ssr Dependency
```
Module not found: Can't resolve '@supabase/ssr'
Module not found: Can't resolve '@supabase/ssr'
```

The build logs show deprecation warnings for the old Supabase auth packages:
```
npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
```

### Solution:

1. Install the new @supabase/ssr package:

```bash
npm install @supabase/ssr
```

2. Update the code that uses the deprecated packages to use the new one.

## Implementation Plan

1. **Fix Package Dependencies**:
   - Add @supabase/ssr to package.json
   - Remove deprecated packages if they're explicitly declared

2. **Fix Import Paths**:
   - Update SupabaseContext.tsx and any other files that import from '@/lib/supabase/client'
   - Make sure they import from '@/lib/supabase' instead

3. **Redeploy**:
   - After making these changes, commit and push to trigger a new Vercel deployment

## Example Update for SupabaseContext.tsx

```typescript
// Change this:
import { supabase } from '@/lib/supabase/client';

// To this:
import { supabase } from '@/lib/supabase';
```

## Long-term Solution

To prevent similar issues in the future:

1. **Standardize Import Patterns**:
   - Always use import aliases like '@/lib/supabase' rather than direct file paths
   - Use barrel exports (index.ts files) to simplify imports

2. **Automate Dependency Updates**:
   - Regularly check for deprecated packages
   - Consider using tools like Dependabot to keep dependencies current

3. **Local Build Testing**:
   - Run a production build locally before deploying
   - Use the same Node.js version locally as in your deployment environment
