/**
 * Matches page component
 * Displays a list of all potential skill matches for a user
 */

'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Grid from '@/components/layout/Grid';
import Column from '@/components/layout/Column';
import { findBestMatches, SkillMatch } from '@/components/matching/MatchingAlgorithm';
import { Skill } from '@/types';

// Mock data for demonstration
const MOCK_USER_REQUESTED_SKILLS: Skill[] = [
  {
    id: 'req-1',
    user_id: 'current-user',
    title: 'React Development',
    description: 'Looking for help with advanced React patterns like context and custom hooks.',
    category: 'programming',
    level: 'intermediate',
    type: 'seeking',
    location_type: 'remote',
    compensation_type: 'exchange',
    contact_preference: 'platform',
    is_active: true,
    created_at: '2025-05-01T00:00:00Z',
    updated_at: '2025-05-01T00:00:00Z',
  },
  {
    id: 'req-2',
    user_id: 'current-user',
    title: 'French Language',
    description: 'Need help practicing conversational French. I know basics but struggle with fluency.',
    category: 'language',
    level: 'beginner',
    type: 'seeking',
    location_type: 'both',
    compensation_type: 'exchange',
    contact_preference: 'email',
    is_active: true,
    created_at: '2025-05-01T00:00:00Z',
    updated_at: '2025-05-01T00:00:00Z',
  },
];

const MOCK_AVAILABLE_SKILLS: Skill[] = [
  {
    id: 'skill-1',
    user_id: 'user-1',
    title: 'React Development',
    description: 'Expert React developer with 5 years of experience. Can teach advanced patterns and performance optimization.',
    category: 'programming',
    level: 'expert',
    type: 'offering',
    location_type: 'remote',
    compensation_type: 'exchange',
    contact_preference: 'platform',
    is_active: true,
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
  },
  {
    id: 'skill-2',
    user_id: 'user-2',
    title: 'React & Next.js Development',
    description: 'Full stack developer specializing in React and Next.js applications. Can help with SSR, ISR, and API routes.',
    category: 'programming',
    level: 'advanced',
    type: 'offering',
    location_type: 'remote',
    compensation_type: 'exchange',
    contact_preference: 'platform',
    is_active: true,
    created_at: '2025-04-02T00:00:00Z',
    updated_at: '2025-04-02T00:00:00Z',
  },
  {
    id: 'skill-3',
    user_id: 'user-3',
    title: 'French Tutoring',
    description: 'Native French speaker offering conversational practice and grammar lessons for beginners and intermediates.',
    category: 'language',
    level: 'expert',
    type: 'offering',
    location_type: 'both',
    compensation_type: 'exchange',
    contact_preference: 'email',
    is_active: true,
    created_at: '2025-04-03T00:00:00Z',
    updated_at: '2025-04-03T00:00:00Z',
  },
  {
    id: 'skill-4',
    user_id: 'user-4',
    title: 'French Language Exchange',
    description: 'Fluent French speaker looking to exchange language practice. Can help with conversation, reading, and writing.',
    category: 'language',
    subcategory: 'french',
    level: 'advanced',
    type: 'offering',
    location_type: 'remote',
    compensation_type: 'exchange',
    contact_preference: 'platform',
    is_active: true,
    created_at: '2025-04-04T00:00:00Z',
    updated_at: '2025-04-04T00:00:00Z',
  },
  {
    id: 'skill-5',
    user_id: 'user-5',
    title: 'Web Development Tutoring',
    description: 'Full stack web developer offering mentoring in HTML, CSS, JavaScript and basic React concepts.',
    category: 'programming',
    subcategory: 'web-development',
    level: 'intermediate',
    type: 'offering',
    location_type: 'both',
    compensation_type: 'free',
    contact_preference: 'platform',
    is_active: true,
    created_at: '2025-04-05T00:00:00Z',
    updated_at: '2025-04-05T00:00:00Z',
  },
];

