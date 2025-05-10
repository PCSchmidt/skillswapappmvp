import React, { HTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Container size variant
   * - none: No max width
   * - sm: Small max width (640px)
   * - md: Medium max width (768px)
   * - lg: Large max width (1024px)
   * - xl: Extra large max width (1280px)
   * - 2xl: 2X large max width (1536px)
   * - full: 100% width with padding
   * - custom: Custom max width defined by maxWidth prop
   */
  size?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'custom';

  /**
   * When size is 'custom', this prop defines the max width
   * Can be a string with a valid CSS value like '1140px' or '80%'
   */
  maxWidth?: string;

  /**
   * Control horizontal padding
   * - none: No padding
   * - sm: Small padding (0.5rem)
   * - md: Medium padding (1rem)
   * - lg: Large padding (1.5rem)
   * - xl: Extra large padding (2rem)
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Center the container horizontally
   */
  center?: boolean;

  /**
   * HTML element to render as the container
   */
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer' | 'aside' | 'nav';

  /**
   * Apply debug borders to help visualize container boundaries
   */
  debug?: boolean;
}

/**
 * Container component for controlling width and padding consistently across the app
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  maxWidth,
  padding = 'md',
  center = true,
  as = 'div',
  debug = false,
  ...props
}) => {
  const sizeClasses = {
    none: '',
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'w-full',
    custom: '',
  };

  const paddingClasses = {
    none: 'px-0',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6',
    lg: 'px-6 sm:px-8',
    xl: 'px-8 sm:px-10',
  };

  const centerClass = center ? 'mx-auto' : '';
  const debugClass = debug ? 'border-2 border-dashed border-red-400' : '';
  const customStyle = size === 'custom' && maxWidth ? { maxWidth } : {};
  
  const combinedClassName = classNames(
    sizeClasses[size],
    paddingClasses[padding],
    centerClass,
    debugClass,
    className || ''
  );

  // Render the appropriate HTML element based on the 'as' prop
  switch (as) {
    case 'section':
      return <section className={combinedClassName} style={customStyle} {...props}>{children}</section>;
    case 'article':
      return <article className={combinedClassName} style={customStyle} {...props}>{children}</article>;
    case 'main':
      return <main className={combinedClassName} style={customStyle} {...props}>{children}</main>;
    case 'header':
      return <header className={combinedClassName} style={customStyle} {...props}>{children}</header>;
    case 'footer':
      return <footer className={combinedClassName} style={customStyle} {...props}>{children}</footer>;
    case 'aside':
      return <aside className={combinedClassName} style={customStyle} {...props}>{children}</aside>;
    case 'nav':
      return <nav className={combinedClassName} style={customStyle} {...props}>{children}</nav>;
    case 'div':
    default:
      return <div className={combinedClassName} style={customStyle} {...props}>{children}</div>;
  }
};

export default Container;
