'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

type Msg = { role: 'user' | 'assistant'; content: string };

const PAGE_LABELS: Record<string, string> = {
  '/': 'Dashboard', '/taches': 'Tâches', '/projets': 'Projets',
  '/clients': 'Clients', '/chrono': 'Chrono', '/pipeline': 'Pipeline',
  '/finances': 'Finances', '/documents': 'Jarvis Docs', '/agents': 'Agents IA',
  '/morning': 'Morning', '/orchestre': 'Chef Adjoint', '/livrables': 'Livrables',
  '/gmail': 'Gmail', '/calendar': 'Agenda',
};

const SUGGESTIONS: Record<string, string[]> = {
  '/':         ['Quelle est ma priorité du jour ?', 'Résume l\'état des projets'],
  '/taches':   ['Quelles tâches prioriser ?', 'Comment décomposer une tâche complexe ?'],
  '/projets':  ['Quel projet est le plus à risque ?', 'Rédige un update pour BeLoc'],
  '/clients':  ['Que faire pour relancer 100P ?', 'Prépare le prochain point BeLoc'],
  '/chrono':   ['Comment optimiser mon temps ?', 'Sur quoi ai-je passé le plus de temps ?'],
  '/pipeline': ['Comment relancer un prospect froid ?', 'Rédige un message de prospection'],
  '/agents':   ['Quel agent pour créer un post Instagram ?', 'Quel agent pour un devis ?'],
  '/documents':['Résume le Business Plan Lumi', 'Quels sont les points clés des SOPs ?'],
};

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center', padding: '2px 0' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'var(--teal-light)',
          animation: `typingDot 1.2s ${i * 0.2}s ease-in-out infinite`,
        }} />
      ))}
    </span>
  );
}

