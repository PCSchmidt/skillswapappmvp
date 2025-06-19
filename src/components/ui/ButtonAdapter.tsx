'use client';

/**
 * ButtonAdapter Component
 * 
 * A compatibility layer that bridges existing button usages with the standardized Button component.
 * This adapter supports additional properties like 'as' for polymorphic rendering,
 * 'ExtraSmall' size, and 'success' variant that aren't in the core Button component.
 */

import React from 'react';
import Button, { ButtonProps } from '@/components/ui/Button';
import { classNames } from '@/lib/utils';

// Define extended types for our new component
type ExtendedButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link' | 'success';
type ExtendedButtonSize = 'Small' | 'Medium' | 'Large' | 'ExtraSmall';

// Size mapping from extended sizes to Button component sizes
const sizeMap: Record<ExtendedButtonSize, ButtonProps['size']> = {
  'Small': 'sm',
  'Medium': 'md',
  'Large': 'lg',
  'ExtraSmall': 'xs'
};

// Keep the interface simpler to avoid type conflicts
interface ButtonAdapterProps {
  as?: 'a' | 'button';
  href?: string;
  size?: ExtendedButtonSize;
  variant?: ExtendedButtonVariant;
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  // Additional props for future extensibility
  [key: string]: unknown;
}

const ButtonAdapter: React.FC<ButtonAdapterProps> = ({
  as = 'button',
  href,
  size = 'Medium',
  variant = 'primary',
  className = '',
  children,
  isLoading,
  loadingText,
  disabled,
  icon,
  iconPosition = 'left',
  onClick,
  type,
  fullWidth,
  ...otherProps
}) => {
  // Map sizes from adapter format to Button component format
  const mappedSize = sizeMap[size] || 'md';
  
  // Map success variant to primary with success colors
  let mappedVariant: ButtonProps['variant'] = variant as ButtonProps['variant'];
  let extraClasses = '';
  
  if (variant === 'success') {
    mappedVariant = 'primary';
    extraClasses = 'bg-success hover:bg-success-600 focus:ring-success-500';
  } else if (variant === 'link') {
    mappedVariant = 'ghost';
    extraClasses = 'underline text-primary-600 hover:text-primary-700';
  }

  const isDisabled = disabled || isLoading;
  
  // For anchor buttons
  if (as === 'a' && href) {
    // For anchor elements, create anchor-specific styling
    const anchorSizeClasses = {
      'xs': 'px-2 py-1 text-xs',
      'sm': 'px-3 py-2 text-sm',
      'md': 'px-4 py-2 text-base',
      'lg': 'px-5 py-2.5 text-base',
      'xl': 'px-6 py-3 text-lg',
    };
    
    const sizeClasses = anchorSizeClasses[mappedSize];
    
    const variantClasses = variant === 'link' 
      ? 'bg-transparent text-primary-600 hover:text-primary-700 focus:ring-primary-500 underline' 
      : extraClasses || 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500';
      
    const disabledClasses = isDisabled ? 'opacity-60 cursor-not-allowed' : '';
    const widthClass = fullWidth ? 'w-full' : '';
    
    const baseClasses = classNames(
      'inline-flex items-center justify-center rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
      variantClasses,
      sizeClasses,
      disabledClasses,
      widthClass,
      className
    );

    // For anchor elements, only pass valid anchor props
    const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
      href,
      className: baseClasses,
      onClick: onClick as React.MouseEventHandler<HTMLAnchorElement>,
      ...otherProps as React.AnchorHTMLAttributes<HTMLAnchorElement>,
    };

    return (
      <a {...anchorProps}>
        {isLoading ? (
          <>
            <svg
              className={classNames('animate-spin -ml-1 h-4 w-4', loadingText ? 'mr-2' : '')}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
      </a>
    );
  }
  
  // For regular buttons
  // Keep only the props that the Button component needs
  const buttonProps: ButtonProps = {
    size: mappedSize,
    variant: mappedVariant,
    className: `${extraClasses} ${className}`,
    isLoading,
    loadingText,
    disabled,
    icon,
    iconPosition,
    fullWidth,
    onClick: onClick as React.MouseEventHandler<HTMLButtonElement>,
    type,
    children,
    ...otherProps as Omit<ButtonProps, keyof ButtonProps>,
  };

  return <Button {...buttonProps} />;
};

export default ButtonAdapter;
