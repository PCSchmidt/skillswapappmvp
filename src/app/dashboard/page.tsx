'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import DashboardOnboarding from '@/components/dashboard/DashboardOnboarding';
import EngagementActions from '@/components/dashboard/EngagementActions';
import QuickActions, { commonActions } from '@/components/dashboard/QuickActions';
import ActivityFeedSkeleton from '@/components/dashboard/skeletons/ActivityFeedSkeleton';
import ExchangeStatusSkeleton from '@/components/dashboard/skeletons/ExchangeStatusSkeleton';
import RecommendationPanelSkeleton from '@/components/dashboard/skeletons/RecommendationPanelSkeleton';
import StatCard from '@/components/dashboard/StatCard';
import { Container } from '@/components/layout/Container';
import Grid from '@/components/layout/Grid';
import Section from '@/components/layout/Section';

// Dynamic imports for heavy components with skeleton fallbacks

const ActivityFeed = dynamic(
  () => import('@/components/dashboard/ActivityFeed'),
  { loading: () => <ActivityFeedSkeleton /> }
);

const ExchangeStatusSection = dynamic(
  () => import('@/components/dashboard/ExchangeStatusSection'),
  { loading: () => <ExchangeStatusSkeleton /> }
);

const RecommendationPanel = dynamic(
  () => import('@/components/dashboard/RecommendationPanel'),
  { loading: () => <RecommendationPanelSkeleton /> }
);

