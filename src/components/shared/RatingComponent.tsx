import React from 'react';
import { cn } from '@/lib/utils';

interface RatingComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current rating value (e.g., from 0 to 5).
   */
  rating: number;
  /**
   * The maximum possible rating value (e.g., 5 for a 5-star rating).
   */
  maxRating?: number;
  /**
   * Whether the rating is read-only or interactive.
   */
  readOnly?: boolean;
  /**
   * Callback function when the rating changes (only if not readOnly).
   */
  onRatingChange?: (newRating: number) => void;
  /**
   * Size of the stars.
   */
  size?: 'sm' | 'md' | 'lg';
}

const RatingComponent = React.forwardRef<HTMLDivElement, RatingComponentProps>(
  (
    {
      rating,
      maxRating = 5,
      readOnly = true,
      onRatingChange,
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const starSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const renderStar = (index: number) => {
      const fillPercentage = Math.min(Math.max(0, rating - index + 1), 1) * 100;
      const isFilled = rating >= index;
      const isHalfFilled = rating >= index - 0.5 && rating < index;

      return (
        <div
          key={index}
          className={cn('relative', { 'cursor-pointer': !readOnly })}
          onClick={() => !readOnly && onRatingChange && onRatingChange(index)}
          onMouseMove={(e) => {
            if (!readOnly && onRatingChange) {
              const { left, width } = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const hoverX = e.clientX - left;
              const newRating = hoverX > width / 2 ? index : index - 0.5;
              // Optional: provide visual feedback on hover before click
            }
          }}
          onMouseLeave={() => {
            // Optional: reset visual feedback on mouse leave
          }}
        >
          <svg
            className={cn(
              'text-gray-300', // Base color for empty star
              starSizeClasses[size]
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.536 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.78.565-1.83-.197-1.535-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.725c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
          {(isFilled || isHalfFilled) && (
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <svg
                className={cn(
                  'text-yellow-400', // Filled star color
                  starSizeClasses[size]
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.536 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.78.565-1.83-.197-1.535-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.725c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
        </div>
      );
    };

    return (
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((index) =>
          renderStar(index)
        )}
      </div>
    );
  }
);

RatingComponent.displayName = 'RatingComponent';

export { RatingComponent };
