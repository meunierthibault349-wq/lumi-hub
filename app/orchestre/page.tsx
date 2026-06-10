'use client';
import { useState, useRef, useEffect } from 'react';

interface ChatMessage { role: 'agent' | 'user'; text: string; imageUrl?: string; imageLoading?: boolean; }

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
  return text
    .replace(/\[MODE:[^\]]+\]/g, '')
    .replace(/\[LIVRABLE:[^\]]+\]/g, '')
    .replace(/\[IMAGE_PROMPT:[^\]]+\]/g, '')
    .trim();
}

function extractImagePrompt(text: string): string | null {
  const m = text.match(/\[IMAGE_PROMPT:\s*([\s\S]+?)\]/);
  return m ? m[1].trim() : null;
}

export default function OrchestrerPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'agent', text: WELCOME }]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const messagesEl = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const CLIENT_COLORS: Record<string, string> = {
    'BeLoc': '#C9A96E',
    '100P Location': '#8B1E2F',
    'TYT03': '#EF9F27',
    'Lumi': '#0d9488',
  };

  async function handleSave(text: string, mode: string | null, imageUrl?: string) {
    const liv = extractLivrable(text);
    if (!liv) return;
    const key = `${text.slice(0, 20)}`;
    setSaved(key);
    await fetch('/api/livrables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `${liv.type} — ${liv.client}`,
        type: liv.type.toLowerCase().replace(/\s+/g, '-'),
        client: liv.client,
        client_color: CLIENT_COLORS[liv.client] ?? '#0d9488',
        content: cleanText(text),
        agent_mode: mode ?? 'Chef Adjoint',
        image_url: imageUrl ?? null,
      }),
    });
    setTimeout(() => setSaved(null), 3000);
  }

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

      // Auto-génération d'image si IMAGE_PROMPT détecté
      const imagePrompt = extractImagePrompt(full);
      if (imagePrompt) {
        setMessages(prev => {
          const upd = [...prev];
          upd[upd.length - 1] = { ...upd[upd.length - 1], imageLoading: true };
          return upd;
        });
        try {
          const imgRes = await fetch('/api/image-gen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: imagePrompt, size: 'square_hd' }),
          });
          const imgData = await imgRes.json();
          setMessages(prev => {
            const upd = [...prev];
            upd[upd.length - 1] = { ...upd[upd.length - 1], imageUrl: imgData.url, imageLoading: false };
            return upd;
          });
        } catch {
          setMessages(prev => {
            const upd = [...prev];
            upd[upd.length - 1] = { ...upd[upd.length - 1], imageLoading: false };
            return upd;
          });
        }
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
                {isAgent && msg.imageLoading && (
                  <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 10, background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.06)', fontSize: 12, color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                    Génération de l&apos;image en cours...
                  </div>
                )}
                {isAgent && msg.imageUrl && (
                  <div style={{ marginTop: 12 }}>
                    <img
                      src={msg.imageUrl}
                      alt="Visuel généré"
                      style={{ width: '100%', maxWidth: 400, borderRadius: 10, display: 'block' }}
                    />
                    <a href={msg.imageUrl} download target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 8, padding: '4px 12px', borderRadius: 6, background: 'rgba(0,210,200,.1)', border: '1px solid rgba(0,210,200,.25)', color: 'var(--teal)', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
                      ⬇ Télécharger
                    </a>
                  </div>
                )}
              </div>
              {livrable && !streaming && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleSave(msg.text, activeMode, msg.imageUrl)}
                    style={{ padding: '5px 12px', borderRadius: 6, background: saved ? 'rgba(52,211,153,.12)' : 'rgba(0,210,200,.1)', border: `1px solid ${saved ? 'rgba(52,211,153,.3)' : 'rgba(0,210,200,.25)'}`, color: saved ? '#34d399' : 'var(--teal)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}
                  >
                    {saved ? '✓ Sauvegardé dans Livrables' : `💾 Sauvegarder · ${livrable.type}`}
                  </button>
                  {isVisualBrief(msg.text) && (
                    <button
                      onClick={openCanva}
                      style={{ padding: '5px 12px', borderRadius: 6, background: 'rgba(124,77,255,.12)', border: '1px solid rgba(124,77,255,.3)', color: '#a78bfa', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      🎨 Ouvrir Canva →
                    </button>
                  )}
                </div>
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
