/**
 * Toast Notification Component
 * 
 * Simple toast notification system for user feedback
 */

'use client';

import React, { useEffect, useState } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const baseClasses = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 max-w-md";
  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white", 
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
      <div className="flex items-center justify-between">
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="ml-3 text-white hover:text-gray-200 text-xl font-bold"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
