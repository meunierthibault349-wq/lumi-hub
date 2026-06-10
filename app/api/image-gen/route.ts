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

  let res: Response;
  try {
    res = await fetch(
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
  } catch (err) {
    return NextResponse.json({ error: `Fetch failed: ${err}` }, { status: 500 });
  }

  if (!res.ok) {
    const errText = await res.text();
    return NextResponse.json({ error: `HF ${res.status}: ${errText}` }, { status: 500 });
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('image')) {
    const body = await res.text();
    return NextResponse.json({ error: `HF non-image: ${body.slice(0, 300)}` }, { status: 500 });
  }

  // Retourne l'image en binaire directement — pas de base64
  const imageBuffer = await res.arrayBuffer();
  return new Response(imageBuffer, {
    headers: { 'Content-Type': contentType },
  });
}
