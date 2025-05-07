#!/bin/bash

# Exit on error
set -e

echo "Starting custom build process..."

# Display Node and npm versions
echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"

# Use the simplified vercel package.json if available
if [ -f "vercel-package.json" ]; then
  echo "Using vercel-package.json for deployment..."
  cp vercel-package.json package.json
  echo "Contents of package.json:"
  cat package.json
fi

# Clean any existing build artifacts
echo "Cleaning previous build..."
rm -rf .next || true
rm -rf node_modules/.cache || true

# Install dependencies
echo "Installing dependencies..."
npm ci

# Manually install TypeScript and ESLint with exact versions
echo "Installing TypeScript and ESLint with fixed versions..."
npm install --no-save typescript@5.0.4 eslint@8.57.0 eslint-config-next@14.0.4 @typescript-eslint/eslint-plugin@6.19.1 @typescript-eslint/parser@6.19.1

# Verify TypeScript is installed correctly
echo "TypeScript version: $(./node_modules/.bin/tsc --version || echo 'TypeScript not found')"

# Skip type checking for the build to avoid TypeScript errors
echo "Building Next.js application..."
NEXT_TELEMETRY_DISABLED=1 npm run build || {
  echo "Build failed. Attempting build with extended options..."
  NODE_OPTIONS="--max-old-space-size=4096" NEXT_TELEMETRY_DISABLED=1 npm run build
}

echo "Build process completed."
