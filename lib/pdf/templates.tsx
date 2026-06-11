import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ClientRow, ProjectRow, InvoiceRow } from '@/lib/supabase';

const TEAL = '#0D9488';
const DARK = '#111827';
const MID = '#374151';
const GRAY = '#6B7280';
const BORDER = '#E5E7EB';
const LIGHT = '#F9FAFB';

const s = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', fontSize: 10, color: DARK, backgroundColor: '#FFFFFF' },
  row: { flexDirection: 'row' },
  flex1: { flex: 1 },
  divider: { borderBottomWidth: 1, borderBottomColor: BORDER, marginTop: 16, marginBottom: 16 },
  label: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: GRAY, textTransform: 'uppercase', letterSpacing: 0.8 },
  h1: { fontFamily: 'Helvetica-Bold', fontSize: 22, color: DARK },
  h2: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: DARK },
  small: { fontSize: 9, color: GRAY, marginTop: 2 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  tealBar: { width: 3, height: 14, backgroundColor: TEAL, borderRadius: 2, marginRight: 8 },
  tableHead: { flexDirection: 'row', backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 7 },
  tableRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: BORDER },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  notice: { backgroundColor: '#F0FDFA', padding: 12, borderRadius: 6, borderLeftWidth: 3, borderLeftColor: TEAL },
  footer: { position: 'absolute', bottom: 30, left: 48, right: 48, borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: GRAY },
});

function PageHeader({ title, ref: refNum, date }: { title: string; ref: string; date: string }) {
  return (
    <View>
      <View style={[s.row, { justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }]}>
        <View style={s.row}>
          <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#0B1120', borderWidth: 2, borderColor: TEAL, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: TEAL, fontSize: 17, fontFamily: 'Helvetica-Bold' }}>L</Text>
          </View>
          <View style={{ marginLeft: 10, justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 14, color: DARK }}>Lumi</Text>
            <Text style={{ fontSize: 9, color: GRAY }}>Stratégie digitale & IA</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.h1}>{title}</Text>
          <Text style={[s.small, { marginTop: 6 }]}>{refNum}</Text>
          <Text style={s.small}>{date}</Text>
        </View>
      </View>
      <View style={s.divider} />
    </View>
  );
}

function PageFooter() {
  return (
    <View style={s.footer}>
      <Text style={s.footerText}>Lumi · Thibault Meunier · Vichy · meunierthibault349@gmail.com</Text>
      <Text style={s.footerText}>lumi-site.fr</Text>
    </View>
  );
}

// ─── DEVIS ───────────────────────────────────────────────────────────────────

