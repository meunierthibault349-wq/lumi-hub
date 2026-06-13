import { renderToBuffer } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { DevisPDF } from '@/lib/pdf/templates';
import type { ClientRow, ProjectRow } from '@/lib/supabase';
import React from 'react';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');
  if (!clientId) return NextResponse.json({ error: 'clientId requis' }, { status: 400 });

  try {
    const supabase = await createSupabaseServer();

    const [clientRes, projectsRes] = await Promise.all([
      supabase.from('clients').select('*').eq('id', clientId).single(),
      supabase.from('projects').select('*').eq('client_id', clientId),
    ]);

    const client = clientRes.data as ClientRow | null;
    const projects = (projectsRes.data ?? []) as ProjectRow[];

    if (!client) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 });

    const element = React.createElement(DevisPDF, { client, projects });
    const buffer = await renderToBuffer(element as React.ReactElement);

    const slug = client.name.toLowerCase().replace(/\s+/g, '-');
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="devis-${slug}.pdf"`,
      },
    });
  } catch (err) {
    console.error('[PDF/devis] erreur:', err);
    return NextResponse.json(
      { error: 'Erreur génération PDF', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
