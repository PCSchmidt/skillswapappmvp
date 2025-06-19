/**
 * NotificationItem Component
 * 
 * Displays a single notification with appropriate styling based on type
 * and read status.
 */

import Link from 'next/link';
import React from 'react';
import { FiCheckCircle, FiXCircle, FiMessageSquare, FiStar, FiBell, FiRefreshCcw, FiTrash2 } from 'react-icons/fi';
import type { Notification } from '@/types/supabase';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete
}: NotificationItemProps) {
  // Format the relative time (e.g., "2 hours ago")
  const formatTimeAgo = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} days ago`;
    if (diffSec < 2592000) return `${Math.floor(diffSec / 604800)} weeks ago`;
    
    // Format as a date for older notifications
    return date.toLocaleDateString();
  };

  // Get appropriate notification icon based on type
  const getNotificationIcon = (type: string) => {
    const iconClasses = "h-6 w-6";
    switch (type) {
      case 'trade_proposal':
        return <FiRefreshCcw className={iconClasses + " text-info"} />; // Using FiRefreshCcw for trade proposal
      case 'trade_status_accepted':
        return <FiCheckCircle className={iconClasses + " text-success"} />;
      case 'trade_status_declined':
      case 'trade_status_cancelled': 
        return <FiXCircle className={iconClasses + " text-error"} />;
      case 'trade_status_completed':
        return <FiCheckCircle className={iconClasses + " text-success"} />; // Using success for completed
      case 'new_message':
        return <FiMessageSquare className={iconClasses + " text-info"} />;
      case 'new_rating':
        return <FiStar className={iconClasses + " text-warning"} />;
      default:
        return <FiBell className={iconClasses + " text-gray-500"} />;
    }
  };

  // Get background color based on priority and read status
  const getBackgroundColor = () => {
    if (notification.is_read) {
      return 'bg-white';
    }
    
    switch (notification.priority) {
      case 'urgent':
        return 'bg-error-50';
      case 'high':
        return 'bg-warning-50';
      case 'low':
        return 'bg-gray-50';
      default:
        return 'bg-info-50';
    }
  };

  // Handle mark as read
  const handleMarkAsRead = (e: React.MouseEvent) => {
    // Prevent navigation if clicking the mark as read button
    e.preventDefault();
    e.stopPropagation();
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  // Handle delete
  const handleDelete = (e: React.MouseEvent) => {
    // Prevent navigation if clicking the delete button
    e.preventDefault();
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <Link 
      href={notification.link || '#'} 
      className={`block border-b last:border-0 ${getBackgroundColor()} hover:bg-gray-50 transition duration-150`}
      onClick={() => {
        if (!notification.is_read) {
          onMarkAsRead(notification.id);
        }
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="ml-3 flex-grow">
            <p className={`text-sm font-medium ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
              {notification.title}
            </p>
            <p className={`mt-1 text-sm ${notification.is_read ? 'text-gray-500' : 'text-gray-700'}`}>
              {notification.content}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {formatTimeAgo(notification.created_at)}
            </p>
          </div>
          <div className="flex-shrink-0 ml-2 flex">
            {!notification.is_read && (
              <button
                onClick={handleMarkAsRead}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                title="Mark as read"
              >
                <FiCheckCircle className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              title="Delete notification"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