export function DevisPDF({ client, projects }: { client: ClientRow; projects: ProjectRow[] }) {
  const today = new Date().toLocaleDateString('fr-FR');
  const validity = new Date(Date.now() + 30 * 86400000).toLocaleDateString('fr-FR');
  const ref = `DEV-${new Date().getFullYear()}-${client.id.replace('CLT-', '')}`;
  const activeProjects = projects.filter(p => p.status !== 'livré');

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PageHeader title="DEVIS" ref={ref} date={today} />

        <View style={[s.row, { marginBottom: 20 }]}>
          <View style={[s.flex1, { paddingRight: 20 }]}>
            <Text style={[s.label, { marginBottom: 6 }]}>De</Text>
            <Text style={[s.h2, { marginBottom: 4 }]}>Thibault Meunier</Text>
            <Text style={s.small}>Lumi — Stratégie digitale & IA</Text>
            <Text style={s.small}>Vichy, France</Text>
            <Text style={s.small}>meunierthibault349@gmail.com</Text>
          </View>
          <View style={s.flex1}>
            <Text style={[s.label, { marginBottom: 6 }]}>Pour</Text>
            <Text style={[s.h2, { marginBottom: 4 }]}>{client.full_name || client.name}</Text>
            <Text style={s.small}>{client.contact}</Text>
            {!!client.email && <Text style={s.small}>{client.email}</Text>}
            <Text style={s.small}>{client.sector}</Text>
          </View>
        </View>

        <View style={s.divider} />

        <View style={{ marginBottom: 20 }}>
          <View style={s.sectionTitle}>
            <View style={s.tealBar} />
            <Text style={s.h2}>Prestations</Text>
          </View>

          <View style={s.tableHead}>
            <Text style={[s.label, { flex: 3 }]}>Description</Text>
            <Text style={[s.label, { flex: 1, textAlign: 'right' }]}>Tarif</Text>
            <Text style={[s.label, { width: 70, textAlign: 'right' }]}>Type</Text>
          </View>

          <View style={s.tableRow}>
            <View style={{ flex: 3 }}>
              <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10 }}>{client.pack}</Text>
              <Text style={s.small}>Abonnement mensuel — services digitaux inclus</Text>
            </View>
            <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Helvetica-Bold', fontSize: 10, color: TEAL }}>{client.mrr.toLocaleString('fr-FR')} €</Text>
            <Text style={{ width: 70, textAlign: 'right', fontSize: 9, color: GRAY }}>Mensuel</Text>
          </View>

          {activeProjects.map(p => (
            <View key={p.id} style={s.tableRow}>
              <View style={{ flex: 3 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10 }}>{p.title}</Text>
                {!!p.summary && <Text style={s.small}>{p.summary}</Text>}
                {!!p.deadline && <Text style={s.small}>Deadline : {p.deadline}</Text>}
              </View>
              <Text style={{ flex: 1, textAlign: 'right', fontSize: 10 }}>{p.devis || '—'}</Text>
              <Text style={{ width: 70, textAlign: 'right', fontSize: 9, color: GRAY }}>One-shot</Text>
            </View>
          ))}

          <View style={[s.row, { justifyContent: 'flex-end', marginTop: 14 }]}>
            <View style={{ width: 210, borderTopWidth: 2, borderTopColor: TEAL, paddingTop: 10 }}>
              <View style={[s.row, { justifyContent: 'space-between', marginBottom: 6 }]}>
                <Text style={s.small}>Abonnement mensuel</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{client.mrr.toLocaleString('fr-FR')} €/mois</Text>
              </View>
              <View style={[s.row, { justifyContent: 'space-between' }]}>
                <Text style={s.label}>Total HT mensuel</Text>
                <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: TEAL }}>{client.mrr.toLocaleString('fr-FR')} €</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.notice}>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: TEAL, marginBottom: 5 }}>CONDITIONS</Text>
          <Text style={s.small}>Devis valable jusqu&apos;au {validity} · Acompte 30 % à la signature · Facturation mensuelle début de mois</Text>
          <Text style={[s.small, { marginTop: 3 }]}>Auto-entrepreneur — Non assujetti à la TVA (art. 293 B du CGI)</Text>
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
}

// ─── FACTURE ─────────────────────────────────────────────────────────────────

const INVOICE_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  encaisse: { label: 'Encaissé', color: '#059669', bg: '#D1FAE5' },
  en_attente: { label: 'En attente', color: '#D97706', bg: '#FEF3C7' },
  a_faire: { label: 'À venir', color: '#6B7280', bg: '#F3F4F6' },
};

