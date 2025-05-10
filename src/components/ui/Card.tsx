import React, { HTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  bordered?: boolean;
  fullWidth?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  radius = 'md',
  bordered = false,
  fullWidth = false,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-neutral-800',
    outlined: 'bg-transparent border border-neutral-200 dark:border-neutral-700',
    elevated: 'bg-white dark:bg-neutral-800 shadow-md',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const borderedClass = bordered ? 'border border-neutral-200 dark:border-neutral-700' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div
      className={classNames(
        variantClasses[variant],
        paddingClasses[padding],
        radiusClasses[radius],
        borderedClass,
        widthClass,
        'transition-shadow duration-200',
        className || ''
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  separator?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  separator = false,
  className,
  children,
  ...props
}) => {
  return (
    <div 
      className={classNames(
        'px-5 py-4', 
        separator ? 'border-b border-neutral-200 dark:border-neutral-700' : '',
        className || ''
      )}
      {...props}
    >
      {children || (
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col">
            {title && (
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="ml-4">{action}</div>}
        </div>
      )}
    </div>
  );
};

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CardBody: React.FC<CardBodyProps> = ({ className, children, ...props }) => {
  return (
    <div className={classNames('px-5 py-4', className || '')} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  className,
  children,
  separator = false,
  align = 'between',
  ...props
}) => {
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <div
      className={classNames(
        'px-5 py-4 flex items-center',
        alignClasses[align],
        separator ? 'border-t border-neutral-200 dark:border-neutral-700' : '',
        className || ''
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
