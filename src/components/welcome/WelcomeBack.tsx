/**
 * Welcome Back Component
 * 
 * Dashboard for returning users featuring:
 * - Personalized welcome message
 * - Quick stats and recent activity
 * - Skill management shortcuts
 * - Recent messages and trade requests
 * - Recommended connections and skills
 */

import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import RecommendationPanel from '@/components/dashboard/RecommendationPanel';
import StatCard from '@/components/dashboard/StatCard';
import Button from '@/components/ui/Button';
import { useOptimizedData } from '@/lib/hooks/useOptimizedData';

// Helper function to calculate profile completeness
function calculateProfileCompleteness(profile: UserProfile | null): number {
  if (!profile) return 0;
  
  const profileFields = [
    profile.full_name,
    profile.bio,
    profile.location_city,
    profile.location_state,
  ];
  const completedFields = profileFields.filter(field => field && field.trim()).length;
  return Math.round((completedFields / profileFields.length) * 100);
}

interface UserProfile {
  id: string;
  full_name?: string | null;
  bio?: string | null;
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  created_at?: string;
}

interface WelcomeBackProps {
  user: User;
  profile: UserProfile | null;
}

interface UserStats {
  skillsOffered: number;
  skillsWanted: number;
  activeExchanges: number;
  unreadMessages: number;
  completedExchanges: number;
  profileCompleteness: number;
}

interface WelcomeBackProps {
  user: User;
  profile: UserProfile | null;
}

interface UserSkill {
  id: string;
  title: string;
  description: string;
  category: string;
  skill_type: 'offered' | 'wanted';
  experience_level: string;
  created_at?: string;
}

interface UserTrade {
  id: string;
  status: 'proposed' | 'accepted' | 'completed' | 'cancelled';
  created_at: string;
}

interface UserMessage {
  id: string;
  created_at: string;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  time: string;
}

