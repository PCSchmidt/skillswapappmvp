/**
 * Success Toast Component
 * 
 * Shows success notifications with animations to provide
 * positive feedback for user actions in the demo.
 */

'use client';

import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useEffect, useState } from 'react';

interface SuccessToastProps {
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function SuccessToast({
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 4000
}: SuccessToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, handleClose]);

  if (!isVisible && !isExiting) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`max-w-md w-full bg-white border border-green-200 rounded-lg shadow-lg transition-all duration-300 ${
          isVisible && !isExiting
            ? 'transform translate-x-0 opacity-100'
            : 'transform translate-x-full opacity-0'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={handleClose}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar for auto-close */}
        {autoClose && isVisible && !isExiting && (
          <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all ease-linear"
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
