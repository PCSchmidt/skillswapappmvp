#!/bin/bash

echo "SkillSwap MVP - Cypress E2E Test Runner"
echo "======================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies first..."
  npm install
  echo ""
fi

# Get command line argument for test specification
spec_arg=$1

if [ -z "$spec_arg" ]; then
  echo "Running all Cypress tests in headless mode..."
  npx cypress run
elif [ "$spec_arg" = "open" ]; then
  echo "Opening Cypress Test Runner..."
  npx cypress open
elif [ "$spec_arg" = "chrome" ]; then
  echo "Running all tests in Chrome..."
  npx cypress run --browser chrome
elif [ "$spec_arg" = "firefox" ]; then
  echo "Running all tests in Firefox..."
  npx cypress run --browser firefox
else
  echo "Running specific test: $spec_arg"
  npx cypress run --spec "cypress/e2e/$spec_arg.cy.js"
fi

# Check exit code
if [ $? -ne 0 ]; then
  echo ""
  echo "Tests failed with exit code $?"
  exit $?
else
  echo ""
  echo "Tests completed successfully!"
fi
