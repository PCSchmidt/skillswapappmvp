#!/bin/bash

# Pre-commit Hook Setup Script for SkillSwap MVP
# This script sets up Git pre-commit hooks to validate dependencies
# and prevent common deployment issues.

echo "Setting up pre-commit hooks for SkillSwap MVP..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create pre-commit hook that ONLY validates dependencies (ESLint is disabled)
cat > .git/hooks/pre-commit << 'EOL'
#!/bin/bash

echo "Running pre-commit checks..."

# Validate dependencies only
echo "Validating critical dependencies..."
node scripts/validate-dependencies.js
if [ $? -ne 0 ]; then
  echo "Dependency validation failed. Commit aborted."
  exit 1
fi

# ESLint checks are disabled until configuration issues are resolved
echo "ESLint checks are temporarily disabled."

echo "All pre-commit checks passed!"
exit 0
EOL

# Make the hook executable
chmod +x .git/hooks/pre-commit

echo "Git pre-commit hook installed successfully!"
echo "This hook will run automatically before each commit to validate dependencies."
echo "ESLint checks are temporarily disabled until configuration issues are resolved."
echo "To bypass the hook in exceptional cases, use 'git commit --no-verify' (not recommended)."
