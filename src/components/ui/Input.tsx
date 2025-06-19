'use client';

/**
 * Input Component
 * 
 * A versatile input component with multiple variants, sizes, and states.
 * Supports icons, helper text, error states, and various visual styles.
 * 
 * @example
 * // Basic usage
 * <Input label="Username" placeholder="Enter your username" />
 * 
 * // With error state
 * <Input label="Email" placeholder="Enter your email" error="Invalid email format" />
 * 
 * // With helper text
 * <Input label="Password" type="password" helperText="Must be at least 8 characters" />
 * 
 * // With icons
 * <Input 
 *   label="Search" 
 *   placeholder="Search..." 
 *   startIcon={<SearchIcon />} 
 *   endIcon={<ClearIcon />} 
 * />
 * 
 * // Different variants
 * <Input variant="filled" label="Filled input" />
 * <Input variant="outlined" label="Outlined input" />
 */

import { ChangeEvent, forwardRef, InputHTMLAttributes } from 'react';
import { classNames } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      className,
      fullWidth = false,
      startIcon,
      endIcon,
      variant = 'default',
      size = 'md',
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const variantClasses = {
      default:
        'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500',
      filled:
        'bg-gray-100 dark:bg-gray-900 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-primary-500',
      outlined:
        'bg-transparent border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:border-primary-500 focus:ring-primary-500',
    };

    const sizeClasses = {
      sm: 'h-8 text-sm px-2',
      md: 'h-10 text-base px-3',
      lg: 'h-12 text-lg px-4',
    };

    const baseClasses = 'w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors';
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900' : '';
    const errorClasses = error ? 'border-error focus:border-error focus:ring-error' : '';
    const widthClasses = fullWidth ? 'w-full' : 'w-auto';

    return (
      <div className={classNames('flex flex-col', widthClasses, className || '')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{startIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            className={classNames(
              baseClasses,
              variantClasses[variant],
              sizeClasses[size],
              errorClasses,
              disabledClasses,
              startIcon ? 'pl-10' : '',
              endIcon ? 'pr-10' : ''
            )}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{endIcon}</span>
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p className={classNames('mt-1 text-sm', error ? 'text-error' : 'text-gray-500 dark:text-gray-400')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
