@echo off
setlocal

echo SkillSwap MVP - Committing E2E Testing Changes
echo =============================================
echo.

:: Add all Cypress-related files
git add cypress/
git add docs/cypress_testing_guide.md
git add docs/phase9_implementation_tracker.md
git add run-cypress-tests.bat
git add run-cypress-tests.sh
git add package.json
git add README.md

:: Commit the changes
git commit -m "Phase 9: Add comprehensive E2E testing with Cypress

- Created test fixtures for users, skills, and matches
- Implemented E2E tests for core user flows:
  - Registration process
  - Skills search functionality
  - Match initiation and management
  - Skill management (add, edit, delete)
- Added helper scripts for running Cypress tests
- Updated documentation with testing guides
- Extended package.json with Cypress npm scripts
- Updated README with testing instructions"

echo.
echo Changes committed successfully!
echo.
echo You can now push these changes to the repository with:
echo git push origin your-branch-name
echo.

endlocal
