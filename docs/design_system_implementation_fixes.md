# Design System Implementation Fixes

This document outlines the fixes made to the Storybook configuration and provides guidance for further implementation of the design system.

## Storybook Configuration Fixes

### 1. Framework Configuration

The Storybook configuration was updated from using the experimental `@storybook/experimental-nextjs-vite` to the stable `@storybook/nextjs` framework. This resolves compatibility issues with the current Next.js setup.

```typescript
// .storybook/main.ts
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  // ...
  "framework": {
    "name": "@storybook/nextjs",
    "options": {}
  },
  // ...
};
```

### 2. Addon Configuration

Updated the addons configuration to use only the necessary addons:

```typescript
"addons": [
  "@storybook/addon-links",
  "@storybook/addon-essentials",
  "@storybook/addon-interactions"
],
```

### 3. Context Providers

Created a decorator to provide the necessary contexts for components that rely on SupabaseContext:

```typescript
// .storybook/decorators.tsx
export const withContexts = (Story: React.ComponentType) => {
  return (
    <SupabaseProvider>
      <Story />
    </SupabaseProvider>
  );
};
```

### 4. Tailwind CSS Integration

Updated the preview configuration to properly import Tailwind styles:

```typescript
// .storybook/preview.ts
import '../src/app/globals.css'; // Import your Tailwind CSS
```

### 5. Dependencies

Installed missing dependencies:

```bash
npm install @headlessui/react --save
```

### 6. Supabase Environment Variables

Added mock environment variables for Supabase to prevent the "supabaseUrl is required" error:

```typescript
// .storybook/mockSupabase.ts
export const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://storybook-mock.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon-key-for-storybook-environment',
};

// Expose to window.process.env
if (typeof window !== 'undefined') {
  window.process = {
    ...window.process,
    env: {
      ...window.process?.env,
      ...mockEnv
    }
  };
}
```

Then imported in the preview file:

```typescript
// .storybook/preview.ts
import './mockSupabase'; // Import mock Supabase configuration
```

## Design System Implementation Guidelines

### Component Organization

Components should be organized into the following categories:

1. **UI Components**: Basic building blocks (e.g., Button, Input, Card)
2. **Layout Components**: Structural components (e.g., Container, Grid, Section)
3. **Feature Components**: Domain-specific components (e.g., SkillCard, ProfileHeader)
4. **Composite Components**: Combinations of UI components for specific patterns

### Documentation Standards

Each component should include:

1. **Component Description**: What the component is and when to use it
2. **Props API**: All available props with types and descriptions
3. **Variants**: Visual representation of all variants
4. **Usage Examples**: Code examples showing common usage patterns
5. **Accessibility Considerations**: ARIA attributes, keyboard navigation, etc.
6. **Design Guidelines**: Recommendations for proper usage

### Story Structure

Follow this pattern for component stories:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import ComponentName from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description...'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Prop configurations
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Default story
export const Default: Story = {
  args: {
    // Default props
  },
};

// Variant demonstrations
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      {/* Render different variants */}
    </div>
  ),
};

// Usage examples
export const Examples: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Usage examples */}
    </div>
  ),
};
```

## Next Steps

1. **Component Audit**: Review all UI components to ensure they follow the design system guidelines
2. **Story Creation**: Create stories for any components missing documentation
3. **Theme Integration**: Ensure components correctly respond to theme changes
4. **Accessibility Testing**: Verify all components meet accessibility standards
5. **Component Playground**: Create a playground for testing component combinations

## Running Storybook

```bash
npm run storybook
```

This will start Storybook at http://localhost:6006/
