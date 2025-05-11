'use client';

/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 */

import React from 'react';
import { classNames } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  isLoading = false,
  loadingText,
  disabled,
  type = 'button',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:text-gray-200 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={classNames(
        'inline-flex items-center justify-center rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-60 cursor-not-allowed' : '',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className={classNames('animate-spin -ml-1 mr-2 h-4 w-4', loadingText ? 'mr-2' : '')}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText || children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
