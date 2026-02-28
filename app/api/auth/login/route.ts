import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '@/data/mock-users';

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

    const record = MOCK_USERS.find(
      (u) => u.user.email === email && u.password === password
    );

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    const tokenPayload = JSON.stringify({
      id: record.user.id,
      email: record.user.email,
    });
    const token = Buffer.from(tokenPayload).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: record.user,
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