function MarkdownLine({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, i = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith('`')) {
      parts.push(
        <code key={i++} style={{
          background: 'rgba(255,255,255,.1)', borderRadius: 4,
          padding: '1px 5px', fontSize: '0.88em',
          fontFamily: 'ui-monospace, monospace', color: 'var(--teal-light)',
        }}>{token.slice(1, -1)}</code>
      );
    } else if (token.startsWith('**')) {
      parts.push(<strong key={i++} style={{ color: 'var(--white)', fontWeight: 600 }}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<em key={i++} style={{ fontStyle: 'italic', color: 'rgba(248,255,254,.7)' }}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Markdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { nodes.push(<div key={i} style={{ height: 6 }} />); i++; continue; }

    if (/^#{1,3} /.test(line)) {
      const lvl = line.match(/^(#+)/)?.[1].length ?? 1;
      const txt = line.replace(/^#+\s/, '');
      const sizes = [16, 14, 13];
      nodes.push(
        <div key={i} style={{ fontWeight: 700, fontSize: sizes[lvl - 1] ?? 13, color: 'var(--white)', margin: '10px 0 4px' }}>
          <MarkdownLine text={txt} />
        </div>
      );
      i++; continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, ''));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} style={{ margin: '4px 0', paddingLeft: 16, listStyleType: 'none' }}>
          {items.map((it, j) => (
            <li key={j} style={{ display: 'flex', gap: 7, marginBottom: 3, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--teal-light)', marginTop: 2, flexShrink: 0, fontSize: 10 }}>▸</span>
              <span><MarkdownLine text={it} /></span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      let n = 1;
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} style={{ margin: '4px 0', paddingLeft: 0, listStyleType: 'none' }}>
          {items.map((it, j) => (
            <li key={j} style={{ display: 'flex', gap: 8, marginBottom: 3, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--teal-light)', fontVariantNumeric: 'tabular-nums', fontSize: 11, minWidth: 14, marginTop: 1, flexShrink: 0 }}>{n++ + j}.</span>
              <span><MarkdownLine text={it} /></span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
      i++;
      nodes.push(
        <pre key={`code-${i}`} style={{
          background: 'rgba(0,0,0,.4)', borderRadius: 8,
          padding: '10px 12px', margin: '6px 0',
          fontSize: 11.5, fontFamily: 'ui-monospace, monospace',
          color: 'var(--teal-light)', overflowX: 'auto',
          border: '1px solid rgba(255,255,255,.07)',
        }}>{codeLines.join('\n')}</pre>
      );
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      nodes.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.1)', margin: '10px 0' }} />);
      i++; continue;
    }

    nodes.push(
      <p key={i} style={{ margin: 0, marginBottom: 2, lineHeight: 1.65 }}>
        <MarkdownLine text={line} />
      </p>
    );
    i++;
  }

  return <div>{nodes}</div>;
}

export default function AIAssistant() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState<Msg[]>([]);
  const [input, setInput]     = useState('');
  const [streaming, setStreaming] = useState(false);
  const pathname              = usePathname();
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);
  const abortRef              = useRef<AbortController | null>(null);

  const pageLabel = PAGE_LABELS[pathname] ?? 'Hub';
  const suggestions = SUGGESTIONS[pathname] ?? ['Comment puis-je t\'aider ?'];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => { setMsgs([]); }, [pathname]);

  const send = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    setInput('');

    const userMsg: Msg = { role: 'user', content };
    const updatedMsgs = [...msgs, userMsg];
    setMsgs([...updatedMsgs, { role: 'assistant', content: '' }]);
    setStreaming(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/jarvis-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: updatedMsgs.map(m => ({ role: m.role, content: m.content })),
          pathname,
        }),
      });

      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMsgs(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: full } : m));
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') {
        setMsgs(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: 'Erreur de connexion.' } : m));
      }
    }
    setStreaming(false);
  }, [input, msgs, pathname, streaming]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  function clear() {
    abortRef.current?.abort();
    setMsgs([]);
    setStreaming(false);
  }

  return (
    <>
      <style>{`
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes assistantSlide {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ai-msg-scroll::-webkit-scrollbar { width: 4px; }
        .ai-msg-scroll::-webkit-scrollbar-track { background: transparent; }
        .ai-msg-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(p => !p)}
        title="Jarvis AI"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 700,
          width: 48, height: 48, borderRadius: '50%',
          background: open
            ? 'rgba(11,17,32,0.95)'
            : 'linear-gradient(135deg, #0D9488, #5DCAA5)',
          border: open ? '1px solid rgba(13,148,136,.4)' : 'none',
          color: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open ? '0 0 0 2px rgba(13,148,136,.3)' : '0 4px 20px rgba(13,148,136,.4)',
          transition: 'all .2s cubic-bezier(0.4,0,0.2,1)',
          fontFamily: 'var(--font-jakarta)',
        }}
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <circle cx="9" cy="10" r="1" fill="currentColor"/>
            <circle cx="12" cy="10" r="1" fill="currentColor"/>
            <circle cx="15" cy="10" r="1" fill="currentColor"/>
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', right: 0, top: 0, bottom: 0, width: 420,
          zIndex: 690,
          background: 'rgba(8,13,24,0.98)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,.08)',
          display: 'flex', flexDirection: 'column',
          animation: 'assistantSlide 0.22s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '-8px 0 40px rgba(0,0,0,.5)',
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.07)',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#0D9488,#5DCAA5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-jakarta)',
            }}>J</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-jakarta)', color: 'var(--white)' }}>Jarvis</div>
              <div style={{ fontSize: 11, color: 'var(--gray)' }}>
                {pageLabel}
                <span style={{ marginLeft: 6, color: 'rgba(13,148,136,.8)', fontSize: 10 }}>Sonnet</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              {msgs.length > 0 && (
                <button onClick={clear} style={{
                  background: 'none', border: '1px solid rgba(255,255,255,.1)',
                  borderRadius: 6, color: 'var(--gray)', cursor: 'pointer',
                  padding: '4px 9px', fontSize: 11, fontFamily: 'inherit',
                  transition: 'all .12s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.2)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--white)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--gray)'; }}
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="ai-msg-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
            {msgs.length === 0 && (
              <div style={{ paddingTop: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 14, lineHeight: 1.6 }}>
                  Bonjour Thibault, je suis sur{' '}
                  <strong style={{ color: 'var(--teal-light)' }}>{pageLabel}</strong>.
                  Comment puis-je t&apos;aider ?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => send(s)} style={{
                      textAlign: 'left', padding: '10px 13px', borderRadius: 9,
                      background: 'rgba(13,148,136,.06)', border: '1px solid rgba(13,148,136,.14)',
                      color: 'var(--gray)', fontSize: 13, cursor: 'pointer',
                      fontFamily: 'inherit', lineHeight: 1.4, transition: 'all .12s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(13,148,136,.13)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--white)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(13,148,136,.3)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(13,148,136,.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--gray)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(13,148,136,.14)'; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 12,
                animation: 'msgIn 0.15s ease',
              }}>
                {m.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#0D9488,#5DCAA5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 800, color: 'white', flexShrink: 0,
                    }}>J</div>
                    <span style={{ fontSize: 11, color: 'var(--gray)', fontWeight: 500 }}>Jarvis</span>
                  </div>
                )}
                <div style={{
                  maxWidth: '88%',
                  padding: m.role === 'user' ? '9px 14px' : '12px 15px',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, rgba(13,148,136,.25), rgba(13,148,136,.15))'
                    : 'rgba(255,255,255,.04)',
                  border: m.role === 'user'
                    ? '1px solid rgba(13,148,136,.35)'
                    : '1px solid rgba(255,255,255,.07)',
                  fontSize: 13.5,
                  color: m.role === 'user' ? 'var(--white)' : 'rgba(245,255,253,.9)',
                }}>
                  {m.content === '' && m.role === 'assistant'
                    ? <TypingDots />
                    : m.role === 'user'
                      ? <span style={{ lineHeight: 1.5 }}>{m.content}</span>
                      : <Markdown content={m.content} />
                  }
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 14px 14px',
            borderTop: '1px solid rgba(255,255,255,.07)',
            flexShrink: 0,
          }}>
            {streaming && (
              <div style={{ fontSize: 11, color: 'var(--teal-light)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <TypingDots />
                <span style={{ marginLeft: 2 }}>Jarvis réfléchit…</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Message à Jarvis…"
                disabled={streaming}
                style={{
                  flex: 1, padding: '10px 14px',
                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.1)',
                  borderRadius: 10, color: 'var(--white)',
                  fontSize: 13, fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color .15s',
                  opacity: streaming ? 0.5 : 1,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(13,148,136,.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || streaming}
                style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: input.trim() && !streaming
                    ? 'linear-gradient(135deg,#0D9488,#5DCAA5)'
                    : 'rgba(255,255,255,.06)',
                  border: 'none', color: 'white',
                  cursor: input.trim() && !streaming ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                  boxShadow: input.trim() && !streaming ? '0 2px 12px rgba(13,148,136,.35)' : 'none',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', marginTop: 6, textAlign: 'center' }}>
              Entrée pour envoyer · Shift+Entrée pour saut de ligne
            </div>
          </div>
        </div>
      )}
    </>
  );
}
