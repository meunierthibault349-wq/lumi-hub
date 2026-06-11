import { createSupabaseServer } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ClientHeader from '@/components/ClientHeader';
import type { ProjectRow, ClientRow } from '@/lib/supabase';

const STATUS_LABELS: Record<string, string> = {
  livré: 'Livré', en_cours: 'En cours', en_attente_client: 'En attente', demarrage: 'Démarrage',
};
const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  livré: { color: 'var(--mint)', bg: 'rgba(93,202,165,.12)' },
  en_cours: { color: 'var(--amber)', bg: 'rgba(239,159,39,.12)' },
  en_attente_client: { color: '#f87171', bg: 'rgba(239,68,68,.12)' },
  demarrage: { color: 'var(--gray)', bg: 'rgba(148,163,184,.1)' },
};

export default async function ClientDashboard() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/client/login');

  const { data: clientData } = await supabase
    .from('clients')
    .select('*')
    .eq('email', user.email)
    .maybeSingle() as { data: ClientRow | null };

  if (!clientData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
        <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Accès non autorisé</div>
        <div style={{ fontSize: 13, color: 'var(--gray)', textAlign: 'center', maxWidth: 320, lineHeight: 1.6 }}>
          L&apos;adresse <strong style={{ color: 'var(--white)' }}>{user.email}</strong> n&apos;est pas associée à un compte client Lumi. Contactez votre gestionnaire.
        </div>
      </div>
    );
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientData.id)
    .order('created_at') as { data: ProjectRow[] | null };

  const activeProjects = (projects ?? []).filter(p => p.status !== 'livré');
  const deliveredProjects = (projects ?? []).filter(p => p.status === 'livré');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientHeader clientName={clientData.name} />

      <div style={{ flex: 1, padding: '28px 24px', maxWidth: 720, margin: '0 auto', width: '100%' }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 22, fontWeight: 800, letterSpacing: -.3 }}>
            Bonjour 👋
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 4 }}>
            {activeProjects.length > 0
              ? `${activeProjects.length} mission${activeProjects.length > 1 ? 's' : ''} en cours`
              : 'Toutes les missions sont livrées ✓'}
          </div>
        </div>

        {activeProjects.length > 0 && (
          <div style={{ marginBottom: 32 }}>
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

        {(projects ?? []).length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--gray-dim)', fontSize: 13 }}>
            Aucune mission pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project: p, clientColor }: { project: ProjectRow; clientColor: string }) {
  const s = STATUS_COLORS[p.status] ?? STATUS_COLORS.demarrage;
  const label = STATUS_LABELS[p.status] ?? p.status;

  return (
    <div style={{
      background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)',
      borderRadius: 12, padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
          {p.summary && (
            <div style={{ fontSize: 12, color: 'var(--gray)', lineHeight: 1.5 }}>{p.summary}</div>
          )}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', background: s.bg, color: s.color }}>
          {label}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: p.deadline ? 8 : 0 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--night-4)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4, transition: 'width .4s',
            background: p.status === 'livré' ? 'var(--mint)' : clientColor,
            width: `${p.progress}%`,
          }} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--gray)', whiteSpace: 'nowrap' }}>{p.progress}%</span>
      </div>

      {p.deadline && (
        <div style={{ fontSize: 11, color: 'var(--gray-dim)' }}>
          Deadline : {p.deadline}
        </div>
      )}
    </div>
  );
}
