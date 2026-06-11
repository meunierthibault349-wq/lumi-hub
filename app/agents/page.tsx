'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { AGENTS_DATA, AgentDef, PoleData } from '@/lib/data';
import { useClientContext } from '@/components/ClientContextProvider';
import type { jsPDF as JsPDFType } from 'jspdf';

interface ChatMessage { role: 'agent' | 'user'; text: string; }
interface ActiveAgent { name: string; firstName: string; pole: string; poleColor: string; }

/** URL d'avatar DiceBear Adventurer à partir d'un prénom */
function dicebearUrl(firstName: string): string {
  const seed = encodeURIComponent(firstName);
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=111827&backgroundType=solid&radius=50`;
}

/** Carte agent avec avatar DiceBear et superpower au hover */
function AgentCard({
  agent,
  pole,
  poleColor,
  isActive,
  onClick,
}: {
  agent: AgentDef;
  pole: string;
  poleColor: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: isActive
          ? `${poleColor}18`
          : hovered && !agent.recruit
          ? 'rgba(255,255,255,.04)'
          : 'var(--night-2)',
        border: `1px solid ${isActive ? `${poleColor}55` : hovered && !agent.recruit ? `${poleColor}33` : 'rgba(255,255,255,.06)'}`,
        borderStyle: agent.recruit ? 'dashed' : 'solid',
        borderRadius: 12,
        padding: '18px 14px 14px',
        cursor: agent.recruit ? 'default' : 'pointer',
        opacity: agent.recruit ? 0.5 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        textAlign: 'center',
        transition: 'all .18s ease',
        overflow: 'hidden',
      }}
    >
      {/* Avatar DiceBear */}
      <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
        <Image
          src={dicebearUrl(agent.firstName)}
          alt={agent.firstName}
          width={52}
          height={52}
          style={{ borderRadius: '50%', display: 'block' }}
          unoptimized
        />
        {/* Indicateur actif */}
        {isActive && (
          <div style={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: poleColor,
            border: '2px solid var(--night-2)',
          }} />
        )}
      </div>

      {/* Prénom */}
      <div style={{ fontSize: 12, fontWeight: 700, color: agent.recruit ? 'var(--gray)' : 'var(--white)', lineHeight: 1.2 }}>
        {agent.firstName}
      </div>

      {/* Rôle */}
      <div style={{ fontSize: 11, color: 'var(--gray)', lineHeight: 1.2 }}>
        {agent.n}
      </div>

      {/* Superpower — remplace le bouton au hover */}
      {!agent.recruit && agent.superpower && hovered ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `${poleColor}ee`,
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          gap: 8,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Superpower
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1.4, textAlign: 'center' }}>
            {agent.superpower}
          </div>
          <div style={{
            marginTop: 4,
            padding: '5px 14px',
            background: 'rgba(0,0,0,.25)',
            border: '1px solid rgba(255,255,255,.2)',
            borderRadius: 6,
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Parler à {agent.firstName} ↗
          </div>
        </div>
      ) : (
        <button
          onClick={e => { e.stopPropagation(); onClick(); }}
          style={{
            marginTop: 2,
            padding: '5px 10px',
            background: agent.recruit ? 'rgba(255,255,255,.05)' : `${poleColor}22`,
            border: `1px solid ${agent.recruit ? 'rgba(255,255,255,.1)' : `${poleColor}44`}`,
            borderRadius: 6,
            color: agent.recruit ? 'var(--gray)' : poleColor,
            fontSize: 11,
            fontWeight: 600,
            cursor: agent.recruit ? 'default' : 'pointer',
            fontFamily: 'inherit',
            width: '100%',
            transition: 'all .15s',
          }}
        >
          {agent.recruit ? 'Recruter' : 'Lancer ↗'}
        </button>
      )}
    </div>
  );
}

function AgentsInner() {
  const { activeClient } = useClientContext();
  const [activeAgent, setActiveAgent] = useState<ActiveAgent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const messagesEl = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const clientContext = activeClient?.ref ?? null;

  function openAgent(a: AgentDef, poleData: PoleData) {
    if (a.recruit) return;
    abortRef.current?.abort();
    setActiveAgent({ name: a.n, firstName: a.firstName, pole: poleData.pole, poleColor: poleData.color });
    setMessages([{ role: 'agent', text: getWelcome(a.n, clientContext ?? undefined) }]);
    setInput('');
    setStreaming(false);
  }

  function getWelcome(name: string, clientName?: string): string {
    const ctx = clientName ? ` Je travaille sur le dossier **${clientName}**.` : '';
    const welcomes: Record<string, string> = {
      'Web Developer':     'Prêt à coder. Quel site ou module tu veux que je construise ?',
      'Instagram':         'Prêt pour le contenu Instagram. Quel client et quel type de post ?',
      'Facebook':          'Prêt pour Facebook. Quel client et quel objectif ?',
      'LinkedIn':          'Prêt pour LinkedIn. Post Thibault ou post client ?',
      'TikTok':            'Prêt pour TikTok. Quel client et quel concept de vidéo ?',
      'SEO':               "Prêt pour le SEO. Donne-moi l'URL ou le mot-clé cible.",
      'Finance':           'MRR actuel : 490€, objectif 5 000€. Que veux-tu analyser ?',
      'Prospection':       'Prêt à prospecter. Quel secteur et quelle zone géographique ?',
      'Devis':             'Prêt à rédiger une proposition. Quel client et quel besoin ?',
      'Analytics':         'Prêt pour le reporting. Quel client et quelle période ?',
      'Account Manager':   'Prêt pour le suivi client. Quel client tu veux préparer ?',
      'Meta Ads':          'Prêt pour les Meta Ads. Quel client et quel objectif publicitaire ?',
      'Google Ads':        'Prêt pour Google Ads. Quel client et quel budget mensuel ?',
      'Editorial Director':'Prêt à orchestrer la stratégie éditoriale. Quel client ?',
      'Email Marketing':   "Prêt pour l'email. Newsletter, séquence ou email promo ?",
      'Onboarding':        "Prêt pour l'onboarding. Quel nouveau client à démarrer ?",
      'Project Manager':   'Vue globale : 4 projets actifs. Que veux-tu suivre ou ajuster ?',
      'Mobile Dev':        'Prêt pour le mobile. Quel bug ou quelle optimisation ?',
      'Google My Business':'Prêt pour GMB. Quel client et quel type de contenu ?',
      'Contenu Lumi':      'Prêt pour le contenu Lumi. Post LinkedIn, étude de cas ou autre ?',
      'UX Designer':       'Prêt pour le design. Quelle interface ou quel flow tu veux modéliser ?',
      'Frontend React':    'Prêt à coder. Quel composant ou quelle page React ?',
      'Backend Supabase':  'Prêt pour le backend. Quel schéma, query ou policy Supabase ?',
      'QA':                'Prêt à tester. Quel scénario ou quelle fonctionnalité à auditer ?',
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
        body: JSON.stringify({
          messages: apiMessages,
          agentName: activeAgent.name,
          clientContextText: activeClient?.context,
        }),
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
          copy[agentMsgIndex] = { role: 'agent', text: "[Erreur de connexion à l'API. Vérifie ta clé ANTHROPIC_API_KEY.]" };
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

  async function exportPDF() {
    if (!activeAgent || messages.length < 2) return;
    const { default: jsPDF } = await import('jspdf') as { default: new (...a: unknown[]) => JsPDFType };
    const doc = new jsPDF({ unit: 'mm', format: 'a4' }) as JsPDFType;
    const pageW = 210; const pageH = 297; const margin = 14; const contentW = pageW - margin * 2;

    doc.setFillColor(13, 148, 136);
    doc.rect(0, 0, pageW, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('LUMI', margin, 14);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Agent : ${activeAgent.firstName} (${activeAgent.name})${activeClient ? ` — ${activeClient.name}` : ''}`, margin + 20, 14);
    const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(dateStr, pageW - margin - doc.getTextWidth(dateStr), 14);

    let y = 32;

    messages.forEach((m, idx) => {
      if (idx === 0 && m.role === 'agent') return;
      const isUser = m.role === 'user';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(isUser ? 30 : 13, isUser ? 30 : 148, isUser ? 180 : 136);
      doc.text(isUser ? 'Thibault' : `${activeAgent.firstName} — ${activeAgent.name}`, margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      const clean = m.text.replace(/\*\*/g, '').replace(/\*/g, '');
      const lines = doc.splitTextToSize(clean, contentW);
      lines.forEach((line: string) => {
        if (y > pageH - 20) { doc.addPage(); y = 20; }
        doc.text(line, margin, y);
        y += 5.5;
      });
      y += 4;
    });

    const pages = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, pageH - 12, pageW - margin, pageH - 12);
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text('Genere par Lumi Hub — hub.lumi-site.fr', margin, pageH - 7);
      doc.text(`${i} / ${pages}`, pageW - margin - 10, pageH - 7);
    }

    const slug = activeAgent.name.toLowerCase().replace(/\s+/g, '-');
    doc.save(`lumi-${slug}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  /* Compte total des agents actifs sur tous les pôles */
  const totalActive = AGENTS_DATA.reduce(
    (acc, p) => acc + p.agents.filter(a => !a.recruit).length,
    0
  );

  return (
    <>
      <div className="r-tb page-topbar">
        <div className="page-title">Agents IA</div>
        <span style={{ fontSize: 13, color: 'var(--gray)', background: 'var(--night-3)', padding: '2px 10px', borderRadius: 20 }}>
          {totalActive} agents actifs
        </span>
        {activeClient && (
          <span style={{ fontSize: 12, fontWeight: 600, background: `${activeClient.color}18`, color: activeClient.color, padding: '3px 12px', borderRadius: 20, border: `1px solid ${activeClient.color}44` }}>
            Mode client : {activeClient.name}
          </span>
        )}
        <div style={{ marginLeft: 'auto' }} />
        <button className="btn primary">+ Recruter un agent</button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Grille des agents */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {AGENTS_DATA.map((poleData) => (
            <div key={poleData.pole} style={{ marginBottom: 32 }}>
              {/* En-tête de pôle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: `1px solid ${poleData.color}33`,
              }}>
                <div style={{ width: 3, height: 16, borderRadius: 2, background: poleData.color }} />
                <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: 12, fontWeight: 700, color: poleData.color, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {poleData.pole}
                </span>
                <span style={{ fontSize: 11, color: 'var(--gray)' }}>
                  — {poleData.agents.filter(a => !a.recruit).length} agents
                </span>
              </div>

              {/* Cartes agents */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
                {poleData.agents.map(a => (
                  <AgentCard
                    key={`${poleData.pole}-${a.firstName}-${a.n}`}
                    agent={a}
                    pole={poleData.pole}
                    poleColor={poleData.color}
                    isActive={activeAgent?.name === a.n}
                    onClick={() => openAgent(a, poleData)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Panneau chat */}
        {activeAgent && (
          <div style={{ width: 380, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', background: 'var(--night-2)' }}>
            {/* Header chat */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Image
                src={dicebearUrl(activeAgent.firstName)}
                alt={activeAgent.firstName}
                width={36}
                height={36}
                style={{ borderRadius: '50%', flexShrink: 0 }}
                unoptimized
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 14 }}>
                  {activeAgent.firstName}
                  <span style={{ fontWeight: 400, color: 'var(--gray)', fontSize: 12 }}> — {activeAgent.name}</span>
                </div>
                <div style={{ fontSize: 11, color: streaming ? 'var(--amber)' : activeAgent.poleColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: streaming ? 'var(--amber)' : activeAgent.poleColor, animation: 'pulse 2s infinite' }} />
                  {streaming ? "En train d'écrire..." : 'En ligne'}
                </div>
              </div>

              {messages.length > 1 && (
                <button
                  onClick={exportPDF}
                  title="Exporter en PDF"
                  style={{ width: 28, height: 28, padding: 0, background: 'rgba(13,148,136,.15)', border: '1px solid rgba(13,148,136,.3)', borderRadius: 6, color: 'var(--teal-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
                </button>
              )}
              <button className="btn" style={{ width: 28, height: 28, padding: 0, fontSize: 14 }} onClick={() => { abortRef.current?.abort(); setActiveAgent(null); }}>
                x
              </button>
            </div>

            {/* Bandeau contexte client */}
            <div style={{
              padding: '8px 16px',
              background: activeClient ? `${activeClient.color}12` : 'rgba(13,148,136,.08)',
              borderBottom: '1px solid rgba(255,255,255,.04)',
              fontSize: 12,
              color: 'var(--gray)',
              borderLeft: activeClient ? `3px solid ${activeClient.color}` : '3px solid var(--teal)',
            }}>
              {activeClient ? (
                <>
                  <strong style={{ color: activeClient.color }}>Client actif :</strong> {activeClient.name} — contexte injecté dans le system prompt
                </>
              ) : (
                <>
                  <strong style={{ color: 'var(--teal-light)' }}>Contexte :</strong> Lumi · Thibault · Aucun client sélectionné
                </>
              )}
            </div>

            {/* Messages */}
            <div ref={messagesEl} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-dim)', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                    {m.role === 'user' ? 'Thibault' : activeAgent.firstName}
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
                placeholder={streaming ? "En attente de la réponse..." : "Écris ta demande à l'agent..."}
                disabled={streaming}
                rows={1}
                style={{ flex: 1, padding: '10px 14px', background: 'var(--night-3)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: 'var(--white)', fontSize: 13, fontFamily: 'inherit', resize: 'none', opacity: streaming ? 0.6 : 1 }}
              />
              <button
                onClick={sendMessage}
                disabled={streaming || !input.trim()}
                style={{ width: 38, height: 38, borderRadius: 10, background: streaming ? 'var(--gray-dim)' : 'var(--teal)', border: 'none', color: 'white', cursor: streaming ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', flexShrink: 0, transition: 'background .15s' }}
              >
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

export default function AgentsPage() {
  return <AgentsInner />;
}
