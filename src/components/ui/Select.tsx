'use client';

import React, { ChangeEvent, forwardRef, SelectHTMLAttributes } from 'react';
import { classNames } from '@/lib/utils';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg'; // Using similar size scale as Input
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
      children, // Select component needs children for options
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
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900' : '';
    const errorClasses = error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : 'border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500';
    const widthClasses = fullWidth ? 'w-full' : 'w-auto';

    return (
      <div className={classNames('flex flex-col', widthClasses, className || '')}>
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={classNames(
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
          {children}
        </select>
        {(helperText || error) && (
          <p className={classNames('mt-1 text-sm', error ? 'text-error-500' : 'text-neutral-500 dark:text-neutral-400')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