export default function WelcomeBack({ user, profile }: WelcomeBackProps) {
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Use optimized data hooks to reduce API calls
  const { data: userSkills = [] } = useOptimizedData<UserSkill[]>({
    table: 'user_skills',
    select: 'id, title, description, category, skill_type, experience_level',
    filters: { user_id: user.id },
    enabled: !!user.id,
    cacheKey: `user_skills_${user.id}`
  });

  const { data: userTrades = [] } = useOptimizedData<UserTrade[]>({
    table: 'trades', 
    select: 'id, status, created_at',
    filters: { user_id: user.id },
    enabled: !!user.id,
    cacheKey: `user_trades_${user.id}`
  });

  const { data: unreadMessages = [] } = useOptimizedData<UserMessage[]>({
    table: 'messages',
    select: 'id, created_at',
    filters: { receiver_id: user.id, is_read: false },
    enabled: !!user.id,
    cacheKey: `unread_messages_${user.id}`
  });

  // Calculate stats from the fetched data
  const stats: UserStats = {
    skillsOffered: userSkills.filter(s => s.skill_type === 'offered').length,
    skillsWanted: userSkills.filter(s => s.skill_type === 'wanted').length,
    activeExchanges: userTrades.filter(t => ['proposed', 'accepted'].includes(t.status)).length,
    unreadMessages: unreadMessages.length,
    completedExchanges: userTrades.filter(t => t.status === 'completed').length,
    profileCompleteness: calculateProfileCompleteness(profile),
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch user skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('user_skills')
        .select(`
          *,
          skills:skill_id (
            id,
            title,
            category,
            description
          )
        `)
        .eq('user_id', user.id);

      if (skillsError) throw skillsError;

      const skills = skillsData || [];
      setUserSkills(skills);

      // Fetch trades/exchanges
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .or(`proposer_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (tradesError) throw tradesError;

      const trades = tradesData || [];

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('is_read', false);

      if (messagesError) throw messagesError;

      const unreadMessages = messagesData || [];

      // Calculate stats
      const skillsOffered = skills.filter(s => s.skill_type === 'offered').length;
      const skillsWanted = skills.filter(s => s.skill_type === 'wanted').length;
      const activeExchanges = trades.filter(t => ['proposed', 'accepted'].includes(t.status)).length;
      const completedExchanges = trades.filter(t => t.status === 'completed').length;

      // Calculate profile completeness
      const profileFields = [
        profile?.full_name,
        profile?.bio,
        profile?.location_city,
        profile?.location_state,
      ];
      const completedFields = profileFields.filter(field => field && field.trim()).length;
      const profileCompleteness = Math.round((completedFields / profileFields.length) * 100);

      setStats({
        skillsOffered,
        skillsWanted,
        activeExchanges,
        unreadMessages: unreadMessages.length,
        completedExchanges,
        profileCompleteness,
      });

      // Mock recent activity for now (in real app, would come from actual data)
      setRecentActivity([
        {
          id: 'activity-1',
          type: 'skill_added',
          title: 'You added a new skill',
          description: 'JavaScript Programming',
          timestamp: new Date().toISOString(),
          time: '2 hours ago',
        },
        {
          id: 'activity-2',
          type: 'message',
          title: 'New message received',
          description: 'From Sarah about photography tips',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          time: '4 hours ago',
        },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id, supabase]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.full_name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const getQuickTips = () => {
    const tips = [];
    
    if (stats.profileCompleteness < 80) {
      tips.push({
        icon: '👤',
        title: 'Complete your profile',
        description: `Your profile is ${stats.profileCompleteness}% complete`,
        action: 'Complete Profile',
        href: '/profile',
      });
    }
    
    if (stats.skillsOffered === 0) {
      tips.push({
        icon: '🎯',
        title: 'Add your first skill',
        description: 'Share what you can teach others',
        action: 'Add Skills',
        href: '/skills/my-skills',
      });
    }
    
    if (stats.skillsWanted === 0) {
      tips.push({
        icon: '📚',
        title: 'Find skills to learn',
        description: 'Discover what you want to learn',
        action: 'Browse Skills',
        href: '/skills/browse',
      });
    }
    
    return tips.slice(0, 2); // Show max 2 tips
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const quickTips = getQuickTips();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome back to your SkillSwap dashboard
          </p>
        </div>

        {/* Quick Tips (if any) */}
        {quickTips.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Quick Tips to Get Started
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {quickTips.map((tip, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{tip.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{tip.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                      <Link href={tip.href}>
                        <Button variant="outline" size="sm">
                          {tip.action}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Skills I Offer"
            value={stats.skillsOffered}
            to="/skills/my-skills"
            icon="🎯"
          />
          <StatCard
            label="Skills I Want"
            value={stats.skillsWanted}
            to="/skills/my-skills"
            icon="📚"
          />
          <StatCard
            label="Active Exchanges"
            value={stats.activeExchanges}
            to="/trades"
            icon="🤝"
          />
          <StatCard
            label="New Messages"
            value={stats.unreadMessages}
            to="/messages"
            icon="💬"
            variant={stats.unreadMessages > 0 ? 'highlight' : 'default'}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Activity and Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <QuickActions />
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Activity
                  </h2>
                  <Link href="/activity" className="text-blue-600 hover:text-blue-800 text-sm">
                    View All
                  </Link>
                </div>
                <ActivityFeed activities={recentActivity} limit={3} />
              </div>
            )}

            {/* My Skills Summary */}
            {userSkills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Skills
                  </h2>
                  <Link href="/skills/my-skills" className="text-blue-600 hover:text-blue-800 text-sm">
                    Manage All
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {userSkills.slice(0, 4).map((userSkill) => (
                    <div key={userSkill.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {userSkill.skills?.title || 'Unknown Skill'}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {userSkill.skill_type} • {userSkill.proficiency_level}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          userSkill.skill_type === 'offered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {userSkill.skill_type === 'offered' ? 'Teaching' : 'Learning'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {userSkills.length > 4 && (
                  <div className="text-center mt-4">
                    <Link href="/skills/my-skills">
                      <Button variant="outline" size="sm">
                        View All {userSkills.length} Skills
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Recommendations */}
          <div className="space-y-8">
            <RecommendationPanel />
            
            {/* Profile Completeness */}
            {stats.profileCompleteness < 100 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Completeness
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{stats.profileCompleteness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.profileCompleteness}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Complete your profile to help others find and connect with you.
                </p>
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
