'use client';

import { ChangeEvent, forwardRef, InputHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

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
        'bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500',
      filled:
        'bg-neutral-100 dark:bg-neutral-900 border border-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-800 focus:border-primary-500 focus:ring-primary-500',
      outlined:
        'bg-transparent border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-primary-500 focus:ring-primary-500',
    };

    const sizeClasses = {
      sm: 'h-8 text-sm px-2',
      md: 'h-10 text-base px-3',
      lg: 'h-12 text-lg px-4',
    };

    const baseClasses = 'w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors';
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900' : '';
    const errorClasses = error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : '';
    const widthClasses = fullWidth ? 'w-full' : 'w-auto';

    return (
      <div className={classNames('flex flex-col', widthClasses, className || '')}>
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-neutral-500">{startIcon}</span>
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
              <span className="text-neutral-500">{endIcon}</span>
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p className={classNames('mt-1 text-sm', error ? 'text-error-500' : 'text-neutral-500 dark:text-neutral-400')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
