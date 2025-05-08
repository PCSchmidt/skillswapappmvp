/**
 * MatchRecommendationPanel.tsx
 * Panel component that displays recommended skill matches for a user
 */

import React, { useState, useEffect } from 'react';
import { 
  findBestMatches, 
  SkillMatch
} from './MatchingAlgorithm';
import { Skill } from '@/types';
import Link from 'next/link';

interface MatchRecommendationPanelProps {
  userRequestedSkills: Skill[];
  availableOfferedSkills: Skill[];
  isLoading?: boolean;
}

const MatchRecommendationPanel: React.FC<MatchRecommendationPanelProps> = ({
  userRequestedSkills,
  availableOfferedSkills,
  isLoading = false
}) => {
  const [matches, setMatches] = useState<SkillMatch[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(true);

  // Calculate matches when skills change
  useEffect(() => {
    if (!userRequestedSkills.length || !availableOfferedSkills.length) {
      setMatches([]);
      setIsCalculating(false);
      return;
    }

    // Simulate a slight delay for complex calculations
    const timer = setTimeout(() => {
      const calculatedMatches = findBestMatches(
        userRequestedSkills,
        availableOfferedSkills
      );
      
      setMatches(calculatedMatches);
      setIsCalculating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [userRequestedSkills, availableOfferedSkills]);

  if (isLoading || isCalculating) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Finding Matches</h2>
        <div className="animate-pulse flex flex-col space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Skill Matches</h2>
        <p className="text-gray-600 mb-4">
          We couldn't find any matches for your requested skills at the moment.
        </p>
        <div className="p-4 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-600">
            Try adding more skills you're looking for or check back later as new users join the platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Suggested Matches</h2>
      <p className="text-gray-600 mb-4">
        Based on the skills you're looking for, we've found these potential matches:
      </p>

      <div className="space-y-4">
        {matches.slice(0, 3).map((match, index) => (
          <MatchCard key={`${match.offeredSkill.id}-${index}`} match={match} />
        ))}
      </div>

      {matches.length > 3 && (
        <div className="mt-4 text-center">
          <Link 
            href="/matches" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View All {matches.length} Matches
          </Link>
        </div>
      )}
    </div>
  );
};

interface MatchCardProps {
  match: SkillMatch;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { offeredSkill, user, matchScore } = match;
  
  // Format match score as percentage
  const matchPercentage = Math.round(matchScore.score * 100);
  
  return (
    <div className="border rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{offeredSkill.title}</h3>
          <p className="text-sm text-gray-600">
            by {user.username || `User ${user.id.substring(0, 6)}`}
          </p>
        </div>
        <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
          {matchPercentage}% Match
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
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
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <Link
          href={`/skills/${offeredSkill.id}`}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View Details
        </Link>
        
        <Link
          href={`/contact/${user.id}?skill=${offeredSkill.id}`}
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Contact
        </Link>
      </div>
    </div>
  );
};

export default MatchRecommendationPanel;
