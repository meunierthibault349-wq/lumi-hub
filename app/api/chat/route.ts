import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { getSystemPrompt } from '@/lib/agent-prompts';

export async function POST(req: NextRequest) {
  const { messages, agentName, clientContextText } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Clé API Anthropic manquante. Ajoute ANTHROPIC_API_KEY dans .env.local' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  let systemPrompt = getSystemPrompt(agentName);
  if (clientContextText) {
    systemPrompt = `CONTEXTE CLIENT ACTIF :\n${clientContextText}\n\n---\n\n${systemPrompt}`;
  }

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2048,
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
