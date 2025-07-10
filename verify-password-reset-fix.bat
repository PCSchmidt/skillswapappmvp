@echo off
REM Password Reset Verification Script - Windows Version
REM Run this after updating Supabase dashboard settings

echo.
echo 🔍 Password Reset URL Verification Script
echo ========================================
echo.

echo 📋 Pre-Flight Checklist:
echo □ Supabase email templates updated to use production URLs
echo □ Supabase Site URL set to https://skillswapappmvp.vercel.app
echo □ Latest code deployed to production
echo □ Fresh email address ready for testing
echo.

echo 🌐 Production URLs to verify:
echo - Main domain: https://skillswapappmvp.vercel.app
echo - Password reset page: https://skillswapappmvp.vercel.app/auth/reset-password
echo - Forgot password page: https://skillswapappmvp.vercel.app/auth/forgot-password
echo.

echo 🧪 Test Steps:
echo 1. Go to: https://skillswapappmvp.vercel.app/auth/forgot-password
echo 2. Enter a fresh email address (not used for reset before)
echo 3. Submit the form
echo 4. Check your email inbox
echo 5. Verify the reset link uses https://skillswapappmvp.vercel.app (NOT localhost)
echo 6. Click the link and complete the password reset
echo.

echo ✅ Expected Results:
echo - Email reset link format: https://skillswapappmvp.vercel.app/auth/reset-password?code=...
echo - No localhost URLs anywhere in the email
echo - Reset flow completes successfully on production domain
echo.

echo ❌ If still seeing localhost URLs:
echo 1. Double-check Supabase email template configuration
echo 2. Verify Supabase Site URL setting
echo 3. Try with a completely different email provider
echo 4. Check browser cache and clear if needed
echo.

echo 📞 Need help? Check PASSWORD_RESET_URL_INVESTIGATION.md for detailed steps
echo.
pause
