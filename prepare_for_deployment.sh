#!/bin/bash

# Prepare for Deployment Script
# This script automates the steps needed to prepare for deployment

set -e  # Exit on error

echo "========================================="
echo "   SkillSwap Deployment Preparation      "
echo "========================================="

# 1. Verify all ESLint dependency fixes are in place
echo "Step 1: Validating dependencies..."
node scripts/validate-dependencies.js

# 2. Run a test build
echo "Step 2: Running a test build..."
./build.sh

# 3. Commit all changes to git
echo "Step 3: Committing changes to git..."
echo ""
echo "The following files will be added to git:"
git status --porcelain

echo ""
read -p "Would you like to commit these changes? (y/n): " confirm
if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
  git add package.json vercel.json docs/eslint_dependency_fix.md docs/deployment_verification_steps.md scripts/validate-dependencies.js build.sh build.bat pre-commit-hook-setup.sh pre-commit-hook-setup.bat
  git commit -m "Fix ESLint dependency conflicts for Vercel deployment"
  
  echo "Changes committed successfully."
  
  # 4. Push to the repository
  echo "Step 4: Push changes to the repository..."
  echo ""
  read -p "Which branch would you like to push to? (default: dev): " branch
  branch=${branch:-dev}
  
  read -p "Push to $branch branch? (y/n): " push_confirm
  if [[ $push_confirm == [yY] || $push_confirm == [yY][eE][sS] ]]; then
    git push origin $branch
    echo "Changes pushed to $branch branch."
    
    echo ""
    echo "Deployment preparation completed!"
    echo ""
    echo "Next steps:"
    echo "1. Monitor the Vercel build at: https://vercel.com/dashboard"
    echo "2. Test the staging deployment once build completes"
    echo "3. Run deployment verification: npm run verify-deployment"
    echo "4. If everything looks good, deploy to production"
  else
    echo "Push skipped. You can push manually when ready:"
    echo "git push origin $branch"
  fi
else
  echo "Commit skipped."
  echo "You can manually commit and push when ready."
fi
