import React, { HTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns in the grid
   * - responsive format: { default: 1, sm: 2, md: 3, lg: 4, xl: 5 }
   * - single number for consistent columns across all breakpoints
   * - default is a responsive grid with 1 column on mobile, 2 on sm, 3 on md, 4 on lg
   */
  columns?: number | Partial<Record<'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>;

  /**
   * Size of the gap between grid items
   */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Vertical gap (row gap) - if different from main gap
   */
  rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Horizontal gap (column gap) - if different from main gap
   */
  colGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Auto-fit or auto-fill behavior (only applies when columns is a number)
   * - auto-fit: expand items to fill available space
   * - auto-fill: keep item size and fill with empty tracks
   */
  autoFlow?: 'auto-fit' | 'auto-fill';

  /**
   * Minimum column width when using autoFlow (instead of fixed columns)
   * Useful for responsive grids with variable number of columns
   */
  minColWidth?: string;

  /**
   * Apply debug borders to help visualize grid boundaries
   */
  debug?: boolean;

  /**
   * HTML element to render as the grid
   */
  as?: 'div' | 'section' | 'ul' | 'ol';
}

/**
 * Grid component for creating responsive grid layouts
 * Uses CSS Grid for flexible layouts
 */
export const Grid: React.FC<GridProps> = ({
  children,
  className,
  columns = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  rowGap,
  colGap,
  autoFlow,
  minColWidth,
  debug = false,
  as = 'div',
  ...props
}) => {
  // Gap sizing classes
  const gapSizes = {
    none: '0',
    xs: '0.5rem',  // 8px
    sm: '1rem',    // 16px
    md: '1.5rem',  // 24px
    lg: '2rem',    // 32px
    xl: '3rem',    // 48px
  };

  // Build grid template columns style
  let gridTemplateColumns: string;

  if (typeof columns === 'number') {
    // Fixed number of columns
    if (autoFlow && minColWidth) {
      gridTemplateColumns = `repeat(${autoFlow}, minmax(${minColWidth}, 1fr))`;
    } else {
      gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    }
  } else {
    // Responsive columns
    const colDefaults = { default: 1, sm: 2, md: 3, lg: 4 };
    const colConfig = { ...colDefaults, ...columns };
    
    // Setup grid with responsive columns using Tailwind classes
    return renderGrid(
      classNames(
        'grid',
        `grid-cols-${colConfig.default}`,
        colConfig.sm ? `sm:grid-cols-${colConfig.sm}` : '',
        colConfig.md ? `md:grid-cols-${colConfig.md}` : '',
        colConfig.lg ? `lg:grid-cols-${colConfig.lg}` : '',
        colConfig.xl ? `xl:grid-cols-${colConfig.xl}` : '',
        colConfig['2xl'] ? `2xl:grid-cols-${colConfig['2xl']}` : '',
        getGapClasses(gap, rowGap, colGap),
        debug ? 'border-2 border-dashed border-blue-400' : '',
        className || ''
      ),
      as,
      children,
      props
    );
  }

  // When using fixed columns or auto-flow, we need inline styles
  const gridStyles = {
    display: 'grid',
    gridTemplateColumns,
    gap: rowGap && colGap ? undefined : gapSizes[gap],
    rowGap: rowGap ? gapSizes[rowGap] : undefined,
    columnGap: colGap ? gapSizes[colGap] : undefined,
  };

  const debugClass = debug ? 'border-2 border-dashed border-blue-400' : '';

  return renderGrid(
    classNames(debugClass, className || ''),
    as,
    children,
    props,
    gridStyles
  );
};

// Helper function to generate gap classes
function getGapClasses(
  gap: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  colGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
): string {
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-2',   // 8px (0.5rem)
    sm: 'gap-4',   // 16px (1rem)
    md: 'gap-6',   // 24px (1.5rem)
    lg: 'gap-8',   // 32px (2rem)
    xl: 'gap-12',  // 48px (3rem)
  };

  const rowGapClasses = {
    none: 'gap-y-0',
    xs: 'gap-y-2',  // 8px
    sm: 'gap-y-4',  // 16px
    md: 'gap-y-6',  // 24px
    lg: 'gap-y-8',  // 32px
    xl: 'gap-y-12', // 48px
  };

  const colGapClasses = {
    none: 'gap-x-0',
    xs: 'gap-x-2',  // 8px
    sm: 'gap-x-4',  // 16px
    md: 'gap-x-6',  // 24px
    lg: 'gap-x-8',  // 32px
    xl: 'gap-x-12', // 48px
  };

  if (rowGap && colGap) {
    return `${rowGapClasses[rowGap]} ${colGapClasses[colGap]}`;
  }

  return gapClasses[gap];
}

// Helper function to render the grid with the appropriate HTML element
function renderGrid(
  className: string, 
  as: 'div' | 'section' | 'ul' | 'ol',
  children: React.ReactNode,
  props: any,
  style?: React.CSSProperties
) {
  switch (as) {
    case 'section':
      return <section className={className} style={style} {...props}>{children}</section>;
    case 'ul':
      return <ul className={className} style={style} {...props}>{children}</ul>;
    case 'ol':
      return <ol className={className} style={style} {...props}>{children}</ol>;
    case 'div':
    default:
      return <div className={className} style={style} {...props}>{children}</div>;
  }
}

export default Grid;
