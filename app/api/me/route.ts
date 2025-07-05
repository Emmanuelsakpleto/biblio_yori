import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Récupère le token du cookie
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
  }

  // Appel au backend pour récupérer le profil
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Token invalide' }, { status: 401 });
    }
    const data = await res.json();
    // Le backend peut retourner { user, ... }
    const user = data.user || data;
    return NextResponse.json({ success: true, user });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
