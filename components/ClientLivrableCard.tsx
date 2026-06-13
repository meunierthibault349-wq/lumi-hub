'use client';
import { useState } from 'react';

export interface LivrableIARow {
  id: string;
  title: string;
  type: string;
  content: string;
  agent_mode: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  'post-instagram':  { label: 'Instagram',   color: '#e1306c', bg: 'rgba(225,48,108,.1)',   icon: '📸' },
  'post-linkedin':   { label: 'LinkedIn',    color: '#0077b5', bg: 'rgba(0,119,181,.1)',     icon: '💼' },
  'post-facebook':   { label: 'Facebook',    color: '#1877f2', bg: 'rgba(24,119,242,.1)',    icon: '👍' },
  'post-tiktok':     { label: 'TikTok',      color: '#69c9d0', bg: 'rgba(105,201,208,.1)',   icon: '🎵' },
  'stratégie':       { label: 'Stratégie',   color: '#34d399', bg: 'rgba(52,211,153,.1)',    icon: '📊' },
  'strategie':       { label: 'Stratégie',   color: '#34d399', bg: 'rgba(52,211,153,.1)',    icon: '📊' },
  'calendrier':      { label: 'Calendrier',  color: '#fb923c', bg: 'rgba(251,146,60,.1)',    icon: '📅' },
  'rapport':         { label: 'Rapport',     color: '#818cf8', bg: 'rgba(129,140,248,.1)',   icon: '📋' },
  'devis':           { label: 'Devis',       color: '#fbbf24', bg: 'rgba(251,191,36,.1)',    icon: '💰' },
  'document':        { label: 'Document',    color: '#94a3b8', bg: 'rgba(148,163,184,.1)',   icon: '📄' },
  'outil':           { label: 'Outil IA',    color: '#0d9488', bg: 'rgba(13,148,136,.1)',    icon: '⚡' },
};

function getTypeConf(type: string) {
  return TYPE_CONFIG[type?.toLowerCase()] ?? { label: type ?? 'Livrable', color: '#94a3b8', bg: 'rgba(148,163,184,.1)', icon: '📄' };
}

export default function ClientLivrableCard({ liv }: { liv: LivrableIARow }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const conf = getTypeConf(liv.type);
  const preview = liv.content.length > 260 ? liv.content.slice(0, 260) + '…' : liv.content;
  const isNew = Date.now() - new Date(liv.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;

  function copy() {
    navigator.clipboard.writeText(liv.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div style={{
      background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.07)',
      borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: conf.bg, color: conf.color }}>
          {conf.icon} {conf.label}
        </span>
        {isNew && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: 'rgba(13,148,136,.2)', color: 'var(--teal-light)', letterSpacing: '.04em' }}>
            NOUVEAU
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gray-dim)' }}>
          {new Date(liv.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Title */}
      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--white)', lineHeight: 1.3 }}>{liv.title}</div>

      {/* Image */}
      {liv.image_url && (
        <img
          src={liv.image_url}
          alt="Visuel"
          style={{ width: '100%', maxWidth: 360, borderRadius: 8, display: 'block' }}
        />
      )}

      {/* Content */}
      <div style={{ fontSize: 13, color: 'rgba(245,255,253,.75)', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {expanded ? liv.content : preview}
      </div>
      {liv.content.length > 260 && (
        <button
          onClick={() => setExpanded(p => !p)}
          style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--teal)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
        >
          {expanded ? '▲ Réduire' : '▼ Lire tout'}
        </button>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,.05)', flexWrap: 'wrap' }}>
        <button
          onClick={copy}
          style={{
            padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
            background: copied ? 'rgba(52,211,153,.15)' : 'rgba(255,255,255,.06)',
            border: `1px solid ${copied ? 'rgba(52,211,153,.3)' : 'rgba(255,255,255,.1)'}`,
            color: copied ? '#34d399' : 'var(--gray)', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all .15s',
          }}
        >
          {copied ? '✓ Copié' : 'Copier le contenu'}
        </button>
        <a
          href={`/api/pdf/livrable?livrableId=${liv.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
            background: 'rgba(13,148,136,.08)', border: '1px solid rgba(13,148,136,.2)',
            color: 'var(--teal)', textDecoration: 'none',
          }}
        >
          Télécharger PDF
        </a>
      </div>
    </div>
  );
}
