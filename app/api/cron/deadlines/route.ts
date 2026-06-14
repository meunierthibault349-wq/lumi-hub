import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function daysLeft(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d     = new Date(dateStr); d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

function urgencyLabel(days: number): string {
  if (days < 0)   return `EN RETARD (${Math.abs(days)}j)`;
  if (days === 0) return 'AUJOURD\'HUI';
  if (days === 1) return 'DEMAIN';
  return `DANS ${days} JOURS`;
}

export async function GET(req: NextRequest) {
  // Sécurité : Vercel passe Authorization: Bearer <CRON_SECRET> automatiquement
  const auth = req.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const alerts: {
    type: string; client?: string; project?: string; title: string;
    deadline: string; days: number; label: string;
  }[] = [];

  // --- Missions avec deadline ---
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, client, deadline, status')
    .not('deadline', 'is', null)
    .not('status', 'eq', 'livré');

  for (const p of projects ?? []) {
    const days = daysLeft(p.deadline);
    if (days !== null && days <= 3) {
      alerts.push({ type: 'mission', client: p.client, title: p.title, deadline: p.deadline, days, label: urgencyLabel(days) });
    }
  }

  // --- Tâches avec due date ---
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, project, due, done')
    .not('due', 'is', null)
    .eq('done', false);

  for (const t of tasks ?? []) {
    const days = daysLeft(t.due);
    if (days !== null && days <= 3) {
      alerts.push({ type: 'tache', project: t.project, title: t.title, deadline: t.due, days, label: urgencyLabel(days) });
    }
  }

  alerts.sort((a, b) => a.days - b.days);

  // Log visible dans Vercel Dashboard → Functions
  if (alerts.length === 0) {
    console.log('[cron/deadlines] ✓ Aucune deadline dans les 3 prochains jours.');
  } else {
    console.log(`[cron/deadlines] ⚠️  ${alerts.length} deadline(s) imminente(s) :`);
    for (const a of alerts) {
      const who = a.client || a.project;
      console.log(`  ${a.label} — [${who}] ${a.title} (${a.deadline})`);
    }
  }

  return NextResponse.json({ ok: alerts.length === 0, count: alerts.length, alerts, checkedAt: new Date().toISOString() });
}
