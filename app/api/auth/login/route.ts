import { NextRequest, NextResponse } from 'next/server';
import { BackendAuthResponse } from '@/types';

const COOKIE_NAME = 'auth-token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { success: false, error: 'Configuração de backend ausente.' },
        { status: 500 }
      );
    }

    const backendRes = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    if (backendRes.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Erro ao fazer login.' },
        { status: backendRes.status }
      );
    }

    const data = (await backendRes.json()) as BackendAuthResponse;

    const response = NextResponse.json({
      success: true,
      user: data.user,
    });

    response.cookies.set(COOKIE_NAME, data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
