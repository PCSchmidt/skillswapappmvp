import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils'; // Use cn for consistency

type OrderValue = number | 'first' | 'last' | 'none';
type ResponsiveOrder = Partial<Record<'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', OrderValue>>;

export interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Column span (number of columns this column should span)
   * Accepts responsive configuration:
   * - number for fixed spans
   * - responsive object like { default: 12, sm: 6, md: 4, lg: 3 }
   */
  span?: number | Partial<Record<'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>;

  /**
   * Column start position (1-based index)
   * Can be responsive with breakpoint keys
   */
  start?: number | Partial<Record<'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>;

  /**
   * Column ordering
   * Can be responsive with breakpoint keys
   */
  order?: OrderValue | ResponsiveOrder;

  /**
   * Auto sizing
   * - true: column will automatically size based on content
   * - false: column will be sized based on span
   */
  auto?: boolean | Partial<Record<'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', boolean>>;

  /**
   * Apply debug borders to help visualize column boundaries
   */
  debug?: boolean;

  /**
   * HTML element to render as the column
   */
  as?: 'div' | 'li' | 'article' | 'section';
}

/**
 * Column component for use within Grid component
 * Provides responsive column spans, ordering, and positioning
 */
export const Column: React.FC<ColumnProps> = ({
  children,
  className,
  span,
  start,
  order,
  auto = false,
  debug = false,
  as = 'div',
  ...props
}) => {
  const debugClass = debug ? 'border-2 border-dashed border-green-400' : '';
  
  // Build responsive classes
  let columnClasses = '';
  
  // Handle span
  if (span) {
    if (typeof span === 'number') {
      columnClasses += ` col-span-${span}`;
    } else {
      if (span.default) columnClasses += ` col-span-${span.default}`;
      if (span.sm) columnClasses += ` sm:col-span-${span.sm}`;
      if (span.md) columnClasses += ` md:col-span-${span.md}`;
      if (span.lg) columnClasses += ` lg:col-span-${span.lg}`;
      if (span.xl) columnClasses += ` xl:col-span-${span.xl}`;
      if (span['2xl']) columnClasses += ` 2xl:col-span-${span['2xl']}`;
    }
  }

  // Handle start position
  if (start) {
    if (typeof start === 'number') {
      columnClasses += ` col-start-${start}`;
    } else {
      if (start.default) columnClasses += ` col-start-${start.default}`;
      if (start.sm) columnClasses += ` sm:col-start-${start.sm}`;
      if (start.md) columnClasses += ` md:col-start-${start.md}`;
      if (start.lg) columnClasses += ` lg:col-start-${start.lg}`;
      if (start.xl) columnClasses += ` xl:col-start-${start.xl}`;
      if (start['2xl']) columnClasses += ` 2xl:col-start-${start['2xl']}`;
    }
  }

  // Handle order
  if (order) {
    if (typeof order === 'number' || typeof order === 'string') {
      columnClasses += ` order-${order}`;
    } else {
      // Now we know order is a ResponsiveOrder object
      if (order.default) columnClasses += ` order-${order.default}`;
      if (order.sm) columnClasses += ` sm:order-${order.sm}`;
      if (order.md) columnClasses += ` md:order-${order.md}`;
      if (order.lg) columnClasses += ` lg:order-${order.lg}`;
      if (order.xl) columnClasses += ` xl:order-${order.xl}`;
      if (order['2xl']) columnClasses += ` 2xl:order-${order['2xl']}`;
    }
  }

  // Handle auto sizing
  if (auto) {
    if (typeof auto === 'boolean') {
      if (auto) columnClasses += ' col-auto';
    } else {
      if (auto.default) columnClasses += ' col-auto';
      if (auto.sm) columnClasses += ' sm:col-auto';
      if (auto.md) columnClasses += ' md:col-auto';
      if (auto.lg) columnClasses += ' lg:col-auto';
      if (auto.xl) columnClasses += ' xl:col-auto';
      if (auto['2xl']) columnClasses += ' 2xl:col-auto';
    }
  }

  // Combine all classes
  const combinedClassName = cn(
    columnClasses,
    debugClass,
    className
  );

  // Render the appropriate element
  switch (as) {
    case 'li':
      return <li className={combinedClassName}>{children}</li>;
    case 'article':
      return <article className={combinedClassName} {...props}>{children}</article>;
    case 'section':
      return <section className={combinedClassName} {...props}>{children}</section>;
    case 'div':
    default:
      return <div className={combinedClassName} {...props}>{children}</div>;
  }
};

export default Column;
