'use client';

import React, { HTMLAttributes } from 'react';
import { cn, getInitials } from '@/lib/utils'; // Import cn and getInitials

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string; // Used for alt text and fallback initials
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      size = 'md',
      shape = 'circle',
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
    };

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-md',
    };

    const baseClasses = 'inline-flex items-center justify-center bg-gray-200 text-gray-700 overflow-hidden';

    // Fallback to initials if no src is provided
    const initials = getInitials(alt); // Use the getInitials utility

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          shapeClasses[shape],
          className
        )}
        aria-label={alt}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
