/**
 * Direct Supabase Authentication Test
 * 
 * Tests the Supabase authentication directly to verify our backend integration
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase Connection...');
  
  const supabase = createClientComponentClient();
  
  try {
    // Test 1: Check if we can connect to Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase');
    console.log('📊 Current session:', data.session ? 'Active' : 'None');
    
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

async function testUserRegistration() {
  console.log('\n📝 Testing User Registration...');
  
  const supabase = createClientComponentClient();
  const testEmail = `test-${Date.now()}@skillswap-test.com`;
  const testPassword = 'TestPassword123!';
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify`,
      }
    });
    
    if (error) {
      console.error('❌ Registration failed:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Registration successful!');
    console.log('📧 Test email:', testEmail);
    console.log('👤 User ID:', data.user?.id);
    console.log('📮 Email confirmation required:', !data.user?.email_confirmed_at);
    
    return { 
      success: true, 
      user: data.user, 
      email: testEmail,
      password: testPassword 
    };
    
  } catch (error) {
    console.error('❌ Registration test failed:', error);
    return { success: false, error: error.message };
  }
}

async function testUserLogin(email, password) {
  console.log('\n🔑 Testing User Login...');
  
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ Login failed:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Login successful!');
    console.log('👤 User:', data.user?.email);
    console.log('🎟️ Session active:', !!data.session);
    
    return { success: true, user: data.user, session: data.session };
    
  } catch (error) {
    console.error('❌ Login test failed:', error);
    return { success: false, error: error.message };
  }
}

async function runAuthenticationTests() {
  console.log('🧪 Starting Direct Supabase Authentication Tests');
  console.log('================================================');
  
  // Test 1: Connection
  const connectionOk = await testSupabaseConnection();
  if (!connectionOk) {
    console.log('🚨 Cannot proceed - Supabase connection failed');
    return;
  }
  
  // Test 2: Registration
  const registrationResult = await testUserRegistration();
  if (!registrationResult.success) {
    console.log('🚨 Registration failed - cannot test login');
    return;
  }
  
  // Test 3: Login (only if registration succeeded)
  const loginResult = await testUserLogin(
    registrationResult.email, 
    registrationResult.password
  );
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('===============');
  console.log('Connection:', connectionOk ? '✅ PASS' : '❌ FAIL');
  console.log('Registration:', registrationResult.success ? '✅ PASS' : '❌ FAIL');
  console.log('Login:', loginResult.success ? '✅ PASS' : '❌ FAIL');
  
  const totalTests = 3;
  const passedTests = [connectionOk, registrationResult.success, loginResult.success].filter(Boolean).length;
  console.log(`Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL AUTHENTICATION TESTS PASSED!');
    console.log('✅ Supabase integration is working correctly');
  } else {
    console.log('⚠️ Some authentication tests failed');
    console.log('🔧 Check Supabase configuration and database setup');
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.runAuthTests = runAuthenticationTests;
  console.log('🔧 Run window.runAuthTests() in browser console to test authentication');
}

export default runAuthenticationTests;
