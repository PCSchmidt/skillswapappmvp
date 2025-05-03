@echo off
echo Deploying send-email Supabase Edge Function...

rem Navigate to the functions directory
cd %~dp0

rem Set the Resend API key as a secret for the function
echo Setting up secrets...
call supabase secrets set RESEND_API_KEY=%RESEND_API_KEY%

rem Deploy the email function
echo Deploying function...
call supabase functions deploy send-email

echo Done! The send-email function has been deployed with your Resend API key.
