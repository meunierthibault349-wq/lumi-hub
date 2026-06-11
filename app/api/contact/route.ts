import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const prenom = body.get('prenom')?.toString() ?? '';
  const email = body.get('email')?.toString() ?? '';
  const telephone = body.get('telephone')?.toString() ?? '';
  const besoin = body.get('besoin')?.toString() ?? '';
  const message = body.get('message')?.toString() ?? '';

  if (!prenom || !email || !besoin) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'Lumi Contact <noreply@lumi-site.fr>',
        to: ['contact@lumi-site.fr'],
        reply_to: email,
        subject: `Diagnostic Lumi — ${prenom} (${besoin})`,
        html: `
          <p><strong>Prénom :</strong> ${prenom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Téléphone :</strong> ${telephone || '—'}</p>
          <p><strong>Besoin :</strong> ${besoin}</p>
          <p><strong>Message :</strong><br>${message || '—'}</p>
        `,
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
