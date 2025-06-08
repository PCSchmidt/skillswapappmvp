import React from 'react';
import Card from '@/components/ui/Card';

export interface Recommendation {
  id: string;
  title: string;
  userName: string;
  userId: string;
  skillId: string;
  matchScore: number; // 0-100
  matchReason?: string;
  description?: string;
  skillLevel?: string;
  location?: string;
  imageUrl?: string;
}

interface RecommendationItemProps {
  recommendation: Recommendation;
  onAction?: (action: string, id: string) => void;
}

export const RecommendationItem: React.FC<RecommendationItemProps> = ({ 
  recommendation, 
  onAction 
}) => {
  // Generate a color based on match score
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-primary-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="border-b border-gray-100 pb-3">
      <h4 className="font-medium">{recommendation.title}</h4>
      <div className="flex justify-between mt-1">
        <span className="text-gray-600">{recommendation.userName}</span>
        <span className={`text-sm font-medium ${getMatchColor(recommendation.matchScore)}`}>
          {recommendation.matchScore}% match
        </span>
      </div>
      
      {recommendation.matchReason && (
        <p className="text-xs text-gray-500 mt-1">{recommendation.matchReason}</p>
      )}
      
      {onAction && (
        <div className="flex space-x-2 mt-2">
          <button 
            onClick={() => onAction('view', recommendation.skillId)}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
          >
            View
          </button>
          <button 
            onClick={() => onAction('contact', recommendation.userId)}
            className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded hover:bg-primary-100"
          >
            Contact
          </button>
        </div>
      )}
    </div>
  );
};

export interface RecommendationPanelProps {
  recommendations: Recommendation[];
  loading?: boolean;
  emptyMessage?: string;
  showViewAll?: boolean;
  viewAllUrl?: string;
  limit?: number;
  onAction?: (action: string, id: string) => void;
  className?: string;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendations,
  loading = false,
  emptyMessage = "No recommendations available",
  showViewAll = true,
  viewAllUrl = "/recommendations",
  limit,
  onAction,
  className,
}) => {
  // Apply limit if specified
  const displayedRecommendations = limit ? recommendations.slice(0, limit) : recommendations;

  return (
    <Card className={`p-6 ${className || ''}`}>
      <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
      
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-100 pb-3">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayedRecommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <div className="space-y-4">
          {displayedRecommendations.map((recommendation) => (
            <RecommendationItem 
              key={recommendation.id} 
              recommendation={recommendation}
              onAction={onAction}
            />
          ))}
        </div>
      )}

      {showViewAll && recommendations.length > 0 && (
        <a 
          href={viewAllUrl}
          className="text-primary-600 font-medium mt-4 hover:text-primary-700 transition-colors inline-block"
        >
          View all recommendations
        </a>
      )}
    </Card>
  );
};

export default RecommendationPanel;
