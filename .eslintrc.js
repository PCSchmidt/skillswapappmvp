module.exports = {
  extends: 'next/core-web-vitals',
  // Preserve any custom rules from the original configuration
  plugins: [
    'import'
  ],
  settings: {
    'import/resolver': {
      typescript: {} // This uses the paths defined in tsconfig.json
    }
  },
  rules: {
    // Add your custom rules here
    'react/no-unescaped-entities': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    // Enforce consistent import path style
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
    // Enforce using path aliases for deep imports
    'no-restricted-imports': ['error', {
      'patterns': ['../**/*/'] // Prevent deep relative imports
    }]
  },
  // Modern configuration that avoids deprecated options
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  // Use per-project settings for TypeScript
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
    },
  ],
}
