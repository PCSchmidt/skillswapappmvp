import React from 'react';
import { cn } from '@/lib/utils'; // Use cn for consistency

export interface NotificationBadgeProps {
  /**
   * The number to display in the badge
   */
  count: number;
  
  /**
   * Maximum number to display before showing "99+"
   * @default 99
   */
  max?: number;
  
  /**
   * Badge size
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Badge variant
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';
  
  /**
   * Whether to hide the badge when count is 0
   * @default true
   */
  hideZero?: boolean;
  
  /**
   * Optional CSS class names
   */
  className?: string;
  
  /**
   * Whether to pulse the badge for emphasis
   * @default false
   */
  pulse?: boolean;
  
  /**
   * Whether to show as a dot instead of a count
   * @default false
   */
  dot?: boolean;
}

/**
 * NotificationBadge component displaying unread counts
 * 
 * Renders a badge with count information for notifications, messages, etc.
 */
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  size = 'md',
  variant = 'primary',
  hideZero = true,
  className = '',
  pulse = false,
  dot = false,
}) => {
  // Don't render if count is 0 and hideZero is true
  if (count === 0 && hideZero) {
    return null;
  }

  // Format display text
  const displayText = dot ? '' : count > max ? `${max}+` : `${count}`;
  
  // Size classes
  const sizeClasses = {
    sm: 'h-4 min-w-4 text-xs px-1',
    md: 'h-5 min-w-5 text-xs px-1.5',
    lg: 'h-6 min-w-6 text-sm px-2',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-secondary-600 text-white',
    danger: 'bg-error text-white',
    warning: 'bg-warning text-white',
    success: 'bg-success text-white',
    info: 'bg-info text-white',
  };
  
  // Dot specific classes
  const dotClasses = dot ? 
    {
      sm: 'w-2 h-2 min-w-0 p-0',
      md: 'w-3 h-3 min-w-0 p-0',
      lg: 'w-4 h-4 min-w-0 p-0',
    } : {};
  
  // Pulse animation
  const pulseAnimation = pulse ? 'animate-pulse' : '';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium leading-none',
        sizeClasses[size],
        dotClasses[size], // dotClasses[size] can be undefined, cn handles this
        variantClasses[variant],
        pulseAnimation,
        className
      )}
      aria-label={dot ? `${count} unread notifications` : undefined}
    >
      {displayText}
    </span>
  );
};

export default NotificationBadge;
