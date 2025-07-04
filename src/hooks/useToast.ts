/**
 * Toast notification hook
 * 
 * Provides a simple interface for showing toast notifications
 * throughout the application.
 */

import { useState, useCallback } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface UseToastReturn {
  toast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  messages: ToastMessage[];
  dismiss: (id: string) => void;
  clear: () => void;
}

let toastId = 0;

export const useToast = (): UseToastReturn => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback((
    message: string, 
    type: ToastMessage['type'] = 'info', 
    duration: number = 5000
  ) => {
    const id = `toast-${++toastId}`;
    const newMessage: ToastMessage = {
      id,
      message,
      type,
      duration
    };

    setMessages(prev => [...prev, newMessage]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      }, duration);
    }
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    toast(message, 'success', duration);
  }, [toast]);

  const error = useCallback((message: string, duration?: number) => {
    toast(message, 'error', duration);
  }, [toast]);

  const warning = useCallback((message: string, duration?: number) => {
    toast(message, 'warning', duration);
  }, [toast]);

  const info = useCallback((message: string, duration?: number) => {
    toast(message, 'info', duration);
  }, [toast]);

  const dismiss = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    toast,
    success,
    error,
    warning,
    info,
    messages,
    dismiss,
    clear
  };
};
