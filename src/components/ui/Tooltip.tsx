'use client';

import React, { useState, useRef, ReactNode } from 'react';
import { classNames } from '@/lib/utils';

export interface TooltipProps {
  /**
   * The content to display inside the tooltip.
   */
  content: ReactNode;
  /**
   * The element that triggers the tooltip.
   */
  children: ReactNode;
  /**
   * The position of the tooltip relative to the trigger element.
   * @default 'top'
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Optional CSS class names for the tooltip content.
   */
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);
  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const tooltipClasses = classNames(
    'absolute z-50 px-3 py-1.5 text-sm font-medium text-white bg-neutral-800 rounded-md shadow-sm',
    positionClasses[position],
    className
  );

  return (
    <div className="relative inline-block" ref={triggerRef}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </div>
      {isVisible && (
        <div className={tooltipClasses} role="tooltip">
          {content}
          {/* Optional: Add a simple arrow */}
          {/* <div className={`absolute w-2 h-2 bg-neutral-800 transform rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 mt-1' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
            'right-full top-1/2 -translate-y-1/2 ml-1'
          }`}></div> */}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
