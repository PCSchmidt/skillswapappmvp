# Client Components Usage Guide in Next.js Server Components

## Problem: "Event handlers cannot be passed to Client Component props"

When building with Next.js App Router (which uses React Server Components), you may encounter the following error:

```
Error: Event handlers cannot be passed to Client Component props.
  {variant: "primary", onClick: function, children: ...}
                                ^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

This error occurs because:

1. Server Components cannot include client-side interactivity directly
2. Event handlers (like `onClick`, `onChange`, etc.) are client-side functionality
3. When a Server Component tries to pass these handlers to a Client Component, React throws this error

## Solution: Component Wrappers

To solve this problem, we've implemented wrapper components that act as intermediaries between server and client components. The primary example is `ButtonWrapper`.

### Using ButtonWrapper

The `ButtonWrapper` component is a Client Component that wraps around our base `Button` component, allowing you to use buttons with event handlers in Server Components.

**Example Usage:**

```tsx
// In a Server Component (default in App Router)
import ButtonWrapper from '@/components/wrappers/ButtonWrapper';

export default function ServerComponent() {
  return (
    <ButtonWrapper 
      variant="primary"
      onClick={() => {
        // This will work correctly!
        console.log('Button clicked');
      }}
    >
      Click Me
    </ButtonWrapper>
  );
}
```

### How It Works

1. `ButtonWrapper` is marked with `'use client'` directive
2. It accepts the same props as our base `Button` component
3. It renders a `Button` component, passing through all props
4. Since event handlers are passed from a Client Component to another Client Component, React doesn't throw an error

## Best Practices

1. **Identify interactive UI elements in server components**:
   - Buttons
   - Form elements
   - Interactive cards/panels
   - Any element with event handlers

2. **Use the appropriate wrapper**:
   - `ButtonWrapper` for buttons
   - Create additional wrappers for other interactive components as needed

3. **Keep wrapper components thin**:
   - Wrappers should only handle the passing of props
   - Avoid adding complex logic in wrappers

4. **Consider making sections client components**:
   - If a section has multiple interactive elements, consider making the entire section a Client Component
   - This can be more efficient than using many individual wrappers

## Troubleshooting

If you still see the "Event handlers cannot be passed to Client Component props" error:

1. **Check component imports**:
   - Make sure you're importing the wrapper (e.g., `ButtonWrapper`) and not the base component directly

2. **Check component hierarchy**:
   - Ensure you're not passing event handlers from a Server Component to a Client Component at any level of nesting

3. **Verify wrapper implementation**:
   - Check that your wrapper is correctly marked with `'use client'`
   - Ensure the wrapper correctly passes all props to the base component

## Advanced Patterns

For more complex scenarios, consider these patterns:

### Component Islands

Break your page into "islands" of client-side interactivity, keeping most of your UI as Server Components:

```tsx
// ClientInteractiveSection.tsx
'use client';

export default function ClientInteractiveSection() {
  // All interactive logic here
}

// ServerPage.tsx (Server Component)
import ClientInteractiveSection from './ClientInteractiveSection';

export default function ServerPage() {
  return (
    <div>
      <h1>Static content rendered on server</h1>
      <ClientInteractiveSection />
    </div>
  );
}
```

### State Lifting

For components that share state, lift the state to a common Client Component parent:

```tsx
// InteractiveContainer.tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function InteractiveContainer() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
      <p>Count: {count}</p>
    </div>
  );
}
```

## Contributing

If you create a new wrapper component for reuse:

1. Place it in the `src/components/wrappers/` directory
2. Follow the naming pattern: `[ComponentName]Wrapper.tsx`
3. Ensure proper documentation within the component file
4. Update this guide as needed

## Additional Resources

- [Next.js Documentation on Server Components](https://nextjs.org/docs/getting-started/react-essentials#server-components)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Patterns for React Server Components](https://vercel.com/blog/understanding-react-server-components)
