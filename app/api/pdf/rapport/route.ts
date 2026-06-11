import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { RapportPDF } from '@/lib/pdf/templates';
import type { ClientRow, ProjectRow } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');
  if (!clientId) return NextResponse.json({ error: 'clientId requis' }, { status: 400 });

  const supabase = await createSupabaseServer();

  const [clientRes, projectsRes] = await Promise.all([
    supabase.from('clients').select('*').eq('id', clientId).single(),
    supabase.from('projects').select('*').eq('client_id', clientId).order('created_at'),
  ]);

  const client = clientRes.data as ClientRow | null;
  const projects = (projectsRes.data ?? []) as ProjectRow[];

  if (!client) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 });

  const element = React.createElement(RapportPDF, { client, projects }) as unknown as React.ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(element);

  const slug = client.name.toLowerCase().replace(/\s+/g, '-');
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="rapport-${slug}.pdf"`,
    },
  });
}
