import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BASE = `Tu es Jarvis, l'assistant IA intégré au Hub de Thibault Meunier, fondateur de Lumi.
Lumi : cabinet de conseil en stratégie digitale, développement web et IA, basé à Vichy.
Clients actifs : 100P Location (Jean Charles Taret) et BeLoc (location véhicules luxe, 890 €/mois).
MRR actuel : ~1 380 €/mois | Objectif : 5 000 €/mois.
Stack : Next.js, Supabase, Claude API, N8N, Webflow.
Réponds en français, directement, sans blabla. 3-4 lignes max sauf demande explicite.`;

const PAGE_CTX: Record<string, string> = {
  '/':          'Dashboard : MRR, projets actifs, tâches urgentes, jalons.',
  '/taches':    'Tâches : priorités P1-P9, projets, échéances. Aide à prioriser, formuler ou décomposer.',
  '/projets':   'Projets : missions clients (statut, avancement, jalons).',
  '/clients':   'Clients : fiches 100P et BeLoc, historique, points en suspens.',
  '/chrono':    'Chrono : sessions de travail par projet, bilan jour/semaine.',
  '/pipeline':  'Pipeline : prospects, opportunités, relances commerciales.',
  '/finances':  'Finances : MRR, facturation, trésorerie.',
  '/documents': 'Jarvis Docs : contexte, fiches clients, PDFs (Business Plan, SOP, offres).',
  '/agents':    'Agents IA : 28 agents spécialisés. Conseille lequel utiliser pour une tâche.',
  '/morning':   'Morning : briefing quotidien, agenda, emails.',
  '/orchestre': 'Chef Adjoint : orchestration multi-agents.',
  '/livrables': 'Livrables clients : aide à rédiger ou structurer.',
  '/gmail':     'Gmail : emails clients et prospects.',
  '/calendar':  'Agenda : calendrier et événements.',
};

export async function POST(req: NextRequest) {
  try {
    const { messages, pathname } = await req.json();
    const system = `${BASE}\n\nPage active — ${PAGE_CTX[pathname] ?? 'Hub Lumi'}`;

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = anthropic.messages.stream({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            system,
            messages,
          });
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Erreur API';
          controller.enqueue(new TextEncoder().encode(`[Erreur : ${msg}]`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new Response('Erreur serveur', { status: 500 });
  }
}
