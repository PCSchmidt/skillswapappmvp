@echo off
setlocal enableextensions

echo SkillSwap MVP - Cypress E2E Test Runner
echo =======================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
  echo Installing dependencies first...
  call npm install
  echo.
)

:: Get command line argument for test specification
set spec_arg=%1

if "%spec_arg%"=="" (
  echo Running all Cypress tests in headless mode...
  npx cypress run
) else if "%spec_arg%"=="open" (
  echo Opening Cypress Test Runner...
  npx cypress open
) else if "%spec_arg%"=="chrome" (
  echo Running all tests in Chrome...
  npx cypress run --browser chrome
) else if "%spec_arg%"=="firefox" (
  echo Running all tests in Firefox...
  npx cypress run --browser firefox
) else (
  echo Running specific test: %spec_arg%
  npx cypress run --spec "cypress/e2e/%spec_arg%.cy.js"
)

:: Check exit code
if %ERRORLEVEL% neq 0 (
  echo.
  echo Tests failed with exit code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
) else (
  echo.
  echo Tests completed successfully!
)

endlocal
