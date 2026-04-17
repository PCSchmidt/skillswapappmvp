@echo off
:: SkillSwap MVP Test Runner
:: This script runs tests and generates coverage reports

echo SkillSwap MVP Test Runner
echo ====================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js 18 or later and try again.
    exit /b 1
)

:: Print Node.js and npm versions
echo Environment:
node -v
npm -v
echo.

:: Check if dependencies are installed
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

:: Run tests with jest
echo Running tests...
echo.

if "%1"=="--coverage" (
    :: Run with coverage
    call npm test -- --coverage
    
    :: Print coverage report location
    echo.
    echo Coverage report generated in ./coverage/lcov-report/index.html
    echo Open this file in your browser to view detailed coverage information.
) else if "%1"=="-c" (
    :: Run with coverage
    call npm test -- --coverage
    
    :: Print coverage report location
    echo.
    echo Coverage report generated in ./coverage/lcov-report/index.html
    echo Open this file in your browser to view detailed coverage information.
) else if "%1"=="--watch" (
    :: Run in watch mode
    call npm test -- --watch
) else if "%1"=="-w" (
    :: Run in watch mode
    call npm test -- --watch
) else (
    :: Run normal tests
    call npm test
)

:: Print completion message
echo.
echo Test run completed.
