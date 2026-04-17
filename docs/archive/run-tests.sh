#!/bin/bash

# SkillSwap MVP Test Runner
# This script runs tests and generates coverage reports

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}SkillSwap MVP Test Runner${NC}"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js 18 or later and try again."
    exit 1
fi

# Print Node.js and npm versions
echo -e "${YELLOW}Environment:${NC}"
echo -e "Node.js: $(node -v)"
echo -e "npm: $(npm -v)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Run tests with jest
echo -e "${YELLOW}Running tests...${NC}"
echo ""

if [ "$1" == "--coverage" ] || [ "$1" == "-c" ]; then
    # Run with coverage
    npm test -- --coverage
    
    # Print coverage report location
    echo ""
    echo -e "${GREEN}Coverage report generated in ./coverage/lcov-report/index.html${NC}"
    echo "Open this file in your browser to view detailed coverage information."
elif [ "$1" == "--watch" ] || [ "$1" == "-w" ]; then
    # Run in watch mode
    npm test -- --watch
else
    # Run normal tests
    npm test
fi

# Print completion message
echo ""
echo -e "${GREEN}Test run completed.${NC}"
