'use client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AGENTS_DATA, AgentDef } from '@/lib/data';

interface ChatMessage { role: 'agent' | 'user'; text: string; }
interface ActiveAgent { name: string; emoji: string; pole: string; }

export default function AgentsPage() {
  const searchParams = useSearchParams();
  const [activeAgent, setActiveAgent] = useState<ActiveAgent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const messagesEl = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const didAutoOpen = useRef(false);

  useEffect(() => {
    if (didAutoOpen.current) return;
    const clientName = searchParams.get('client');
    const agentName = searchParams.get('agent');
    if (!clientName || !agentName) return;
    for (const { pole, agents } of AGENTS_DATA) {
      const found = agents.find(a => a.n === agentName && !a.recruit);
      if (found) {
        didAutoOpen.current = true;
        setActiveAgent({ name: found.n, emoji: found.e, pole });
        setMessages([{ role: 'agent', text: getWelcome(found.n, clientName) }]);
        break;
      }
    }
  }, [searchParams]);

  function openAgent(a: AgentDef, pole: string) {
    if (a.recruit) return;
    abortRef.current?.abort();
    setActiveAgent({ name: a.n, emoji: a.e, pole });
    setMessages([{ role: 'agent', text: getWelcome(a.n) }]);
    setInput('');
    setStreaming(false);
  }

  function getWelcome(name: string, clientName?: string): string {
    const ctx = clientName ? ` Je travaille sur le dossier **${clientName}**.` : '';
    const welcomes: Record<string, string> = {
      'Web Developer': 'Prêt à coder. Quel site ou module tu veux que je construise ?',
      'Instagram': 'Prêt pour le contenu Instagram. Quel client et quel type de post ?',
      'Facebook': 'Prêt pour Facebook. Quel client et quel objectif ?',
      'LinkedIn': 'Prêt pour LinkedIn. Post Thibault ou post client ?',
      'TikTok': 'Prêt pour TikTok. Quel client et quel concept de vidéo ?',
      'SEO': 'Prêt pour le SEO. Donne-moi l\'URL ou le mot-clé cible.',
      'Finance': `MRR actuel : 490€, objectif 5 000€. Que veux-tu analyser ?`,
      'Prospection': 'Prêt à prospecter. Quel secteur et quelle zone géographique ?',
      'Devis': 'Prêt à rédiger une proposition. Quel client et quel besoin ?',
      'Analytics': 'Prêt pour le reporting. Quel client et quelle période ?',
      'Account Manager': 'Prêt pour le suivi client. Quel client tu veux préparer ?',
      'Meta Ads': 'Prêt pour les Meta Ads. Quel client et quel objectif publicitaire ?',
      'Google Ads': 'Prêt pour Google Ads. Quel client et quel budget mensuel ?',
      'Editorial Director': 'Prêt à orchestrer la stratégie éditoriale. Quel client ?',
      'Email Marketing': 'Prêt pour l\'email. Newsletter, séquence ou email promo ?',
      'Onboarding': 'Prêt pour l\'onboarding. Quel nouveau client à démarrer ?',
      'Project Manager': 'Vue globale : 4 projets actifs. Que veux-tu suivre ou ajuster ?',
      'Mobile Web Dev': 'Prêt pour le mobile. Quel bug ou quelle optimisation ?',
      'Google My Business': 'Prêt pour GMB. Quel client et quel type de contenu ?',
      'Contenu Lumi': 'Prêt pour le contenu Lumi. Post LinkedIn, étude de cas ou autre ?',
    };
    const base = welcomes[name] ?? 'Bonjour, je suis prêt. Quelle est ta demande ?';
    return clientName ? base.replace(/\.$/, '') + ctx : base;
  }

  async function sendMessage() {
    if (!input.trim() || !activeAgent || streaming) return;
    const text = input.trim();
    setInput('');

    const userMsg: ChatMessage = { role: 'user', text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    const apiMessages = updatedMessages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    setStreaming(true);
    const agentMsgIndex = updatedMessages.length;
    setMessages(prev => [...prev, { role: 'agent', text: '' }]);

    abortRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, agentName: activeAgent.name }),
        signal: abortRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Erreur ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const copy = [...prev];
          copy[agentMsgIndex] = { role: 'agent', text: fullText };
          return copy;
        });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages(prev => {
          const copy = [...prev];
          copy[agentMsgIndex] = { role: 'agent', text: '[Erreur de connexion à l\'API. Vérifie ta clé ANTHROPIC_API_KEY.]' };
          return copy;
        });
      }
    } finally {
      setStreaming(false);
    }
  }

  useEffect(() => {
    if (messagesEl.current) messagesEl.current.scrollTop = messagesEl.current.scrollHeight;
  }, [messages, streaming]);

  return (
    <>
      <div className="r-tb" style={{ padding: '0 28px', height: 60, borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--night-2)' }}>
        <div className="page-title">Agents IA</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>20 agents actifs</span>
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary">+ Recruter un agent</button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Agents grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {AGENTS_DATA.map(({ pole, agents }) => (
            <div key={pole} style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: 13, fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                {pole} — {agents.filter(a => !a.recruit).length} agents
              </div>
              <div className="r-g5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
                {agents.map(a => (
                  <div key={a.n}
                    onClick={() => openAgent(a, pole)}
                    style={{ background: activeAgent?.name === a.n ? 'rgba(13,148,136,.1)' : 'var(--night-2)', border: `1px solid ${activeAgent?.name === a.n ? 'rgba(13,148,136,.4)' : 'rgba(255,255,255,.06)'}`, borderRadius: 10, padding: '16px 14px', cursor: a.recruit ? 'default' : 'pointer', opacity: a.recruit ? .5 : 1, borderStyle: a.recruit ? 'dashed' : 'solid', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', transition: 'all .15s' }}>
                    <div className="agent-avatar-wrap" style={{ width: 44, height: 44, fontSize: 20, opacity: a.recruit ? .5 : 1 }}>{a.e}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: a.recruit ? 'var(--gray)' : 'var(--white)', lineHeight: 1.3 }}>{a.n}</div>
                    <button
                      onClick={e => { e.stopPropagation(); openAgent(a, pole); }}
                      style={{ marginTop: 4, padding: '5px 12px', background: a.recruit ? 'rgba(255,255,255,.05)' : 'rgba(13,148,136,.15)', border: `1px solid ${a.recruit ? 'rgba(255,255,255,.1)' : 'rgba(13,148,136,.25)'}`, borderRadius: 6, color: a.recruit ? 'var(--gray)' : 'var(--teal-light)', fontSize: 11, fontWeight: 600, cursor: a.recruit ? 'default' : 'pointer', fontFamily: 'inherit', width: '100%', transition: 'all .15s' }}>
                      {a.recruit ? 'Recruter' : 'Lancer ↗'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chat panel */}
        {activeAgent && (
          <div className="r-ac" style={{ width: 380, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', background: 'var(--night-2)' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="agent-avatar-wrap" style={{ width: 36, height: 36, fontSize: 18, flexShrink: 0 }}>{activeAgent.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 14 }}>{activeAgent.name}</div>
                <div style={{ fontSize: 11, color: streaming ? 'var(--amber)' : 'var(--mint)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: streaming ? 'var(--amber)' : 'var(--mint)', animation: 'pulse 2s infinite' }} />
                  {streaming ? 'En train d\'écrire…' : 'En ligne'}
                </div>
              </div>
              <button className="btn" style={{ width: 28, height: 28, padding: 0, fontSize: 14 }} onClick={() => { abortRef.current?.abort(); setActiveAgent(null); }}>×</button>
            </div>

            {/* Context banner */}
            <div style={{ padding: '8px 16px', background: 'rgba(13,148,136,.08)', borderBottom: '1px solid rgba(255,255,255,.04)', fontSize: 12, color: 'var(--gray)' }}>
              <strong style={{ color: 'var(--teal-light)' }}>Contexte :</strong> Lumi · Thibault · 2 clients actifs (100P + BeLoc)
            </div>

            {/* Messages */}
            <div ref={messagesEl} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-dim)', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                    {m.role === 'user' ? 'Thibault' : activeAgent.name}
                  </div>
                  <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-agent'} style={{ whiteSpace: 'pre-wrap' }}>
                    {m.text}
                    {streaming && i === messages.length - 1 && m.role === 'agent' && (
                      <span style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--teal-light)', marginLeft: 2, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: 8 }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={streaming ? 'En attente de la réponse…' : 'Écris ta demande à l\'agent…'}
                disabled={streaming}
                rows={1}
                style={{ flex: 1, padding: '10px 14px', background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: 'var(--white)', fontSize: 13, fontFamily: 'inherit', resize: 'none', opacity: streaming ? .6 : 1 }}
              />
              <button
                onClick={sendMessage}
                disabled={streaming || !input.trim()}
                style={{ width: 38, height: 38, borderRadius: 10, background: streaming ? 'var(--gray-dim)' : 'var(--teal)', border: 'none', color: 'white', cursor: streaming ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', flexShrink: 0, transition: 'background .15s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </>
  );
}
