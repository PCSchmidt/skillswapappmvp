# SkillSwap MVP Architecture Overview

This document provides architectural guidelines for the SkillSwap MVP application.

## Application Structure

- **Next.js App Router**: All pages are organized under src/app/
- **UI Components**: Reusable components in src/components/
- **Data Access Layer**: Abstractions in src/lib/

## Key Design Patterns

1. **Server Components First**: Use React Server Components by default unless client interactivity is required
2. **Data Fetching Strategy**:
   - Server components: Direct Supabase calls
   - Client components: SWR with custom hooks
3. **Component Composition**: Build pages from smaller, focused components
4. **State Management Hierarchy**:
   - Local component state → Context API → SWR cache → Server state

## Architectural Boundaries

1. Components should not directly import from unrelated feature modules
2. Database access should only happen through the lib/supabase abstraction
3. UI component variants should be composed using props rather than creating new components
