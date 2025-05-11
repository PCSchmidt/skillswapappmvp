# Client Component Issues in Next.js App Router

## Issue Overview

The build is failing with the following error:

```
Error: Event handlers cannot be passed to Client Component props.
  {type: "button", className: ..., disabled: ..., onClick: function, children: ...}
                                                           ^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

This error is occurring across multiple pages in the application during the static generation phase.

## Cause of the Issue

In Next.js App Router, components are Server Components by default. A Server Component cannot use client-side features like:

- React hooks (`useState`, `useEffect`, etc.)
- Browser APIs (`window`, `document`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)

When we pass event handlers or interactive props to a component that is rendered as a Server Component, Next.js throws this error because Server Components cannot handle client-side interactivity.

## Affected Components and Pages

Based on the build errors, the issue affects many pages including:
- `/auth/*` pages
- `/dashboard`
- `/profile`
- `/search`
- `/matches`
- Landing page
- And others

## Solution Strategy

To fix this issue, we need to:

1. **Identify components that need client-side functionality**: Any component that uses event handlers, hooks, or browser APIs
2. **Mark these components as Client Components**: Add `'use client'` at the top of the file
3. **Refactor component boundaries**: Split components into client and server parts where appropriate
4. **Apply proper data fetching patterns**: Use appropriate methods for fetching data in Client Components

### Example Fix

```tsx
// Before (Server Component by default)
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

// After (Client Component)
'use client';

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

## Implementation Plan

1. **UI Components**: Start by marking all base UI components that have interactivity as Client Components
   - Button, Input, Switch, Form elements, etc.

2. **Feature Components**: Identify and convert feature components that require client-side functionality
   - Forms, interactive cards, components with state, etc.

3. **Page Components**: Review and refactor page components to properly separate:
   - Client-side parts (interactions, forms, state)
   - Server-side parts (data fetching, static content)

4. **Testing**: Test each converted component to ensure functionality is preserved

## Best Practices for Next.js App Router

1. **Keep Server Components as the default**: Use Server Components wherever possible for better performance
2. **Client Components for interactivity**: Only use Client Components when needed for interactivity
3. **Move Client Components down the tree**: Push client components as far down the component tree as possible
4. **Use proper boundaries**: Create clean boundaries between Server and Client Components
5. **Async Server Components**: Take advantage of async/await for data fetching in Server Components

## Related Resources

- [Next.js Documentation: Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Next.js Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching)
