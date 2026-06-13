import { renderToBuffer } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { FacturePDF } from '@/lib/pdf/templates';
import type { ClientRow, InvoiceRow } from '@/lib/supabase';
import React from 'react';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const invoiceId = request.nextUrl.searchParams.get('invoiceId');
  if (!invoiceId) return NextResponse.json({ error: 'invoiceId requis' }, { status: 400 });

  try {
    const supabase = await createSupabaseServer();

    const invoiceRes = await supabase.from('invoices').select('*').eq('id', invoiceId).single();
    const invoice = invoiceRes.data as InvoiceRow | null;

    if (!invoice) return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 });

    const clientRes = await supabase.from('clients').select('*').eq('name', invoice.client).maybeSingle();
    const client = clientRes.data as ClientRow | null;

    const element = React.createElement(FacturePDF, { invoice, client });
    const buffer = await renderToBuffer(element as React.ReactElement);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${invoiceId}.pdf"`,
      },
    });
  } catch (err) {
    console.error('[PDF/facture] erreur:', err);
    return NextResponse.json(
      { error: 'Erreur génération PDF', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
