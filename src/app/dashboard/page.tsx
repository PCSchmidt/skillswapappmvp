/**
 * Dashboard Page
 * 
 * The main dashboard for authenticated users to view and manage their skills,
 * trades, and account information.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSupabase } from '@/contexts/SupabaseContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, signOut, isVerified, refreshUser, supabase } = useSupabase();
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<boolean | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load verification status on initial load
  useEffect(() => {
    if (user && !isLoading) {
      handleVerifyStatus();
    }
  }, [user, isLoading]);
  
  // Function to manually check verification status
  const handleVerifyStatus = async () => {
    if (!user) return;
    
    setVerifying(true);
    
    try {
      // Force refresh the user data from Supabase
      const { data } = await supabase.auth.getUser();
      
      if (data?.user) {
        // Log the email verification status
        console.log('Manual verification check:', {
          user_id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
          is_confirmed: data.user.email_confirmed_at !== null
        });
        
        // Store verification status
        setVerificationStatus(data.user.email_confirmed_at !== null);
        
        // Refresh user data in context
        await refreshUser();
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setVerifying(false);
    }
  };
  
  // Function to force-update verification status in database
  const forceVerification = async () => {
    if (!user) return;
    
    setVerifying(true);
    
    try {
      // First check if the user exists in the database
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, is_verified')
        .eq('id', user.id)
        .single();
      
      if (existingUser) {
        // Update existing user
        const { error: updateError } = await supabase
          .from('users')
          .update({ is_verified: true })
          .eq('id', user.id);
          
        if (updateError) {
          console.error('Error updating verification status:', updateError);
        } else {
          console.log('Successfully updated verification status in database');
        }
      } else {
        // Insert new user record
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            is_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error creating user record with verified status:', insertError);
        } else {
          console.log('Successfully created user record with verified status');
        }
      }
      
      // Refresh user data in context
      await refreshUser();
    } catch (error) {
      console.error('Error forcing verification status:', error);
    } finally {
      setVerifying(false);
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Show verification notice if user is not verified
  if (user && !isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Verification Required</h1>
              <div className="py-4">
                <svg className="mx-auto h-16 w-16 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">
                Your email address hasn't been verified yet. Please check your inbox for a verification email and click the link to verify your account.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
                <Link href="/auth/resend-verification" className="btn btn-primary">
                  Resend Verification Email
                </Link>
                <button 
                  onClick={handleVerifyStatus} 
                  className="btn btn-secondary" 
                  disabled={verifying}
                >
                  {verifying ? 'Checking...' : 'Check Verification Status'}
                </button>
                <button 
                  onClick={forceVerification}
                  className="btn btn-accent"
                  disabled={verifying}
                >
                  Force Verification (DB only)
                </button>
                <button onClick={handleSignOut} className="btn btn-outline-primary">
                  Sign Out
                </button>
              </div>
              
              {/* Show debug information about verification status */}
              <div className="mt-6 text-sm text-left bg-gray-100 p-4 rounded-md">
                <p className="font-medium mb-2">Verification Debug Info:</p>
                <pre className="whitespace-pre-wrap break-words">
                  {user ? JSON.stringify({
                    email: user.email,
                    auth_email_confirmed: verificationStatus,
                    context_is_verified: isVerified,
                    confirmed_at: user.email_confirmed_at,
                  }, null, 2) : 'No user data'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show dashboard if user is authenticated and verified
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h1>
            
            <div className="flex justify-end mb-4">
              <Link href="/skills/new" className="btn btn-primary">
                Create New Skill
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {/* Quick actions card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link href="/skills/new" className="block text-primary-600 hover:text-primary-500">
                      → Add a new skill
                    </Link>
                    <Link href="/skills/browse" className="block text-primary-600 hover:text-primary-500">
                      → Browse skills in your area
                    </Link>
                    <Link href="/trades" className="block text-primary-600 hover:text-primary-500">
                      → View your trades
                    </Link>
                    <Link href="/profile" className="block text-primary-600 hover:text-primary-500">
                      → Complete your profile
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* User Profile card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h2>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      {user?.user_metadata?.avatar_url ? (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt="Profile picture"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-semibold text-xl">
                          {(user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {user?.user_metadata?.full_name || 'Your Profile'}
                      </h3>
                      <Link 
                        href={`/profile/${user?.id}`} 
                        className="text-sm text-primary-600 hover:text-primary-500"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link 
                      href="/profile/edit" 
                      className="text-sm text-gray-700 hover:text-primary-600 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile Information
                    </Link>
                    <Link 
                      href="/skills/manage" 
                      className="text-sm text-gray-700 hover:text-primary-600 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      Manage Your Skills
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Stats card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Your Stats</h2>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Skills Offered</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Skills Requested</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Trades Completed</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Rating</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">-</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {/* Coming soon card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h2>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Skill matching algorithm</li>
                    <li>• In-app messaging</li>
                    <li>• Mobile app</li>
                    <li>• Community events</li>
                    <li>• Enhanced search filters</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
