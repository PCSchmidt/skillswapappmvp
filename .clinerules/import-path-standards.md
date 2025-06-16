# SkillSwap Import Path Standards

This document defines the import path standards for the SkillSwap MVP project.

## Import Path Patterns

### Absolute Imports
Use absolute imports with the `@/` prefix for all imports from the `src` directory:

```typescript
// ✅ Correct
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { UserType } from '@/types';

// ❌ Incorrect
import Button from '../../components/ui/Button';
import { useAuth } from '../../../lib/hooks/useAuth';
```

### External Dependencies
Import external dependencies directly:

```typescript
// ✅ Correct
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createBrowserClient } from '@supabase/ssr';
```

### Type Imports
Use explicit type imports when importing only types:

```typescript
// ✅ Correct
import type { User, Profile } from '@/types';

// ❌ Incorrect
import { User, Profile } from '@/types';
```

## Import Order

Organize imports in the following order, separated by blank lines:

1. React and Next.js imports
2. External libraries
3. Project imports (components, hooks, utils)
4. Type imports
5. Asset imports (CSS, images)

Example:

```typescript
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';

import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatDate } from '@/lib/utils';

import type { User, AuthResponse } from '@/types';

import '@/styles/component.css';
```

## Barrel Exports

Use barrel exports (index.ts files) for related components to simplify imports:

```typescript
// src/components/ui/index.ts
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';

// Usage in other files
import { Button, Card, Input } from '@/components/ui';
```

## Path Aliases

The project is configured with the following path aliases:

- `@/` - Maps to the `src/` directory
- `@components/` - Maps to the `src/components/` directory
- `@lib/` - Maps to the `src/lib/` directory
- `@styles/` - Maps to the `src/styles/` directory
- `@types/` - Maps to the `src/types/` directory

Prefer using the `@/` prefix for consistency across the codebase.
