import { NextRequest, NextResponse } from 'next/server';

// Cette route API Next.js reçoit les infos du frontend et les transmet au backend
export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, text } = await req.json();
    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    // Appel au backend (Node.js) qui gère l’envoi réel de l’email
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html, text }),
    });

    if (!apiRes.ok) {
      return NextResponse.json({ error: 'Erreur lors de l’envoi de l’email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
