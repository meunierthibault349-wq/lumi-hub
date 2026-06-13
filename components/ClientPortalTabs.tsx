'use client';
import { useState } from 'react';
import type { ProjectRow, ClientRow } from '@/lib/supabase';
import ClientLivrableCard, { type LivrableIARow } from '@/components/ClientLivrableCard';

const STATUS_LABELS: Record<string, string> = {
  livré: 'Livré', en_cours: 'En cours', en_attente_client: 'En attente', demarrage: 'Démarrage',
};
const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  livré:             { color: 'var(--mint)',  bg: 'rgba(93,202,165,.12)' },
  en_cours:          { color: 'var(--amber)', bg: 'rgba(239,159,39,.12)' },
  en_attente_client: { color: '#f87171',      bg: 'rgba(239,68,68,.12)' },
  demarrage:         { color: 'var(--gray)',  bg: 'rgba(148,163,184,.1)' },
};

function ProjectCard({ project: p, clientColor }: { project: ProjectRow; clientColor: string }) {
  const s = STATUS_COLORS[p.status] ?? STATUS_COLORS.demarrage;
  const label = STATUS_LABELS[p.status] ?? p.status;
  return (
    <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
          {p.summary && <div style={{ fontSize: 12, color: 'var(--gray)', lineHeight: 1.5 }}>{p.summary}</div>}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', background: s.bg, color: s.color }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: p.deadline ? 8 : 0 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--night-4)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, transition: 'width .4s', background: p.status === 'livré' ? 'var(--mint)' : clientColor, width: `${p.progress}%` }} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--gray)', whiteSpace: 'nowrap' }}>{p.progress}%</span>
      </div>
      {p.deadline && <div style={{ fontSize: 11, color: 'var(--gray-dim)' }}>Deadline : {p.deadline}</div>}
    </div>
  );
}

interface Props {
  clientData: ClientRow;
  projects: ProjectRow[];
  livrables: LivrableIARow[];
}

export default function ClientPortalTabs({ clientData, projects, livrables }: Props) {
  const [tab, setTab] = useState<'projets' | 'livrables'>('projets');

  const activeProjects = projects.filter(p => p.status !== 'livré');
  const deliveredProjects = projects.filter(p => p.status === 'livré');
  const newLivrables = livrables.filter(l => Date.now() - new Date(l.created_at).getTime() < 7 * 24 * 60 * 60 * 1000);

  return (
    <div style={{ flex: 1, padding: '28px 24px', maxWidth: 720, margin: '0 auto', width: '100%' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 22, fontWeight: 800, letterSpacing: -.3 }}>
          Bonjour 👋
        </div>
        <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 4 }}>
          {activeProjects.length > 0
            ? `${activeProjects.length} mission${activeProjects.length > 1 ? 's' : ''} en cours`
            : 'Toutes les missions sont livrées ✓'}
          {livrables.length > 0 && ` · ${livrables.length} livrable${livrables.length > 1 ? 's' : ''} disponible${livrables.length > 1 ? 's' : ''}`}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid rgba(255,255,255,.07)', marginBottom: 24 }}>
        {[
          { key: 'projets', label: 'Projets', count: projects.length },
          { key: 'livrables', label: 'Livrables', count: livrables.length, badge: newLivrables.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as 'projets' | 'livrables')}
            style={{
              padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: tab === t.key ? 700 : 400,
              color: tab === t.key ? 'var(--white)' : 'var(--gray)',
              borderBottom: tab === t.key ? '2px solid var(--teal)' : '2px solid transparent',
              marginBottom: -1, transition: 'color .15s',
              display: 'flex', alignItems: 'center', gap: 7,
            }}
          >
            {t.label}
            {t.count > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20,
                background: t.badge && t.badge > 0 ? 'rgba(13,148,136,.25)' : 'rgba(255,255,255,.08)',
                color: t.badge && t.badge > 0 ? 'var(--teal-light)' : 'var(--gray)',
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Projets tab */}
      {tab === 'projets' && (
        <div>
          {activeProjects.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 12 }}>
                En cours
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activeProjects.map(p => <ProjectCard key={p.id} project={p} clientColor={clientData.color} />)}
              </div>
            </div>
          )}
          {deliveredProjects.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 12 }}>
                Livrés
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {deliveredProjects.map(p => <ProjectCard key={p.id} project={p} clientColor={clientData.color} />)}
              </div>
            </div>
          )}
          {projects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--gray-dim)', fontSize: 13 }}>
              Aucune mission pour le moment.
            </div>
          )}
        </div>
      )}

      {/* Livrables tab */}
      {tab === 'livrables' && (
        <div>
          {livrables.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>📭</div>
              <div style={{ color: 'var(--gray)', fontSize: 13, lineHeight: 1.6 }}>
                Aucun livrable disponible pour le moment.<br />
                Votre gestionnaire vous en partagera prochainement.
              </div>
            </div>
          ) : (
            <>
              {newLivrables.length > 0 && (
                <div style={{ marginBottom: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(13,148,136,.08)', border: '1px solid rgba(13,148,136,.15)', fontSize: 12, color: 'var(--teal-light)' }}>
                  {newLivrables.length} nouveau{newLivrables.length > 1 ? 'x' : ''} livrable{newLivrables.length > 1 ? 's' : ''} cette semaine
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {livrables.map(l => <ClientLivrableCard key={l.id} liv={l} />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
