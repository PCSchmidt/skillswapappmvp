/**
 * Toast Container Component
 * 
 * Container for rendering multiple toast notifications
 */

'use client';

import React from 'react';
import { ToastData } from '@/hooks/useToast';
import Toast from './Toast';

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
