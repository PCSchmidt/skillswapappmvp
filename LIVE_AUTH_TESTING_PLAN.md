# Live Authentication Testing Plan

## Test User Account
**Test Email:** test-user-skillswap-$(date +%s)@example.com
**Test Password:** TestPassword123!

## Authentication Flow Tests

### 1. User Registration
- [ ] Navigate to /signup
- [ ] Fill in registration form
- [ ] Submit registration
- [ ] Verify email confirmation (if required)
- [ ] Check user profile creation

### 2. User Login
- [ ] Navigate to /login
- [ ] Enter test credentials
- [ ] Verify successful login
- [ ] Check redirect to dashboard
- [ ] Verify session persistence

### 3. Protected Routes Access
- [ ] Access /dashboard (should work after login)
- [ ] Access /profile (should work after login)
- [ ] Access /skills/new (should work after login)
- [ ] Access /messages (should work after login)
- [ ] Access /trades (should work after login)

### 4. Core Functionality
- [ ] Create a new skill
- [ ] Search for skills
- [ ] View other user profiles
- [ ] Attempt to propose a trade

### 5. User Logout
- [ ] Click logout button
- [ ] Verify session cleared
- [ ] Check redirect to home
- [ ] Verify protected routes redirect to login

## Expected Results
- User registration creates account in Supabase
- Login provides authentication token
- Protected routes accessible when authenticated
- Core CRUD operations work with database
- Session management functions correctly

## Issues to Document
- Any form validation problems
- Database connection issues
- UI/UX friction points
- Performance concerns
