import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'prompt requis' }, { status: 400 });
  }

  if (!process.env.HF_API_KEY) {
    return NextResponse.json({ error: 'HF_API_KEY manquante' }, { status: 503 });
  }

  const res = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error('[image-gen] HF error:', res.status, errText);
    return NextResponse.json({ error: `HF ${res.status}: ${errText}` }, { status: 500 });
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('image')) {
    const body = await res.text();
    console.error('[image-gen] HF non-image response:', body);
    return NextResponse.json({ error: `Réponse inattendue: ${body}` }, { status: 500 });
  }

  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  return NextResponse.json({ url: `data:${contentType};base64,${base64}` });
}
