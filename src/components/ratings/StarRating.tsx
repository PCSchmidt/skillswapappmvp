/**
 * StarRating Component
 * 
 * This component displays a star rating and allows users to select a rating
 * when in interactive mode.
 */

import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  disabled?: boolean;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  color = 'text-yellow-400',
  interactive = false,
  onChange,
  disabled = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);
  
  // Determine the size of the stars based on the size prop
  const starSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];
  
  // Determine the right spacing between stars
  const spacing = {
    sm: 'space-x-1',
    md: 'space-x-1.5',
    lg: 'space-x-2'
  }[size];
  
  // Handle mouse enter on a star
  const handleMouseEnter = (index: number) => {
    if (interactive && !disabled) {
      setHoverRating(index);
    }
  };
  
  // Handle mouse leave from the rating component
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  // Handle click on a star
  const handleClick = (index: number) => {
    if (interactive && !disabled && onChange) {
      onChange(index);
    }
  };
  
  // Generate an array of stars based on maxRating
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);
  
  // The current display rating (either hoverRating if hovering, or rating)
  const displayRating = hoverRating > 0 ? hoverRating : rating;
  
  return (
    <div
      role="group"
      className={`flex ${spacing} items-center ${size}`}
      onMouseLeave={handleMouseLeave}
    >
      {stars.map((star) => (
        <Star
          key={star}
          filled={displayRating >= star}
          half={displayRating >= star - 0.5 && displayRating < star}
          size={starSize}
          color={color}
          interactive={interactive && !disabled}
          isHovered={star <= hoverRating}
          onMouseEnter={() => handleMouseEnter(star)}
          onClick={() => handleClick(star)}
          data-testid={`star-${star}`}
        />
      ))}
    </div>
  );
}

interface StarProps {
  filled: boolean;
  half: boolean;
  size: string;
  color: string;
  interactive: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  'data-testid': string;
}

// Star component for rendering individual stars
function Star({ filled, half, size, color, interactive, isHovered, onMouseEnter, onClick, 'data-testid': testId }: StarProps) {
  const cursorStyle = interactive ? 'cursor-pointer' : '';
  const fillColor = filled || half ? color : 'text-gray-300';
  const hoverClass = isHovered ? 'hover' : '';

  return (
    <svg
      data-testid={testId}
      role={interactive ? 'button' : undefined}
      aria-label={filled ? 'Full Star' : half ? 'Half Star' : 'Empty Star'}
      className={`${size} ${fillColor} ${cursorStyle} ${hoverClass}`}
      viewBox="0 0 24 24"
      fill={filled || half ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
