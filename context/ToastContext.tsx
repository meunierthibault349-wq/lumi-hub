'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  exiting: boolean;
};

type ToastContextValue = {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
  dismiss: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 280);
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2, 10);
    setToasts(prev => [...prev.slice(-4), { id, message, type, exiting: false }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext).addToast;
}

export function useToastContext() {
  return useContext(ToastContext);
}
