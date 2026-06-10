import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('livrables_ia')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ livrables: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, type, client, client_color, content, agent_mode, image_url } = body;

  if (!title || !content) {
    return NextResponse.json({ error: 'title et content requis' }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('livrables_ia')
    .insert({ title, type, client, client_color, content, agent_mode, image_url: image_url ?? null, status: 'brouillon' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ livrable: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const supabase = getSupabase();
  const { error } = await supabase.from('livrables_ia').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });
  const supabase = getSupabase();
  const { error } = await supabase.from('livrables_ia').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
