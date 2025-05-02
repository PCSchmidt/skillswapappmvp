'use client';

import React from 'react';
import Link from 'next/link';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, signOut, isLoading } = useSupabase();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-primary-600">
          SkillSwap
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-600 hover:text-primary-600">
            Discover
          </Link>
          <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600">
            How It Works
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-primary-600">
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
          ) : user ? (
            <>
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-primary-600"
              >
                Dashboard
              </Link>
              <Link 
                href={`/profile/${user.id}`}
                className="text-gray-600 hover:text-primary-600"
              >
                Profile
              </Link>
              <button 
                onClick={handleSignOut}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-primary-600"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
