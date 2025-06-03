import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to be rendered within the responsive layout.
   */
  children: React.ReactNode;
  /**
   * Optional: Specifies the maximum width of the content.
   * Can be a Tailwind CSS max-width class (e.g., 'max-w-screen-xl').
   */
  maxWidth?: string;
  /**
   * Optional: Specifies horizontal padding.
   * Can be a Tailwind CSS padding class (e.g., 'px-4', 'px-6', 'px-8').
   */
  paddingX?: string;
  /**
   * Optional: Specifies vertical padding.
   * Can be a Tailwind CSS padding class (e.g., 'py-4', 'py-6', 'py-8').
   */
  paddingY?: string;
}

const ResponsiveLayout = React.forwardRef<HTMLDivElement, ResponsiveLayoutProps>(
  ({ children, className, maxWidth = 'max-w-7xl', paddingX = 'px-4', paddingY = 'py-8', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto', // Center the content
          maxWidth,
          paddingX,
          paddingY,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveLayout.displayName = 'ResponsiveLayout';

export { ResponsiveLayout };
