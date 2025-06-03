'use client';

import React, { ChangeEvent, forwardRef, TextareaHTMLAttributes } from 'react';
import { classNames } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg'; // Using similar size scale as Input
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      ...props
    },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (props.onChange) {
        props.onChange(e);
      }
    };

    // Styling consistent with Input component
    const baseClasses = 'block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors';
    const sizeClasses = {
      sm: 'px-2 py-1.5 text-sm', // Adjusted padding/size for textarea
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-2.5 text-lg',
    };
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900' : '';
    const errorClasses = error ? 'border-error focus:border-error focus:ring-error' : 'border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500';
    const widthClasses = fullWidth ? 'w-full' : 'w-auto';

    return (
      <div className={classNames('flex flex-col', widthClasses, className || '')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={classNames(
            baseClasses,
            sizeClasses[size],
            errorClasses,
            disabledClasses,
          )}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          {...props}
        />
        {(helperText || error) && (
          <p className={classNames('mt-1 text-sm', error ? 'text-error' : 'text-gray-500 dark:text-gray-400')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
