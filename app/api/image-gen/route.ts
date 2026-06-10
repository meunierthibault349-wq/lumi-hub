import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt, size = 'square_hd' } = await req.json();

  if (!process.env.FAL_API_KEY) {
    return NextResponse.json({ error: 'FAL_API_KEY manquante' }, { status: 503 });
  }
  if (!prompt) {
    return NextResponse.json({ error: 'prompt requis' }, { status: 400 });
  }

  const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: size,
      num_inference_steps: 4,
      num_images: 1,
      enable_safety_checker: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const data = await res.json();
  const imageUrl = data.images?.[0]?.url;
  if (!imageUrl) return NextResponse.json({ error: 'Aucune image retournée' }, { status: 500 });

  return NextResponse.json({ url: imageUrl });
}
