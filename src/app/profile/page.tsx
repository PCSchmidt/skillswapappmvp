/**
 * Profile Redirect Page
 * 
 * This page redirects the user to their own profile page.
 * It serves as a convenient way to access the user's profile without
 * requiring them to know their user ID.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/contexts/SupabaseContext';

export default function ProfileRedirect() {
  const router = useRouter();
  const { user, isLoading } = useSupabase();
  
  useEffect(() => {
    if (isLoading) return; // Wait until auth state is loaded
    
    if (user) {
      // Redirect to the user's profile page
      router.push(`/profile/${user.id}`);
    } else {
      // If not logged in, redirect to login page
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="spinner mb-4"></div>
        <p className="text-gray-700">Redirecting to your profile...</p>
      </div>
    </div>
  );
}
