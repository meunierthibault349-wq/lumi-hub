import { google } from 'googleapis';
import { NextResponse } from 'next/server';

function getAuth() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return client;
}

export async function GET(request: Request) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  try {
    const gmail = google.gmail({ version: 'v1', auth: getAuth() });
    const { searchParams } = new URL(request.url);
    const maxResults = Number(searchParams.get('maxResults') || 15);
    const q = searchParams.get('q') || '';

    const listRes = await gmail.users.threads.list({
      userId: 'me',
      maxResults,
      labelIds: ['INBOX'],
      q: q || undefined,
    });

    const rawThreads = listRes.data.threads || [];
    if (!rawThreads.length) return NextResponse.json({ threads: [] });

    const threads = await Promise.all(
      rawThreads.slice(0, 15).map(async (t) => {
        const thread = await gmail.users.threads.get({
          userId: 'me',
          id: t.id!,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From', 'To', 'Date'],
        });
        const msgs = thread.data.messages || [];
        const first = msgs[0];
        const last = msgs[msgs.length - 1];
        const headers = first?.payload?.headers || [];
        const get = (name: string) => headers.find(h => h.name === name)?.value || '';
        return {
          id: t.id,
          subject: get('Subject') || '(sans objet)',
          from: get('From'),
          to: get('To'),
          date: get('Date'),
          snippet: last?.snippet || '',
          unread: first?.labelIds?.includes('UNREAD') ?? false,
          messageCount: msgs.length,
        };
      })
    );

    return NextResponse.json({ threads });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
