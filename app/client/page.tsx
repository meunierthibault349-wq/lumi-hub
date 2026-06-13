import { createSupabaseServer } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ClientHeader from '@/components/ClientHeader';
import ClientPortalTabs from '@/components/ClientPortalTabs';
import type { ProjectRow, ClientRow } from '@/lib/supabase';
import type { LivrableIARow } from '@/components/ClientLivrableCard';

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

  const [projectsRes, livrablesRes] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientData.id)
      .order('created_at'),
    supabase
      .from('livrables_ia')
      .select('id, title, type, content, agent_mode, image_url, status, created_at')
      .eq('client', clientData.name)
      .eq('status', 'livré')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const projects = (projectsRes.data ?? []) as ProjectRow[];
  const livrables = (livrablesRes.data ?? []) as LivrableIARow[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientHeader clientName={clientData.name} />
      <ClientPortalTabs
        clientData={clientData}
        projects={projects}
        livrables={livrables}
      />
    </div>
  );
}
