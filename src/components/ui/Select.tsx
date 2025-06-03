'use client';

import React, { ChangeEvent, forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils'; // Use cn for consistency

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg'; // Using similar size scale as Input
  options?: { value: string; label: string }[]; // Add options prop
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      className,
      fullWidth = false,
      size = 'md', // Default size
      disabled,
      required,
      options, // Destructure options prop
      children, // Keep children for flexibility, though options will be preferred
      ...props
    },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      if (props.onChange) {
        props.onChange(e);
      }
    };

    // Styling consistent with Input component
    const baseClasses = 'block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors';
    const sizeClasses = {
      sm: 'px-2 py-1.5 text-sm', // Adjusted padding/size for select
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-2.5 text-lg',
    };
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900' : '';
    const errorClasses = error ? 'border-error focus:border-error focus:ring-error' : 'border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500';
    const widthClasses = fullWidth ? 'w-full' : 'w-auto';

    return (
      <div className={cn('flex flex-col', widthClasses, className)}> {/* Use cn */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn( // Use cn
            baseClasses,
            sizeClasses[size],
            errorClasses,
            disabledClasses,
            'pr-8' // Add padding to the right for the default select arrow
          )}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          {...props}
        >
          {options ? ( // Render options from options prop if provided
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children // Fallback to children if no options prop
          )}
        </select>
        {(helperText || error) && (
          <p className={cn('mt-1 text-sm', error ? 'text-error' : 'text-gray-500 dark:text-gray-400')}> {/* Use cn */}
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
