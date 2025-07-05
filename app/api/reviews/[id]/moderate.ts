import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { action } = await req.json();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  if (!['approve', 'reject'].includes(action)) return NextResponse.json({ error: 'Action invalide' }, { status: 400 });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const res = await fetch(`${apiUrl}/reviews/${params.id}/moderate`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
