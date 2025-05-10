import React from 'react';

interface ActivityFeedSkeletonProps {
  className?: string;
  itemCount?: number;
}

const ActivityFeedSkeleton: React.FC<ActivityFeedSkeletonProps> = ({ 
  className = '',
  itemCount = 3
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Activity items */}
      {Array.from({ length: itemCount }).map((_, index) => (
        <div 
          key={index} 
          className={`py-3 ${index !== itemCount - 1 ? 'border-b border-gray-100' : ''}`}
        >
          <div className="flex justify-between mb-2">
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          
          {/* Action button (for some activities) */}
          {index % 2 === 0 && (
            <div className="mt-2 h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          )}
        </div>
      ))}
      
      {/* View all link */}
      <div className="mt-3 h-5 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
    </div>
  );
};

export default ActivityFeedSkeleton;
