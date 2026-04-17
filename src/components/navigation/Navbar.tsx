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
  const [mobileOpen, setMobileOpen] = useState(false);
  
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
        // Notification count fetch failed silently
      }
    };
    
    fetchNotificationCount();
    
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

  const navLinks = [
    { href: '/', label: 'Discover' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link href="/" className="font-display text-xl font-semibold text-text-primary tracking-tight">
          SkillSwap
        </Link>
        
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-emerald-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="animate-pulse h-8 w-20 bg-surface-raised" />
          ) : user ? (
            <>
              <Link 
                href="/dashboard" 
                className="hidden md:inline text-sm text-text-secondary hover:text-emerald-400 transition-colors"
              >
                Dashboard
              </Link>
              
              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="notification-button"
                  className="text-text-secondary hover:text-emerald-400 p-1 relative transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-expanded={showNotifications}
                  aria-haspopup="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-emerald-600">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
                
                <NotificationDropdown 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)}
                  count={notificationCount}
                />
              </div>
              
              <Link 
                href={`/profile/${user.id}`}
                className="hidden md:inline text-sm text-text-secondary hover:text-emerald-400 transition-colors"
              >
                Profile
              </Link>
              <button 
                onClick={handleSignOut}
                className="hidden md:inline-flex btn btn-ghost text-xs"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="hidden md:inline text-sm text-text-secondary hover:text-emerald-400 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="hidden md:inline-flex btn btn-primary text-xs"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm text-text-secondary hover:text-emerald-400 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {user ? (
            <>
              <Link href="/dashboard" className="block py-2 text-sm text-text-secondary hover:text-emerald-400" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <Link href={`/profile/${user.id}`} className="block py-2 text-sm text-text-secondary hover:text-emerald-400" onClick={() => setMobileOpen(false)}>
                Profile
              </Link>
              <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="block py-2 text-sm text-text-secondary hover:text-emerald-400 w-full text-left">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-sm text-text-secondary hover:text-emerald-400" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link href="/signup" className="block py-2 text-sm text-emerald-400 font-semibold" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
