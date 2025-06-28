/**
 * Loading Spinner Component
 * 
 * A reusable loading spinner with different sizes and variants
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'white' | 'gray';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  variant = 'primary', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  const variantClasses = {
    primary: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`
          animate-spin rounded-full border-2 border-t-transparent
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
        `}
      />
    </div>
  );
}
