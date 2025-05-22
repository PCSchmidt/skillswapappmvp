# ESLint and Git Hooks Configuration

This document details the ESLint configuration and Git hooks setup implemented for the SkillSwap MVP project.

## ESLint Configuration

The ESLint configuration has been updated to include stricter import path validation and better TypeScript integration. This helps maintain consistent code quality and prevents import-related issues that could cause problems during deployment.

### Key Features

- **Import Path Validation**: Using `eslint-plugin-import` to validate all import paths
- **TypeScript Path Resolution**: Using `eslint-import-resolver-typescript` to resolve TypeScript path aliases
- **Alphabetized Imports**: Enforcing consistent import order and grouping
- **Restricted Deep Imports**: Preventing problematic deep relative imports (e.g., `../../components/SomeComponent`)
- **Consistent Style**: Enforcing consistent React and TypeScript coding patterns

### Configuration Details

The updated `.eslintrc.js` includes:

```js
module.exports = {
  extends: 'next/core-web-vitals',
  plugins: [
    'import'
  ],
  settings: {
    'import/resolver': {
      typescript: {} // Uses paths defined in tsconfig.json
    }
  },
  rules: {
    // React rules
    'react/no-unescaped-entities': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    
    // Variable usage
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    
    // Import path rules
    'import/no-unresolved': 'error',
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'pathGroups': [
        {
          'pattern': '@/**',
          'group': 'internal'
        }
      ],
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true
      }
    }],
    
    // Deep import restriction
    'no-restricted-imports': ['error', {
      'patterns': ['../**/*/'] // Prevent deep relative imports
    }]
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
    },
  ],
}
```

## Git Hooks

Git hooks have been set up using Husky to automate code quality checks before commits and pushes.

### Installed Hooks

1. **Pre-commit Hook**: Runs ESLint with auto-fix on all staged files
   ```bash
   npx eslint --fix .
   ```

2. **Pre-push Hook**: Runs a build verification to ensure code can be built successfully
   ```bash
   npm run prebuild:verify
   ```

### Hook Implementation

The hooks are installed in the `.husky` directory and are automatically executed during Git operations.

### Benefits

- **Consistent Code Quality**: Ensures all committed code meets the project's style guidelines
- **Early Error Detection**: Catches potential build errors before they reach the remote repository
- **Automated Fixes**: Automatically fixes minor style issues without developer intervention
- **Deployment Readiness**: Verifies that code is always in a deployable state

## Setup for New Developers

New developers joining the project should run the following commands to set up the hooks:

```bash
# Install dependencies
npm install

# Install Husky hooks
npx husky install
```

## Troubleshooting

If Git hooks are not executing:

1. Make sure Husky is properly installed
2. Verify hook permissions are set correctly
3. Try reinstalling the hooks with `npx husky install`

For ESLint-related issues:

1. Check that all ESLint dependencies are installed
2. Run `npm run lint:fix` to see detailed error messages
3. Verify the correct `.eslintrc.js` file is being used

## Notes for CI/CD

When implementing CI/CD pipelines, ensure:

1. Lint checks are part of the pipeline
2. Build verification is performed before deployment
3. Code coverage checks are included in test runs
