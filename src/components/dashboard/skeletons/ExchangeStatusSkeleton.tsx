import React from 'react';

interface ExchangeStatusSkeletonProps {
  className?: string;
  itemCount?: number;
}

const ExchangeStatusSkeleton: React.FC<ExchangeStatusSkeletonProps> = ({
  className = '',
  itemCount = 3
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-7 w-56 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Exchange items */}
      <div className="space-y-4">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Progress indicator */}
            <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
              <div 
                className="h-2 bg-gray-200 rounded-full animate-pulse" 
                style={{ width: `${Math.random() * 100}%` }}
              ></div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View all link */}
      <div className="mt-4 h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
    </div>
  );
};

export default ExchangeStatusSkeleton;