// Mock user data
const MOCK_USERS: Record<string, { username: string, avatar_url?: string }> = {
  'user-1': { username: 'ReactMaster', avatar_url: '/avatars/user1.jpg' },
  'user-2': { username: 'NextJSDev', avatar_url: '/avatars/user2.jpg' },
  'user-3': { username: 'FrenchNative', avatar_url: '/avatars/user3.jpg' },
  'user-4': { username: 'LanguageLover', avatar_url: '/avatars/user4.jpg' },
  'user-5': { username: 'WebDevTutor', avatar_url: '/avatars/user5.jpg' },
};

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<SkillMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Fetch and calculate matches
  useEffect(() => {
    // In a real application, we would fetch the user's requested skills
    // and available skills from the API
    setTimeout(() => {
      // Calculate matches using our matching algorithm
      const calculatedMatches = findBestMatches(
        MOCK_USER_REQUESTED_SKILLS,
        MOCK_AVAILABLE_SKILLS,
        20 // Show more matches on the dedicated page
      );
      
      // Enhance with mock user data
      const enhancedMatches = calculatedMatches.map(match => {
        const userData = MOCK_USERS[match.offeredSkill.user_id] || { 
          username: `User ${match.offeredSkill.user_id.substring(0, 6)}`
        };
        
        return {
          ...match,
          user: {
            ...match.user,
            username: userData.username,
            avatar_url: userData.avatar_url
          }
        };
      });
      
      setMatches(enhancedMatches);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter matches by category
  const filteredMatches = activeFilter === 'all' 
    ? matches 
    : matches.filter(match => match.offeredSkill.category === activeFilter);
  
  // Get unique categories for filter
  const categories = Array.from(
    new Set(matches.map(match => match.offeredSkill.category))
  );

  return (
    <>
      <Section className="bg-gray-50 py-8">
        <Container>
          <h1 className="text-3xl font-bold mb-2">Your Skill Matches</h1>
          <p className="text-gray-600 mb-6">
            Based on the skills you're looking for, we've found potential matches 
            with other users on the platform.
          </p>
          
          {/* Category filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All Categories
            </button>
            
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          {isLoading ? (
            // Loading state
            <div className="py-12">
              <div className="w-24 h-24 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto"></div>
              <p className="text-center mt-4 text-gray-600">Finding your matches...</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            // No matches state
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold mb-2">No Matches Found</h2>
              <p className="text-gray-600">
                {activeFilter === 'all' 
                  ? "We couldn't find any matches for your skills at the moment." 
                  : `We couldn't find any ${activeFilter} matches for your skills.`}
              </p>
              {activeFilter !== 'all' && (
                <button 
                  onClick={() => setActiveFilter('all')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View All Categories
                </button>
              )}
            </div>
          ) : (
            // Display matches
            <Grid>
              {filteredMatches.map((match, index) => (
                <Column key={`${match.offeredSkill.id}-${index}`} className="sm:w-full md:w-1/2 lg:w-1/3 p-2">
                  <MatchCard match={match} />
                </Column>
              ))}
            </Grid>
          )}
        </Container>
      </Section>
    </>
  );
};

interface MatchCardProps {
  match: SkillMatch;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { offeredSkill, requestedSkill, user, matchScore } = match;
  
  // Format match score as percentage
  const matchPercentage = Math.round(matchScore.score * 100);
  
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 font-medium">{user.username?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-lg">{offeredSkill.title}</h3>
            <p className="text-sm text-gray-600">by {user.username}</p>
          </div>
        </div>
        <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium ml-2">
          {matchPercentage}% Match
        </div>
      </div>
      
      <p className="mt-3 text-sm text-gray-600 line-clamp-3">
        {offeredSkill.description}
      </p>
      
      <div className="mt-3 text-xs text-gray-500">
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {offeredSkill.category}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded">
            {offeredSkill.level}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded">
            {offeredSkill.location_type}
          </span>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-600">
        <div className="p-2 bg-blue-50 rounded border border-blue-100">
          <p><strong>Matches your request:</strong> {requestedSkill.title}</p>
          <p className="mt-1"><strong>Match reasons:</strong></p>
          <ul className="list-disc list-inside">
            {matchScore.reasons.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-auto pt-4 flex justify-between items-center">
        <a 
          href={`/skills/${offeredSkill.id}`}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View Details
        </a>
        
        <a 
          href={`/contact/${user.id}?skill=${offeredSkill.id}`}
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Contact
        </a>
      </div>
    </div>
  );
};

export default MatchesPage;
