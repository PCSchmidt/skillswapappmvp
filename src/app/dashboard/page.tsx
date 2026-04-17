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
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Check verification on load
  useEffect(() => {
    if (user && !isLoading) {
      handleVerifyStatus();
    }
  }, [user, isLoading]);
  
  const handleVerifyStatus = async () => {
    if (!user) return;
    setVerifying(true);
    try {
      await refreshUser();
    } catch (error) {
      // Verification check failed silently
    } finally {
      setVerifying(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }
  
  if (user && !isVerified) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-lg mx-auto px-4">
          <div className="card p-8 text-center">
            <span className="eyebrow text-warning-500 mb-4 block">Action Required</span>
            <h1 className="font-display text-2xl mb-3">Email Verification Required</h1>
            <p className="text-text-secondary text-sm mb-8">
              Please check your inbox for a verification email and click the link to verify your account.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/auth/resend-verification" className="btn btn-primary">
                Resend Verification Email
              </Link>
              <button 
                onClick={handleVerifyStatus} 
                className="btn btn-secondary" 
                disabled={verifying}
              >
                {verifying ? 'Checking…' : 'Check Status'}
              </button>
              <button onClick={handleSignOut} className="btn btn-ghost">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="eyebrow mb-2 block">Dashboard</span>
            <h1 className="font-display text-display-sm">
              Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
            </h1>
          </div>
          <Link href="/skills/new" className="btn btn-primary">
            + New Skill
          </Link>
        </div>
        
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Skills Offered', value: '0' },
            { label: 'Skills Requested', value: '0' },
            { label: 'Trades Completed', value: '0' },
            { label: 'Avg Rating', value: '—' },
          ].map((stat) => (
            <div key={stat.label} className="card p-5">
              <dt className="text-xs uppercase tracking-eyebrow text-text-muted mb-1">{stat.label}</dt>
              <dd className="text-2xl font-display font-semibold text-text-primary">{stat.value}</dd>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <span className="eyebrow mb-4 block">Quick Actions</span>
            <div className="space-y-3">
              <Link href="/skills/new" className="block text-text-secondary hover:text-emerald-400 text-sm transition-colors">
                → Add a new skill
              </Link>
              <Link href="/skills/browse" className="block text-text-secondary hover:text-emerald-400 text-sm transition-colors">
                → Browse skills
              </Link>
              <Link href="/trades" className="block text-text-secondary hover:text-emerald-400 text-sm transition-colors">
                → View your trades
              </Link>
              <Link href="/profile" className="block text-text-secondary hover:text-emerald-400 text-sm transition-colors">
                → Complete your profile
              </Link>
            </div>
          </div>
          
          {/* Profile card */}
          <div className="card p-6">
            <span className="eyebrow mb-4 block">Your Profile</span>
            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-14 h-14 overflow-hidden bg-surface-raised border border-border flex-shrink-0">
                {user?.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-900/30 text-emerald-400 font-semibold text-lg">
                    {(user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {user?.user_metadata?.full_name || 'Your Profile'}
                </h3>
                <Link 
                  href={`/profile/${user?.id}`} 
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  View Profile
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/profile/edit" className="text-sm text-text-secondary hover:text-emerald-400 transition-colors">
                Edit Profile
              </Link>
              <Link href="/skills/manage" className="text-sm text-text-secondary hover:text-emerald-400 transition-colors">
                Manage Skills
              </Link>
            </div>
          </div>

          {/* AI Recommendations placeholder */}
          <div className="card p-6">
            <span className="eyebrow mb-4 block">AI Recommendations</span>
            <p className="text-sm text-text-muted mb-4">
              Personalized skill matches powered by semantic similarity.
            </p>
            <div className="flex items-center justify-center py-8 border border-border-subtle">
              <span className="text-xs text-text-muted uppercase tracking-eyebrow">
                Matching engine loading…
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
