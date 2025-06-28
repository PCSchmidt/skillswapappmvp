/**
 * Demo Data Provider Component
 * 
 * Provides sample/mock data to showcase app functionality for trial users
 * and when real data is sparse. This helps new users understand the app's
 * potential and encourages engagement.
 */

import React from 'react';

export interface DemoSkill {
  id: string;
  title: string;
  description: string;
  category: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  is_offering: boolean;
  is_remote: boolean;
  user: {
    id: string;
    full_name: string;
    profile_image_url?: string;
    location_city: string;
    location_state: string;
    rating: number;
    completedTrades: number;
  };
}

export interface DemoUser {
  id: string;
  full_name: string;
  profile_image_url?: string;
  location_city: string;
  location_state: string;
  bio: string;
  rating: number;
  completedTrades: number;
  joinedDate: string;
  skills: DemoSkill[];
}

export const DEMO_SKILLS: DemoSkill[] = [
  {
    id: 'demo-1',
    title: 'Guitar Lessons (Acoustic & Electric)',
    description: 'I\'ve been playing guitar for 8 years and love teaching beginners. I can help with chords, fingerpicking, and basic music theory.',
    category: 'Music',
    experience_level: 'advanced',
    is_offering: true,
    is_remote: true,
    user: {
      id: 'demo-user-1',
      full_name: 'Sarah Music',
      profile_image_url: '/demo-avatars/sarah.jpg',
      location_city: 'Austin',
      location_state: 'TX',
      rating: 4.9,
      completedTrades: 23
    }
  },
  {
    id: 'demo-2',
    title: 'Python Programming & Web Development',
    description: 'Experienced software developer offering help with Python, Django, and web development. Perfect for beginners wanting to start coding!',
    category: 'Technology',
    experience_level: 'expert',
    is_offering: true,
    is_remote: true,
    user: {
      id: 'demo-user-2',
      full_name: 'Alex Code',
      profile_image_url: '/demo-avatars/alex.jpg',
      location_city: 'Austin',
      location_state: 'TX',
      rating: 4.8,
      completedTrades: 31
    }
  },
  {
    id: 'demo-3',
    title: 'Italian Cooking Classes',
    description: 'Learn authentic Italian recipes from my grandmother\'s cookbook! From pasta making to perfect risotto, I\'ll teach you family secrets.',
    category: 'Culinary',
    experience_level: 'advanced',
    is_offering: true,
    is_remote: false,
    user: {
      id: 'demo-user-3',
      full_name: 'Marco Cuisine',
      profile_image_url: '/demo-avatars/marco.jpg',
      location_city: 'Austin',
      location_state: 'TX',
      rating: 4.9,
      completedTrades: 18
    }
  },
  {
    id: 'demo-4',
    title: 'Yoga & Meditation Sessions',
    description: 'Certified yoga instructor offering personalized sessions for stress relief, flexibility, and mindfulness. All levels welcome!',
    category: 'Fitness & Wellness',
    experience_level: 'expert',
    is_offering: true,
    is_remote: false,
    user: {
      id: 'demo-user-4',
      full_name: 'Emma Zen',
      profile_image_url: '/demo-avatars/emma.jpg',
      location_city: 'Austin',
      location_state: 'TX',
      rating: 5.0,
      completedTrades: 27
    }
  },
  {
    id: 'demo-5',
    title: 'Spanish Conversation Practice',
    description: 'Native Spanish speaker from Mexico City. Let\'s practice conversational Spanish over coffee! I can help with pronunciation and cultural context.',
    category: 'Languages',
    experience_level: 'expert',
    is_offering: true,
    is_remote: true,
    user: {
      id: 'demo-user-5',
      full_name: 'Carlos Language',
      profile_image_url: '/demo-avatars/carlos.jpg',
      location_city: 'Austin',
      location_state: 'TX',
      rating: 4.7,
      completedTrades: 14
    }
  },
  {
    id: 'demo-6',
    title: 'Photography & Photo Editing',
    description: 'Professional photographer offering lessons in portrait, landscape, and event photography. Plus Lightroom and Photoshop editing skills!',
    category: 'Arts & Crafts',
    experience_level: 'expert',
    is_offering: true,
    is_remote: true,
    user: {
      id: 'demo-user-6',
      full_name: 'David Lens',
      profile_image_url: '/demo-avatars/david.jpg',
      location_city: 'Austin',
      location_state: 'TX',
      rating: 4.8,
      completedTrades: 22
    }
  }
];

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-user-1',
    full_name: 'Sarah Music',
    profile_image_url: '/demo-avatars/sarah.jpg',
    location_city: 'Austin',
    location_state: 'TX',
    bio: 'Music teacher and performer who loves sharing the joy of music. Always looking to learn new skills in exchange for guitar lessons!',
    rating: 4.9,
    completedTrades: 23,
    joinedDate: '2024-08-15',
    skills: [DEMO_SKILLS[0]]
  },
  {
    id: 'demo-user-2',
    full_name: 'Alex Code',
    profile_image_url: '/demo-avatars/alex.jpg',
    location_city: 'Austin',
    location_state: 'TX',
    bio: 'Full-stack developer passionate about teaching others to code. Currently learning Spanish and looking for cooking lessons!',
    rating: 4.8,
    completedTrades: 31,
    joinedDate: '2024-07-20',
    skills: [DEMO_SKILLS[1]]
  },
  {
    id: 'demo-user-3',
    full_name: 'Marco Cuisine',
    profile_image_url: '/demo-avatars/marco.jpg',
    location_city: 'Austin',
    location_state: 'TX',
    bio: 'Third-generation Italian chef sharing family recipes. Always excited to learn new cuisines and techniques from other cultures.',
    rating: 4.9,
    completedTrades: 18,
    joinedDate: '2024-09-01',
    skills: [DEMO_SKILLS[2]]
  },
  {
    id: 'demo-user-4',
    full_name: 'Emma Zen',
    profile_image_url: '/demo-avatars/emma.jpg',
    location_city: 'Austin',
    location_state: 'TX',
    bio: 'Wellness enthusiast helping others find balance through yoga and meditation. Interested in learning photography and music.',
    rating: 5.0,
    completedTrades: 27,
    joinedDate: '2024-06-10',
    skills: [DEMO_SKILLS[3]]
  },
  {
    id: 'demo-user-5',
    full_name: 'Carlos Language',
    profile_image_url: '/demo-avatars/carlos.jpg',
    location_city: 'Austin',
    location_state: 'TX',
    bio: 'Language enthusiast who speaks 4 languages fluently. Love helping others communicate across cultures while learning new skills myself.',
    rating: 4.7,
    completedTrades: 14,
    joinedDate: '2024-10-05',
    skills: [DEMO_SKILLS[4]]
  },
  {
    id: 'demo-user-6',
    full_name: 'David Lens',
    profile_image_url: '/demo-avatars/david.jpg',
    location_city: 'Austin',
    location_state: 'TX',
    bio: 'Professional photographer with 10+ years experience. Always looking to trade photo lessons for interesting skills and experiences.',
    rating: 4.8,
    completedTrades: 22,
    joinedDate: '2024-08-30',
    skills: [DEMO_SKILLS[5]]
  }
];

interface DemoDataProviderProps {
  children: React.ReactNode;
}

const DemoDataContext = React.createContext<{
  demoSkills: DemoSkill[];
  demoUsers: DemoUser[];
  isDemoMode: boolean;
}>({
  demoSkills: DEMO_SKILLS,
  demoUsers: DEMO_USERS,
  isDemoMode: true
});

export const useDemoData = () => {
  const context = React.useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
};

export default function DemoDataProvider({ children }: DemoDataProviderProps) {
  return (
    <DemoDataContext.Provider
      value={{
        demoSkills: DEMO_SKILLS,
        demoUsers: DEMO_USERS,
        isDemoMode: true
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
}