export default function DashboardPage() {
  // Demo data for onboarding
  const onboardingSteps = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add a photo, bio, and location to make a great first impression',
      action: 'Complete Profile',
      href: '/profile/edit',
      completed: false,
      icon: '👤'
    },
    {
      id: 'skills',
      title: 'Add Your Skills',
      description: 'Tell others what you can teach and what you want to learn',
      action: 'Add Skills',
      href: '/skills/my-skills',
      completed: true,
      icon: '🎯'
    },
    {
      id: 'explore',
      title: 'Discover Skills',
      description: 'Browse available skills and find interesting people to connect with',
      action: 'Start Exploring',
      href: '/discover',
      completed: true,
      icon: '🔍'
    },
    {
      id: 'connect',
      title: 'Make Your First Connection',
      description: 'Send a message or propose a skill swap to get started',
      action: 'Find Matches',
      href: '/matches',
      completed: false,
      icon: '🤝'
    }
  ];
  
  const completedOnboardingSteps = onboardingSteps.filter(step => step.completed).length;
  const isNewUser = completedOnboardingSteps < 3;
  
  // Demo data for engagement actions
  const engagementActions = [
    {
      id: 'new-matches',
      title: 'You have 3 new potential matches!',
      description: 'People interested in your skills and offering skills you want to learn.',
      action: 'View Matches',
      href: '/matches',
      icon: '🎯',
      color: 'bg-green-100',
      urgency: 'high' as const,
      badge: 'New'
    },
    {
      id: 'complete-profile',
      title: 'Boost your visibility',
      description: 'Complete your profile to get 3x more connection requests.',
      action: 'Complete Profile',
      href: '/profile/edit',
      icon: '✨',
      color: 'bg-blue-100',
      urgency: 'medium' as const
    },
    {
      id: 'demo-features',
      title: 'Try Premium Features',
      description: 'Experience video calls, payments, and AI matching in our demo environment.',
      action: 'Enter Demo',
      href: '/demo',
      icon: '🎭',
      color: 'bg-purple-100',
      urgency: 'low' as const,
      badge: 'Demo'
    }
  ];
  // Demo data for statistics
  const stats = [
    { label: "Active Exchanges", value: 3, to: "/exchanges?status=active" },
    { label: "Pending Requests", value: 2, to: "/exchanges?status=pending" },
    { label: "Completed", value: 7, to: "/exchanges?status=completed" },
    { label: "New Messages", value: 5, to: "/messages?filter=unread" },
  ];
  
  // Demo data for activity feed
  const activities = [
    {
      id: "act-1",
      type: "message" as const,
      title: "New message from Jane Doe",
      time: "10 minutes ago",
      timestamp: "2025-05-08T18:50:00Z",
      content: "Regarding your JavaScript tutoring offer...",
      read: false,
      actionUrl: "/messages/123",
      actionLabel: "Reply"
    },
    {
      id: "act-2",
      type: "request" as const,
      title: "Exchange request from Mike Smith",
      time: "2 hours ago",
      timestamp: "2025-05-08T17:00:00Z",
      content: "Interested in your photography skills...",
      read: true
    },
    {
      id: "act-3", 
      type: "status" as const,
      title: "Exchange status updated",
      time: "1 day ago",
      timestamp: "2025-05-07T18:00:00Z",
      content: "UI Design exchange with Alex marked as complete",
      read: true
    }
  ];
  
  // Demo data for exchange status
  const exchanges = [
    {
      id: "exch-1",
      title: "JavaScript Tutoring with Jane Doe",
      participants: ["user-1", "user-2"],
      status: "active" as const,
      lastUpdated: "Today",
      timestamp: "2025-05-08T18:00:00Z",
      progress: 65,
      skillOffered: "JavaScript Fundamentals",
      skillRequested: "UI Design Basics"
    },
    {
      id: "exch-2",
      title: "UI Design help with Alex Chen",
      participants: ["user-1", "user-3"],
      status: "completed" as const,
      lastUpdated: "3 days ago",
      timestamp: "2025-05-05T14:30:00Z",
      progress: 100,
      skillOffered: "UI Design Expertise",
      skillRequested: "React Components"
    },
    {
      id: "exch-3",
      title: "Photography basics with Mike Smith",
      participants: ["user-1", "user-4"],
      status: "pending" as const,
      lastUpdated: "2 hours ago",
      timestamp: "2025-05-08T17:10:00Z",
      progress: 0,
      skillOffered: "Photography Tips",
      skillRequested: "Social Media Marketing"
    }
  ];
  
  // Demo data for recommendations
  const recommendations = [
    {
      id: "rec-1",
      title: "Python Programming",
      userName: "Thomas R.",
      userId: "user-5",
      skillId: "skill-7",
      matchScore: 92,
      matchReason: "Based on your JavaScript skills"
    },
    {
      id: "rec-2",
      title: "Digital Marketing",
      userName: "Sarah L.",
      userId: "user-6",
      skillId: "skill-12",
      matchScore: 85,
      matchReason: "Complements your UX/UI skills"
    },
    {
      id: "rec-3",
      title: "Video Editing",
      userName: "James K.",
      userId: "user-7",
      skillId: "skill-18",
      matchScore: 78,
      matchReason: "Matches your photography interest"
    }
  ];
  
  // Define quick actions
  const quickActionsList = [
    commonActions.newSkill,
    commonActions.messages,
    commonActions.findSkills,
    commonActions.profile,
  ];
  
  // Event handlers
  const handleExchangeAction = (action: string, id: string) => {
    console.log(`Exchange action: ${action} on exchange ${id}`);
    // In a real app, this would update the backend
  };
  
  const handleRecommendationAction = (action: string, id: string) => {
    console.log(`Recommendation action: ${action} on item ${id}`);
    // In a real app, this would navigate or perform actions
  };

  return (
    <>
      <Section className="bg-gradient-to-b from-primary-50 to-white">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back! Here's an overview of your skill exchanges and activities.
            </p>
          </div>
          
          {/* Onboarding for new users */}
          {isNewUser && (
            <DashboardOnboarding
              steps={onboardingSteps}
              completedSteps={completedOnboardingSteps}
              totalSteps={onboardingSteps.length}
              className="mb-8"
            />
          )}
          
          {/* Stats section */}
          <Grid columns={4} gap="sm">
            {stats.map((stat, index) => (
              <StatCard 
                key={index}
                label={stat.label}
                value={stat.value}
                to={stat.to}
              />
            ))}
          </Grid>
        </Container>
      </Section>
      
      <Section>
        <Container>
          <Grid columns={3} className="gap-8">
            {/* Main content area - 2/3 width */}
            <div className="col-span-2">
              {/* Activity Feed */}
              <ActivityFeed 
                activities={activities}
                className="mb-8"
                showViewAll={true}
                viewAllUrl="/activities"
              />
              
              {/* Exchange Status */}
              <ExchangeStatusSection 
                exchanges={exchanges}
                onAction={handleExchangeAction}
              />
            </div>
            
            {/* Sidebar - 1/3 width */}
            <div>
              {/* Engagement Actions */}
              <EngagementActions 
                actions={engagementActions}
                className="mb-8"
              />
              
              {/* Recommendations Panel */}
              <RecommendationPanel 
                recommendations={recommendations}
                onAction={handleRecommendationAction}
                className="mb-8"
              />
              
              {/* Quick Actions */}
              <QuickActions 
                actions={quickActionsList}
              />
            </div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
