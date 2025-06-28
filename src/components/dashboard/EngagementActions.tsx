'use client';

import Link from 'next/link';
import React from 'react';

interface EngagementAction {
  id: string;
  title: string;
  description: string;
  action: string;
  href: string;
  icon: string;
  color: string;
  urgency?: 'low' | 'medium' | 'high';
  badge?: string;
}

interface EngagementActionsProps {
  actions: EngagementAction[];
  className?: string;
}

export default function EngagementActions({ actions, className = '' }: EngagementActionsProps) {
  const getUrgencyStyle = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'border-l-4 border-red-400 bg-red-50';
      case 'medium': return 'border-l-4 border-yellow-400 bg-yellow-50';
      case 'low': return 'border-l-4 border-green-400 bg-green-50';
      default: return 'border-l-4 border-blue-400 bg-blue-50';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Actions</h2>
      
      <div className="grid gap-4">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`${getUrgencyStyle(action.urgency)} rounded-lg p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start gap-4">
              <div className={`text-2xl p-2 rounded-lg ${action.color}`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  {action.badge && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {action.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{action.description}</p>
                <Link
                  href={action.href}
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  {action.action}
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
