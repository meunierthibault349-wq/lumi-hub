'use client';
import { useState, useRef, useEffect } from 'react';

interface ChatMessage { role: 'agent' | 'user'; text: string; }

const WELCOME = `Bonjour Thibault. Je suis ton Chef Adjoint — j'ai chargé tes clients, projets et tâches en cours.

Dis-moi ce que tu veux faire : contenu pour un client, devis, relance prospect, analyse, stratégie... Je m'occupe du reste.`;

function extractMode(text: string): string | null {
  const m = text.match(/\[MODE:\s*([^\]]+)\]/);
  return m ? m[1].trim() : null;
}

function extractLivrable(text: string): { type: string; client: string } | null {
  const m = text.match(/\[LIVRABLE:\s*([^|]+)\|([^\]]+)\]/);
  if (!m) return null;
  return { type: m[1].trim(), client: m[2].trim() };
}

function cleanText(text: string): string {
  return text.replace(/\[MODE:[^\]]+\]/g, '').replace(/\[LIVRABLE:[^\]]+\]/g, '').trim();
}

export default function OrchestrerPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'agent', text: WELCOME }]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const messagesEl = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (messagesEl.current) {
      messagesEl.current.scrollTop = messagesEl.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || streaming) return;
    const text = input.trim();
    setInput('');

    const userMsg: ChatMessage = { role: 'user', text };
    const history = [...messages, userMsg];
    setMessages(history);

    const apiMessages = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    setStreaming(true);
    setMessages(prev => [...prev, { role: 'agent', text: '' }]);
    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/orchestre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortRef.current.signal,
      });
      if (!res.ok || !res.body) throw new Error('Erreur réseau');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const mode = extractMode(full);
        if (mode) setActiveMode(mode);
        setMessages(prev => {
          const upd = [...prev];
          upd[upd.length - 1] = { role: 'agent', text: full };
          return upd;
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages(prev => {
          const upd = [...prev];
          upd[upd.length - 1] = { role: 'agent', text: '[Erreur de connexion]' };
          return upd;
        });
      }
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--night-1)' }}>
      {/* Header */}
      <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, var(--teal), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--white)' }}>Chef Adjoint</div>
          <div style={{ fontSize: 11, color: 'var(--gray-dim)' }}>Orchestrateur IA — Lumi · Sonnet 4.6</div>
        </div>
        {activeMode && (
          <div style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 6, background: 'rgba(0,210,200,.12)', border: '1px solid rgba(0,210,200,.25)', fontSize: 11, color: 'var(--teal)', fontWeight: 700, letterSpacing: '.03em' }}>
            MODE : {activeMode.toUpperCase()}
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={messagesEl} style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg, i) => {
          const isAgent = msg.role === 'agent';
          const livrable = isAgent ? extractLivrable(msg.text) : null;
          const display = isAgent ? cleanText(msg.text) : msg.text;
          const isLast = i === messages.length - 1;

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isAgent ? 'flex-start' : 'flex-end', gap: 6 }}>
              {isAgent && (
                <div style={{ fontSize: 10, color: 'var(--gray-dim)', marginLeft: 4, fontWeight: 600, letterSpacing: '.04em' }}>
                  CHEF ADJOINT
                </div>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '12px 16px',
                borderRadius: isAgent ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                background: isAgent ? 'var(--night-2)' : 'linear-gradient(135deg, var(--teal), var(--violet))',
                color: 'var(--white)',
                fontSize: 13,
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                border: isAgent ? '1px solid rgba(255,255,255,.06)' : 'none',
              }}>
                {display || (isAgent && streaming && isLast ? (
                  <span style={{ opacity: .4 }}>...</span>
                ) : '')}
              </div>
              {livrable && !streaming && (
                <button
                  onClick={() => alert(`✅ Livrable prêt à sauvegarder :\nType : ${livrable.type}\nClient : ${livrable.client}\n\n(Phase B — la sauvegarde Supabase arrive bientôt)`)}
                  style={{ padding: '5px 12px', borderRadius: 6, background: 'rgba(0,210,200,.1)', border: '1px solid rgba(0,210,200,.25)', color: 'var(--teal)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  💾 Sauvegarder le livrable · {livrable.type}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{ padding: '16px 28px 20px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: 10, flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Ex : génère un post Instagram pour BeLoc sur la mise en ligne du site..."
          disabled={streaming}
          style={{ flex: 1, padding: '11px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'var(--night-2)', color: 'var(--white)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
        />
        <button
          onClick={streaming ? () => abortRef.current?.abort() : sendMessage}
          style={{ padding: '11px 20px', borderRadius: 10, background: streaming ? 'rgba(255,80,80,.12)' : 'linear-gradient(135deg, var(--teal), var(--violet))', border: streaming ? '1px solid rgba(255,80,80,.3)' : 'none', color: streaming ? '#ff8080' : 'var(--night-1)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
        >
          {streaming ? '⏹ Stop' : 'Envoyer →'}
        </button>
      </div>
    </div>
  );
}
