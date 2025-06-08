# Setting Up Environment Variables for Vercel Deployment

This guide explains how to obtain and configure the required environment variables for deploying the SkillSwap MVP to Vercel.

## Required Supabase Environment Variables

The build logs identified several missing Supabase environment variables that are required for successful deployment:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`
4. `SUPABASE_JWT_SECRET`

## How to Obtain These Variables

### From Supabase Dashboard

1. **Log in to your Supabase account** at [https://app.supabase.io/](https://app.supabase.io/)

2. **Select your project** from the list of projects

3. **Navigate to Project Settings**:
   - Click on the gear icon (⚙️) in the sidebar
   - Select "API" from the settings menu

4. **Retrieve the API Keys**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Copy the URL shown under "Project URL"
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Copy the string labeled "anon" or "public" key
   - `SUPABASE_SERVICE_ROLE_KEY`: Copy the string labeled "service_role" key (treat this as sensitive)

5. **Retrieve the JWT Secret**:
   - Still in the Project Settings
   - Navigate to "API" > "JWT Settings"
   - Copy the JWT Secret shown (or generate a new one if needed)
   - This will be your `SUPABASE_JWT_SECRET`

## Setting Variables in Vercel

1. **Log in to your Vercel account** at [https://vercel.com/](https://vercel.com/)

2. **Navigate to your project**:
   - Select the SkillSwap project from your dashboard

3. **Access Environment Variables**:
   - Click on "Settings" in the top navigation
   - Select "Environment Variables" from the sidebar

4. **Add Each Environment Variable**:
   - Click "Add New" for each variable
   - Enter the variable name exactly as shown (case-sensitive)
   - Paste the corresponding value from Supabase
   - Select which environments to apply it to (Production, Preview, Development)
   - Click "Save" after each addition

   Example format:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://yourproject.supabase.co`
   - Environment: Production, Preview, Development

5. **Repeat for all required variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET`

6. **Deploy Again**:
   - After setting all variables, deploy your application again
   - The build should now succeed without the Supabase URL/key missing errors

## Security Considerations

- `NEXT_PUBLIC_` variables are exposed to the browser and should only contain non-sensitive information
- The `SUPABASE_SERVICE_ROLE_KEY` has admin privileges and should never be exposed to the client side
- Consider using Vercel's integration with 1Password or similar services for managing sensitive keys in team environments

## Troubleshooting

If you encounter errors after setting the environment variables:

1. **Check for typos** in variable names
2. **Verify the values** are correct and complete (no extra spaces)
3. **Ensure all variables** are applied to the correct environments
4. **Redeploy the application** to apply the new environment variables
5. **Check Vercel build logs** for any new errors
