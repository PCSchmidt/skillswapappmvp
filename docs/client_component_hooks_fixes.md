# Client Component Hooks Fixes

This document outlines the fixes implemented to resolve issues with React hooks being used in server components.

## Problem

In Next.js 13+, components are server components by default. React hooks can only be used in client components. We encountered errors in our application where hooks were being used in server components, causing compilation failures:

```
ReactServerComponentsError:

You're importing a component that needs useState. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.
```

## Solution

We implemented a three-part solution:

1. **Add 'use client' directive**: Added the directive to files that use React hooks:
   - useSupabaseData.ts
   - useSWRFetcher.ts
   - useData.ts
   - useErrorHandler.ts
   - useSWRConfig.tsx

2. **Create client component wrappers**: Created wrapper components that isolate client-specific functionality:
   - SWRWrapper.tsx - A client component wrapper for SWRProvider

3. **Update component usage**: Updated the layout.tsx file to use the wrapper component instead of directly using components that contain hooks.

## Best Practices

When working with React hooks in Next.js 13+ projects:

1. Always add 'use client' directive to files that use React hooks
2. Create client component wrappers when you need to use client components in server components
3. Keep server components as the default for better performance
4. Use the React DevTools to identify components that are client vs. server rendered
5. Consider the data requirements when deciding if a component should be client or server

## Example Pattern

```tsx
// Component with hooks (client component)
'use client';

import { useState } from 'react';

export function ClientComponent() {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
}

// Wrapper for use in server components
'use client';

import { ReactNode } from 'react';
import { ClientComponentProvider } from './provider';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <ClientComponentProvider>{children}</ClientComponentProvider>;
}

// Usage in server component
import ClientWrapper from './ClientWrapper';

// This is a server component
export default function ServerComponent() {
  return (
    <ClientWrapper>
      {/* Children can now use client features */}
      <div>Server component content</div>
    </ClientWrapper>
  );
}
```

By following these patterns, we can properly separate client and server code while maintaining the benefits of both paradigms.
