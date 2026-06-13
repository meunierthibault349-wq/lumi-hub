import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { LivrablePDF } from '@/lib/pdf/templates';
import type { LivrableIA } from '@/lib/pdf/templates';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const livrableId = request.nextUrl.searchParams.get('livrableId');
  if (!livrableId) return NextResponse.json({ error: 'livrableId requis' }, { status: 400 });

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const res = await supabase.from('livrables_ia').select('*').eq('id', livrableId).single();
    const livrable = res.data as LivrableIA | null;

    if (!livrable) return NextResponse.json({ error: 'Livrable introuvable' }, { status: 404 });

    const element = React.createElement(LivrablePDF, { livrable });
    const buffer = await renderToBuffer(element as unknown as React.ReactElement<DocumentProps>);

    const slug = livrable.title.toLowerCase().replace(/\s+/g, '-').slice(0, 40);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="livrable-${slug}.pdf"`,
      },
    });
  } catch (err) {
    console.error('[PDF/livrable] erreur:', err);
    return NextResponse.json(
      { error: 'Erreur génération PDF', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
