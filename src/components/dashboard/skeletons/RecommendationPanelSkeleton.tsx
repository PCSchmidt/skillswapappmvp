import React from 'react';

interface RecommendationPanelSkeletonProps {
  className?: string;
  itemCount?: number;
}

const RecommendationPanelSkeleton: React.FC<RecommendationPanelSkeletonProps> = ({
  className = '',
  itemCount = 3
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Recommendation items */}
      <div className="space-y-3">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div 
            key={index}
            className="border border-gray-100 rounded-lg p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View more link */}
      <div className="mt-3 h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
    </div>
  );
};

export default RecommendationPanelSkeleton;
