'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useSupabase } from '@/contexts/SupabaseContext';
import { classNames } from '@/lib/utils';

const Navbar = () => {
  const { user, signOut, isLoading, supabase } = useSupabase();
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Handle hydration to prevent SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  // Fetch unread notification count
  useEffect(() => {
    if (!user || !isHydrated) return;
    
    let isMounted = true;
    
    const fetchNotificationCount = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('unread_notification_count')
          .eq('id', user.id)
          .single();
        
        if (!isMounted) return;
        
        if (error) {
          console.warn('Unable to fetch notification count (table may not exist or no access):', error.message);
          setNotificationCount(0);
          return;
        }
        
        if (data) {
          setNotificationCount(data.unread_notification_count || 0);
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn('Error fetching notification count:', err);
        setNotificationCount(0);
      }
    };

    // Debounce the fetch to prevent rapid calls
    const timeoutId = setTimeout(fetchNotificationCount, 100);
    
    // Set up real-time subscription for notification count changes
    const subscription = supabase
      .channel('user-notification-count')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user.id}`
      }, (payload) => {
        if (!isMounted) return;
        if (payload.new && payload.new.unread_notification_count !== undefined) {
          setNotificationCount(payload.new.unread_notification_count || 0);
        }
      })
      .subscribe();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      // Only call removeChannel if subscription is a RealtimeChannel (has 'topic')
      if (subscription && 'topic' in subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [user, supabase, isHydrated]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  if (!isHydrated) {
    // Show stable skeleton to prevent layout shift
    return (
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <Container size="xl" padding="sm" className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg 
                viewBox="0 0 40 40" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-full h-full"
              >
                <rect width="40" height="40" rx="8" fill="#4f46e5"/>
                <rect x="10" y="10" width="20" height="4" rx="2" fill="white"/>
                <rect x="10" y="18" width="20" height="4" rx="2" fill="white"/>
                <rect x="10" y="26" width="20" height="4" rx="2" fill="white"/>
              </svg>
            </div>
            <span className="font-heading font-bold text-xl md:text-2xl text-primary-600">
              SkillSwap
            </span>
          </Link>
          
          {/* Desktop Navigation Skeleton */}
          <nav className="hidden md:flex space-x-8">
            <div className="animate-pulse h-6 w-16 bg-neutral-200 rounded"></div>
            <div className="animate-pulse h-6 w-20 bg-neutral-200 rounded"></div>
            <div className="animate-pulse h-6 w-14 bg-neutral-200 rounded"></div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <div className="animate-pulse h-10 w-10 bg-neutral-200 rounded"></div>
          </div>
          
          {/* Desktop Auth Links Skeleton */}
          <div className="hidden md:flex items-center space-x-5">
            <div className="animate-pulse h-6 w-20 bg-neutral-200 rounded"></div>
            <div className="animate-pulse h-6 w-16 bg-neutral-200 rounded"></div>
            <div className="animate-pulse h-6 w-6 bg-neutral-200 rounded-full"></div>
            <div className="animate-pulse h-6 w-16 bg-neutral-200 rounded"></div>
            <div className="animate-pulse h-10 w-20 bg-neutral-200 rounded"></div>
          </div>
        </Container>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <Container size="xl" padding="sm" className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo SVG Icon for brand identity */}
          <div className="w-8 h-8 flex items-center justify-center">
            <svg 
              viewBox="0 0 40 40" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full h-full"
            >
              <rect width="40" height="40" rx="8" fill="#4f46e5"/>
              <rect x="10" y="10" width="20" height="4" rx="2" fill="white"/>
              <rect x="10" y="18" width="20" height="4" rx="2" fill="white"/>
              <rect x="10" y="26" width="20" height="4" rx="2" fill="white"/>
            </svg>
          </div>
          <span className="font-heading font-bold text-xl md:text-2xl text-primary-600 hover:text-primary-500 transition-colors">
            SkillSwap
          </span>
        </Link>
          {/* Desktop Navigation */}        <nav className="hidden md:flex space-x-8">
          <Link href="/discover" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
            Discover
          </Link>
          <Link href="/demo" className="text-purple-600 hover:text-purple-700 font-medium transition-colors bg-purple-50 px-3 py-1 rounded-lg">
            Demo Features
          </Link>
          <Link href="/how-it-works" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
            How It Works
          </Link>
          <Link href="/about" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
            About
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            type="button" 
            className="p-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>        {/* Desktop Authentication Links */}
        <div className="hidden md:flex items-center space-x-5">
          {!isHydrated || isLoading ? (
            <div className="flex items-center space-x-5">
              <div className="animate-pulse h-6 w-20 bg-neutral-200 rounded"></div>
              <div className="animate-pulse h-6 w-16 bg-neutral-200 rounded"></div>
              <div className="animate-pulse h-6 w-6 bg-neutral-200 rounded-full"></div>
              <div className="animate-pulse h-6 w-16 bg-neutral-200 rounded"></div>
              <div className="animate-pulse h-10 w-20 bg-neutral-200 rounded"></div>
            </div>
          ) : user ? (
            <>              <Link 
                href="/dashboard" 
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              
              <Link 
                href="/skills/my-skills" 
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
              >
                My Skills
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

        {/* Mobile Menu Dropdown */}
        <div className={classNames(
          "absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-lg md:hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}>
          <Container size="xl" padding="sm" className="py-4 flex flex-col space-y-4">            <nav className="flex flex-col space-y-3">
              <Link 
                href="/discover" 
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors p-2 rounded hover:bg-neutral-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discover
              </Link>
              <Link 
                href="/demo" 
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors p-2 rounded bg-purple-50 hover:bg-purple-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Demo Features
              </Link>
              <Link 
                href="/how-it-works" 
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors p-2 rounded hover:bg-neutral-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="/about" 
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors p-2 rounded hover:bg-neutral-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </nav>
            
            <hr className="border-neutral-200" />            <div className="flex flex-col space-y-3">
              {!isHydrated || isLoading ? (
                <div className="flex flex-col space-y-3">
                  <div className="animate-pulse h-10 w-full bg-neutral-200 rounded"></div>
                  <div className="animate-pulse h-10 w-full bg-neutral-200 rounded"></div>
                  <div className="animate-pulse h-10 w-full bg-neutral-200 rounded"></div>
                  <div className="animate-pulse h-10 w-full bg-neutral-200 rounded"></div>
                </div>
              ) : user ? (
                <>                  <Link 
                    href="/dashboard" 
                    className="text-neutral-700 hover:text-primary-600 font-medium transition-colors p-2 rounded hover:bg-neutral-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/skills/my-skills" 
                    className="text-neutral-700 hover:text-primary-600 font-medium transition-colors p-2 rounded hover:bg-neutral-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Skills
                  </Link>
                  <Link 
                    href={`/profile/${user.id}`}
                    className="text-neutral-700 hover:text-primary-600 font-medium transition-colors p-2 rounded hover:bg-neutral-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="btn-primary w-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-neutral-700 hover:text-primary-600 font-medium transition-colors p-2 rounded hover:bg-neutral-50 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
