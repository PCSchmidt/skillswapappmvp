@echo off
echo Running tests and saving output to test_output.txt...
cd %~dp0
npm test > test_output.txt 2>&1
echo Test execution completed. Results saved to test_output.txt
