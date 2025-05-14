@echo off
echo Running tests after import path standardization...

echo.
echo Step 1: Running import path standardization script...
call npm run update-imports

echo.
echo Step 2: Running tests to verify imports are working correctly...
call npm test

echo.
echo Test verification complete!
pause
