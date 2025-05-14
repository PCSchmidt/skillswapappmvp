# Import Path Standardization

## Overview

This document outlines the approach for standardizing import paths across the SkillSwap MVP project. The standardization addresses deployment failures caused by inconsistent import path usage and improves code maintainability.

## Problem Statement

The project was experiencing deployment failures due to inconsistent import path patterns:

1. **Direct imports without prefix**: `import Component from 'components/path'`
2. **Alias imports with @ prefix**: `import Component from '@components/path'`
3. **Standard Next.js imports**: `import Component from '@/components/path'`

These inconsistencies caused module resolution failures during testing and production builds, particularly in Jest tests and Vercel deployments.

## Solution

### Standardized Import Format

All imports are standardized to use the Next.js convention with the `@/` prefix:

```javascript
// Before (inconsistent):
import Button from 'components/ui/Button';
import Input from '@components/ui/Input';

// After (standardized):
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
```

### Implementation Components

#### 1. Configuration Updates

**tsconfig.json**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**jest.config.js**
```javascript
moduleNameMapper: {
  // Primary path alias
  '^@/(.*)$': '<rootDir>/src/$1',
  
  // Legacy import paths (for backward compatibility during transition)
  '^components/(.*)$': '<rootDir>/src/components/$1',
  '^lib/(.*)$': '<rootDir>/src/lib/$1',
  // ... additional mappings
}
```

**next.config.js**
```javascript
const nextConfig = {
  // ... other config
  webpack: (config) => {
    // ... other webpack config
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    return config;
  },
};
```

**vercel.json**
```json
{
  "buildCommand": "npm ci && npm run update-imports && SKIP_TYPE_CHECK=true npm run build"
}
```

#### 2. Automated Import Path Standardization Script

The `scripts/update-imports.js` script automatically updates import paths across the codebase:

- Scans all source and test files
- Identifies non-standardized import patterns
- Converts them to the standardized `@/` prefix format
- Preserves original file structure and formatting

#### 3. Utility Batch Files

- `run-update-imports.bat`: Runs the import path standardization script
- `run-tests-after-import-update.bat`: Updates imports and runs tests to verify changes

## Implementation Process

1. **Configuration Setup**:
   - Update tsconfig.json with proper path aliases
   - Update jest.config.js to handle both standardized and legacy imports
   - Update next.config.js with webpack alias configuration
   - Update vercel.json to run the import path standardization script during build

2. **Script Development**:
   - Create the update-imports.js script to automate the standardization process
   - Test the script on a small subset of files to ensure it works correctly
   - Run the script on the entire codebase

3. **Verification**:
   - Run tests to ensure all imports are working correctly
   - Verify that the application builds successfully
   - Deploy to staging to ensure the deployment process works

## Benefits

1. **Consistent Import Paths**: All imports follow the same pattern with the `@/` prefix
2. **Improved IDE Support**: Better autocompletion and navigation
3. **Reliable Testing**: Jest can correctly resolve imports in test files
4. **Successful Deployments**: Vercel builds complete without path resolution errors
5. **Maintainability**: Easier to understand and maintain the codebase

## Usage

### Running the Import Path Standardization Script

```bash
# Using npm script
npm run update-imports

# Using batch file (Windows)
run-update-imports.bat
```

### Verifying Changes with Tests

```bash
# Using batch file (Windows)
run-tests-after-import-update.bat
```

## Best Practices for Future Development

1. **Always use the `@/` prefix** for imports from the src directory
2. **Use relative imports** (`./` or `../`) for imports within the same directory or nearby directories
3. **Use the standardized import format** in all new files and components
4. **Run the import path standardization script** before committing changes to ensure consistency

## Conclusion

The import path standardization approach provides a consistent and reliable way to handle imports across the SkillSwap MVP project. By standardizing on the Next.js convention with the `@/` prefix, we ensure that all imports work correctly in development, testing, and production environments.
