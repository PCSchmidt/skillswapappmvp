import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { MatchResult } from '../../lib/matching/matchingAlgorithm';
import { classNames } from '../../lib/utils';

interface MatchRecommendationPanelProps {
  /**
   * List of match results to display
   */
  matches: MatchResult[];
  
  /**
   * Number of matches to display at once
   * @default 3
   */
  displayCount?: number;
  
  /**
   * Whether to show detailed match explanations
   * @default true
   */
  showMatchDetails?: boolean;
  
  /**
   * Custom class names
   */
  className?: string;
  
  /**
   * Callback when a match is selected
   */
  onSelectMatch?: (match: MatchResult) => void;
  
  /**
   * Callback when a user dismisses a match
   */
  onDismissMatch?: (matchId: string) => void;
  
  /**
   * The panel's title
   * @default "Recommended Skill Exchanges"
   */
  title?: string;
}

/**
 * Match Recommendation Panel Component
 * 
 * Displays potential skill exchange matches with match scores, explanations,
 * and actions to contact or dismiss the match.
 */
const MatchRecommendationPanel: React.FC<MatchRecommendationPanelProps> = ({
  matches,
  displayCount = 3,
  showMatchDetails = true,
  className = '',
  onSelectMatch,
  onDismissMatch,
  title = "Recommended Skill Exchanges"
}) => {
  const [visibleMatches, setVisibleMatches] = useState<MatchResult[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const { } = useSupabase();
  
  // Prepare visible matches - filter out dismissed ones and limit to display count
  useEffect(() => {
    const filteredMatches = matches
      .filter(match => !dismissedIds.has(match.user.id))
      .slice(0, displayCount);
    
    setVisibleMatches(filteredMatches);
  }, [matches, dismissedIds, displayCount]);
  
  // Handle match dismissal
  const handleDismiss = (match: MatchResult) => {
    const newDismissedIds = new Set(dismissedIds);
    newDismissedIds.add(match.user.id);
    setDismissedIds(newDismissedIds);
    
    if (onDismissMatch) {
      onDismissMatch(match.user.id);
    }
  };
  
  // Handle match selection
  const handleSelect = (match: MatchResult) => {
    if (onSelectMatch) {
      onSelectMatch(match);
    }
  };
  
  // Render score color based on match quality
  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-gray-600';
  };
  
  return (
    <div className={classNames('rounded-lg overflow-hidden', className)}>
      <div className="bg-white shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            People with complementary skills who might be a good match for you.
          </p>
        </div>
        
        {visibleMatches.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {visibleMatches.map((match) => (
              <li key={match.user.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      {match.user.avatar_url ? (
                        <Image
                          src={match.user.avatar_url}
                          alt={match.user.display_name}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-lg font-medium">
                          {match.user.display_name.substring(0, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* User info and match details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <Link href={`/profile/${match.user.id}`} className="hover:underline">
                        <span className="text-base font-medium text-primary">
                          {match.user.display_name}
                        </span>
                      </Link>
                      <span className={classNames('font-semibold', getScoreColor(match.score))}>
                        {match.score}% Match
                      </span>
                    </div>
                    
                    {/* Skill match info */}
                    <div className="mt-1 text-sm text-gray-600">
                      {match.matchedSkills.offered.length > 0 && (
                        <p>
                          <span className="font-medium">Skills:</span> {
                            match.matchedSkills.offered.map(skill => skill.name).join(', ')
                          }
                        </p>
                      )}
                    </div>
                    
                    {/* Match reasons */}
                    {showMatchDetails && match.matchReasons.length > 0 && (
                      <div className="mt-2">
                        <ul className="text-xs text-gray-500 space-y-1">
                          {match.matchReasons.slice(0, 2).map((reason, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block h-4 w-4 mr-1 text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => handleDismiss(match)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Not Interested
                  </button>
                  <button
                    onClick={() => handleSelect(match)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Contact
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-6 text-center text-gray-500">
            <p>No matches currently available.</p>
            <p className="mt-1 text-sm">Try updating your skills or preferences to find more matches.</p>
          </div>
        )}
      </div>
      
      {/* See all matches button */}
      {matches.length > displayCount && (
        <div className="mt-2 text-center">
          <Link 
            href="/matches" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:underline"
          >
            View all matches
            <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MatchRecommendationPanel;
