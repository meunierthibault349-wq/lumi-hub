'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Doc = {
  id: string;
  title: string;
  category: string;
  path: string;
  content: string;
  file_type: string;
  file_url: string | null;
  updated_at: string;
};

const CATS = [
  { key: 'contexte', label: 'Contexte',   icon: '◈' },
  { key: 'clients',  label: 'Clients',    icon: '◉' },
  { key: 'lumi',     label: 'Lumi',       icon: '◐' },
  { key: 'config',   label: 'Config',     icon: '◇' },
];

// ── Markdown renderer (no external deps) ──────────────────────────────────
function esc(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function inlineFormat(s: string): string {
  return s
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/~~([^~\n]+)~~/g, '<del>$1</del>')
    .replace(/`([^`\n]+)`/g, '<code class="md-ic">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="md-a">$1</a>');
}

function renderMd(raw: string): string {
  let text = esc(raw);
  text = text.replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) =>
    `<pre class="md-pre"><code>${code.trimEnd()}</code></pre>`
  );
  const lines = text.split('\n');
  const out: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  function flushTable() {
    if (!tableRows.length) return;
    const [head, , ...body] = tableRows;
    out.push('<div class="md-table-wrap"><table class="md-table">');
    if (head) out.push('<thead><tr>' + head.map(c => `<th>${inlineFormat(c.trim())}</th>`).join('') + '</tr></thead>');
    if (body.length) {
      out.push('<tbody>');
      body.forEach(row => out.push('<tr>' + row.map(c => `<td>${inlineFormat(c.trim())}</td>`).join('') + '</tr>'));
      out.push('</tbody>');
    }
    out.push('</table></div>');
    tableRows = [];
    inTable = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trim = line.trim();
    if (trim.startsWith('|')) {
      inTable = true;
      tableRows.push(trim.replace(/^\||\|$/g, '').split('|'));
      continue;
    } else if (inTable) {
      flushTable();
    }
    if (/^-{3,}$/.test(trim)) { out.push('<hr class="md-hr" />'); continue; }
    const h = trim.match(/^(#{1,4}) (.+)$/);
    if (h) { out.push(`<h${h[1].length} class="md-h${h[1].length}">${inlineFormat(h[2])}</h${h[1].length}>`); continue; }
    if (trim.startsWith('&gt;')) { out.push(`<blockquote class="md-bq">${inlineFormat(trim.slice(4).trim())}</blockquote>`); continue; }
    if (trim.startsWith('- [ ] ')) { out.push(`<div class="md-li md-check-item">☐ ${inlineFormat(trim.slice(6))}</div>`); continue; }
    if (trim.startsWith('- [x] ') || trim.startsWith('- [X] ')) { out.push(`<div class="md-li md-check-done">☑ ${inlineFormat(trim.slice(6))}</div>`); continue; }
    if (/^[-*] /.test(trim)) { out.push(`<div class="md-li">• ${inlineFormat(trim.slice(2))}</div>`); continue; }
    if (/^\d+\. /.test(trim)) { out.push(`<div class="md-li">${inlineFormat(trim.replace(/^\d+\. /, ''))}</div>`); continue; }
    if (!trim) { out.push('<div class="md-gap"></div>'); continue; }
    out.push(`<p class="md-p">${inlineFormat(trim)}</p>`);
  }
  if (inTable) flushTable();
  return out.join('\n');
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const [docs, setDocs]           = useState<Doc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openCats, setOpenCats]   = useState<Record<string, boolean>>(
    Object.fromEntries(CATS.map(c => [c.key, true]))
  );
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    supabase.from('jarvis_docs').select('*').order('category').order('title')
      .then(({ data }) => {
        if (data?.length) { setDocs(data); setSelectedId(data[0].id); }
        setLoading(false);
      });
  }, []);

  const selected = docs.find(d => d.id === selectedId);

  const filteredDocs = search
    ? docs.filter(d =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.content.toLowerCase().includes(search.toLowerCase())
      )
    : docs;

  const docsByCategory = CATS.map(cat => ({
    ...cat,
    docs: filteredDocs.filter(d => d.category === cat.key),
  }));

  function toggleCat(key: string) {
    setOpenCats(p => ({ ...p, [key]: !p[key] }));
  }

  const isPdf = selected?.file_type === 'pdf';

  return (
    <>
      <div className="r-tb page-topbar">
        <div className="page-title">Jarvis Docs</div>
        <span style={{ fontSize: 12, color: 'var(--gray)', background: 'rgba(255,255,255,.06)', padding: '2px 10px', borderRadius: 20 }}>
          {docs.length} documents
        </span>
        <div style={{ marginLeft: 'auto' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher…"
          style={{
            padding: '6px 14px', background: 'rgba(26,34,53,0.6)',
            border: '1px solid rgba(255,255,255,.1)', borderRadius: 8,
            color: 'var(--white)', fontSize: 13, fontFamily: 'inherit', width: 200,
          }}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left tree ── */}
        <div style={{
          width: 220, flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,.06)',
          overflowY: 'auto', padding: '14px 10px',
          background: 'rgba(11,17,32,0.4)',
        }}>
          {loading && <div style={{ color: 'var(--gray-dim)', fontSize: 13, padding: 8 }}>Chargement…</div>}

          {docsByCategory.map(cat => (
            <div key={cat.key} style={{ marginBottom: 8 }}>
              <button
                onClick={() => toggleCat(cat.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  width: '100%', padding: '6px 8px', borderRadius: 7,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--gray)', fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '1px',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 9, opacity: 0.7 }}>{openCats[cat.key] ? '▾' : '▸'}</span>
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 400, opacity: 0.6 }}>{cat.docs.length}</span>
              </button>

              {openCats[cat.key] && cat.docs.map(doc => {
                const active = selectedId === doc.id;
                const isPdfDoc = doc.file_type === 'pdf';
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedId(doc.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      width: '100%', textAlign: 'left',
                      padding: '7px 10px 7px 22px', borderRadius: 7, marginTop: 2,
                      background: active ? 'rgba(13,148,136,.15)' : 'transparent',
                      border: `1px solid ${active ? 'rgba(13,148,136,.3)' : 'transparent'}`,
                      color: active ? 'var(--teal-light)' : 'var(--gray)',
                      fontSize: 13, fontWeight: active ? 600 : 400,
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all .12s',
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'var(--white)'; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'var(--gray)'; }}
                  >
                    <span style={{
                      fontSize: 9, padding: '1px 5px', borderRadius: 3, flexShrink: 0,
                      background: isPdfDoc ? 'rgba(239,100,39,.15)' : 'rgba(13,148,136,.12)',
                      color: isPdfDoc ? '#F97316' : 'var(--teal-light)',
                      fontWeight: 700, letterSpacing: '.5px',
                    }}>
                      {isPdfDoc ? 'PDF' : 'MD'}
                    </span>
                    {doc.title}
                  </button>
                );
              })}

              {openCats[cat.key] && cat.docs.length === 0 && !loading && (
                <div style={{ padding: '6px 22px', fontSize: 12, color: 'var(--gray-dim)' }}>
                  {search ? 'Aucun résultat' : 'Vide'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Document viewer ── */}
        <div style={{ flex: 1, overflowY: isPdf ? 'hidden' : 'auto', padding: isPdf ? '28px 36px 0' : '28px 36px', display: 'flex', flexDirection: 'column' }}>
          {!selected && !loading && (
            <div style={{ color: 'var(--gray-dim)', fontSize: 14, textAlign: 'center', paddingTop: 60 }}>
              Sélectionne un document dans le panneau gauche.
            </div>
          )}

          {selected && (
            <>
              {/* Doc header */}
              <div style={{ marginBottom: 20, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <h1 style={{ fontFamily: 'var(--font-jakarta)', fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--white)' }}>
                    {selected.title}
                  </h1>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    {isPdf && selected.file_url && (
                      <a
                        href={selected.file_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '5px 12px', borderRadius: 7, fontSize: 12,
                          background: 'rgba(239,100,39,.12)', border: '1px solid rgba(239,100,39,.25)',
                          color: '#F97316', textDecoration: 'none', fontWeight: 600,
                        }}
                      >
                        ↗ Ouvrir PDF
                      </a>
                    )}
                    <span style={{
                      fontSize: 11, color: 'var(--gray-dim)', background: 'rgba(255,255,255,.05)',
                      padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', marginTop: 4,
                    }}>
                      {new Date(selected.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-dim)', marginTop: 5, fontFamily: 'monospace' }}>
                  {selected.path}
                </div>
              </div>

              {/* PDF viewer */}
              {isPdf && selected.file_url && (
                <iframe
                  src={selected.file_url}
                  style={{ flex: 1, border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, marginBottom: 28 }}
                  title={selected.title}
                />
              )}

              {isPdf && !selected.file_url && (
                <div style={{
                  padding: 24, background: 'rgba(255,255,255,.03)',
                  border: '1px dashed rgba(255,255,255,.1)', borderRadius: 10,
                  color: 'var(--gray)', lineHeight: 1.8,
                }}>
                  <p>Ce PDF n'a pas encore été uploadé sur Supabase Storage.</p>
                  <p style={{ marginTop: 8, fontSize: 13 }}>
                    Pour le rendre accessible ici : upload le fichier dans Storage → bucket <code style={{ color: 'var(--teal-light)', background: 'rgba(13,148,136,.1)', padding: '1px 6px', borderRadius: 4 }}>jarvis-docs</code>,
                    puis mets à jour la colonne <code style={{ color: 'var(--teal-light)', background: 'rgba(13,148,136,.1)', padding: '1px 6px', borderRadius: 4 }}>file_url</code>.
                  </p>
                </div>
              )}

              {/* Markdown content */}
              {!isPdf && (
                <div
                  className="md-content"
                  dangerouslySetInnerHTML={{ __html: renderMd(selected.content) }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
