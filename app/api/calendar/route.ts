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

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: getAuth() });
    const now = new Date();
    const in3Weeks = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: in3Weeks.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 30,
    });

    const events = (res.data.items || []).map(e => ({
      id: e.id,
      title: e.summary || '(sans titre)',
      start: e.start?.dateTime || e.start?.date || '',
      end: e.end?.dateTime || e.end?.date || '',
      allDay: !e.start?.dateTime,
      location: e.location || null,
      description: e.description || null,
      attendees: (e.attendees || []).map(a => ({ email: a.email, name: a.displayName || null, self: a.self || false })),
      hangoutLink: e.hangoutLink || null,
      colorId: e.colorId || null,
      status: e.status || 'confirmed',
    }));

    return NextResponse.json({ events });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
