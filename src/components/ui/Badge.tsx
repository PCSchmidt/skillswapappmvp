'use client';

import React, { ReactNode } from 'react';
import { classNames } from '@/lib/utils';

export interface BadgeProps {
  /**
   * The content to display inside the badge.
   */
  children: ReactNode;
  /**
   * The color variant of the badge.
   * @default 'neutral'
   */
  variant?: 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /**
   * Optional CSS class names for the badge.
   */
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantClasses = {
    neutral: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    info: 'bg-info-100 text-info-800',
  };

  return (
    <span
      className={classNames(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
