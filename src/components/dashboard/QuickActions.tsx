import React from 'react';
import Card from '@/components/ui/Card';

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
  color?: string; // Optional color class
  onClick?: () => void; // Optional onClick handler
}

interface QuickActionButtonProps {
  action: QuickAction;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({ action }) => {
  const Component = action.onClick ? 'button' : 'a';
  const props = action.onClick 
    ? { onClick: action.onClick } 
    : { href: action.href };
  
  return (
    <Component 
      {...props}
      className={`flex flex-col items-center justify-center p-3 ${
        action.color || 'bg-gray-50 hover:bg-gray-100'
      } rounded-lg transition-colors`}
    >
      <span className="text-2xl mb-1">{action.icon}</span>
      <span className="text-sm">{action.label}</span>
    </Component>
  );
};

export interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title = "Quick Actions",
  columns = 2,
  className,
}) => {
  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  };

  return (
    <Card className={`p-6 ${className || ''}`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className={`grid ${gridColsClass[columns]} gap-3`}>
        {actions.map(action => (
          <QuickActionButton 
            key={action.id} 
            action={action} 
          />
        ))}
      </div>
    </Card>
  );
};

// Predefined common actions
export const commonActions = {
  newSkill: {
    id: 'new-skill',
    label: 'New Skill',
    icon: '✨',
    href: '/skills/new',
  },
  messages: {
    id: 'messages',
    label: 'Messages',
    icon: '💬',
    href: '/messages',
  },
  findSkills: {
    id: 'find-skills',
    label: 'Find Skills',
    icon: '🔍',
    href: '/skills/browse',
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    href: '/profile',
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    href: '/settings',
  },
  notifications: {
    id: 'notifications',
    label: 'Notifications',
    icon: '🔔',
    href: '/notifications',
  },
  trades: {
    id: 'trades',
    label: 'Trades',
    icon: '🔄',
    href: '/trades',
  },
  help: {
    id: 'help',
    label: 'Help',
    icon: '❓',
    href: '/help',
  },
};

export default QuickActions;
