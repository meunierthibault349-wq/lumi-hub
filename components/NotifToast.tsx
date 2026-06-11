'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast, useToastContext, ToastType } from '@/context/ToastContext';

const DOT_COLOR: Record<ToastType, string> = {
  success: 'var(--teal-light)',
  info: 'var(--gray)',
  warning: 'var(--amber)',
  error: '#f87171',
};
const DOT_GLOW: Record<ToastType, string> = {
  success: '0 0 8px var(--teal)',
  info: 'none',
  warning: '0 0 8px var(--amber)',
  error: '0 0 8px #ef4444',
};
const BORDER_COLOR: Record<ToastType, string> = {
  success: 'rgba(13,148,136,.4)',
  info: 'rgba(255,255,255,.12)',
  warning: 'rgba(239,159,39,.35)',
  error: 'rgba(239,68,68,.35)',
};

export default function NotifToast() {
  const addToast = useToast();
  const { toasts, dismiss } = useToastContext();

  // Realtime Supabase notifications
  useEffect(() => {
    const channel = supabase
      .channel('hub-realtime-notifs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'livrables_ia' }, (payload) => {
        const row = payload.new as { title?: string };
        addToast(`Livrable prêt : "${row.title ?? '—'}"`, 'success');
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'prospects' }, (payload) => {
        const prev = payload.old as { stage?: string };
        const next = payload.new as { stage?: string; name?: string };
        if (prev.stage !== next.stage) {
          const labels: Record<string, string> = { froid: 'Froid', contacte: 'Contacté', chaud: 'Chaud', signe: 'Signé' };
          addToast(`${next.name} → ${labels[next.stage ?? ''] ?? next.stage}`, 'success');
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'invoices' }, (payload) => {
        const row = payload.new as { client?: string; amount?: number };
        addToast(`Facture créée : ${row.client ?? ''} — ${row.amount ? row.amount + ' €' : ''}`, 'info');
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 600, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
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
          <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: DOT_COLOR[toast.type], boxShadow: DOT_GLOW[toast.type] }} />
          <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
          <span style={{ fontSize: 16, opacity: 0.4, marginLeft: 4 }}>×</span>
        </div>
      ))}
    </div>
  );
}