export function FacturePDF({ invoice, client }: { invoice: InvoiceRow; client: ClientRow | null }) {
  const st = INVOICE_STATUS[invoice.status] ?? INVOICE_STATUS.a_faire;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PageHeader title="FACTURE" ref={invoice.id} date={invoice.date} />

        <View style={[s.row, { marginBottom: 20 }]}>
          <View style={[s.flex1, { paddingRight: 20 }]}>
            <Text style={[s.label, { marginBottom: 6 }]}>Émetteur</Text>
            <Text style={[s.h2, { marginBottom: 4 }]}>Thibault Meunier</Text>
            <Text style={s.small}>Lumi — Stratégie digitale & IA</Text>
            <Text style={s.small}>Vichy, France</Text>
            <Text style={s.small}>meunierthibault349@gmail.com</Text>
          </View>
          <View style={s.flex1}>
            <Text style={[s.label, { marginBottom: 6 }]}>Destinataire</Text>
            <Text style={[s.h2, { marginBottom: 4 }]}>{invoice.client}</Text>
            {!!client?.contact && <Text style={s.small}>{client.contact}</Text>}
            {!!client?.email && <Text style={s.small}>{client.email}</Text>}
          </View>
        </View>

        <View style={s.divider} />

        <View style={{ marginBottom: 20 }}>
          <View style={s.sectionTitle}>
            <View style={s.tealBar} />
            <Text style={s.h2}>Détail de la facture</Text>
          </View>

          <View style={s.tableHead}>
            <Text style={[s.label, { flex: 3 }]}>Description</Text>
            <Text style={[s.label, { flex: 1, textAlign: 'right' }]}>Montant HT</Text>
            <Text style={[s.label, { width: 70, textAlign: 'right' }]}>Statut</Text>
          </View>

          <View style={s.tableRow}>
            <Text style={{ flex: 3, fontSize: 10 }}>{invoice.description}</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Helvetica-Bold', fontSize: 10, color: TEAL }}>{invoice.amount.toLocaleString('fr-FR')} €</Text>
            <View style={{ width: 70, alignItems: 'flex-end' }}>
              <View style={[s.badge, { backgroundColor: st.bg }]}>
                <Text style={[s.badgeText, { color: st.color }]}>{st.label}</Text>
              </View>
            </View>
          </View>

          <View style={[s.row, { justifyContent: 'flex-end', marginTop: 14 }]}>
            <View style={{ width: 210, borderTopWidth: 2, borderTopColor: TEAL, paddingTop: 10 }}>
              <View style={[s.row, { justifyContent: 'space-between' }]}>
                <Text style={s.label}>Total HT</Text>
                <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: TEAL }}>{invoice.amount.toLocaleString('fr-FR')} €</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.notice}>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: TEAL, marginBottom: 5 }}>MENTIONS LÉGALES</Text>
          <Text style={s.small}>Auto-entrepreneur — Non assujetti à la TVA (art. 293 B du CGI)</Text>
          <Text style={[s.small, { marginTop: 3 }]}>Règlement par virement bancaire sous 30 jours à réception</Text>
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
}

// ─── RAPPORT ─────────────────────────────────────────────────────────────────

const PROJECT_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  'livré': { label: 'Livré', color: '#059669', bg: '#D1FAE5' },
  'en_cours': { label: 'En cours', color: '#D97706', bg: '#FEF3C7' },
  'en_attente_client': { label: 'En attente', color: '#DC2626', bg: '#FEE2E2' },
  'demarrage': { label: 'Démarrage', color: '#6B7280', bg: '#F3F4F6' },
};

