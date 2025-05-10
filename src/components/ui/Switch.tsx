/**
 * Switch Component
 * 
 * A toggle switch control for boolean settings.
 */

import React from 'react';
import { classNames } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  size = 'md',
  className = '',
  ariaLabel,
}) => {
  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      thumbTranslate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      thumbTranslate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      thumbTranslate: 'translate-x-7',
    },
  };

  return (
    <div className={classNames('flex items-center', className)}>
      {label && (
        <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label || 'Toggle'}
        disabled={disabled}
        onClick={onChange}
        className={classNames(
          'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          sizeClasses[size].track
        )}
      >
        <span
          className={classNames(
            'pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out',
            checked ? sizeClasses[size].thumbTranslate : 'translate-x-0',
            sizeClasses[size].thumb
          )}
        />
      </button>
    </div>
  );
};

export default Switch;
