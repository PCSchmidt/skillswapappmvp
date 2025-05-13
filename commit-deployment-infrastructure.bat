@echo off
echo Committing Phase 9 Deployment Infrastructure Changes

REM Navigate to the correct directory first
cd skillswap_mvp

REM Add new files
git add scripts/verify-deployment.js
git add deploy.js
git add docs/environment_variables_setup_guide.md
git add docs/deployment_workflow.md

REM Add modified files
git add package.json
git add docs/phase9_implementation_tracker.md

REM Commit the changes
git commit -m "Phase 9: Add comprehensive deployment infrastructure

- Added verify-deployment.js script for post-deployment verification
- Created deploy.js orchestration script for automated deployment workflow
- Added environment_variables_setup_guide.md documentation
- Created deployment_workflow.md with detailed deployment procedures
- Updated package.json with new deployment scripts
- Updated phase9_implementation_tracker.md to mark all tasks as complete
"

echo Deployment infrastructure changes committed successfully!
