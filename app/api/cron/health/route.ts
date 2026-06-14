import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const start = Date.now();
  const issues: string[] = [];

  // --- Supabase ping ---
  const { error: dbErr, count } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });

  if (dbErr) {
    issues.push(`Supabase inaccessible : ${dbErr.message}`);
    console.error('[cron/health] 🔴 Supabase KO :', dbErr.message);
  } else {
    console.log(`[cron/health] ✓ Supabase OK — ${count} client(s) en base`);
  }

  const ms = Date.now() - start;
  const ok = issues.length === 0;

  if (ok) {
    console.log(`[cron/health] ✓ Hub sain (${ms}ms)`);
  } else {
    console.error(`[cron/health] ⚠️  ${issues.length} problème(s) détecté(s)`);
  }

  return NextResponse.json({ ok, issues, ms, checkedAt: new Date().toISOString() }, { status: ok ? 200 : 503 });
}
