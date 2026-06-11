import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { FacturePDF } from '@/lib/pdf/templates';
import type { ClientRow, InvoiceRow } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const invoiceId = request.nextUrl.searchParams.get('invoiceId');
  if (!invoiceId) return NextResponse.json({ error: 'invoiceId requis' }, { status: 400 });

  const supabase = await createSupabaseServer();

  const invoiceRes = await supabase.from('invoices').select('*').eq('id', invoiceId).single();
  const invoice = invoiceRes.data as InvoiceRow | null;

  if (!invoice) return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 });

  const clientRes = await supabase.from('clients').select('*').eq('name', invoice.client).maybeSingle();
  const client = clientRes.data as ClientRow | null;

  const element = React.createElement(FacturePDF, { invoice, client }) as unknown as React.ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(element);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="facture-${invoiceId}.pdf"`,
    },
  });
}
