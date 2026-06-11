import { createSupabaseServer } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ClientHeader from '@/components/ClientHeader';
import type { InvoiceRow, ClientRow } from '@/lib/supabase';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  encaisse: { label: 'Encaissé', color: 'var(--mint)', bg: 'rgba(93,202,165,.12)' },
  en_attente: { label: 'En attente', color: 'var(--amber)', bg: 'rgba(239,159,39,.12)' },
  a_faire: { label: 'À venir', color: 'var(--gray)', bg: 'rgba(148,163,184,.1)' },
};

export default async function ClientFactures() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/client/login');

  const { data: clientData } = await supabase
    .from('clients')
    .select('*')
    .eq('email', user.email)
    .maybeSingle() as { data: ClientRow | null };

  if (!clientData) redirect('/client');

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('client', clientData.name)
    .order('date', { ascending: false }) as { data: InvoiceRow[] | null };

  const list = invoices ?? [];
  const totalEncaisse = list.filter(i => i.status === 'encaisse').reduce((s, i) => s + i.amount, 0);
  const totalEnAttente = list.filter(i => i.status !== 'encaisse').reduce((s, i) => s + i.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientHeader clientName={clientData.name} />

      <div style={{ flex: 1, padding: '28px 24px', maxWidth: 720, margin: '0 auto', width: '100%' }}>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 22, fontWeight: 800, letterSpacing: -.3, marginBottom: 4 }}>
            Factures
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray)' }}>
            {list.length} facture{list.length > 1 ? 's' : ''}
          </div>
        </div>

        {list.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 6 }}>Encaissé</div>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 22, fontWeight: 700, color: 'var(--mint)' }}>
                {totalEncaisse.toLocaleString('fr-FR')} €
              </div>
            </div>
            <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray)', marginBottom: 6 }}>En attente</div>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 22, fontWeight: 700, color: totalEnAttente > 0 ? 'var(--amber)' : 'var(--gray-dim)' }}>
                {totalEnAttente.toLocaleString('fr-FR')} €
              </div>
            </div>
          </div>
        )}

        <div style={{ background: 'var(--night-2)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, overflow: 'hidden' }}>
          {list.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-dim)', fontSize: 13 }}>
              Aucune facture pour le moment.
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 90px', gap: 12, padding: '10px 20px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--gray-dim)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <div>Description</div><div>Montant</div><div>Date</div><div>Statut</div>
              </div>
              {list.map(inv => {
                const st = STATUS_MAP[inv.status] ?? STATUS_MAP.a_faire;
                return (
                  <div key={inv.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 90px', gap: 12, padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,.04)', alignItems: 'center' }}>
                    <div style={{ fontSize: 13 }}>{inv.description}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.amount.toLocaleString('fr-FR')} €</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>{inv.date}</div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
