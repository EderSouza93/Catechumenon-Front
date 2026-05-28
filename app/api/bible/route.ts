import { NextRequest, NextResponse } from 'next/server';
import { bibleServices } from '@/services/bibleServices';
import { BackendConfigError } from '@/services/api';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  const reference = request.nextUrl.searchParams.get('reference');
  if (!reference) {
    return NextResponse.json(
      { error: 'Parâmetro reference é obrigatório.' },
      { status: 400 },
    );
  }

  try {
    const backendRes = await bibleServices.getReference(reference, token);
    const body = await backendRes.text();
    return new NextResponse(body, {
      status: backendRes.status,
      headers: { 'Content-Type': backendRes.headers.get('Content-Type') ?? 'application/json' },
    });
  } catch (error) {
    if (error instanceof BackendConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erro ao consultar o backend.' }, { status: 502 });
  }
}
