@echo off
echo Committing import path standardization changes...
echo.

git add docs/import_fix_summary.md
git add jest.config.js
git add next.config.js
git add package.json
git add sentry.client.config.js
git add src/app/auth/reset-password/page.tsx
git add tsconfig.json
git add vercel.json
git add docs/import_path_standardization.md
git add run-tests-after-import-update.bat
git add run-update-imports.bat
git add scripts/update-imports.js

git commit -m "Fix: Standardize import paths to resolve deployment failures"
echo.
echo Changes committed successfully!
echo.
echo You can now push the changes with: git push origin fix/client-component-issues
pause
