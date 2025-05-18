# SkillSwap Tech Stack Guidelines

This document outlines the core technologies used in SkillSwap MVP and how they should be used.

## Core Technologies

- **Next.js 14**: App Router, Server Components, Client Components
- **TypeScript 5.x**: Strict type checking enabled
- **Supabase**: Auth, Database, Storage
- **Tailwind CSS**: Styling solution
- **SWR**: Data fetching and caching
- **Jest + React Testing Library**: Testing

## Technology Usage Guidelines

### Next.js
- Use the App Router pattern
- Leverage Server Components for data-fetching pages
- Use Client Components only when interactivity is required

### TypeScript
- Full typing for all components, functions, and props
- Use interfaces for complex objects, type aliases for simpler types
- Avoid the `any` type; use proper typing or generics

### Supabase
- Use the centralized client from src/lib/supabase.ts
- Implement proper error handling for all Supabase operations
- Follow consistent query patterns

### Tailwind CSS
- Follow the project's design system (primary/secondary colors, spacing, etc.)
- Use the utility-first approach
- Extract common patterns to component classes when repeated frequently

### SWR
- Use the custom hooks in src/lib/hooks/ for data fetching
- Implement proper loading states and error handling
- Use optimistic updates for better UX