export function RapportPDF({ client, projects }: { client: ClientRow; projects: ProjectRow[] }) {
  const today = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const pending = client.pending ?? [];
  const notes = client.notes ?? [];

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PageHeader title="RAPPORT" ref={`Rapport de mission · ${client.name}`} date={today} />

        <View style={[s.row, { backgroundColor: LIGHT, padding: 16, borderRadius: 8, marginBottom: 20 }]}>
          <View style={[s.flex1, { paddingRight: 16 }]}>
            <Text style={[s.label, { marginBottom: 4 }]}>Client</Text>
            <Text style={s.h2}>{client.full_name || client.name}</Text>
            <Text style={[s.small, { marginTop: 4 }]}>{client.sector} · {client.pack}</Text>
          </View>
          <View style={[s.flex1, { paddingRight: 16 }]}>
            <Text style={[s.label, { marginBottom: 4 }]}>Contact</Text>
            <Text style={{ fontSize: 10, marginTop: 4 }}>{client.contact}</Text>
            {!!client.email && <Text style={s.small}>{client.email}</Text>}
          </View>
          <View>
            <Text style={[s.label, { marginBottom: 4 }]}>MRR</Text>
            <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: TEAL, marginTop: 4 }}>{client.mrr.toLocaleString('fr-FR')} €</Text>
          </View>
        </View>

        {projects.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={s.sectionTitle}>
              <View style={s.tealBar} />
              <Text style={s.h2}>Missions ({projects.length})</Text>
            </View>

            <View style={s.tableHead}>
              <Text style={[s.label, { flex: 3 }]}>Mission</Text>
              <Text style={[s.label, { width: 80, textAlign: 'center' }]}>Avancement</Text>
              <Text style={[s.label, { width: 70, textAlign: 'right' }]}>Statut</Text>
            </View>

            {projects.map(p => {
              const st = PROJECT_STATUS[p.status] ?? PROJECT_STATUS.demarrage;
              return (
                <View key={p.id} style={s.tableRow}>
                  <View style={{ flex: 3 }}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10 }}>{p.title}</Text>
                    {!!p.ref && <Text style={[s.small, { color: TEAL }]}>{p.ref}</Text>}
                    {!!p.deadline && <Text style={s.small}>Deadline : {p.deadline}</Text>}
                  </View>
                  <View style={{ width: 80, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 56, height: 5, backgroundColor: BORDER, borderRadius: 3 }}>
                      <View style={{ width: `${p.progress}%`, height: 5, backgroundColor: TEAL, borderRadius: 3 }} />
                    </View>
                    <Text style={[s.small, { marginTop: 3 }]}>{p.progress}%</Text>
                  </View>
                  <View style={{ width: 70, alignItems: 'flex-end' }}>
                    <View style={[s.badge, { backgroundColor: st.bg }]}>
                      <Text style={[s.badgeText, { color: st.color }]}>{st.label}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {pending.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={s.sectionTitle}>
              <View style={s.tealBar} />
              <Text style={s.h2}>Actions en suspens ({pending.length})</Text>
            </View>
            {pending.map((item, i) => (
              <View key={i} style={[s.row, { alignItems: 'center', marginBottom: 6 }]}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.owner === 'lumi' ? TEAL : '#F59E0B', marginRight: 8 }} />
                <Text style={{ flex: 1, fontSize: 10 }}>{item.text}</Text>
                <Text style={{ fontSize: 9, color: item.owner === 'lumi' ? TEAL : '#D97706', fontFamily: 'Helvetica-Bold' }}>
                  {item.owner === 'lumi' ? 'Lumi' : 'Client'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {notes.length > 0 && (
          <View>
            <View style={s.sectionTitle}>
              <View style={s.tealBar} />
              <Text style={s.h2}>Notes</Text>
            </View>
            {notes.map((note, i) => (
              <View key={i} style={{ paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: BORDER, marginBottom: 8 }}>
                <Text style={{ fontSize: 10, color: MID, lineHeight: 1.5 }}>{note}</Text>
              </View>
            ))}
          </View>
        )}

        <PageFooter />
      </Page>
    </Document>
  );
}

// ─── LIVRABLE ────────────────────────────────────────────────────────────────

export interface LivrableIA {
  id: string; title: string; type: string; client: string;
  content: string; agent_mode: string; status: string; created_at: string;
}

export function LivrablePDF({ livrable }: { livrable: LivrableIA }) {
  const date = livrable.created_at
    ? new Date(livrable.created_at).toLocaleDateString('fr-FR')
    : new Date().toLocaleDateString('fr-FR');

  const clean = livrable.content
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

  const lines = clean.split('\n').filter(l => l.trim());

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PageHeader title="LIVRABLE" ref={livrable.id} date={date} />

        <View style={[s.row, { backgroundColor: LIGHT, padding: 14, borderRadius: 8, marginBottom: 16 }]}>
          <View style={[s.flex1, { paddingRight: 16 }]}>
            <Text style={[s.label, { marginBottom: 4 }]}>Titre</Text>
            <Text style={[s.h2, { marginTop: 4 }]}>{livrable.title}</Text>
          </View>
          <View style={{ paddingRight: 16 }}>
            <Text style={[s.label, { marginBottom: 4 }]}>Client</Text>
            <Text style={{ fontSize: 10, marginTop: 4 }}>{livrable.client || '—'}</Text>
          </View>
          <View style={{ paddingRight: 16 }}>
            <Text style={[s.label, { marginBottom: 4 }]}>Type</Text>
            <Text style={{ fontSize: 10, color: TEAL, fontFamily: 'Helvetica-Bold', marginTop: 4 }}>{livrable.type}</Text>
          </View>
          <View>
            <Text style={[s.label, { marginBottom: 4 }]}>Agent</Text>
            <Text style={{ fontSize: 10, marginTop: 4 }}>{livrable.agent_mode || '—'}</Text>
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.sectionTitle}>
          <View style={s.tealBar} />
          <Text style={s.h2}>Contenu</Text>
        </View>

        {lines.map((line, i) => {
          const isHeading = line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ');
          const cleaned = line.replace(/^#+\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1');
          return (
            <Text key={i} style={{
              fontSize: isHeading ? 11 : 10,
              fontFamily: isHeading ? 'Helvetica-Bold' : 'Helvetica',
              color: isHeading ? DARK : MID,
              lineHeight: 1.6,
              marginBottom: isHeading ? 6 : 3,
              marginTop: isHeading ? 10 : 0,
            }}>
              {cleaned}
            </Text>
          );
        })}

        <PageFooter />
      </Page>
    </Document>
  );
}
