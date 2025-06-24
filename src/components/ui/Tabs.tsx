'use client';

/**
 * Tabs Component
 * 
 * A tabbed interface component for organizing and switching between different content views.
 */

import React, { ReactNode } from 'react';
import { classNames } from '@/lib/utils';

export interface TabProps {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}

export const Tab: React.FC<TabProps> = ({ children, className }) => (
  <div className={classNames('tab-content', className)}>
    {children}
  </div>
);

export interface TabsProps {
  children: ReactNode;
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  contentClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  children,
  activeTab,
  onChange,
  className = '',
  tabListClassName = '',
  tabClassName = '',
  activeTabClassName = '',
  contentClassName = '',
}) => {  // Filter out only Tab components from children
  const tabs = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && (child.type as React.ComponentType<unknown>)?.displayName === 'Tab'
  ) as React.ReactElement<TabProps>[];

  // Find the active tab content
  const activeTabContent = tabs.find((tab) => tab.props.id === activeTab)?.props.children;

  return (
    <div className={classNames('w-full', className)}>
      <div className={classNames(
        'border-b border-gray-200 dark:border-gray-700',
        tabListClassName
      )}>
        <nav className="flex -mb-px space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.props.id}
              onClick={() => onChange(tab.props.id)}
              className={classNames(
                'py-4 px-1 border-b-2 font-medium text-sm',
                tab.props.id === activeTab
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400 ' + activeTabClassName
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 ' + tabClassName,
                'focus:outline-none transition-colors duration-200'
              )}
              aria-current={tab.props.id === activeTab ? 'page' : undefined}
            >
              {tab.props.label}
            </button>
          ))}
        </nav>
      </div>
      <div className={classNames('py-4', contentClassName)}>
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;
