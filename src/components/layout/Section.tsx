import React, { HTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  /**
   * Container type to use for the section
   */
  container?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Whether to add vertical padding to the section
   */
  spacingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Background style variant
   */
  variant?: 'default' | 'primary' | 'secondary' | 'neutral' | 'dark';
  
  /**
   * Whether to add a divider at the top
   */
  dividerTop?: boolean;
  
  /**
   * Whether to add a divider at the bottom
   */
  dividerBottom?: boolean;
  
  /**
   * HTML element to use for the section
   */
  as?: 'section' | 'div' | 'header' | 'footer' | 'main' | 'article' | 'aside';
}

const Section: React.FC<SectionProps> = ({
  children,
  className,
  container = 'lg',
  spacingY = 'lg',
  variant = 'default',
  dividerTop = false,
  dividerBottom = false,
  as: Component = 'section',
  ...props
}) => {
  const containerClasses = {
    none: '',
    sm: 'max-w-screen-sm mx-auto px-4',
    md: 'max-w-screen-md mx-auto px-4',
    lg: 'max-w-screen-lg mx-auto px-4 sm:px-6',
    xl: 'max-w-screen-xl mx-auto px-4 sm:px-6',
    full: 'w-full px-4 sm:px-6',
  };

  const spacingClasses = {
    none: 'py-0',
    sm: 'py-4 sm:py-6',
    md: 'py-6 sm:py-10',
    lg: 'py-10 sm:py-16',
    xl: 'py-16 sm:py-24',
  };

  const variantClasses = {
    default: 'bg-white dark:bg-neutral-900',
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    secondary: 'bg-secondary-50 dark:bg-secondary-900/20',
    neutral: 'bg-neutral-50 dark:bg-neutral-800',
    dark: 'bg-neutral-900 dark:bg-black text-white',
  };

  const dividerTopClass = dividerTop ? 'border-t border-neutral-200 dark:border-neutral-800' : '';
  const dividerBottomClass = dividerBottom ? 'border-b border-neutral-200 dark:border-neutral-800' : '';

  return (
    <Component
      className={classNames(
        variantClasses[variant],
        spacingClasses[spacingY],
        dividerTopClass,
        dividerBottomClass,
        className || ''
      )}
      {...props}
    >
      <div className={containerClasses[container]}>{children}</div>
    </Component>
  );
};

export default Section;
