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
  type: 'message' | 'request' | 'status' | 'review' | 'match';
  title: string;
  description: string;
  timestamp: string;
  time: string;
  content: string;
  read: boolean;
}

interface QuickTip {
  icon: string;
  title: string;
  description: string;
  action: string;
  href: string;
}

export default function WelcomeBack({ user, profile }: WelcomeBackProps) {
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<UserStats>({
    skillsOffered: 0,
    skillsWanted: 0,
    activeExchanges: 0,
    unreadMessages: 0,
    completedExchanges: 0,
    profileCompleteness: calculateProfileCompleteness(profile),
  });

  // CRITICAL FIX: Use a single batched API call instead of 3 separate calls
  // This prevents API rate limiting and page shaking issues
  const { data: dashboardData } = useOptimizedData<{
    userSkills: UserSkill[];
    userTrades: UserTrade[];
    unreadMessages: UserMessage[];
  }>({
    table: 'dashboard_combined',
    enabled: !!user.id,
    cacheKey: `dashboard_combined_${user.id}`,
    customFetcher: async (supabase) => {
      // Batch all queries in parallel to prevent rate limiting
      const [skillsResult, tradesResult, messagesResult] = await Promise.all([
        supabase
          .from('user_skills')
          .select('id, title, description, category, skill_type, experience_level')
          .eq('user_id', user.id),
        supabase
          .from('trades')
          .select('id, status, created_at')
          .eq('user_id', user.id),
        supabase
          .from('messages')
          .select('id, created_at')
          .eq('receiver_id', user.id)
          .eq('is_read', false)
      ]);

      return {
        userSkills: skillsResult.data || [],
        userTrades: tradesResult.data || [],
        unreadMessages: messagesResult.data || []
      };
    }
  });

  // Calculate stats when data changes
  useEffect(() => {
    if (dashboardData) {
      const newStats: UserStats = {
        skillsOffered: dashboardData.userSkills.filter(s => s.skill_type === 'offered').length,
        skillsWanted: dashboardData.userSkills.filter(s => s.skill_type === 'wanted').length,
        activeExchanges: dashboardData.userTrades.filter(t => ['proposed', 'accepted'].includes(t.status)).length,
        unreadMessages: dashboardData.unreadMessages.length,
        completedExchanges: dashboardData.userTrades.filter(t => t.status === 'completed').length,
        profileCompleteness: calculateProfileCompleteness(profile),
      };
      setStats(newStats);
    }
  }, [dashboardData, profile]);

  // Convert data to activity items
  const convertToActivities = useCallback((data: typeof dashboardData): ActivityItem[] => {
    if (!data) return [];
    
    const activities: ActivityItem[] = [];
    
    // Add skill activities
    data.userSkills.forEach(skill => {
      activities.push({
        id: `skill-${skill.id}`,
        type: 'status',
        title: `${skill.skill_type === 'offered' ? 'Offering' : 'Learning'} ${skill.title}`,
        description: skill.description || '',
        timestamp: skill.created_at || new Date().toISOString(),
        time: 'recently',
        content: skill.description || '',
        read: true
      });
    });
    
    // Add trade activities
    data.userTrades.forEach(trade => {
      activities.push({
        id: `trade-${trade.id}`,
        type: 'request',
        title: `Trade ${trade.status}`,
        description: 'Skill exchange activity',
        timestamp: trade.created_at,
        time: 'recently',
        content: `Trade status: ${trade.status}`,
        read: true
      });
    });
    
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, []);

  // Update activity feed when data changes
  useEffect(() => {
    if (dashboardData) {
      const activities = convertToActivities(dashboardData);
      setRecentActivity(activities);
    }
  }, [dashboardData, convertToActivities]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.full_name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const getQuickTips = (): QuickTip[] => {
    const tips: QuickTip[] = [];
    
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

  const quickTips = getQuickTips();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}
          </h1>
          <p className="text-gray-600">
            Here's your skill exchange activity and opportunities.
          </p>
        </div>

        {/* Quick Tips */}
        {quickTips.length > 0 && (
          <div className="mb-8 grid md:grid-cols-2 gap-4">
            {quickTips.map((tip, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/skills/my-skills" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="text-2xl mb-2">🎯</span>
                  <span className="text-sm font-medium">Manage Skills</span>
                </Link>
                <Link href="/skills/browse" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="text-2xl mb-2">🔍</span>
                  <span className="text-sm font-medium">Find Skills</span>
                </Link>
                <Link href="/messages" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="text-2xl mb-2">💬</span>
                  <span className="text-sm font-medium">Messages</span>
                </Link>
              </div>
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
            {dashboardData?.userSkills && dashboardData.userSkills.length > 0 && (
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
                  {dashboardData.userSkills.slice(0, 4).map((userSkill) => (
                    <div key={userSkill.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {userSkill.title || 'Unknown Skill'}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {userSkill.skill_type} • {userSkill.experience_level}
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
                {dashboardData.userSkills.length > 4 && (
                  <div className="text-center mt-4">
                    <Link href="/skills/my-skills">
                      <Button variant="outline" size="sm">
                        View All {dashboardData.userSkills.length} Skills
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Recommendations */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recommendations
              </h2>
              <p className="text-gray-600 text-sm">
                Personalized recommendations coming soon...
              </p>
            </div>
            
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
                    ></div>
                  </div>
                </div>
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="w-full">
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
