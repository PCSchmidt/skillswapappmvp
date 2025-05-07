# Path Resolution Fix for Deployment

This document outlines the steps required to fix the path resolution issues encountered during the Vercel deployment.

## Current Issues

Based on the build logs, we're experiencing the following errors:

```
Failed to compile.
./src/app/auth/complete-profile/page.tsx
Module not found: Can't resolve '@/lib/supabase/client'
https://nextjs.org/docs/messages/module-not-found

./src/app/auth/resend-verification/page.tsx
Module not found: Can't resolve '@/lib/supabase/client'
https://nextjs.org/docs/messages/module-not-found

./src/app/auth/reset-password/page.tsx
Module not found: Can't resolve '@/lib/supabase/client'
https://nextjs.org/docs/messages/module-not-found

./src/app/auth/verify/page.tsx
Module not found: Can't resolve '@/lib/supabase/client'
https://nextjs.org/docs/messages/module-not-found

./src/components/auth/SignupForm.tsx
Module not found: Can't resolve '../../lib/supabase/client'
https://nextjs.org/docs/messages/module-not-found
```

## Root Cause Analysis

The issue revolves around path resolution during the build process:

1. The project uses path aliases configured in `tsconfig.json`:
   ```json
   "paths": {
     "@/*": ["./src/*"],
     "@components/*": ["./src/components/*"],
     "@lib/*": ["./src/lib/*"],
     "@types/*": ["./src/types/*"],
     "@ai/*": ["./src/ai/*"]
   }
   ```

2. These aliases work locally but are failing in the Vercel build environment.

3. The most common cause is that while TypeScript understands these aliases, webpack might need additional configuration to resolve them during the build process.

4. Additionally, there's an inconsistency in import paths - some files use `@/lib/supabase/client` while others use relative paths like `../../lib/supabase/client`.

## Solution Approaches

### Approach 1: Create a Re-export Index File

1. Create a centralized re-export file to ensure consistent paths:

```typescript
// src/lib/supabase/index.ts
export * from './client';
export * from './cachedClient';
```

2. Update all imports to use this consistent path:
   - Change `import { supabase } from '@/lib/supabase/client'` to `import { supabase } from '@/lib/supabase'`
   - Change `import { supabase } from '../../lib/supabase/client'` to `import { supabase } from '@/lib/supabase'`

### Approach 2: Ensure Next.js Path Resolution is Properly Configured

1. Update the `next.config.js` to explicitly handle path aliases:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Add path resolution for webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@lib': path.resolve(__dirname, 'src/lib/'),
      '@types': path.resolve(__dirname, 'src/types/'),
      '@ai': path.resolve(__dirname, 'src/ai/')
    };
    return config;
  }
}

module.exports = nextConfig
```

### Approach 3: Fix Inconsistent Import Paths

1. Standardize all import statements to use one consistent pattern:

For all auth-related files that are failing:
   - `src/app/auth/complete-profile/page.tsx`
   - `src/app/auth/resend-verification/page.tsx`
   - `src/app/auth/reset-password/page.tsx`
   - `src/app/auth/verify/page.tsx`
   - `src/components/auth/SignupForm.tsx`

Update imports from:
```typescript
import { supabase } from '@/lib/supabase/client';
// or
import { supabase } from '../../lib/supabase/client';
```

To:
```typescript
import { supabase } from '@/lib/supabase/client';
```

## Recommended Action Plan

1. Create the re-export index file for Supabase client (Approach 1)
2. Update the next.config.js to explicitly handle path aliases (Approach 2)
3. Commit changes and trigger a new deployment
4. Monitor build logs for any remaining path resolution issues

## Long-term Recommendations

1. Establish a consistent import pattern across the codebase
2. Create ESLint rules to enforce these patterns
3. Include a pre-build verification step in the CI/CD pipeline to catch path resolution issues early
