import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types';

const COOKIE_NAME = 'auth-token';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { success: false, user: null, error: 'Configuração de backend ausente.' },
      { status: 500 }
    );
  }

  try {
    const backendRes = await fetch(`${backendUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (backendRes.status === 401) {
      const response = NextResponse.json(
        { success: false, user: null },
        { status: 401 }
      );
      response.cookies.set(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, user: null },
        { status: backendRes.status }
      );
    }

    const user = (await backendRes.json()) as User;
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json(
      { success: false, user: null },
      { status: 500 }
    );
  }
}
