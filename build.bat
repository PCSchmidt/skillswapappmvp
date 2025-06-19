@echo off
echo Starting custom build process...

echo Node version:
node -v
echo npm version:
npm -v

REM Use simplified vercel package.json if available
if exist vercel-package.json (
  echo Using vercel-package.json for deployment...
  copy vercel-package.json package.json /Y
  echo Contents of package.json:
  type package.json
)

REM Clean existing build artifacts
echo Cleaning previous build...
if exist .next rmdir /S /Q .next
if exist node_modules\.cache rmdir /S /Q node_modules\.cache

REM Install dependencies
echo Installing dependencies...
call npm ci

REM Install TypeScript and ESLint with exact versions
echo Installing TypeScript and ESLint with fixed versions...
call npm install --no-save typescript@5.0.4 eslint@8.57.0 eslint-config-next@14.0.4 @typescript-eslint/eslint-plugin@6.19.1 @typescript-eslint/parser@6.19.1

REM Verify TypeScript is installed correctly
echo TypeScript version:
call node_modules\.bin\tsc --version || echo TypeScript not found

REM Build Next.js application with telemetry disabled
echo Building Next.js application...
set NEXT_TELEMETRY_DISABLED=1
call npm run build || (
  echo Build failed. Attempting build with extended options...
  set NODE_OPTIONS=--max-old-space-size=4096
  call npm run build
)

echo Build process completed.
