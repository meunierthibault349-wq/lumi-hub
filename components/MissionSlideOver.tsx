'use client';
import { useState } from 'react';
import { supabase, ProjectRow } from '@/lib/supabase';

export default function MissionSlideOver({
  project, onClose, onSave,
}: {
  project: ProjectRow;
  onClose: () => void;
  onSave: (p: ProjectRow) => void;
}) {
  const [progress, setProgress] = useState(project.progress);
  const [status, setStatus] = useState(project.status);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from('projects').update({ progress, status }).eq('id', project.id);
    setSaving(false);
    if (!error) {
      onSave({ ...project, progress, status });
      onClose();
    }
  }

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100 }} onClick={onClose} />
      <div className="slide-over open">
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16, lineHeight: 1.3 }}>{project.title}</div>
            <div style={{ marginTop: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.06)', fontSize: 12, color: 'var(--gray)' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: project.client_color }} />
                {project.client}
              </span>
            </div>
          </div>
          <button className="btn danger" style={{ width: 28, height: 28, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }} onClick={onClose}>x</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 10 }}>Statut & Avancement</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--gray)' }}>Statut</div>
              <select className="form-select" style={{ width: 'auto' }} value={status} onChange={e => setStatus(e.target.value as ProjectRow['status'])}>
                <option value="livré">Livré</option>
                <option value="en_cours">En cours</option>
                <option value="en_attente_client">Attente client</option>
                <option value="demarrage">Démarrage</option>
              </select>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 8 }}>Progression</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="range" className="so-slider" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} style={{ flex: 1 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-light)', width: 40, textAlign: 'right' }}>{progress}%</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 10 }}>Informations</div>
            {[['Référence', project.ref], ['Devis', project.devis], ['Deadline', project.deadline]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--gray)' }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 8 }}>Résumé</div>
            <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6, background: 'var(--night-3)', borderRadius: 8, padding: 12 }}>{project.summary}</div>
          </div>

          {project.livrables.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 8 }}>Livrables</div>
              {project.livrables.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, background: 'rgba(13,148,136,.12)', flexShrink: 0 }}>{l.icon}</div>
                  <div style={{ fontSize: 13 }}>{l.name}</div>
                </div>
              ))}
            </div>
          )}

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8, color: 'var(--gray-dim)', marginBottom: 8 }}>Agents assignés</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.agents.map(a => (
                <span key={a} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.06)', fontSize: 12, color: 'var(--gray)' }}>🤖 {a}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: 10 }}>
          <button className="btn" style={{ flex: 1 }} onClick={onClose}>Fermer</button>
          <button className="btn primary" style={{ flex: 1, opacity: saving ? .6 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement…' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </>
  );
}
