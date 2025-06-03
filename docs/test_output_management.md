# Test Output Management

The SkillSwap MVP project has several tools to manage test output and make it more readable and focused. This document explains the available options for running tests and capturing their output.

## Available Test Scripts

### Basic Test Command
```
npm test
```
This runs all tests without any special output handling. Output appears directly in the terminal.

### Original Test Output Script
```
run-tests-with-output.bat
```
This batch file runs all tests and saves the complete output to `test_output.txt`. While comprehensive, this file can become very large (400KB+) and difficult to navigate.

### Enhanced Test Output with Summary (Recommended)
```
run-tests-with-summary.bat
```
This script runs all tests and:
1. Saves the complete output to `test_output_full.txt` for detailed inspection if needed
2. Creates a concise `test_summary.txt` file containing:
   - Test statistics (pass/fail counts, execution time)
   - Failed tests with context (if any)
   - Coverage summary

## When to Use Each Script

- Use `npm test` during active development when you want to see test results immediately in the terminal
- Use `run-tests-with-summary.bat` for regular testing sessions when you want both comprehensive output and a focused summary
- Use `run-tests-with-output.bat` only when backward compatibility is needed

## More Specific Test Commands

For more focused testing, you can use these npm scripts directly:

- `npm run test:ui` - Runs only UI component tests
- `npm run test:lib` - Runs only library code tests  
- `npm run test:coverage` - Runs tests with coverage reporting
- `npm run test:coverage:report` - Runs tests with formatted coverage report

## Customizing Test Output

The PowerShell script `run-tests-with-summary.ps1` can be modified to extract different information from the test output if needed. Common customizations include:

- Changing the context lines for failed tests (currently set to 2 lines)
- Adding more specific patterns to extract different types of information
- Modifying the formatting of the summary file

## PowerShell Execution Policy

If you encounter issues running the PowerShell script, you might need to adjust your execution policy. The batch wrapper uses `-ExecutionPolicy Bypass` to avoid these issues, but for direct PowerShell execution, you may need to run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
