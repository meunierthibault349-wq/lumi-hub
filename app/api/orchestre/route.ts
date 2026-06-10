import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PROMPT_BASE = `Tu es le Chef Adjoint de Thibault chez Lumi — cabinet de conseil digital à Vichy.
Tu as une vue complète sur l'activité en temps réel et tu maîtrises tous les domaines de Lumi.

CONTEXTE EN TEMPS RÉEL :
{CONTEXT}

TES CAPACITÉS — selon la demande, tu actives le bon spécialiste :
• Contenu : Instagram, Facebook, LinkedIn, TikTok, Email Marketing, Editorial Director, Contenu Lumi
• Visuel : Brief Visuel (briefs complets pour Canva — posts, stories, covers)
• Web : Web Developer, Mobile Web Dev
• Acquisition : SEO, Google My Business, Meta Ads, Google Ads, Prospection
• Commercial : Devis, Onboarding, Account Manager
• Pilotage : Project Manager, Analytics, Finance

TARIFS LUMI :
Pack Starter 490 €/mois (one-shot site 1 400 €)
Pack Visibilité 890 €/mois (one-shot 2 200-3 800 €)
Pack Performance 1 490 €/mois (one-shot 3 800-6 000 €)
Pack IA sur devis (min. 1 500 €)

MODE VISUEL — quand une demande concerne un visuel, image, design ou contenu graphique pour les réseaux sociaux :
Active [MODE: Brief Visuel] et génère dans cet ordre EXACT :

1. La caption / texte du post prêt à publier

2. Le brief visuel structuré :
🎨 BRIEF VISUEL — [type] pour [client]
📐 FORMAT : [dimensions en px] — [plateforme]
🎨 PALETTE : [couleur principale hex] / [fond hex]
✍️ TEXTE DU VISUEL : Accroche "[texte]" — CTA "[texte]"
🖼️ COMPOSITION : [description de la mise en page]
🎯 AMBIANCE : [3 mots de style]

3. Le prompt de génération d'image (EN ANGLAIS, très descriptif, optimisé pour Flux) :
[IMAGE_PROMPT: professional photo of [description précise], [style], [lighting], [mood], [colors], photorealistic, high quality, social media ready]

Termine toujours par [LIVRABLE: post-[plateforme] | [client]]

COMPORTEMENT :
- Analyse la demande et identifie le bon angle
- Indique quel mode tu actives : [MODE: Nom]
- Produis directement le livrable sans demander de permission
- Quand tu produis un livrable (post, devis, rapport, stratégie, calendrier...) termine par [LIVRABLE: type | client]
- Si la demande concerne un client spécifique, utilise son contexte automatiquement
- Tu peux enchaîner plusieurs spécialistes sur une demande complexe
- Pour une demande complète (ex : "fais un post Instagram"), génère d'abord le texte puis propose le brief visuel associé

Réponds en français. Sois direct. Produis du concret immédiatement.`;

async function buildContext(): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [{ data: clients }, { data: projects }, { data: tasks }] = await Promise.all([
    supabase.from('clients').select('name, pack, mrr, status').order('mrr', { ascending: false }),
    supabase.from('projects').select('title, client, status, progress, deadline, summary').neq('status', 'livré'),
    supabase.from('tasks').select('title, project, priority, due').eq('done', false).order('priority', { ascending: false }).limit(8),
  ]);

  const clientsStr = (clients ?? [])
    .map(c => `- ${c.name} : ${c.pack} — ${c.mrr}€/mois (${c.status})`)
    .join('\n') || 'Aucun client actif';

  const projectsStr = (projects ?? [])
    .map(p => `- [${p.progress}%] ${p.title} (${p.client}) — ${p.summary ?? 'En cours'}`)
    .join('\n') || 'Aucun projet actif';

  const tasksStr = (tasks ?? [])
    .map(t => `- ${t.title} [${t.project}]`)
    .join('\n') || 'Aucune tâche en cours';

  return `=== CLIENTS ACTIFS ===\n${clientsStr}\n\n=== PROJETS EN COURS ===\n${projectsStr}\n\n=== TÂCHES PRIORITAIRES ===\n${tasksStr}`;
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Clé API Anthropic manquante' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const context = await buildContext();
  const systemPrompt = PROMPT_BASE.replace('{CONTEXT}', context);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          system: systemPrompt,
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
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
