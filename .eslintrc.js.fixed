module.exports = {
  extends: 'next/core-web-vitals',
  // Preserve any custom rules from the original configuration
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
