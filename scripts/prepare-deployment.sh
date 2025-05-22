#!/bin/bash
# SkillSwap MVP Deployment Preparation Script
# This script guides you through all the steps needed to prepare your project for deployment

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Print header
echo -e "\n${CYAN}${BOLD}SkillSwap MVP Deployment Preparation Script${NC}\n"
echo -e "${CYAN}This script will guide you through preparing your project for deployment.${NC}"
echo -e "${CYAN}Follow the steps below and respond to any prompts.${NC}\n"

# Verify prerequisites
echo -e "${CYAN}${BOLD}Step 1: Verifying prerequisites${NC}"

# Check for Node.js
if command -v node &> /dev/null; then
    node_version=$(node -v)
    echo -e "${GREEN}✓ Node.js is installed: $node_version${NC}"
else
    echo -e "${RED}✗ Node.js is not installed. Please install Node.js v18.17.0 or higher.${NC}"
    exit 1
fi

# Check for npm
if command -v npm &> /dev/null; then
    npm_version=$(npm -v)
    echo -e "${GREEN}✓ npm is installed: $npm_version${NC}"
else
    echo -e "${RED}✗ npm is not installed. Please install npm v9.6.7 or higher.${NC}"
    exit 1
fi

# Check for Vercel CLI
if command -v vercel &> /dev/null; then
    vercel_version=$(vercel --version)
    echo -e "${GREEN}✓ Vercel CLI is installed: $vercel_version${NC}"
else
    echo -e "${YELLOW}! Vercel CLI is not installed. Installing now...${NC}"
    npm install -g vercel
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Vercel CLI installed successfully${NC}"
    else
        echo -e "${RED}✗ Failed to install Vercel CLI. Please install it manually: npm install -g vercel${NC}"
        exit 1
    fi
fi

# Check for Supabase CLI
if command -v supabase &> /dev/null; then
    supabase_version=$(supabase --version)
    echo -e "${GREEN}✓ Supabase CLI is installed: $supabase_version${NC}"
else
    echo -e "${YELLOW}! Supabase CLI is not installed. Installing now...${NC}"
    npm install -g supabase
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Supabase CLI installed successfully${NC}"
    else
        echo -e "${RED}✗ Failed to install Supabase CLI. Please install it manually: npm install -g supabase${NC}"
        exit 1
    fi
fi

# Install project dependencies
echo -e "\n${CYAN}${BOLD}Step 2: Installing project dependencies${NC}"
echo -e "${CYAN}Installing dependencies for the project...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies. Please check for errors and try again.${NC}"
    exit 1
fi

# Generate environment files
echo -e "\n${CYAN}${BOLD}Step 3: Generating environment files${NC}"
echo -e "${CYAN}Generating environment files for staging and production...${NC}"

# Generate staging environment file
echo -e "${CYAN}Generating staging environment file...${NC}"
node scripts/generate-env.js staging
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Staging environment file generated successfully${NC}"
else
    echo -e "${RED}✗ Failed to generate staging environment file.${NC}"
    exit 1
fi

# Generate production environment file
echo -e "${CYAN}Generating production environment file...${NC}"
node scripts/generate-env.js production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Production environment file generated successfully${NC}"
else
    echo -e "${RED}✗ Failed to generate production environment file.${NC}"
    exit 1
fi

echo -e "${YELLOW}! Environment files have been generated with placeholder values.${NC}"
echo -e "${YELLOW}! Please edit .env.staging and .env.production with your actual values.${NC}"

# Vercel login
echo -e "\n${CYAN}${BOLD}Step 4: Vercel authentication${NC}"
echo -e "${CYAN}Checking Vercel authentication status...${NC}"
echo -e "${YELLOW}You will need to authenticate with Vercel to continue.${NC}"

read -p "Do you want to login to Vercel now? (y/n): " login_vercel
if [[ $login_vercel == "y" || $login_vercel == "Y" ]]; then
    vercel login
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully logged in to Vercel${NC}"
    else
        echo -e "${RED}✗ Failed to login to Vercel. Please try again manually.${NC}"
        echo -e "${YELLOW}! You can continue with the rest of the setup, but you will need to login to Vercel later.${NC}"
    fi
else
    echo -e "${YELLOW}! Skipping Vercel login. You will need to login before deploying.${NC}"
fi

# Supabase setup
echo -e "\n${CYAN}${BOLD}Step 5: Supabase database setup${NC}"
echo -e "${CYAN}Checking Supabase project configuration...${NC}"

read -p "Do you want to set up the production database now? (y/n): " setup_db
if [[ $setup_db == "y" || $setup_db == "Y" ]]; then
    node scripts/setup-production-db.js
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database setup completed successfully${NC}"
    else
        echo -e "${RED}✗ Database setup encountered errors. Please check the output above.${NC}"
        echo -e "${YELLOW}! You can continue with the rest of the setup, but you will need to configure the database later.${NC}"
    fi
else
    echo -e "${YELLOW}! Skipping database setup. You will need to run this step later.${NC}"
fi

# Run unit tests
echo -e "\n${CYAN}${BOLD}Step 6: Running tests${NC}"
echo -e "${CYAN}Running unit tests to ensure everything is working...${NC}"

read -p "Do you want to run the tests now? (y/n): " run_tests
if [[ $run_tests == "y" || $run_tests == "Y" ]]; then
    npm test
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Tests passed successfully${NC}"
    else
        echo -e "${RED}✗ Tests failed. Please fix the issues before deploying.${NC}"
        echo -e "${YELLOW}! You can continue with the rest of the setup, but you should fix the tests before deploying.${NC}"
    fi
else
    echo -e "${YELLOW}! Skipping tests. Make sure to run tests before deploying.${NC}"
fi

# Deployment instructions
echo -e "\n${CYAN}${BOLD}Step 7: Ready for deployment${NC}"
echo -e "${GREEN}✓ Deployment preparation is complete!${NC}\n"

echo -e "${CYAN}${BOLD}Next steps:${NC}"
echo -e "${CYAN}1. Edit the generated environment files with your actual values:${NC}"
echo -e "   ${CYAN}- .env.staging${NC}"
echo -e "   ${CYAN}- .env.production${NC}"
echo -e "${CYAN}2. Commit your changes to git (exclude .env.* files from git)${NC}"
echo -e "${CYAN}3. Push to the appropriate branch:${NC}"
echo -e "   ${CYAN}- dev branch for staging deployment${NC}"
echo -e "   ${CYAN}- master branch for production deployment${NC}"
echo -e "${CYAN}4. Monitor the deployment in the GitHub Actions tab${NC}"
echo -e "${CYAN}5. Verify the deployment using the verify-deployment script:${NC}"
echo -e "   ${CYAN}- node scripts/verify-deployment.js --url=https://your-deployment-url${NC}\n"

echo -e "${CYAN}For more detailed instructions, refer to:${NC}"
echo -e "${CYAN}- docs/deployment.md${NC}"
echo -e "${CYAN}- docs/production_database_setup.md${NC}"
echo -e "${CYAN}- docs/deployment_checklist.md${NC}"
echo -e "${CYAN}- docs/deployment_steps.md${NC}\n"

echo -e "${GREEN}${BOLD}Happy deploying!${NC}\n"
