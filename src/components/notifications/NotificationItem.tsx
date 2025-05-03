/**
 * NotificationItem Component
 * 
 * Displays a single notification with appropriate styling based on type
 * and read status.
 */

import React from 'react';
import Link from 'next/link';
import { Database } from '@/types/supabase';

// Define Notification type manually since it's not in the Database types yet
type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
  expires_at: string | null;
  metadata: any;
  priority: string | null;
};

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
    switch (type) {
      case 'trade_proposal':
        return (
          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'trade_status_accepted':
        return (
          <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'trade_status_declined':
      case 'trade_status_cancelled': 
        return (
          <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'trade_status_completed':
        return (
          <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'new_message':
        return (
          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'new_rating':
        return (
          <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  // Get background color based on priority and read status
  const getBackgroundColor = () => {
    if (notification.is_read) {
      return 'bg-white';
    }
    
    switch (notification.priority) {
      case 'urgent':
        return 'bg-red-50';
      case 'high':
        return 'bg-yellow-50';
      case 'low':
        return 'bg-gray-50';
      default:
        return 'bg-blue-50';
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
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              title="Delete notification"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
