import React from 'react';
import Card from '@/components/ui/Card';

export interface ActivityItem {
  id: string;
  type: 'message' | 'request' | 'status' | 'review' | 'match';
  title: string;
  time: string; // Human-readable time (e.g., "10 minutes ago")
  timestamp: string; // ISO timestamp for sorting
  content: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface ActivityItemProps {
  item: ActivityItem;
  onMarkRead?: (id: string) => void;
}

export const ActivityItemComponent: React.FC<ActivityItemProps> = ({ item, onMarkRead }) => {
  const handleMarkRead = () => {
    if (!item.read && onMarkRead) {
      onMarkRead(item.id);
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'message': return '💬';
      case 'request': return '🔄';
      case 'status': return '📋';
      case 'review': return '⭐';
      case 'match': return '🎯';
      default: return '📌';
    }
  };

  return (
    <div 
      className={`border-b border-gray-100 pb-3 ${!item.read ? 'bg-primary-50/50 -mx-3 px-3 py-2 rounded-md' : ''}`}
      onClick={handleMarkRead}
    >
      <div className="flex items-start gap-3">
        <div className="text-xl">{getTypeIcon(item.type)}</div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className={`font-medium ${!item.read ? 'text-primary-700' : ''}`}>{item.title}</h4>
            <span className="text-sm text-gray-500">{item.time}</span>
          </div>
          <p className="text-gray-600 mt-1">{item.content}</p>
          {item.actionUrl && item.actionLabel && (
            <a 
              href={item.actionUrl}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 mt-2 inline-block"
            >
              {item.actionLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export interface ActivityFeedProps {
  activities: ActivityItem[];
  loading?: boolean;
  emptyMessage?: string;
  showViewAll?: boolean;
  viewAllUrl?: string;
  limit?: number;
  onMarkRead?: (id: string) => void;
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  emptyMessage = "No recent activity to display",
  showViewAll = true,
  viewAllUrl = "/activities",
  limit,
  onMarkRead,
  className,
}) => {
  // Apply limit if specified
  const displayedActivities = limit ? activities.slice(0, limit) : activities;

  return (
    <Card className={`p-6 ${className || ''}`}>
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-100 pb-3">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : displayedActivities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <div className="space-y-4">
          {displayedActivities.map((item) => (
            <ActivityItemComponent 
              key={item.id} 
              item={item} 
              onMarkRead={onMarkRead}
            />
          ))}
        </div>
      )}

      {showViewAll && activities.length > 0 && (
        <a 
          href={viewAllUrl}
          className="text-primary-600 font-medium mt-4 hover:text-primary-700 transition-colors inline-block"
        >
          View all activity
        </a>
      )}
    </Card>
  );
};

export default ActivityFeed;
