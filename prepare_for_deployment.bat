@echo off
:: Prepare for Deployment Script (Windows)
:: This script automates the steps needed to prepare for deployment

echo =========================================
echo    SkillSwap Deployment Preparation      
echo =========================================

:: 1. Verify all ESLint dependency fixes are in place
echo Step 1: Validating dependencies...
call node scripts/validate-dependencies.js
if %ERRORLEVEL% NEQ 0 (
  echo Dependency validation failed!
  exit /b 1
)

:: 2. Run a test build
echo Step 2: Running a test build...
call build.bat
if %ERRORLEVEL% NEQ 0 (
  echo Build test failed!
  exit /b 1
)

:: 3. Commit all changes to git
echo Step 3: Committing changes to git...
echo.
echo The following files will be added to git:
git status --porcelain

echo.
set /p confirm="Would you like to commit these changes? (y/n): "
if /i "%confirm%"=="y" (
  git add package.json vercel.json docs/eslint_dependency_fix.md docs/deployment_verification_steps.md scripts/validate-dependencies.js build.sh build.bat pre-commit-hook-setup.sh pre-commit-hook-setup.bat
  git commit -m "Fix ESLint dependency conflicts for Vercel deployment"
  
  echo Changes committed successfully.
  
  :: 4. Push to the repository
  echo Step 4: Push changes to the repository...
  echo.
  set branch=dev
  set /p branch_input="Which branch would you like to push to? (default: dev): "
  if defined branch_input set branch=%branch_input%
  
  set /p push_confirm="Push to %branch% branch? (y/n): "
  if /i "%push_confirm%"=="y" (
    git push origin %branch%
    echo Changes pushed to %branch% branch.
    
    echo.
    echo Deployment preparation completed!
    echo.
    echo Next steps:
    echo 1. Monitor the Vercel build at: https://vercel.com/dashboard
    echo 2. Test the staging deployment once build completes
    echo 3. Run deployment verification: npm run verify-deployment
    echo 4. If everything looks good, deploy to production
  ) else (
    echo Push skipped. You can push manually when ready:
    echo git push origin %branch%
  )
) else (
  echo Commit skipped.
  echo You can manually commit and push when ready.
)
