import React from 'react';
import Card from '@/components/ui/Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  change?: number; // Percentage change from previous period
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  onClick?: () => void;
  to?: string; // Navigation link
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  trend,
  loading = false,
  onClick,
  to,
  className,
}) => {
  const getTrendColor = () => {
    if (!trend) return '';
    
    switch(trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      case 'neutral': return 'text-gray-500';
      default: return '';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch(trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'neutral': return '→';
      default: return null;
    }
  };

  const cardContent = (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-500">{label}</h3>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      {loading ? (
        <div className="animate-pulse mt-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      ) : (
        <div className="flex items-end mt-1">
          <p className="text-2xl font-bold">{value}</p>
          
          {(change !== undefined || trend) && (
            <div className={`text-sm ml-2 mb-1 flex items-center ${getTrendColor()}`}>
              {change !== undefined && `${change > 0 ? '+' : ''}${change}%`}
              {getTrendIcon()}
            </div>
          )}
        </div>
      )}
    </>
  );

  // If there's a click handler or link, make the card interactive
  const interactiveClass = (onClick || to) 
    ? 'cursor-pointer transition hover:shadow-md hover:bg-gray-50' 
    : '';

  // Wrap content in link if "to" prop is provided
  if (to) {
    return (
      <Card className={`p-4 ${interactiveClass} ${className || ''}`}>
        <a href={to} className="block">
          {cardContent}
        </a>
      </Card>
    );
  }

  // Otherwise, render as a regular card with optional click handler
  return (
    <Card 
      className={`p-4 ${interactiveClass} ${className || ''}`} 
      onClick={onClick}
    >
      {cardContent}
    </Card>
  );
};

export default StatCard;
