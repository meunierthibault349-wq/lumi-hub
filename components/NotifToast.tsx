'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

type ToastType = 'success' | 'info' | 'warning';
type Toast = { id: string; message: string; type: ToastType; exiting: boolean };

const DOT_COLOR: Record<ToastType, string> = {
  success: 'var(--teal-light)',
  info: 'var(--gray)',
  warning: 'var(--amber)',
};
const DOT_GLOW: Record<ToastType, string> = {
  success: '0 0 8px var(--teal)',
  info: 'none',
  warning: '0 0 8px var(--amber)',
};
const BORDER_COLOR: Record<ToastType, string> = {
  success: 'rgba(13,148,136,.4)',
  info: 'rgba(255,255,255,.12)',
  warning: 'rgba(239,159,39,.35)',
};

export default function NotifToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2, 10);
    setToasts(prev => [...prev.slice(-4), { id, message, type, exiting: false }]);
    setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  useEffect(() => {
    const channel = supabase
      .channel('hub-realtime-notifs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'livrables_ia' },
        (payload) => {
          const row = payload.new as { title?: string };
          addToast(`Livrable prêt : "${row.title ?? '—'}"`, 'success');
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'prospects' },
        (payload) => {
          const prev = payload.old as { stage?: string };
          const next = payload.new as { stage?: string; name?: string };
          if (prev.stage !== next.stage) {
            const stageLabel: Record<string, string> = { froid: 'Froid', contacte: 'Contacté', chaud: 'Chaud', signe: 'Signé' };
            addToast(`${next.name} → ${stageLabel[next.stage ?? ''] ?? next.stage}`, 'success');
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'invoices' },
        (payload) => {
          const row = payload.new as { client?: string; amount?: number };
          addToast(`Facture créée : ${row.client ?? ''} — ${row.amount ? row.amount + ' €' : ''}`, 'info');
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      right: 28,
      zIndex: 600,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          onClick={() => dismiss(toast.id)}
          style={{
            background: 'rgba(11,17,32,0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${BORDER_COLOR[toast.type]}`,
            borderRadius: 12,
            padding: '12px 16px',
            fontSize: 13,
            color: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            minWidth: 240,
            maxWidth: 340,
            boxShadow: '0 8px 32px rgba(0,0,0,.5)',
            animation: toast.exiting ? 'toastOut 0.25s ease forwards' : 'toastIn 0.2s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'auto',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <span style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: DOT_COLOR[toast.type],
            boxShadow: DOT_GLOW[toast.type],
          }} />
          <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
          <span style={{ fontSize: 16, opacity: 0.4, marginLeft: 4 }}>×</span>
        </div>
      ))}
    </div>
  );
}
