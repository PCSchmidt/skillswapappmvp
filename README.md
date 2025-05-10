# SkillSwap MVP Deployment Guide

## License

Copyright Paul C. Schmidt 2025. All rights reserved. Unauthorized use, reproduction, or distribution of this software is prohibited.

## Deployment Verification Status

⚠️ **Note: ESLint dependency issues fixed and pending deployment verification**

## Quick Start

To prepare for deployment after fixing ESLint dependency issues:

```bash
# On Windows
.\prepare_for_deployment.bat

# On Linux/Mac
./prepare_for_deployment.sh
```

## ESLint Dependency Fix

This project recently addressed an ESLint dependency conflict that caused Vercel build failures. The specific error was related to `@eslint/config-array@^3.0.0` not being found. 

The fix includes:
- Specifying exact versions for ESLint-related packages
- Adding dependency validation tools
- Updating build scripts with validation steps
- Creating documentation on the issue and solution

For more details, see [ESLint Dependency Fix Documentation](docs/eslint_dependency_fix.md).

## Deployment Steps

Follow these steps to deploy the application:

1. Run the dependency validation to ensure compatibility:
   ```
   node scripts/validate-dependencies.js
   ```

2. Test the build process locally:
   ```
   # On Windows
   .\build.bat
   
   # On Linux/Mac 
   ./build.sh
   ```

3. Set up Git pre-commit hooks (optional but recommended):
   ```
   # On Windows
   .\pre-commit-hook-setup.bat
   
   # On Linux/Mac
   ./pre-commit-hook-setup.sh
   ```

4. Commit and push changes to the repository:
   ```
   git add package.json vercel.json docs/eslint_dependency_fix.md
   git commit -m "Fix ESLint dependency conflicts for Vercel deployment"
   git push origin dev
   ```

5. Monitor the Vercel build at: https://vercel.com/dashboard

6. Test the staging environment thoroughly

7. Deploy to production when staging is verified

For complete deployment steps, see [Deployment Verification Steps](docs/deployment_verification_steps.md).

## Project Structure

The SkillSwap MVP is a Next.js application with the following key components:

- `/src`: Application source code
- `/public`: Static assets
- `/docs`: Documentation
- `/scripts`: Utility scripts
- `/supabase`: Database migrations and functions

## Environment Setup

Before deploying, ensure all environment variables are properly configured. See [Environment Variables Setup](docs/environment_variables_setup.md) for details.

## Troubleshooting

If you encounter deployment issues, refer to [Deployment Troubleshooting](docs/deployment_troubleshooting.md).
