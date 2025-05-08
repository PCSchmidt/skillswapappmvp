'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useRouter } from 'next/navigation';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

const Navbar = () => {
  const { user, signOut, isLoading, supabase } = useSupabase();
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Fetch unread notification count
  useEffect(() => {
    if (!user) return;
    
    const fetchNotificationCount = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('unread_notification_count')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setNotificationCount(data.unread_notification_count || 0);
        }
      } catch (err) {
        console.error('Error fetching notification count:', err);
      }
    };
    
    fetchNotificationCount();
    
    // Set up real-time subscription for notification count changes
    const subscription = supabase
      .channel('user-notification-count')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user.id}`
      }, (payload) => {
        if (payload.new && payload.new.unread_notification_count !== undefined) {
          setNotificationCount(payload.new.unread_notification_count || 0);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, supabase]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="container-custom py-4 flex justify-between items-center">
        <Link href="/" className="font-heading font-bold text-2xl text-primary-600 hover:text-primary-500 transition-colors">
          SkillSwap
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
            Discover
          </Link>
          <Link href="/how-it-works" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
            How It Works
          </Link>
          <Link href="/about" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-5">
          {isLoading ? (
            <div className="animate-pulse h-10 w-24 bg-neutral-200 rounded"></div>
          ) : user ? (
            <>
              <Link 
                href="/dashboard" 
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              
              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="notification-button"
                  className="text-neutral-700 hover:text-primary-600 p-1.5 rounded-full relative hover:bg-neutral-100 transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-expanded={showNotifications}
                  aria-haspopup="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  
                  {/* Notification badge */}
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-error rounded-full">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                <NotificationDropdown 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)}
                  count={notificationCount}
                />
              </div>
              
              <Link 
                href={`/profile/${user.id}`}
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
              >
                Profile
              </Link>
              <button 
                onClick={handleSignOut}
                className="btn-primary"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="font-medium text-neutral-700 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="btn-primary"
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
